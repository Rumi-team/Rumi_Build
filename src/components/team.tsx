const TEAM = [
  {
    name: "Ali Naeini, Ph.D",
    role: "CEO",
    photo: "/team-ali.jpeg",
    school: "UC Berkeley",
    experience: [
      "AI leader at Business Insider & Spotter ($1B+ each)",
      "Products used by millions, $100M+ revenue impact",
    ],
  },
  {
    name: "Saba Fazel",
    role: "CPO",
    photo: "/team-saba.jpeg",
    school: "UCLA",
    experience: [
      "Converts qualitative user insight into product direction",
      "Data Science @ UCLA",
    ],
  },
  {
    name: "Parnian Fazel",
    role: "CTO",
    photo: "/team-parnian.jpeg",
    school: "Imperial College London",
    experience: [
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
        className="h-16 w-16 rounded-full object-cover border-2 border-line"
      />
    );
  }
  const initials = name
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("");
  return (
    <div className="flex h-16 w-16 items-center justify-center rounded-full border-2 border-line bg-surface text-lg font-semibold text-muted">
      {initials}
    </div>
  );
}

export function Team() {
  return (
    <section aria-labelledby="team-heading" className="py-20 px-6">
      <div className="mx-auto max-w-4xl">
        <p className="eyebrow mb-3">
          Team
        </p>
        <h2
          id="team-heading"
          className="text-3xl font-bold tracking-h2 text-ink mb-3"
        >
          Built by people who&apos;ve done it at scale
        </h2>
        <p className="text-muted mb-10">
          Management team — backed by a dedicated engineering and design team.
        </p>

        <div className="space-y-6">
          {TEAM.map((member) => (
            <div
              key={member.name}
              className="flex flex-col sm:flex-row gap-5 card p-6"
            >
              <div className="flex items-center gap-4 sm:flex-col sm:items-center sm:min-w-[140px]">
                <Avatar name={member.name} photo={member.photo} />
                <div className="sm:text-center">
                  <span className="inline-block rounded-full bg-accent px-3 py-0.5 text-xs font-semibold text-white mb-1">
                    {member.role}
                  </span>
                  <p className="text-sm font-semibold text-ink">{member.name}</p>
                  <p className="text-xs text-muted">{member.school}</p>
                </div>
              </div>
              <ul className="flex-1 space-y-2">
                {member.experience.map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-2 text-base md:text-lg text-muted"
                  >
                    <span className="text-accent mt-0.5">&#8226;</span>
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
