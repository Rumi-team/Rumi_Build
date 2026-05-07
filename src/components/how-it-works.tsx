const STEPS = [
  {
    num: 1,
    title: "Quick call",
    desc: "We learn your business in 15 minutes — what you sell, where, what kind of customers you want more of. English or Farsi, your call.",
  },
  {
    num: 2,
    title: "Build in 48 hours",
    desc: "We build your bilingual landing page, write your offer, and design the creative for Instagram and Telegram. You review and approve before anything goes live.",
  },
  {
    num: 3,
    title: "Launch local campaigns",
    desc: "We run targeted ads to Persian-speaking customers in your city plus organic outreach to Iranian-diaspora Telegram channels. Your offer reaches the right neighbors.",
  },
  {
    num: 4,
    title: "Leads to your phone",
    desc: "Every interested customer lands directly on your phone within minutes. Name, photo, location, what they want, budget range. You call, you close.",
  },
  {
    num: 5,
    title: "Weekly results, money-back guarantee",
    desc: "Every week you see exactly how many leads, how many booked, how many bought. If we deliver fewer than 60% of promised leads in month one, you get a pro-rated refund.",
  },
];

export function HowItWorks() {
  return (
    <section aria-labelledby="how-heading" className="py-20 px-6">
      <div className="mx-auto max-w-5xl">
        <p className="text-xs font-medium uppercase tracking-widest text-amber-400 mb-3">
          How It Works
        </p>
        <h2
          id="how-heading"
          className="text-3xl font-bold tracking-tight mb-10"
        >
          From first call to first customer in 7 days
        </h2>

        <ol className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-5">
          {STEPS.map((step) => (
            <li
              key={step.num}
              className="rounded-xl border border-zinc-700 bg-zinc-800/50 p-6"
            >
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-400 font-mono text-sm font-bold text-zinc-900 mb-4">
                {step.num}
              </span>
              <h3 className="text-lg font-semibold mb-2">{step.title}</h3>
              <p className="text-sm text-zinc-400 leading-relaxed">
                {step.desc}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
