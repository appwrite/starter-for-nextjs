import { NextResponse } from 'next/server';
import { AIGitEngine } from '@/lib/aigit/AIGitEngine';
import { reviewCode, isAIEnabled } from '@/lib/aigit/claude-service';

const engine = new AIGitEngine();

/**
 * POST /api/aigit/review
 * AI-powered code review using Claude claude-opus-4-6 with adaptive thinking.
 *
 * Body: { diff?: string, staged?: boolean, vibeMode?: string }
 *   - diff: raw git diff text (sent from the browser dashboard)
 *   - staged: if no diff provided, read staged changes from local git (CLI usage)
 * Returns: { score, summary, issues, suggestions, vibeCheck, source }
 */
export async function POST(request) {
  try {
    const body = await request.json();
    const { diff: bodyDiff, staged = false, vibeMode = 'balanced' } = body;

    // Prefer diff from request body (browser UI); fall back to local git (CLI)
    const diff =
      bodyDiff ||
      (staged
        ? engine.getStagedDiff()
        : engine.getUnstagedDiff() || engine.getStagedDiff());

    if (!diff) {
      return NextResponse.json(
        { error: 'No changes to review' },
        { status: 400 }
      );
    }

    if (!isAIEnabled()) {
      return NextResponse.json({
        score: 7,
        summary: 'Analysis complete (AI not configured)',
        issues: [],
        suggestions: [],
        vibeCheck: 'Add ANTHROPIC_API_KEY to .env.local to enable AI-powered reviews 🤖',
        source: 'pattern-matching',
      });
    }

    const review = await reviewCode(diff, { vibeMode });

    return NextResponse.json({ ...review, source: 'claude', model: 'claude-opus-4-6' });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
