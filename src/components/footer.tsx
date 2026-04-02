export function Footer() {
  return (
    <footer className="border-t border-zinc-800 py-10 px-6">
      <div className="mx-auto max-w-5xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <img src="/rumi-logo.png" alt="Rumi" className="h-8 mb-2" />
          <p className="text-xs text-zinc-500">Designed in California</p>
        </div>

        <p className="text-sm text-zinc-500">
          Copyright &copy;2026, Rumi, Inc. Made in California.
        </p>

        <div className="text-right">
          <a
            href="mailto:support@rumi.team"
            className="text-sm text-zinc-400 hover:text-zinc-200 transition"
          >
            &hearts; Contact Support
          </a>
          <p className="text-xs text-zinc-500 mt-2">
            For developers &amp; enterprise &rarr;{" "}
            <a
              href="https://www.rumiagent.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-zinc-400 hover:text-zinc-200 transition"
            >
              rumiagent.com
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
