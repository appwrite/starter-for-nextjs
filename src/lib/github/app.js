/**
 * ivGit GitHub App — Core utilities
 *
 * Handles:
 *  - Webhook signature verification
 *  - App JWT creation + installation token exchange
 *  - PR diff fetching
 *  - PR comment posting
 *  - Review result → GitHub Markdown formatting
 */

import crypto from 'crypto'
import { App } from '@octokit/app'

// ─── Singleton App instance ───────────────────────────────────────────────────

let _app = null

function getApp() {
  if (_app) return _app

  const privateKey = process.env.GITHUB_APP_PRIVATE_KEY?.replace(/\\n/g, '\n')

  if (!process.env.GITHUB_APP_ID || !privateKey || !process.env.GITHUB_WEBHOOK_SECRET) {
    throw new Error(
      'Missing GitHub App env vars. Add GITHUB_APP_ID, GITHUB_APP_PRIVATE_KEY, and GITHUB_WEBHOOK_SECRET to .env.local'
    )
  }

  _app = new App({
    appId: process.env.GITHUB_APP_ID,
    privateKey,
    webhooks: { secret: process.env.GITHUB_WEBHOOK_SECRET },
  })

  return _app
}

// ─── Webhook verification ─────────────────────────────────────────────────────

/**
 * Verify the X-Hub-Signature-256 header from GitHub.
 * Returns true if the payload matches the signature.
 */
export function verifyWebhookSignature(rawBody, signature) {
  const secret = process.env.GITHUB_WEBHOOK_SECRET
  if (!secret || !signature) return false

  const expected = 'sha256=' + crypto
    .createHmac('sha256', secret)
    .update(rawBody)
    .digest('hex')

  try {
    return crypto.timingSafeEqual(
      Buffer.from(expected),
      Buffer.from(signature)
    )
  } catch {
    return false
  }
}

// ─── GitHub API helpers ───────────────────────────────────────────────────────

/**
 * Get an Octokit instance authenticated as the installation.
 * Automatically handles JWT → installation token exchange.
 */
export async function getInstallationOctokit(installationId) {
  const app = getApp()
  return app.getInstallationOctokit(installationId)
}

/**
 * Fetch the raw unified diff of a pull request.
 * Returns a string containing the full diff.
 */
export async function getPRDiff(octokit, owner, repo, pullNumber) {
  const { data } = await octokit.request('GET /repos/{owner}/{repo}/pulls/{pull_number}', {
    owner,
    repo,
    pull_number: pullNumber,
    headers: { accept: 'application/vnd.github.diff' },
  })
  // data is the raw diff text when using the diff media type
  return typeof data === 'string' ? data : JSON.stringify(data)
}

/**
 * Post a comment on a PR (as a regular issue comment).
 */
export async function postPRComment(octokit, owner, repo, pullNumber, body) {
  return octokit.request('POST /repos/{owner}/{repo}/issues/{issue_number}/comments', {
    owner,
    repo,
    issue_number: pullNumber,
    body,
  })
}

/**
 * Delete a previous ivGit review comment if one exists.
 * Used to avoid spamming multiple reviews on force-push / re-review.
 */
export async function deletePreviousReviewComment(octokit, owner, repo, pullNumber) {
  const { data: comments } = await octokit.request(
    'GET /repos/{owner}/{repo}/issues/{issue_number}/comments',
    { owner, repo, issue_number: pullNumber, per_page: 50 }
  )

  const previous = comments.find(
    (c) =>
      c.body?.includes('<!-- ivgit-review -->') &&
      c.user?.type === 'Bot'
  )

  if (previous) {
    await octokit.request('DELETE /repos/{owner}/{repo}/issues/comments/{comment_id}', {
      owner,
      repo,
      comment_id: previous.id,
    })
  }
}

// ─── Review formatter ─────────────────────────────────────────────────────────

/**
 * Format a Claude review result into a GitHub PR comment (Markdown).
 */
export function formatReviewComment(review) {
  const score = review.score ?? 0
  const scoreBar = buildScoreBar(score)
  const scoreEmoji = score >= 8 ? '🟢' : score >= 6 ? '🟡' : '🔴'

  let md = `<!-- ivgit-review -->\n`
  md += `## 🔍 ivGit AI Code Review\n\n`
  md += `${scoreEmoji} **Score: ${score}/10** ${scoreBar}\n\n`

  if (review.summary) {
    md += `> ${review.summary}\n\n`
  }

  // Issues
  if (review.issues?.length > 0) {
    md += `### Issues Found\n\n`
    for (const issue of review.issues) {
      const icon =
        issue.severity === 'error' ? '🔴' :
        issue.severity === 'warn'  ? '🟡' : 'ℹ️'
      const desc = typeof issue === 'object' ? issue.description : issue
      const fix  = typeof issue === 'object' ? issue.suggestion  : null
      md += `${icon} **${desc}**`
      if (fix) md += `\n  > 💡 ${fix}`
      md += '\n\n'
    }
  } else {
    md += `✅ No issues found — looking clean!\n\n`
  }

  // Suggestions
  if (review.suggestions?.length > 0) {
    md += `### Suggestions\n\n`
    for (const s of review.suggestions) {
      md += `- ${typeof s === 'string' ? s : s.message ?? JSON.stringify(s)}\n`
    }
    md += '\n'
  }

  // Vibe check
  if (review.vibeCheck) {
    md += `---\n\n`
    md += `✦ **Vibe Check:** ${review.vibeCheck}\n\n`
  }

  md += `<sub>Powered by [ivGit](https://ivgit.com) · Model: ${review.model ?? 'claude-opus-4-6'} · [Configure](https://ivgit.com/settings)</sub>`

  return md
}

function buildScoreBar(score) {
  const filled = Math.round(score)
  return '█'.repeat(filled) + '░'.repeat(10 - filled)
}
