import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ThemeToggle } from "@/components/theme-toggle"
import { Logo } from "@/components/logo"
import Link from "next/link"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#FAF9F6] dark:bg-[#1C1917] transition-colors duration-300">

      {/* Navigation */}
      <nav className="border-b border-[#E8E0D5] dark:border-[#2C2825] backdrop-blur-sm sticky top-0 z-50 bg-[#FAF9F6]/90 dark:bg-[#1C1917]/90">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center">
              <Logo width={72} />
            </Link>
            <div className="hidden md:flex items-center gap-7">
              <Link href="#features" className="text-sm text-stone-500 hover:text-[#1C1917] dark:text-stone-400 dark:hover:text-[#FAF9F6] transition">
                Features
              </Link>
              <Link href="#pricing" className="text-sm text-stone-500 hover:text-[#1C1917] dark:text-stone-400 dark:hover:text-[#FAF9F6] transition">
                Pricing
              </Link>
              <ThemeToggle />
              <Link href="/install" className="text-sm text-stone-500 hover:text-[#1C1917] dark:text-stone-400 dark:hover:text-[#FAF9F6] transition">
                GitHub App
              </Link>
              <Link href="/aigit">
                <Button variant="outline" className="border-[#D97757] text-[#D97757] hover:bg-[#F5EDE8] dark:hover:bg-[#2C2825] text-sm">
                  Dashboard
                </Button>
              </Link>
              <Link href="/install">
                <Button className="bg-[#D97757] hover:bg-[#C25E3A] text-white text-sm shadow-sm">
                  Install Free →
                </Button>
              </Link>
            </div>
            <div className="flex md:hidden items-center gap-2">
              <ThemeToggle />
            </div>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="container mx-auto px-6 py-24 md:py-36">
        <div className="text-center space-y-8 max-w-4xl mx-auto">

          <Badge className="bg-[#EEDDD6] text-[#C25E3A] border-[#D9B5A4] dark:bg-[#2C1F18] dark:text-[#E8896A] dark:border-[#5C3A28] px-4 py-1.5 text-sm font-medium rounded-full">
            ✦ AI-Powered Git Workflow
          </Badge>

          <h1 className="text-5xl md:text-7xl font-semibold text-[#1C1917] dark:text-[#FAF9F6] leading-[1.15] tracking-tight" style={{fontFamily: 'Lora, Georgia, serif'}}>
            Code review that
            <br />
            <span className="italic text-[#D97757] dark:text-[#E8896A]">
              understands your vibe
            </span>
          </h1>

          <p className="text-lg md:text-xl text-stone-500 dark:text-stone-400 max-w-2xl mx-auto leading-relaxed">
            Claude AI analyzes your commits, reviews code in real-time, and tracks your flow state. Ship better code, faster.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
            <Link href="/install">
              <Button size="lg" className="bg-[#D97757] hover:bg-[#C25E3A] text-white px-8 py-6 text-base shadow-sm rounded-xl">
                Install GitHub App →
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="border-[#E8E0D5] dark:border-[#2C2825] text-stone-600 dark:text-stone-300 hover:bg-[#F5EDE8] dark:hover:bg-[#252120] px-8 py-6 text-base rounded-xl">
              ▶ Watch demo
            </Button>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6 pt-4 text-stone-400 dark:text-stone-500 text-sm">
            <div className="flex items-center gap-2"><span className="text-[#D97757]">✓</span> No credit card required</div>
            <div className="flex items-center gap-2"><span className="text-[#D97757]">✓</span> 10 free AI operations</div>
            <div className="flex items-center gap-2"><span className="text-[#D97757]">✓</span> Cancel anytime</div>
          </div>
        </div>

        {/* Terminal Demo */}
        <div className="mt-20 max-w-3xl mx-auto">
          <Card className="border-[#E8E0D5] dark:border-[#2C2825] overflow-hidden shadow-lg dark:shadow-2xl bg-white dark:bg-[#252120]">
            <div className="bg-[#F5F1EB] dark:bg-[#1C1917] p-5">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-3 h-3 rounded-full bg-red-400/80" />
                <div className="w-3 h-3 rounded-full bg-yellow-400/80" />
                <div className="w-3 h-3 rounded-full bg-green-400/80" />
                <span className="ml-3 text-xs text-stone-400 font-mono">~ ivgit.com</span>
              </div>
              <div className="bg-[#1C1917] rounded-lg p-5 font-mono text-sm space-y-2">
                <div className="text-[#E8896A]">$ npm run vibe -- review</div>
                <div className="text-stone-500">Analyzing your code with Claude AI...</div>
                <div className="text-emerald-400 mt-3">✓ Code quality: 8.5/10</div>
                <div className="text-amber-400">⚠ 2 potential issues found</div>
                <div className="text-sky-400">ℹ Flow state: Peak momentum detected</div>
                <div className="text-[#E8896A]">✦ Vibe check: You're in the zone! 🔥</div>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="container mx-auto px-6 py-24">
        <div className="text-center mb-16">
          <p className="text-[#D97757] dark:text-[#E8896A] text-sm font-medium uppercase tracking-widest mb-3">Features</p>
          <h2 className="text-4xl md:text-5xl font-semibold text-[#1C1917] dark:text-[#FAF9F6] mb-4" style={{fontFamily: 'Lora, Georgia, serif'}}>
            Everything you need
          </h2>
          <p className="text-stone-500 dark:text-stone-400 max-w-xl mx-auto">
            AI-powered tools that integrate seamlessly into your workflow
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {[
            { icon: "🤖", title: "AI Commit Messages", desc: "Claude writes perfect conventional commits with 3 alternatives to choose from.", code: "feat(auth): implement OAuth 2.0" },
            { icon: "🔍", title: "Live Code Review", desc: "Real-time review with severity scoring and actionable suggestions." },
            { icon: "✦", title: "Vibe Analysis", desc: "Flow state tracking from your commit patterns. Know when you're in the zone." },
            { icon: "📝", title: "PR Descriptions", desc: "Auto-generate comprehensive titles, descriptions, and suggested labels." },
            { icon: "⚡", title: "Git Hooks", desc: "Pre-commit reviews, auto-filled messages, and post-commit insights." },
            { icon: "🛠️", title: "CLI + Web UI", desc: "Terminal commands or browser dashboard. Your choice." },
          ].map((f) => (
            <Card key={f.title} className="bg-white dark:bg-[#252120] border-[#E8E0D5] dark:border-[#2C2825] hover:border-[#D97757] dark:hover:border-[#D97757] transition-all shadow-sm hover:shadow-md group">
              <CardHeader>
                <div className="text-3xl mb-3">{f.icon}</div>
                <CardTitle className="text-[#1C1917] dark:text-[#FAF9F6] text-base font-semibold" style={{fontFamily: 'Lora, Georgia, serif'}}>{f.title}</CardTitle>
                <CardDescription className="text-stone-500 dark:text-stone-400 text-sm leading-relaxed">{f.desc}</CardDescription>
              </CardHeader>
              {f.code && (
                <CardContent>
                  <div className="bg-[#F5F1EB] dark:bg-[#1C1917] rounded-lg p-3 font-mono text-xs text-[#C25E3A] dark:text-[#E8896A]">
                    {f.code}
                  </div>
                </CardContent>
              )}
            </Card>
          ))}
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="container mx-auto px-6 py-24">
        <div className="text-center mb-16">
          <p className="text-[#D97757] dark:text-[#E8896A] text-sm font-medium uppercase tracking-widest mb-3">Pricing</p>
          <h2 className="text-4xl md:text-5xl font-semibold text-[#1C1917] dark:text-[#FAF9F6] mb-4" style={{fontFamily: 'Lora, Georgia, serif'}}>
            Simple, transparent pricing
          </h2>
          <p className="text-stone-500 dark:text-stone-400">Start free, upgrade when ready</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto items-start">
          {/* Free */}
          <Card className="bg-white dark:bg-[#252120] border-[#E8E0D5] dark:border-[#2C2825] p-6 shadow-sm">
            <CardHeader className="p-0 pb-6">
              <div className="text-stone-400 text-sm mb-2">For trying out</div>
              <CardTitle className="text-3xl text-[#1C1917] dark:text-[#FAF9F6]" style={{fontFamily: 'Lora, Georgia, serif'}}>Free</CardTitle>
              <div className="text-5xl font-semibold text-[#1C1917] dark:text-[#FAF9F6] mt-3" style={{fontFamily: 'Lora, Georgia, serif'}}>
                $0<span className="text-base text-stone-400 font-normal">/mo</span>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <ul className="space-y-3 mb-6 text-stone-500 dark:text-stone-400 text-sm">
                <li className="flex gap-2"><span className="text-[#D97757]">✓</span> 10 AI operations/month</li>
                <li className="flex gap-2"><span className="text-[#D97757]">✓</span> Commit messages</li>
                <li className="flex gap-2"><span className="text-[#D97757]">✓</span> Basic vibe tracking</li>
                <li className="flex gap-2 text-stone-300 dark:text-stone-600"><span>✗</span> Code review</li>
              </ul>
              <Link href="/aigit" className="block">
                <Button variant="outline" className="w-full border-[#E8E0D5] dark:border-[#2C2825]">Get started</Button>
              </Link>
            </CardContent>
          </Card>

          {/* Pro */}
          <Card className="bg-[#1C1917] dark:bg-[#D97757]/10 border-[#D97757] p-6 relative shadow-xl -mt-2">
            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
              <Badge className="bg-[#D97757] text-white border-0 px-3 py-1">Most popular</Badge>
            </div>
            <CardHeader className="p-0 pb-6">
              <div className="text-[#E8896A] text-sm mb-2">For developers</div>
              <CardTitle className="text-3xl text-[#FAF9F6]" style={{fontFamily: 'Lora, Georgia, serif'}}>Pro</CardTitle>
              <div className="text-5xl font-semibold text-[#FAF9F6] mt-3" style={{fontFamily: 'Lora, Georgia, serif'}}>
                $15<span className="text-base text-stone-400 font-normal">/mo</span>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <ul className="space-y-3 mb-6 text-stone-300 text-sm">
                <li className="flex gap-2"><span className="text-[#E8896A]">✓</span> Unlimited operations</li>
                <li className="flex gap-2"><span className="text-[#E8896A]">✓</span> Code review + scoring</li>
                <li className="flex gap-2"><span className="text-[#E8896A]">✓</span> PR descriptions</li>
                <li className="flex gap-2"><span className="text-[#E8896A]">✓</span> Full vibe analysis</li>
                <li className="flex gap-2"><span className="text-[#E8896A]">✓</span> Git hooks</li>
              </ul>
              <Link href="/aigit" className="block">
                <Button className="w-full bg-[#D97757] hover:bg-[#C25E3A] text-white">Start free trial</Button>
              </Link>
            </CardContent>
          </Card>

          {/* Team */}
          <Card className="bg-white dark:bg-[#252120] border-[#E8E0D5] dark:border-[#2C2825] p-6 shadow-sm">
            <CardHeader className="p-0 pb-6">
              <div className="text-stone-400 text-sm mb-2">For teams</div>
              <CardTitle className="text-3xl text-[#1C1917] dark:text-[#FAF9F6]" style={{fontFamily: 'Lora, Georgia, serif'}}>Team</CardTitle>
              <div className="text-5xl font-semibold text-[#1C1917] dark:text-[#FAF9F6] mt-3" style={{fontFamily: 'Lora, Georgia, serif'}}>
                $50<span className="text-base text-stone-400 font-normal">/mo</span>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <ul className="space-y-3 mb-6 text-stone-500 dark:text-stone-400 text-sm">
                <li className="flex gap-2"><span className="text-[#D97757]">✓</span> Everything in Pro</li>
                <li className="flex gap-2"><span className="text-[#D97757]">✓</span> Up to 5 developers</li>
                <li className="flex gap-2"><span className="text-[#D97757]">✓</span> Team analytics</li>
                <li className="flex gap-2"><span className="text-[#D97757]">✓</span> Priority support</li>
              </ul>
              <Button variant="outline" className="w-full border-[#E8E0D5] dark:border-[#2C2825]">Contact sales</Button>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA */}
      <section className="container mx-auto px-6 py-24">
        <div className="max-w-3xl mx-auto bg-[#1C1917] dark:bg-[#252120] rounded-2xl p-14 text-center border border-[#2C2825]">
          <h2 className="text-4xl md:text-5xl font-semibold text-[#FAF9F6] mb-5 leading-tight" style={{fontFamily: 'Lora, Georgia, serif'}}>
            Ready to ship
            <span className="italic text-[#E8896A]"> better code?</span>
          </h2>
          <p className="text-stone-400 mb-8 max-w-xl mx-auto">
            Join developers already using AI to write cleaner commits and catch bugs earlier.
          </p>
          <Link href="/aigit">
            <Button size="lg" className="bg-[#D97757] hover:bg-[#C25E3A] text-white px-10 py-6 text-base rounded-xl shadow-sm">
              Start your free trial →
            </Button>
          </Link>
          <p className="text-stone-500 text-sm mt-4">No credit card required</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#E8E0D5] dark:border-[#2C2825]">
        <div className="container mx-auto px-6 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <Logo width={56} />
            <p className="text-stone-400 text-sm">© 2026 ivGit · ivgit.com · Built with Claude AI</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
