import { permanentRedirect } from "next/navigation";

// The separate "free evaluation" intake was absorbed into a single "Book a Call"
// path (implementation guide §2 — one path instead of two). Anyone landing on
// the old /evaluate URL (bookmarks, external links, stale search results) is
// sent to the booking page so nothing dead-ends.
//
// permanentRedirect(), not redirect(): this URL is retired for good, so it has
// to be a 308 and not a 307. A temporary redirect tells search engines to keep
// /evaluate in the index and keep the link equity there.
export default function EvaluatePage() {
  permanentRedirect("/book");
}
