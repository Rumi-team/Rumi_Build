const CALENDLY_URL = "https://calendly.com/ali-rumi/discovery";

export function Nav() {
  return (
    <nav
      aria-label="Main"
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-12 h-16 border-b border-zinc-800 bg-zinc-900/95 backdrop-blur"
    >
      <span className="text-xl font-bold tracking-tight">
        <span className="text-amber-400">rumi</span>
        <span className="text-zinc-400">.build</span>
      </span>
      <a
        href={CALENDLY_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="rounded-lg bg-amber-400 px-5 py-2 text-sm font-semibold text-zinc-900 transition hover:bg-amber-300 focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-900"
      >
        Book Free Call
      </a>
    </nav>
  );
}
