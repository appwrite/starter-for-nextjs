/**
 * POST /api/github/pr-review
 *
 * GitHub App webhook receiver. Triggers an AI code review whenever a PR is
 * opened, reopened, or updated (synchronized). Posts the result as a comment.
 *
 * GitHub sends:
 *   X-GitHub-Event: pull_request
 *   X-Hub-Signature-256: sha256=<hmac>
 *   Body: JSON pull_request event payload
 */

import { NextResponse } from 'next/server'
import {
  verifyWebhookSignature,
  getInstallationOctokit,
  getPRDiff,
  postPRComment,
  deletePreviousReviewComment,
  formatReviewComment,
} from '@/lib/github/app'
import { reviewCode, isAIEnabled } from '@/lib/aigit/claude-service'

// Tell Next.js not to parse the body — we need the raw bytes for HMAC
export const config = { api: { bodyParser: false } }

// PR actions that trigger a review
const TRIGGER_ACTIONS = new Set(['opened', 'reopened', 'synchronize'])

export async function POST(request) {
  try {
    // ── 1. Read raw body for signature verification ──────────────────────────
    const rawBody = await request.text()
    const signature = request.headers.get('x-hub-signature-256') ?? ''
    const event     = request.headers.get('x-github-event') ?? ''

    // ── 2. Verify the webhook signature ─────────────────────────────────────
    if (!verifyWebhookSignature(rawBody, signature)) {
      console.warn('[ivGit] Webhook signature verification failed')
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })
    }

    // ── 3. Only handle pull_request events ──────────────────────────────────
    if (event !== 'pull_request') {
      return NextResponse.json({ ok: true, skipped: `event: ${event}` })
    }

    const payload = JSON.parse(rawBody)
    const { action, pull_request: pr, repository: repo, installation } = payload

    // ── 4. Only run on relevant actions ─────────────────────────────────────
    if (!TRIGGER_ACTIONS.has(action)) {
      return NextResponse.json({ ok: true, skipped: `action: ${action}` })
    }

    // ── 5. Skip draft PRs ───────────────────────────────────────────────────
    if (pr.draft) {
      return NextResponse.json({ ok: true, skipped: 'draft PR' })
    }

    const owner      = repo.owner.login
    const repoName   = repo.name
    const pullNumber = pr.number
    const prTitle    = pr.title

    console.log(`[ivGit] Reviewing PR #${pullNumber}: "${prTitle}" in ${owner}/${repoName}`)

    // ── 6. Get an authenticated Octokit for this installation ────────────────
    const octokit = await getInstallationOctokit(installation.id)

    // ── 7. Delete any previous ivGit review comment (on re-push) ────────────
    if (action === 'synchronize') {
      await deletePreviousReviewComment(octokit, owner, repoName, pullNumber)
    }

    // ── 8. Fetch the PR diff ─────────────────────────────────────────────────
    const diff = await getPRDiff(octokit, owner, repoName, pullNumber)

    if (!diff || diff.length < 10) {
      return NextResponse.json({ ok: true, skipped: 'empty diff' })
    }

    // ── 9. Run AI review ────────────────────────────────────────────────────
    let review

    if (isAIEnabled()) {
      review = await reviewCode(diff, { vibeMode: 'balanced' })
    } else {
      // Graceful fallback when no API key is set
      review = {
        score: null,
        summary: 'AI review unavailable — set ANTHROPIC_API_KEY to enable.',
        issues: [],
        suggestions: [],
        vibeCheck: 'Add your API key to start getting AI-powered reviews!',
        model: 'none',
      }
    }

    // ── 10. Format and post the comment ─────────────────────────────────────
    const commentBody = formatReviewComment(review)
    await postPRComment(octokit, owner, repoName, pullNumber, commentBody)

    console.log(`[ivGit] ✓ Review posted on PR #${pullNumber} (score: ${review.score}/10)`)

    return NextResponse.json({
      ok: true,
      pr: pullNumber,
      score: review.score,
      issueCount: review.issues?.length ?? 0,
    })

  } catch (error) {
    console.error('[ivGit] Webhook handler error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
