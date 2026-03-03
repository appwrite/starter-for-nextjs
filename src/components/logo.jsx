"use client"

import { useTheme } from "next-themes"
import { useEffect, useState } from "react"

/**
 * ivGit logo — "IV" in warm gradient above large light "git" in monospace.
 * git text color adapts: dark warm on light bg, warm cream on dark bg.
 */
export function Logo({ width = 100, className = "" }) {
  const { theme } = useTheme()
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  // git text color: warm dark on light, warm cream on dark
  const gitColor = mounted && theme === "light" ? "#4A433E" : "#EDE8E3"

  const scale = width / 200

  return (
    <svg
      width={width}
      height={120 * scale}
      viewBox="0 0 200 120"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="ivGit"
    >
      <defs>
        <linearGradient id="ivGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" style={{ stopColor: "#CC9B7A", stopOpacity: 1 }} />
          <stop offset="100%" style={{ stopColor: "#E8B17B", stopOpacity: 1 }} />
        </linearGradient>
      </defs>
      {/* IV — bold gradient, small, tracking */}
      <text
        x="10"
        y="40"
        fontFamily="system-ui, sans-serif"
        fontSize="36"
        fontWeight="700"
        fill="url(#ivGrad)"
        letterSpacing="3"
      >
        IV
      </text>
      {/* git — large, light weight, monospace */}
      <text
        x="10"
        y="105"
        fontFamily="'Fira Code', 'Courier New', monospace"
        fontSize="80"
        fontWeight="300"
        fill={gitColor}
        style={{ transition: "fill 0.3s" }}
      >
        git
      </text>
    </svg>
  )
}
