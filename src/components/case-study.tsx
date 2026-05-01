import { PORTFOLIO } from "@/lib/data";

const BEFORE = [
  "WordPress site from 2018",
  "No mobile responsiveness",
  "Manual event updates",
  "No bilingual support",
];

const AFTER = [
  "Modern bilingual design system",
  "Prayer times API integration",
  "Admin CMS for content management",
  "Mobile-first responsive design",
];

function IconX() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 16 16"
      className="mt-1 h-3.5 w-3.5 shrink-0 text-zinc-500"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    >
      <path d="M4 4l8 8M12 4l-8 8" />
    </svg>
  );
}

function IconCheck() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 16 16"
      className="mt-1 h-3.5 w-3.5 shrink-0 text-amber-400"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 8.5l3.5 3.5L13 4.5" />
    </svg>
  );
}

export function CaseStudy() {
  return (
    <section
      id="case-study"
      aria-labelledby="case-study-heading"
      className="scroll-mt-20 py-20 px-6"
    >
      <div className="mx-auto max-w-5xl">
        <p className="text-xs font-medium uppercase tracking-widest text-amber-400 mb-3">
          Our Work
        </p>
        <h2
          id="case-study-heading"
          className="text-3xl md:text-4xl font-bold tracking-tight mb-3"
        >
          Real results, not slide decks
        </h2>
        <p className="text-zinc-400 mb-10 max-w-xl">
          Working software in days, not roadmaps in months. Recent ships
          across web, voice, and iOS.
        </p>

        {/* IMAN website case study — featured */}
        <div className="card-glass card-featured rounded-xl p-6 md:p-10 mb-6">
          <p className="text-xs font-medium uppercase tracking-widest text-amber-400 mb-2">
            IMAN.org — Website Redesign
          </p>
          <h3 className="text-xl md:text-2xl font-bold mb-6">
            Bilingual community website with custom design system
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8">
            <div className="rounded-lg bg-zinc-900/40 p-5">
              <h4 className="text-xs font-medium uppercase tracking-wide text-zinc-500 mb-3">
                Before
              </h4>
              <ul className="space-y-2.5">
                {BEFORE.map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-2.5 text-sm text-zinc-400"
                  >
                    <IconX />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-lg bg-zinc-900/40 p-5">
              <h4 className="text-xs font-medium uppercase tracking-wide text-amber-400 mb-3">
                After
              </h4>
              <ul className="space-y-2.5">
                {AFTER.map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-2.5 text-sm text-zinc-300"
                  >
                    <IconCheck />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="stats-accent mb-6" />
          <div className="flex flex-wrap gap-x-10 gap-y-4">
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {PORTFOLIO.map((project) => (
            <a
              key={project.url}
              href={project.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex flex-col rounded-xl card-glass p-6 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-900"
            >
              <p className="text-xs font-medium uppercase tracking-widest text-amber-400 mb-2">
                {project.label}
              </p>
              <h3 className="text-lg font-semibold mb-2 group-hover:text-amber-400 transition">
                {project.title}
              </h3>
              <p className="text-sm text-zinc-400 leading-relaxed mb-5 flex-1">
                {project.description}
              </p>
              <div className="flex items-baseline gap-2 pt-4 border-t border-zinc-800">
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
