import { redirect } from "next/navigation";

// Retired. /audit was a second front door to the same $100 call that /book
// already sells, written in the older "3 Chiefs" vocabulary and anchored on
// payroll impact rather than on the work — both of which the tone rule forbids.
// The single booking path is /book.
//
// vercel.json also 308s /audit to /book, so the edge handles this before Next
// ever runs. This stub is the backstop if that rule is ever removed. Prior
// content is in git history.
export default function AuditPage() {
  redirect("/book");
}
