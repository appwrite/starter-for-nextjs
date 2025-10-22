import Link from "next/link";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-white/10 bg-neutral-950/90 px-6 py-10 sm:px-8 lg:px-12">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-2">
          <span className="text-sm font-semibold uppercase tracking-[0.35em] text-pink-200/70">
            JAM Events
          </span>
          <p className="text-sm text-neutral-400">
            Crafting unforgettable gatherings for brands, creatives, and
            communities worldwide.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-neutral-400">
          <Link
            href="mailto:hello@jamevents.com"
            className="transition hover:text-white"
          >
            hello@jamevents.com
          </Link>
          <Link
            href="https://www.instagram.com"
            className="transition hover:text-white"
            target="_blank"
            rel="noreferrer"
          >
            Instagram
          </Link>
          <Link
            href="https://www.linkedin.com"
            className="transition hover:text-white"
            target="_blank"
            rel="noreferrer"
          >
            LinkedIn
          </Link>
        </div>
        <p className="text-xs text-neutral-500 sm:text-right">
          © {year} JAM Events. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
