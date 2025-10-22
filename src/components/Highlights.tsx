const highlights = [
  {
    eyebrow: "Strategy",
    title: "Programs built around your goals",
    description:
      "Launches, incentives, roadshows, retreats—we translate business objectives into experiential journeys that drive measurable outcomes.",
  },
  {
    eyebrow: "Experience Design",
    title: "Immersive storytelling & production",
    description:
      "Our creative lab blends set design, lighting, sound, and interactive technology to craft spaces that thrill every sense.",
  },
  {
    eyebrow: "Community",
    title: "Cultivate relationships that last",
    description:
      "Stay in the loop with member-only happenings, collaborations, and cultural moments curated by the JAM collective.",
  },
];

export default function Highlights() {
  return (
    <section
      id="highlights"
      className="relative isolate px-6 py-24 sm:px-8 lg:px-12"
    >
      <div className="absolute inset-x-0 bottom-0 -z-10 h-1/2 bg-gradient-to-t from-neutral-900 via-neutral-900/60 to-transparent" />
      <div className="mx-auto max-w-5xl text-left md:text-center">
        <p className="text-xs uppercase tracking-[0.45em] text-pink-300/80">
          Experiences reimagined
        </p>
        <h2 className="mt-4 text-3xl font-semibold text-white sm:text-4xl">
          Where strategy, creativity, and precision meet
        </h2>
        <p className="mt-4 text-base text-neutral-300 sm:text-lg">
          JAM partners with forward-thinking teams to design intentional
          gatherings, weaving data, artistry, and hospitality into every moment.
        </p>
      </div>

      <div className="mx-auto mt-16 grid max-w-5xl gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {highlights.map((item) => (
          <article
            key={item.title}
            className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.07] p-6 transition duration-500 hover:-translate-y-1.5 hover:border-white/30 hover:bg-white/[0.12]"
          >
            <div className="pointer-events-none absolute -inset-8 z-0 rounded-[36px] opacity-0 blur-3xl transition duration-500 group-hover:opacity-100 group-hover:blur-2xl group-hover:[background:radial-gradient(circle_at_top,_rgba(236,72,153,0.35),_transparent_65%)]" />
            <div className="relative z-10 flex flex-col gap-2">
              <span className="text-xs uppercase tracking-[0.35em] text-pink-200/70">
                {item.eyebrow}
              </span>
              <h3 className="text-lg font-semibold text-white">{item.title}</h3>
              <p className="text-sm text-neutral-200/80">{item.description}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
