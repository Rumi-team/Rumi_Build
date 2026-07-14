import { redirect } from "next/navigation";

// The separate "free evaluation" intake was absorbed into a single "Book a Call"
// path (implementation guide §2 — one path instead of two). Anyone landing on
// the old /evaluate URL (bookmarks, external links, stale search results) is
// sent to the booking page so nothing dead-ends.
export default function EvaluatePage() {
  redirect("/book");
}
