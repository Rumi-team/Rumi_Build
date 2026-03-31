const CALENDLY_URL = "https://cal.com/rumi.team/30min";

const BEFORE = [
  "Outdated design from 2018",
  "No mobile responsiveness",
  "Manual event updates",
  "No online engagement tools",
];

const AFTER = [
  "Modern, mobile-first design",
  "AI-generated content from existing materials",
  "Automated event calendar",
  "Online engagement integrated",
];

export function CaseStudy() {
  return (
    <section
      id="case-study"
      aria-labelledby="case-study-heading"
      className="scroll-mt-20 py-20 px-6"
    >
      <div className="mx-auto max-w-4xl">
        <p className="text-xs font-medium uppercase tracking-widest text-amber-400 mb-3">
          Case Study
        </p>
        <h2
          id="case-study-heading"
          className="text-3xl font-bold tracking-tight mb-8"
        >
          Real results, not slide decks
        </h2>

        <div className="rounded-2xl border border-zinc-700 bg-zinc-800/50 p-6 md:p-10">
          <p className="text-xs font-medium uppercase tracking-widest text-amber-400 mb-2">
            Community Organization
          </p>
          <h3 className="text-xl md:text-2xl font-bold mb-6">
            Complete website redesign with AI-powered content
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8">
            <div className="rounded-lg border border-dashed border-zinc-700 p-5">
              <h4 className="text-xs font-medium uppercase tracking-wide text-red-400 mb-3">
                Before
              </h4>
              <ul className="space-y-2">
                {BEFORE.map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-2 text-sm text-zinc-400"
                  >
                    <span className="text-red-400 mt-0.5">&times;</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-lg border border-dashed border-zinc-700 p-5">
              <h4 className="text-xs font-medium uppercase tracking-wide text-green-400 mb-3">
                After
              </h4>
              <ul className="space-y-2">
                {AFTER.map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-2 text-sm text-zinc-400"
                  >
                    <span className="text-green-400 mt-0.5">&#10003;</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="flex gap-10 border-t border-zinc-700 pt-6 mb-8">
            <div>
              <p className="font-mono text-3xl font-bold text-amber-400">
                3 days
              </p>
              <p className="text-sm text-zinc-400">from call to live site</p>
            </div>
            <div>
              <p className="font-mono text-3xl font-bold text-amber-400">
                10+ hrs/mo
              </p>
              <p className="text-sm text-zinc-400">saved on manual updates</p>
            </div>
          </div>

          <a
            href={CALENDLY_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block rounded-lg bg-amber-400 px-7 py-3.5 text-base font-semibold text-zinc-900 transition hover:bg-amber-300 focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-900"
          >
            Book Free Call
          </a>
        </div>
      </div>
    </section>
  );
}
