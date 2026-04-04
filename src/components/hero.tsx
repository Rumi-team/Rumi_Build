import { CALENDLY_URL } from "@/lib/data";

export function Hero() {
  return (
    <section aria-labelledby="hero-heading" className="relative pt-28 pb-20 px-6 overflow-hidden">
      {/* Ambient glow */}
      <div className="hero-glow" />

      <div className="relative mx-auto max-w-3xl text-center">
        <span className="inline-block rounded-full border border-zinc-700 bg-zinc-800/80 px-4 py-1.5 text-sm text-zinc-400 mb-6 backdrop-blur-sm">
          Working AI in 5 Days
        </span>

        <h1
          id="hero-heading"
          className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight leading-[1.1] mb-5"
        >
          Your Team Saves 10+ Hours a Week.{" "}
          <span className="text-amber-400">We Build the AI That Does It.</span>
        </h1>

        <p className="mx-auto max-w-xl text-lg text-zinc-400 mb-8 leading-relaxed">
          Most consultants give you a roadmap. We give you working software.
          Free 30-minute discovery call, then a 5-day sprint to your first AI
          workflow.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <a
            href={CALENDLY_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto rounded-lg bg-amber-400 px-7 py-3.5 text-base font-semibold text-zinc-900 transition hover:bg-amber-300 hover:shadow-[0_0_24px_rgba(251,191,36,0.25)] focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-900"
          >
            Book Free Call
          </a>
          <a
            href="/services"
            className="w-full sm:w-auto rounded-lg border border-zinc-700 px-7 py-3.5 text-base text-zinc-200 transition hover:border-zinc-500 hover:bg-zinc-800/50 focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-900"
          >
            See Our Services
          </a>
        </div>
      </div>
    </section>
  );
}
