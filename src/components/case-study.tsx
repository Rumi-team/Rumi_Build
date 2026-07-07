import { PORTFOLIO } from "@/lib/data";

const BEFORE = [
  "Hand-coded WordPress site from 2018",
  "Months of agency back-and-forth",
  "Manual event updates",
  "No mobile, no bilingual support",
];

const AFTER = [
  "AI-generated design system, shipped in days",
  "Prayer times API integration",
  "Admin CMS for content management",
  "Mobile-first, fully bilingual",
];

function IconX() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 16 16"
      className="mt-1 h-3.5 w-3.5 shrink-0 text-muted"
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
      className="mt-1 h-3.5 w-3.5 shrink-0 text-accent"
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
        <p className="eyebrow mb-3">
          Our Work
        </p>
        <h2
          id="case-study-heading"
          className="text-3xl md:text-4xl font-bold tracking-h2 text-ink mb-3"
        >
          Real results, not slide decks
        </h2>
        <p className="text-muted mb-10 max-w-xl">
          Working software in days, not roadmaps in months. Recent ships
          across web, voice, and iOS.
        </p>

        {/* IMAN website case study — featured */}
        <div className="card rounded-xl p-6 md:p-10 mb-6">
          <h3 className="text-xl md:text-2xl font-bold text-ink mb-6">
            Bilingual community website,{" "}
            <span className="text-accent">designed and built by AI</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8">
            <div className="rounded-lg bg-surface p-5">
              <h4 className="text-xs font-medium uppercase tracking-wide text-muted mb-3">
                Before
              </h4>
              <ul className="space-y-2.5">
                {BEFORE.map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-2.5 text-sm text-muted"
                  >
                    <IconX />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-lg bg-surface p-5">
              <h4 className="text-xs font-medium uppercase tracking-wide text-accent mb-3">
                After
              </h4>
              <ul className="space-y-2.5">
                {AFTER.map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-2.5 text-sm text-ink"
                  >
                    <IconCheck />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="border-t border-line mb-6" />
          <div className="flex flex-wrap gap-x-10 gap-y-4">
            <div>
              <p className="text-3xl font-bold text-accent">
                5 days
              </p>
              <p className="text-sm text-muted">from call to live site</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-accent">
                10+ hrs/mo
              </p>
              <p className="text-sm text-muted">saved on manual updates</p>
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
              className="group flex flex-col rounded-xl card p-6 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
            >
              <p className="eyebrow mb-2">
                {project.label}
              </p>
              <h3 className="text-lg font-semibold text-ink mb-2 group-hover:text-accent transition">
                {project.title}
              </h3>
              <p className="text-sm text-muted leading-relaxed mb-5 flex-1">
                {project.description}
              </p>
              <div className="flex items-baseline gap-2 pt-4 border-t border-line">
                <span className="text-xl font-bold text-accent">
                  {project.stat}
                </span>
                <span className="text-sm text-muted">
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
