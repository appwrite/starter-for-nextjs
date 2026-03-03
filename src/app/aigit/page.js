"use client"

import { useState } from "react"
import { Logo } from "@/components/logo"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { ThemeToggle } from "@/components/theme-toggle"

export default function Dashboard() {
  const [diff, setDiff] = useState("")
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [usageCount, setUsageCount] = useState(3)
  const maxFreeOps = 10

  const handleReview = async () => {
    if (!diff.trim()) return
    setLoading(true)
    try {
      const res = await fetch('/api/aigit/review', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ diff, vibeMode: 'balanced' })
      })
      const data = await res.json()
      setResult(data)
      setUsageCount(prev => prev + 1)
    } catch (error) {
      console.error('Review failed:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCommitMessage = async () => {
    if (!diff.trim()) return
    setLoading(true)
    try {
      const res = await fetch('/api/aigit/suggest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ diff })
      })
      const data = await res.json()
      setResult(data)
      setUsageCount(prev => prev + 1)
    } catch (error) {
      console.error('Commit message generation failed:', error)
    } finally {
      setLoading(false)
    }
  }

  const usagePercentage = (usageCount / maxFreeOps) * 100
  const isNearLimit = usageCount >= maxFreeOps * 0.8

  return (
    <div className="min-h-screen bg-[#FAF9F6] dark:bg-[#1C1917] transition-colors duration-300">

      {/* Header */}
      <header className="border-b border-[#E8E0D5] dark:border-[#2C2825] backdrop-blur-sm sticky top-0 z-50 bg-[#FAF9F6]/90 dark:bg-[#1C1917]/90">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Logo width={64} />
              <Badge variant="outline" className="border-[#D9B5A4] text-[#C25E3A] dark:border-[#5C3A28] dark:text-[#E8896A] text-xs">
                Free Plan
              </Badge>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-stone-400 dark:text-stone-500 hidden sm:block">
                {usageCount} / {maxFreeOps} operations
              </span>
              <ThemeToggle />
              <Button className="bg-[#D97757] hover:bg-[#C25E3A] text-white text-sm shadow-sm">
                Upgrade to Pro
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8 max-w-4xl">

        {/* Usage Warning */}
        {isNearLimit && (
          <Card className="mb-6 bg-[#FEF3EE] border-[#D9B5A4] dark:bg-[#2C1F18] dark:border-[#5C3A28]">
            <CardHeader className="pb-3">
              <CardTitle className="text-[#C25E3A] dark:text-[#E8896A] flex items-center gap-2 text-base" style={{fontFamily: 'Lora, Georgia, serif'}}>
                ⚠ Running low on free operations
              </CardTitle>
              <CardDescription className="text-[#8B5E4A] dark:text-[#C8A090]">
                Upgrade to Pro for unlimited AI operations and all features.
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <Button className="bg-[#D97757] hover:bg-[#C25E3A] text-white text-sm">
                Upgrade — $15/month
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Usage Progress */}
        <Card className="mb-6 bg-white dark:bg-[#252120] border-[#E8E0D5] dark:border-[#2C2825] shadow-sm">
          <CardContent className="pt-5 pb-5">
            <div className="flex items-center justify-between mb-2.5">
              <span className="text-sm text-stone-500 dark:text-stone-400">Free tier usage</span>
              <span className="text-sm font-medium text-[#1C1917] dark:text-[#FAF9F6]">
                {usageCount} / {maxFreeOps}
              </span>
            </div>
            <div className="w-full bg-stone-100 dark:bg-[#1C1917] rounded-full h-1.5">
              <div
                className={`h-1.5 rounded-full transition-all ${
                  isNearLimit
                    ? 'bg-gradient-to-r from-amber-400 to-red-400'
                    : 'bg-[#D97757]'
                }`}
                style={{ width: `${Math.min(usagePercentage, 100)}%` }}
              />
            </div>
          </CardContent>
        </Card>

        {/* Main Tabs */}
        <Tabs defaultValue="review" className="space-y-5">
          <TabsList className="bg-stone-100 dark:bg-[#252120] border border-[#E8E0D5] dark:border-[#2C2825] p-1 rounded-xl h-auto">
            <TabsTrigger value="review" className="rounded-lg text-sm data-[state=active]:bg-[#D97757] data-[state=active]:text-white data-[state=active]:shadow-sm">
              🔍 Code Review
            </TabsTrigger>
            <TabsTrigger value="commit" className="rounded-lg text-sm data-[state=active]:bg-[#D97757] data-[state=active]:text-white data-[state=active]:shadow-sm">
              🤖 Commit Message
            </TabsTrigger>
            <TabsTrigger value="pr" className="rounded-lg text-sm data-[state=active]:bg-[#D97757] data-[state=active]:text-white data-[state=active]:shadow-sm">
              📝 PR Description
            </TabsTrigger>
            <TabsTrigger value="vibe" className="rounded-lg text-sm data-[state=active]:bg-[#D97757] data-[state=active]:text-white data-[state=active]:shadow-sm">
              ✦ Vibe Session
            </TabsTrigger>
          </TabsList>

          {/* Code Review Tab */}
          <TabsContent value="review">
            <Card className="bg-white dark:bg-[#252120] border-[#E8E0D5] dark:border-[#2C2825] shadow-sm">
              <CardHeader>
                <CardTitle className="text-[#1C1917] dark:text-[#FAF9F6]" style={{fontFamily: 'Lora, Georgia, serif'}}>AI Code Review</CardTitle>
                <CardDescription className="text-stone-400 dark:text-stone-500">
                  Paste your git diff and get instant AI-powered review with severity scoring
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Textarea
                  placeholder={`Paste your git diff here...\n\nExample:\ndiff --git a/src/app.js b/src/app.js\n--- a/src/app.js\n+++ b/src/app.js\n@@ -10,7 +10,7 @@\n-  console.log('clicked')\n+  // TODO: implement logging`}
                  className="min-h-[280px] bg-[#FAF9F6] dark:bg-[#1C1917] border-[#E8E0D5] dark:border-[#2C2825] text-stone-700 dark:text-stone-300 placeholder:text-stone-300 dark:placeholder:text-stone-600 font-mono text-sm rounded-xl resize-none focus-visible:ring-[#D97757]"
                  value={diff}
                  onChange={(e) => setDiff(e.target.value)}
                />
                <Button
                  onClick={handleReview}
                  disabled={loading || !diff.trim() || usageCount >= maxFreeOps}
                  className="bg-[#D97757] hover:bg-[#C25E3A] text-white"
                >
                  {loading ? 'Analyzing...' : usageCount >= maxFreeOps ? 'Upgrade to continue' : 'Get AI review'}
                </Button>

                {result && result.score !== undefined && (
                  <Card className="bg-[#FAF9F6] dark:bg-[#1C1917] border-[#E8E0D5] dark:border-[#2C2825] mt-4">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-[#1C1917] dark:text-[#FAF9F6] text-base" style={{fontFamily: 'Lora, Georgia, serif'}}>Review Results</CardTitle>
                        <Badge className={`text-white text-xs ${
                          result.score >= 8 ? 'bg-emerald-500' :
                          result.score >= 6 ? 'bg-amber-500' : 'bg-red-500'
                        }`}>
                          {result.score}/10
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {result.summary && (
                        <p className="text-stone-500 dark:text-stone-400 text-sm">{result.summary}</p>
                      )}
                      {result.issues?.length > 0 ? (
                        <div className="space-y-2">
                          <p className="font-medium text-[#1C1917] dark:text-[#FAF9F6] text-sm">Issues found:</p>
                          {result.issues.map((issue, i) => (
                            <div key={i} className="bg-white dark:bg-[#252120] p-3 rounded-lg border-l-2 border-amber-400">
                              <p className="text-sm text-stone-600 dark:text-stone-300">
                                {typeof issue === 'object' ? issue.description : issue}
                              </p>
                              {issue.suggestion && (
                                <p className="text-xs text-stone-400 mt-1">→ {issue.suggestion}</p>
                              )}
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-emerald-600 dark:text-emerald-400 text-sm">✓ No issues found!</p>
                      )}
                      {result.vibeCheck && (
                        <div className="bg-[#EEDDD6] dark:bg-[#2C1F18] p-4 rounded-xl border border-[#D9B5A4] dark:border-[#5C3A28]">
                          <p className="text-[#C25E3A] dark:text-[#E8896A] font-medium text-sm mb-1">✦ Vibe check</p>
                          <p className="text-stone-600 dark:text-stone-300 text-sm">{result.vibeCheck}</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Commit Message Tab */}
          <TabsContent value="commit">
            <Card className="bg-white dark:bg-[#252120] border-[#E8E0D5] dark:border-[#2C2825] shadow-sm">
              <CardHeader>
                <CardTitle className="text-[#1C1917] dark:text-[#FAF9F6]" style={{fontFamily: 'Lora, Georgia, serif'}}>Generate Commit Message</CardTitle>
                <CardDescription className="text-stone-400 dark:text-stone-500">
                  AI-generated conventional commit messages with alternatives
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Textarea
                  placeholder="Paste your git diff here..."
                  className="min-h-[280px] bg-[#FAF9F6] dark:bg-[#1C1917] border-[#E8E0D5] dark:border-[#2C2825] text-stone-700 dark:text-stone-300 placeholder:text-stone-300 dark:placeholder:text-stone-600 font-mono text-sm rounded-xl resize-none focus-visible:ring-[#D97757]"
                  value={diff}
                  onChange={(e) => setDiff(e.target.value)}
                />
                <Button
                  onClick={handleCommitMessage}
                  disabled={loading || !diff.trim() || usageCount >= maxFreeOps}
                  className="bg-[#D97757] hover:bg-[#C25E3A] text-white"
                >
                  {loading ? 'Generating...' : usageCount >= maxFreeOps ? 'Upgrade to continue' : 'Generate message'}
                </Button>

                {result?.message && (
                  <Card className="bg-[#FAF9F6] dark:bg-[#1C1917] border-[#E8E0D5] dark:border-[#2C2825]">
                    <CardHeader>
                      <CardTitle className="text-[#1C1917] dark:text-[#FAF9F6] text-base" style={{fontFamily: 'Lora, Georgia, serif'}}>Suggested commits</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      {[result.message, ...(result.alternatives || [])].map((msg, i) => (
                        <div
                          key={i}
                          className="bg-white dark:bg-[#252120] p-4 rounded-xl border border-[#E8E0D5] dark:border-[#2C2825] hover:border-[#D97757] dark:hover:border-[#D97757] transition cursor-pointer"
                          onClick={() => navigator.clipboard?.writeText(msg)}
                        >
                          <p className="font-mono text-sm text-[#C25E3A] dark:text-[#E8896A]">{msg}</p>
                          {i === 0 && (
                            <Badge className="mt-2 bg-[#EEDDD6] text-[#C25E3A] dark:bg-[#2C1F18] dark:text-[#E8896A] border-0 text-xs">Primary</Badge>
                          )}
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* PR Description Tab */}
          <TabsContent value="pr">
            <Card className="bg-white dark:bg-[#252120] border-[#E8E0D5] dark:border-[#2C2825] shadow-sm">
              <CardHeader>
                <CardTitle className="text-[#1C1917] dark:text-[#FAF9F6]" style={{fontFamily: 'Lora, Georgia, serif'}}>Generate PR Description</CardTitle>
                <CardDescription className="text-stone-400 dark:text-stone-500">
                  Auto-generate comprehensive PR titles, descriptions, and labels
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-stone-500 dark:text-stone-400 text-sm mb-4">
                  This feature requires a Pro account. Upgrade to unlock unlimited PR generation.
                </p>
                <Button className="bg-[#D97757] hover:bg-[#C25E3A] text-white">
                  Upgrade to Pro
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Vibe Session Tab */}
          <TabsContent value="vibe">
            <Card className="bg-white dark:bg-[#252120] border-[#E8E0D5] dark:border-[#2C2825] shadow-sm">
              <CardHeader>
                <CardTitle className="text-[#1C1917] dark:text-[#FAF9F6]" style={{fontFamily: 'Lora, Georgia, serif'}}>Vibe Session Analysis</CardTitle>
                <CardDescription className="text-stone-400 dark:text-stone-500">
                  Track your coding flow state and momentum
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-[#FAF9F6] dark:bg-[#1C1917] p-6 rounded-xl border border-[#E8E0D5] dark:border-[#2C2825]">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-stone-500 dark:text-stone-400 text-sm">Current flow state</span>
                    <Badge className="bg-[#EEDDD6] text-[#C25E3A] dark:bg-[#2C1F18] dark:text-[#E8896A] border-0">Peak 🔥</Badge>
                  </div>
                  <div className="w-full bg-stone-100 dark:bg-[#252120] rounded-full h-2 mb-2">
                    <div className="bg-[#D97757] h-2 rounded-full" style={{ width: '75%' }} />
                  </div>
                  <p className="text-stone-400 text-xs">Based on your recent commit patterns</p>
                </div>
                <p className="text-stone-500 dark:text-stone-400 text-sm">
                  Upgrade to Pro for detailed vibe analytics and flow state tracking.
                </p>
                <Button className="bg-[#D97757] hover:bg-[#C25E3A] text-white">
                  Upgrade to Pro
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* CLI Card */}
        <Card className="mt-6 bg-white dark:bg-[#252120] border-[#E8E0D5] dark:border-[#2C2825] shadow-sm">
          <CardHeader>
            <CardTitle className="text-[#1C1917] dark:text-[#FAF9F6] flex items-center gap-2 text-base" style={{fontFamily: 'Lora, Georgia, serif'}}>
              ⚡ Use from terminal
            </CardTitle>
            <CardDescription className="text-stone-400 dark:text-stone-500">
              Pro users get CLI access for seamless workflow integration
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="bg-[#1C1917] rounded-xl p-5 font-mono text-sm space-y-2">
              <p className="text-[#E8896A]">$ npm run vibe -- review</p>
              <p className="text-[#E8896A]">$ npm run vibe -- pr</p>
              <p className="text-[#E8896A]">$ npm run vibe -- session</p>
              <p className="text-stone-500 mt-3">Install git hooks: npm run vibe:setup</p>
            </div>
          </CardContent>
        </Card>

      </div>
    </div>
  )
}
