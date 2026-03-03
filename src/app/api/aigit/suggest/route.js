import { NextResponse } from 'next/server';
import { AIGitEngine } from '@/lib/aigit/AIGitEngine';
import {
  generateCommitMessage,
  generateCommitAlternatives,
  isAIEnabled,
} from '@/lib/aigit/claude-service';

const engine = new AIGitEngine();

export async function POST(request) {
  try {
    const body = await request.json();
    const { diff: bodyDiff, context } = body;

    // Prefer diff from request body (browser UI); fall back to local git (CLI)
    const diff = bodyDiff || engine.getStagedDiff() || engine.getUnstagedDiff();

    if (!diff) {
      return NextResponse.json(
        { error: 'No changes to analyze' },
        { status: 400 }
      );
    }

    if (isAIEnabled()) {
      // Use Claude for intelligent suggestions
      const [primary, alternatives] = await Promise.all([
        generateCommitMessage(diff, context),
        generateCommitAlternatives(diff, context),
      ]);

      if (primary) {
        return NextResponse.json({
          message: primary,
          alternatives: alternatives || [],
          source: 'claude',
          model: 'claude-opus-4-6',
        });
      }
    }

    // Fallback to pattern-based suggestion
    const suggestion = await engine.suggestCommitMessage({ context });

    if (suggestion.error) {
      return NextResponse.json({ error: suggestion.error }, { status: 400 });
    }

    return NextResponse.json({ ...suggestion, source: 'pattern-matching' });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
