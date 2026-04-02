const TEAM = [
  {
    name: "Ali Naeini, Ph.D",
    role: "CEO",
    photo: "/team-ali.jpeg",
    school: "Cal",
    experience: [
      "AI leader at Business Insider & Spotter ($1B+ each)",
      "Products used by millions, $100M+ revenue impact",
      "Multiple Landmark graduate, firsthand insight into post-seminar decay",
    ],
  },
  {
    name: "Saba Fazel",
    role: "CPO",
    photo: null,
    school: "UCLA",
    experience: [
      "Built participatory systems at UN with direct feedback loops",
      "Converts qualitative user insight into product direction",
      "Data Science @ UCLA",
    ],
  },
  {
    name: "Parnian Fazel",
    role: "CTO",
    photo: null,
    school: "Imperial",
    experience: [
      "Applied ML for agentic AI assistants",
      "Built personalization systems processing millions of daily predictions",
      "MSc Machine Learning @ Imperial College London",
    ],
  },
];

function Avatar({
  name,
  photo,
}: {
  name: string;
  photo: string | null;
}) {
  if (photo) {
    return (
      <img
        src={photo}
        alt={name}
        className="h-16 w-16 rounded-full object-cover border-2 border-zinc-700"
      />
    );
  }
  const initials = name
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("");
  return (
    <div className="flex h-16 w-16 items-center justify-center rounded-full border-2 border-zinc-700 bg-zinc-800 text-lg font-semibold text-zinc-400">
      {initials}
    </div>
  );
}

export function Team() {
  return (
    <section aria-labelledby="team-heading" className="py-20 px-6">
      <div className="mx-auto max-w-4xl">
        <p className="text-xs font-medium uppercase tracking-widest text-amber-400 mb-3">
          Team
        </p>
        <h2
          id="team-heading"
          className="text-3xl font-bold tracking-tight mb-10"
        >
          Built by people who&apos;ve done it at scale
        </h2>

        <div className="space-y-6">
          {TEAM.map((member) => (
            <div
              key={member.name}
              className="flex flex-col sm:flex-row gap-5 rounded-xl border border-zinc-700 bg-zinc-800/30 p-6"
            >
              <div className="flex items-center gap-4 sm:flex-col sm:items-center sm:min-w-[140px]">
                <Avatar name={member.name} photo={member.photo} />
                <div className="sm:text-center">
                  <span className="inline-block rounded-full bg-amber-400 px-3 py-0.5 text-xs font-semibold text-zinc-900 mb-1">
                    {member.role}
                  </span>
                  <p className="text-sm font-semibold">{member.name}</p>
                  <p className="text-xs text-zinc-500">{member.school}</p>
                </div>
              </div>
              <ul className="flex-1 space-y-2">
                {member.experience.map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-2 text-sm text-zinc-400"
                  >
                    <span className="text-amber-400 mt-0.5">&#8226;</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
