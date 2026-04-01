export function Footer() {
  return (
    <footer className="border-t border-zinc-800 py-12 px-6 text-center">
      <p className="text-sm text-zinc-500">
        rumi.build is a service of Rumi Inc. &copy; 2026
      </p>
      <p className="text-sm text-zinc-500 mt-2">
        Questions?{" "}
        <a
          href="mailto:support@rumi.team"
          className="text-zinc-400 underline underline-offset-2 hover:text-zinc-200 transition focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-900"
        >
          support@rumi.team
        </a>
      </p>
    </footer>
  );
}
