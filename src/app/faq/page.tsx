import type { Metadata } from "next";
import { Nav } from "@/components/nav";
import { Footer } from "@/components/footer";
import { EnglishMain } from "@/components/english-main";

const TITLE = "FAQ — Rumi AI";
const DESCRIPTION =
  "Straight answers on the five AI employees you can hire from Rumi AI, what each costs, how the 90% saving works, white-labeling, what it means for your existing team, and the extra services we build and run.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  // The root layout's canonical is "/" and is inherited wholesale, so a page
  // without its own declares itself the homepage. Relative, so it resolves
  // through metadataBase and follows the canonical host.
  alternates: { canonical: "/faq" },
  // `openGraph` is inherited wholesale too — same rule as `title` and
  // `alternates`, and the other half of the same defect. Without this block the
  // built HTML carried `canonical: /faq` beside `og:url: /` and the homepage's
  // og:title, so every share of this page resolved and attributed to "/".
  // Restating openGraph replaces the layout's object rather than merging into
  // it, so siteName/type/images have to be restated or the preview image is
  // lost. `url` is relative on purpose: it follows metadataBase rather than
  // pinning a host a sibling site also ships.
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: "/faq",
    siteName: "Rumi AI",
    type: "website",
    images: [{ url: "/og-image.png", width: 1200, height: 630 }],
  },
};

// Static, visible Q&A (no accordion) — deliberate, so search engines and AI
// engines (ChatGPT, Claude, Perplexity) can read every answer. Copy is final,
// from the implementation guide §6.
const FAQS: { q: string; a: string }[] = [
  {
    q: "What does Rumi AI actually do?",
    a: "We recruit, train, and manage AI employees for your business. You hire a role — an AI Receptionist, an AI Executive Assistant, an AI Social Media Manager, or a bundle of them — and we get it live in one to three weeks, trained on your own calls, inbox, calendar, and tone of voice, then keep managing it. We also build and run the rest of the digital side if you need it: the website, the app, the content, and being found when someone searches or asks an AI who to hire.",
  },
  {
    q: "What roles can I hire, and what do they cost?",
    a: "Five. AI Receptionist from $300/mo, AI Social Media Manager from $400/mo, AI Executive Assistant from $500/mo, AI Office Manager (Receptionist plus Executive Assistant) from $800/mo, and AI Chief of Staff (all three core roles) from $900/mo. Each one is priced at roughly a tenth of what that volume of work costs a business today. The full detail on each role is on the AI Employees page.",
  },
  {
    q: "How can it be 90% cheaper for the same work?",
    a: "Because the roles handle the part of the job that repeats — the calls that go to voicemail, the inbox triage, the posting schedule — and that part scales cheaply once it has been trained on your business. The judgement calls still come to you. So you are paying for volume of work handled, not for someone's time, and the arithmetic ends up around a tenth.",
  },
  {
    q: "Can a role run under my own brand?",
    a: "Yes. Any of the five can run white-labeled — your name on it, your logo, a voice you choose. Your customers only ever see you, never Rumi. We go through how that works and what it costs on the call.",
  },
  {
    q: "Do you build a full website, or just improve how I show up in AI search?",
    a: "Both. We build your full digital presence — website, social, and AI visibility — we don't just tweak what you already have.",
  },
  {
    q: "How is a voice agent different from a chatbot?",
    a: "For you, they're not separate products, they're two channels of the same AI front desk. The chatbot handles typed questions on your website, the voice agent answers phone calls, both work in English and Farsi, and both hand off to a real person when something needs one.",
  },
  {
    q: "What if the AI can't handle something?",
    a: "It hands off to a real person — you or your team — rather than guessing or leaving the customer stuck. True for both the chatbot and the voice agent.",
  },
  {
    q: "Who is this for?",
    a: "Local, trust-based businesses where customers hire based on referrals and reputation, not just search ranking. Right now that includes real estate, home design and décor, beauty and salon, and home services. Don't see your industry listed? Tell us about your business, we'll give you an honest answer on whether we're a good fit.",
  },
  {
    q: "Do you only work with small businesses?",
    a: "No. We're not limited by size — we focus publicly on the industries where we have real, proven experience, and that list grows as our track record does. If you're not sure whether you fit, ask — we'd rather give you a straight answer than have you guess.",
  },
  {
    q: "Do you offer services in Farsi or other languages?",
    a: "Yes. We reach customers in English and Farsi today, with more languages as we grow.",
  },
  {
    q: "Where are you based?",
    a: "Rumi AI is founded and based in Los Angeles.",
  },
  {
    q: "How is this different from Thumbtack, Angi, or a regular marketing agency?",
    a: "Two things. Most agencies aren't yet built for how people find businesses through AI tools like ChatGPT and Gemini — right now the large majority of local businesses never come up when someone asks. We build specifically for that. And big lead platforms sell the same lead to several competitors at once, in English only. We deliver leads qualified for your business, in the language that actually gets them to say yes.",
  },
  {
    q: "What happens after I sign up?",
    a: "We start with a working call to understand your business and exactly where you're falling behind — your website, your social presence, or how easy you are to find. From there we build the specific thing that's missing. For a website, that means a first draft, your feedback, a few rounds of revisions, then launch on your own domain. Once you're live, we keep things running and handle changes as you need them.",
  },
  {
    q: "How much does this cost?",
    a: "The AI employee roles have published starting prices, from $300/mo up to $900/mo depending on the role. They are starting points: we set the actual number once we have seen your call volume, your inbox, and the tools you use. Month to month, no setup fee. The extra services — a website, an app, content — are scoped on the call, because what they cost depends on what you need built.",
  },
  {
    q: "What does this mean for the people already on my team?",
    a: "They get their week back. These roles are hired against the work that repeats — the calls nobody can get to, the inbox that never empties, the posting that keeps slipping — not against anyone's job. Nothing here is a reason to let a person go, and we will say so on the call if that is what you are asking us to help with. The point is that your team stops spending its day on the parts of the work that never needed a human, and stays on the parts that do.",
  },
  {
    q: "Every business is different. How do you know what will actually work for mine?",
    a: "We don't guess. The first call is us learning your business specifically, not fitting you into a template. Whatever we build comes from what's actually true about how you operate, not a generic package.",
  },
  {
    q: "Who are you, and is my data safe?",
    a: "We're a small, LA-based team — you can see exactly who's behind this on our Team page. We only access what's needed to do the specific work — your website, your social accounts, whatever's relevant — and you keep ownership and control of your domain, your accounts, and your data the whole time.",
  },
];

// schema.org FAQPage — built from the same array so it never drifts from the
// visible copy. Helps AI engines cite exact answers.
const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: FAQS.map((f) => ({
    "@type": "Question",
    name: f.q,
    acceptedAnswer: { "@type": "Answer", text: f.a },
  })),
};

export default function FaqPage() {
  return (
    <>
      <Nav />
      <EnglishMain className="pt-16">
        {/* Every "<" is escaped to its JSON \u003c form before it reaches
            dangerouslySetInnerHTML. Inside a script element the HTML parser is
            still scanning for the closing tag, so an answer containing that
            sequence would end the script early and spill the rest of the JSON
            into the page as markup. The escape is transparent to every JSON
            parser, so the FAQPage schema an engine reads is unchanged. FAQS is
            authored in this file today, but this is an HTML sink either way and
            getting it right costs one call. */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(faqSchema).replace(/</g, "\\u003c"),
          }}
        />
        <section className="bg-white py-20 px-6 md:px-12">
          <div className="mx-auto max-w-3xl">
            <p className="eyebrow mb-3">FAQ</p>
            <h1 className="text-3xl md:text-4xl font-bold tracking-h2 text-ink mb-3">
              Questions, answered plainly.
            </h1>
            <p className="text-muted text-lg mb-12 max-w-xl">
              Straight answers about what we do, who it&apos;s for, and how we
              work.
            </p>

            <dl>
              {FAQS.map((f, i) => (
                <div
                  key={f.q}
                  className={`py-6 ${i === 0 ? "" : "border-t border-line"}`}
                >
                  <dt className="text-lg font-semibold text-ink mb-2">{f.q}</dt>
                  <dd className="text-muted leading-relaxed">{f.a}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>
      </EnglishMain>
      <Footer />
    </>
  );
}
