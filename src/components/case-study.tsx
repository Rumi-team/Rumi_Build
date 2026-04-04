import { PORTFOLIO } from "@/lib/data";

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
          Our Work
        </p>
        <h2
          id="case-study-heading"
          className="text-3xl font-bold tracking-tight mb-8"
        >
          Real results, not slide decks
        </h2>

        {/* Website redesign case study */}
        <div className="rounded-2xl border border-zinc-700 bg-zinc-800/50 p-6 md:p-10 mb-6">
          <p className="text-xs font-medium uppercase tracking-widest text-amber-400 mb-2">
            Website Redesign
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

          <div className="flex gap-10 border-t border-zinc-700 pt-6">
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
        </div>

        {/* Portfolio cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {PORTFOLIO.map((project) => (
            <a
              key={project.url}
              href={project.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group rounded-xl border border-zinc-700 bg-zinc-800/30 p-6 transition hover:border-amber-400/50 hover:bg-zinc-800/50 focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-900"
            >
              <p className="text-xs font-medium uppercase tracking-widest text-amber-400 mb-2">
                {project.label}
              </p>
              <h3 className="text-lg font-semibold mb-2 group-hover:text-amber-400 transition">
                {project.title}
              </h3>
              <p className="text-sm text-zinc-400 mb-4">
                {project.description}
              </p>
              <div className="flex items-baseline gap-2 border-t border-zinc-700 pt-4">
                <span className="font-mono text-xl font-bold text-amber-400">
                  {project.stat}
                </span>
                <span className="text-sm text-zinc-400">
                  {project.statLabel}
                </span>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
