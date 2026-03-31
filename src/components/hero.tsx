const CALENDLY_URL = "https://cal.com/rumi.team/30min";

export function Hero() {
  return (
    <section aria-labelledby="hero-heading" className="pt-28 pb-20 px-6">
      <div className="mx-auto max-w-3xl text-center">
        <span className="inline-block rounded-full border border-zinc-700 bg-zinc-800 px-3 py-1 text-sm text-zinc-400 mb-6">
          AI Solutions, Delivered in Days
        </span>

        <h1
          id="hero-heading"
          className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight leading-[1.1] mb-5"
        >
          We Build Your AI Automation in{" "}
          <span className="text-amber-400">Days</span>, Not Months
        </h1>

        <p className="mx-auto max-w-xl text-lg text-zinc-400 mb-8">
          Most consultants give you a roadmap. We give you working software.
          Free 15-minute discovery call, then a 5-day sprint to build your first
          AI workflow.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <a
            href={CALENDLY_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto rounded-lg bg-amber-400 px-7 py-3.5 text-base font-semibold text-zinc-900 transition hover:bg-amber-300 focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-900"
          >
            Book Free Call
          </a>
          <a
            href="#case-study"
            className="w-full sm:w-auto rounded-lg border border-zinc-700 px-7 py-3.5 text-base text-zinc-200 transition hover:border-zinc-500 focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-900"
          >
            See Our Work
          </a>
        </div>
      </div>
    </section>
  );
}
