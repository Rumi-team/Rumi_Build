import { CALENDLY_URL } from "@/lib/data";

export function Footer() {
  return (
    <footer className="border-t border-zinc-800 py-12 px-6">
      <div className="mx-auto max-w-5xl">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-10">
          <div>
            <img src="/rumi-logo.png" alt="Rumi" className="h-10 mb-3" />
            <p className="text-xs text-zinc-500">Designed in California</p>
          </div>

          <div>
            <h3 className="text-xs font-medium uppercase tracking-widest text-zinc-500 mb-3">
              Services
            </h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="/services"
                  className="text-sm text-zinc-400 hover:text-zinc-200 transition"
                >
                  All Services
                </a>
              </li>
              <li>
                <a
                  href="/services/workflow-automation"
                  className="text-sm text-zinc-400 hover:text-zinc-200 transition"
                >
                  Workflow Automation
                </a>
              </li>
              <li>
                <a
                  href="/services/voice-ai"
                  className="text-sm text-zinc-400 hover:text-zinc-200 transition"
                >
                  Voice AI Agents
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-medium uppercase tracking-widest text-zinc-500 mb-3">
              Industries
            </h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="/industries"
                  className="text-sm text-zinc-400 hover:text-zinc-200 transition"
                >
                  All Industries
                </a>
              </li>
              <li>
                <a
                  href="/industries/home-services"
                  className="text-sm text-zinc-400 hover:text-zinc-200 transition"
                >
                  Home Services
                </a>
              </li>
              <li>
                <a
                  href="/industries/healthcare"
                  className="text-sm text-zinc-400 hover:text-zinc-200 transition"
                >
                  Healthcare
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-medium uppercase tracking-widest text-zinc-500 mb-3">
              Company
            </h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="/team"
                  className="text-sm text-zinc-400 hover:text-zinc-200 transition"
                >
                  Team
                </a>
              </li>
              <li>
                <a
                  href="/pricing"
                  className="text-sm text-zinc-400 hover:text-zinc-200 transition"
                >
                  Pricing
                </a>
              </li>
              <li>
                <a
                  href={CALENDLY_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-zinc-400 hover:text-zinc-200 transition"
                >
                  Book a Call
                </a>
              </li>
              <li>
                <a
                  href="mailto:support@rumi.team"
                  className="text-sm text-zinc-400 hover:text-zinc-200 transition"
                >
                  Contact Support
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-zinc-800 pt-6 text-center">
          <p className="text-sm text-zinc-500">
            Copyright &copy;2026, Rumi, Inc. Made in California.
          </p>
        </div>
      </div>
    </footer>
  );
}
