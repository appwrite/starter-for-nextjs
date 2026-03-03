import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Logo } from "@/components/logo"
import { ThemeToggle } from "@/components/theme-toggle"
import Link from "next/link"

const GITHUB_APP_URL = process.env.NEXT_PUBLIC_GITHUB_APP_URL ?? 'https://github.com/apps/ivgit'

const steps = [
  {
    number: '01',
    title: 'Install the GitHub App',
    desc: 'Click below and select which repositories ivGit should review. Works with public and private repos.',
  },
  {
    number: '02',
    title: 'Open a pull request',
    desc: 'Create any PR in your chosen repositories. ivGit automatically detects it within seconds.',
  },
  {
    number: '03',
    title: 'Get your AI review',
    desc: 'Claude reviews your diff and posts a structured comment with a quality score, issues, and a vibe check.',
  },
]

const permissions = [
  { icon: '📖', label: 'Read pull requests', desc: 'To fetch the diff when a PR is opened' },
  { icon: '💬', label: 'Write PR comments',  desc: 'To post the review result' },
  { icon: '🔔', label: 'Receive webhooks',   desc: 'To be notified when PRs are opened or updated' },
]

export default function InstallPage() {
  return (
    <div className="min-h-screen bg-[#FAF9F6] dark:bg-[#1C1917] transition-colors duration-300">

      {/* Nav */}
      <nav className="border-b border-[#E8E0D5] dark:border-[#2C2825] backdrop-blur-sm sticky top-0 z-50 bg-[#FAF9F6]/90 dark:bg-[#1C1917]/90">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/"><Logo width={64} /></Link>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <Link href="/aigit">
              <Button variant="outline" className="border-[#E8E0D5] dark:border-[#2C2825] text-sm">
                Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-6 py-16 max-w-3xl">

        {/* Hero */}
        <div className="text-center mb-14">
          <Badge className="bg-[#EEDDD6] text-[#C25E3A] border-[#D9B5A4] dark:bg-[#2C1F18] dark:text-[#E8896A] dark:border-[#5C3A28] mb-5 px-4 py-1.5 rounded-full">
            GitHub App
          </Badge>
          <h1 className="text-4xl md:text-5xl font-semibold text-[#1C1917] dark:text-[#FAF9F6] mb-4 leading-tight" style={{fontFamily: 'Lora, Georgia, serif'}}>
            AI reviews on every
            <span className="italic text-[#D97757] dark:text-[#E8896A]"> pull request</span>
          </h1>
          <p className="text-stone-500 dark:text-stone-400 text-lg max-w-xl mx-auto">
            Install once. ivGit automatically reviews every PR in your chosen repositories — no CLI, no copy-pasting diffs.
          </p>
        </div>

        {/* Big install CTA */}
        <Card className="bg-[#1C1917] dark:bg-[#252120] border-[#2C2825] p-8 text-center mb-10 shadow-xl">
          <div className="text-5xl mb-4">🐙</div>
          <h2 className="text-2xl font-semibold text-[#FAF9F6] mb-2" style={{fontFamily: 'Lora, Georgia, serif'}}>
            Install ivGit on GitHub
          </h2>
          <p className="text-stone-400 mb-6 text-sm">
            Free for public repos · 10 PRs/month on free plan
          </p>
          <a href={GITHUB_APP_URL} target="_blank" rel="noopener noreferrer">
            <Button
              size="lg"
              className="bg-[#D97757] hover:bg-[#C25E3A] text-white px-10 py-6 text-base rounded-xl shadow-sm"
            >
              Install GitHub App →
            </Button>
          </a>
          <p className="text-stone-500 text-xs mt-4">
            You'll be redirected to GitHub to choose which repositories to grant access.
          </p>
        </Card>

        {/* How it works */}
        <div className="mb-10">
          <h2 className="text-xl font-semibold text-[#1C1917] dark:text-[#FAF9F6] mb-6" style={{fontFamily: 'Lora, Georgia, serif'}}>
            How it works
          </h2>
          <div className="space-y-4">
            {steps.map((step) => (
              <div key={step.number} className="flex gap-5 items-start">
                <div className="text-[#D97757] dark:text-[#E8896A] font-mono text-sm font-bold w-8 shrink-0 pt-0.5">
                  {step.number}
                </div>
                <div>
                  <p className="font-medium text-[#1C1917] dark:text-[#FAF9F6] mb-1">{step.title}</p>
                  <p className="text-stone-500 dark:text-stone-400 text-sm">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Sample comment preview */}
        <div className="mb-10">
          <h2 className="text-xl font-semibold text-[#1C1917] dark:text-[#FAF9F6] mb-6" style={{fontFamily: 'Lora, Georgia, serif'}}>
            What the review looks like
          </h2>
          <Card className="bg-white dark:bg-[#252120] border-[#E8E0D5] dark:border-[#2C2825] overflow-hidden shadow-sm">
            {/* GitHub-style PR comment header */}
            <div className="flex items-center gap-3 px-5 py-3 bg-[#F5F1EB] dark:bg-[#1C1917] border-b border-[#E8E0D5] dark:border-[#2C2825]">
              <div className="w-7 h-7 rounded-full bg-[#D97757] flex items-center justify-center text-white text-xs font-bold">iv</div>
              <span className="text-sm font-medium text-[#1C1917] dark:text-[#FAF9F6]">ivgit-bot</span>
              <Badge className="bg-[#EEDDD6] text-[#C25E3A] dark:bg-[#2C1F18] dark:text-[#E8896A] border-0 text-xs">bot</Badge>
              <span className="text-xs text-stone-400 ml-auto">just now</span>
            </div>
            <CardContent className="p-5 font-mono text-sm space-y-3 text-stone-600 dark:text-stone-300">
              <p className="font-bold text-base text-[#1C1917] dark:text-[#FAF9F6]" style={{fontFamily: 'Lora, Georgia, serif'}}>🔍 ivGit AI Code Review</p>
              <p>🟢 <strong>Score: 8/10</strong> ████████░░</p>
              <p className="text-stone-500 dark:text-stone-400 italic border-l-2 border-[#E8E0D5] dark:border-[#2C2825] pl-3">
                Solid implementation with good error handling. Minor improvements possible.
              </p>
              <div className="space-y-1">
                <p className="font-semibold text-[#1C1917] dark:text-[#FAF9F6] not-italic" style={{fontFamily: 'Lora, Georgia, serif'}}>Issues Found</p>
                <p>🟡 <strong>Missing input validation on email field</strong></p>
                <p className="text-stone-400 pl-4">→ 💡 Add regex check before passing to the API</p>
              </div>
              <div className="border-t border-[#E8E0D5] dark:border-[#2C2825] pt-3">
                <p>✦ <strong>Vibe Check:</strong> Clean, focused commit — you're in flow! 🔥</p>
              </div>
              <p className="text-xs text-stone-400">
                Powered by <span className="text-[#D97757]">ivGit</span> · Model: claude-opus-4-6
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Permissions */}
        <div className="mb-10">
          <h2 className="text-xl font-semibold text-[#1C1917] dark:text-[#FAF9F6] mb-6" style={{fontFamily: 'Lora, Georgia, serif'}}>
            Permissions we request
          </h2>
          <div className="space-y-3">
            {permissions.map((p) => (
              <div key={p.label} className="flex items-start gap-4 bg-white dark:bg-[#252120] border border-[#E8E0D5] dark:border-[#2C2825] rounded-xl p-4 shadow-sm">
                <span className="text-2xl">{p.icon}</span>
                <div>
                  <p className="font-medium text-[#1C1917] dark:text-[#FAF9F6] text-sm">{p.label}</p>
                  <p className="text-stone-400 text-xs mt-0.5">{p.desc}</p>
                </div>
                <span className="ml-auto text-emerald-500 text-sm font-medium shrink-0">✓ Required</span>
              </div>
            ))}
          </div>
          <p className="text-stone-400 text-xs mt-3 text-center">
            We never read your code outside of open PRs. No write access to your repository.
          </p>
        </div>

        {/* Bottom CTA */}
        <div className="text-center border-t border-[#E8E0D5] dark:border-[#2C2825] pt-10">
          <a href={GITHUB_APP_URL} target="_blank" rel="noopener noreferrer">
            <Button size="lg" className="bg-[#D97757] hover:bg-[#C25E3A] text-white px-10 py-6 text-base rounded-xl">
              Install on GitHub →
            </Button>
          </a>
          <p className="text-stone-400 text-sm mt-3">
            Questions? <Link href="/" className="text-[#D97757] hover:underline">Back to home</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
