import type { Metadata } from "next";
import { Nav } from "@/components/nav";
import { Footer } from "@/components/footer";
import { EnglishMain } from "@/components/english-main";
import { CalEmbed } from "@/components/cal-embed";
import { CAL_LINK, CALENDLY_URL } from "@/lib/data";

// Kept out of the sitemap AND out of the index. This is the intro call we send
// to people we approached directly, kept alive for anyone holding an old link;
// /book is the paid strategy call every internal link and every CTA points at
// (30 minutes at $75, or 60 at $125 — prices live in src/lib/stripe.ts).
// It used to headline itself as "a free 30-min intro call", which was the site
// advertising a free version of the one thing it charges for — see the note by
// the embed: both pages book the SAME Cal.com event. Left indexable, a
// near-duplicate of the booking page outranks the one that takes money — and
// dropping a URL from the sitemap does not deindex it, it only stops
// advertising it. `follow: true` because the links out of here (nav, footer)
// still lead somewhere we want crawled.
//
// NO CANONICAL. This used to declare `canonical: "/book"` to consolidate any
// signal onto the booking page. That pairing is the one Google Search Central
// explicitly warns against: noindex plus a canonical pointing at a DIFFERENT
// URL are contradictory signals, and Google may take the noindex as the
// stronger one and carry it across to the canonical target. The target here is
// /book — the page every CTA on the site points at, and the only page that
// takes money. Losing it from the index to tidy up a duplicate nobody links to
// is not a trade worth making. A noindex page has nothing to consolidate, so
// the right number of canonicals here is zero.
//
// `canonical: null`, NOT a deleted `alternates`. Verified in the built HTML:
// dropping the key altogether makes this page INHERIT the root layout's
// canonical, so it went straight from claiming to be /book to claiming to be
// the homepage. `null` is Next's supported suppression (Metadata's
// `alternates.canonical` is typed `null | string | URL | URLDescriptor`) and
// emits no <link rel="canonical"> at all.
//
// It DOES declare its own openGraph. This is the one page on the site whose
// entire job is being pasted into an email or a DM, and `openGraph` is
// inherited from the root layout wholesale (same rule as `title` and
// `alternates`), so without this block every share of the invite previewed as
// the homepage — wrong title, wrong description, `og:url` pointing at "/".
// Restating it replaces the layout's object rather than merging into it, so
// siteName/type/images have to be restated or the preview loses its image.
// `url` is relative on purpose: it resolves through metadataBase instead of
// pinning a host a sibling site also ships.
const TITLE = "Your intro call | Rumi AI";
const DESCRIPTION =
  "The 30-minute intro call for businesses we reached out to directly. We map the repetitive work eating your team's week and which AI employee covers it. English or Farsi.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  robots: { index: false, follow: true },
  alternates: { canonical: null },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: "/schedule",
    siteName: "Rumi AI",
    type: "website",
    images: [{ url: "/og-image.png?v=2", width: 1200, height: 630 }],
  },
};

export default function SchedulePage() {
  return (
    <>
      <Nav />
      {/* The one Farsi line below carries its own lang/dir/font-vazirmatn, so
          it still renders RTL in the Persian face inside this LTR wrapper —
          an element-level font-family beats the ancestor's `font-sans`. */}
      <EnglishMain className="min-h-screen bg-white text-ink pt-16">
        <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 sm:py-16">
          <p className="eyebrow mb-3">
            Schedule
          </p>
          <h1 className="text-4xl md:text-5xl font-black tracking-h1 text-ink mb-3">
            Your 30-min intro call. English or Farsi.
          </h1>
          <p className="text-base sm:text-lg text-muted mb-2">
            This is the intro call for businesses we invited directly. Thirty
            minutes: we map the work that repeats — the calls going to
            voicemail, the inbox that never empties, the posting that slips —
            and say plainly which AI employee covers it, and which ones you
            don&apos;t need yet.
          </p>
          <p
            lang="fa"
            dir="rtl"
            className="font-vazirmatn text-base text-muted mb-6 sm:mb-8"
          >
            تماس آشنایی ۳۰ دقیقه‌ای — به فارسی یا انگلیسی.
          </p>

          {/* SAME Cal.com event as the paid 30-minute call. CAL_LINK is one
              slug (rumi-ai/30-min-meeting) and it is still the only event type
              this repo has, so /book/success — reached only after the Stripe
              payment — books this very calendar for a 30-minute purchase. These
              are not two products; they are two doors onto one 30-minute
              meeting, and this door is the one we hand out by hand. Do not
              write copy on either page that implies the other call is a
              different length.
              The 60-minute option sold on /book has NO event type at all:
              CAL_LINK_60MIN is "" and /book/success falls back to emailing the
              buyer times. Three calls, one calendar — see TODOS.md, both
              missing event types should be created in the same sitting. */}
          <CalEmbed calLink={CAL_LINK} />

          <p className="mt-4 text-xs text-muted">
            Trouble with the calendar?{" "}
            <a
              href={CALENDLY_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="underline text-accent hover:text-accent-hover"
            >
              Open it in a new tab
            </a>
            .
          </p>
        </div>
      </EnglishMain>
      <Footer />
    </>
  );
}
