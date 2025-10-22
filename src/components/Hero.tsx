import Link from "next/link";

const stats = [
  { label: "Events Delivered", value: "350+" },
  { label: "Client Satisfaction", value: "98%" },
  { label: "Cities Activated", value: "24" },
];

const highlightCards = [
  {
    title: "Signature Experiences",
    description:
      "Immersive, story-driven environments that keep guests talking long after the lights dim.",
  },
  {
    title: "End-to-End Production",
    description:
      "From creative ideation to on-site execution, our producers ensure flawless delivery.",
  },
  {
    title: "VIP Community",
    description:
      "Unlock insider access to limited experiences, partner perks, and curated inspiration.",
  },
];

export default function Hero() {
  return (
    <section className="relative isolate overflow-hidden px-6 pb-20 pt-28 sm:px-8 sm:pb-24 sm:pt-32 lg:px-12">
      <div className="absolute inset-0 -z-10 opacity-80">
        <div className="absolute -left-48 top-10 h-80 w-80 rounded-full bg-gradient-to-br from-pink-500/60 via-fuchsia-500/40 to-purple-500/30 blur-3xl sm:-left-36 sm:top-0 sm:h-[28rem] sm:w-[28rem]" />
        <div className="absolute bottom-0 right-0 h-64 w-64 rounded-full bg-gradient-to-br from-purple-500/40 via-blue-500/30 to-emerald-400/30 blur-3xl sm:h-[22rem] sm:w-[22rem]" />
        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-neutral-950 via-neutral-950/80 to-transparent" />
      </div>

      <div className="mx-auto grid max-w-6xl items-center gap-16 lg:grid-cols-[minmax(0,1fr),minmax(0,0.9fr)]">
        <div className="flex flex-col gap-8 text-balance">
          <div className="inline-flex items-center gap-3 self-start rounded-full border border-white/20 bg-white/10 px-4 py-1 text-xs uppercase tracking-[0.3em] text-white/80 backdrop-blur-md">
            <span className="h-1.5 w-1.5 rounded-full bg-lime-400" />
            JAM Events
          </div>
          <div className="flex flex-col gap-6">
            <h1 className="font-semibold text-4xl leading-tight text-white sm:text-5xl lg:text-6xl">
              Create unforgettable moments with{" "}
              <span className="bg-gradient-to-br from-pink-400 via-fuchsia-300 to-purple-300 bg-clip-text text-transparent">
                JAM Events
              </span>
            </h1>
            <p className="text-lg text-neutral-200 sm:text-xl">
              We craft immersive corporate and social experiences that delight
              guests, elevate brands, and build lasting community. Join our
              circle to unlock curated events, insider invitations, and bespoke
              planning support.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-4">
            <Link
              href="#signup"
              className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-pink-500 via-fuchsia-500 to-purple-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-pink-500/30 transition hover:scale-[1.02] hover:shadow-pink-500/40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pink-400"
            >
              Join the community
            </Link>
            <Link
              href="#highlights"
              className="inline-flex items-center justify-center rounded-full border border-white/20 px-6 py-3 text-sm font-semibold text-white/80 transition hover:border-white/40 hover:text-white"
            >
              Explore our services
            </Link>
          </div>

          <dl className="grid gap-6 pt-6 sm:grid-cols-3">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="rounded-2xl border border-white/10 bg-white/[0.07] p-4 backdrop-blur-md"
              >
                <dt className="text-xs uppercase tracking-[0.35em] text-neutral-300">
                  {stat.label}
                </dt>
                <dd className="mt-3 text-3xl font-semibold text-white">
                  {stat.value}
                </dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="relative hidden rounded-[2.5rem] border border-white/10 bg-white/[0.08] p-8 shadow-[0_40px_120px_-40px_rgba(236,72,153,0.35)] backdrop-blur-2xl lg:flex lg:flex-col lg:gap-6">
          <div className="absolute -left-12 top-1/2 hidden h-24 w-24 -translate-y-1/2 rounded-full border border-white/30 bg-gradient-to-br from-pink-400/40 to-purple-400/40 blur-xl lg:block" />
          <div>
            <p className="text-sm uppercase tracking-[0.45em] text-white/70">
              Next up
            </p>
            <h2 className="mt-3 font-semibold text-2xl text-white">
              Sunset Soirée, Barcelona
            </h2>
            <p className="mt-3 text-sm text-neutral-200/90">
              A rooftop celebration pairing live jazz, mixology, and immersive
              projection mapping under the Mediterranean sky.
            </p>
          </div>
          <div className="grid gap-4 rounded-2xl border border-white/10 bg-neutral-950/70 p-5">
            {highlightCards.map((card) => (
              <div key={card.title} className="flex flex-col gap-1.5">
                <h3 className="text-sm font-semibold text-white">
                  {card.title}
                </h3>
                <p className="text-sm text-neutral-300">{card.description}</p>
              </div>
            ))}
          </div>
          <p className="text-xs text-neutral-400">
            Request an invite or partner with JAM to bring the next unforgettable
            gathering to life.
          </p>
        </div>
      </div>
    </section>
  );
}
