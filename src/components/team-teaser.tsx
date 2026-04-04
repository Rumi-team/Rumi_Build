import { TEAM } from "@/lib/data";

function Avatar({ name, photo }: { name: string; photo: string }) {
  return (
    <img
      src={photo}
      alt={name}
      className="h-14 w-14 rounded-full object-cover border-2 border-zinc-700"
    />
  );
}

export function TeamTeaser() {
  return (
    <section aria-labelledby="team-heading" className="py-20 px-6">
      <div className="mx-auto max-w-4xl text-center">
        <p className="text-xs font-medium uppercase tracking-widest text-amber-400 mb-3">
          Team
        </p>
        <h2
          id="team-heading"
          className="text-3xl font-bold tracking-tight mb-3"
        >
          Built by people who&apos;ve done it at scale
        </h2>
        <p className="text-zinc-400 mb-8">
          Management team — backed by a dedicated engineering and design team.
        </p>

        <div className="flex items-center justify-center gap-6 mb-8">
          {TEAM.map((member) => (
            <div key={member.name} className="flex flex-col items-center gap-2">
              <Avatar name={member.name} photo={member.photo} />
              <span className="inline-block rounded-full bg-amber-400 px-2.5 py-0.5 text-xs font-semibold text-zinc-900">
                {member.role}
              </span>
              <p className="text-sm font-medium">{member.name}</p>
            </div>
          ))}
        </div>

        <a
          href="/team"
          className="inline-block rounded-lg border border-zinc-700 px-6 py-2.5 text-sm text-zinc-300 transition hover:border-zinc-500 focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-900"
        >
          Meet the full team &rarr;
        </a>
      </div>
    </section>
  );
}
