import { redirect } from "next/navigation";

// Retired. This page sold an "AI Employee · Chief of Staff" at a second URL,
// with a scope (bookkeeping, invoicing, intake forms, project portals) that is
// not part of the five canonical roles, and with person-anchored copy the tone
// rule forbids ("you have a payroll problem", "someone you pay $80K+"). The real
// role now lives at /services/ai-chief-of-staff.
//
// vercel.json also 308s /chief-of-staff to the same destination, so the edge
// handles this before Next ever runs. This stub is the backstop if that rule is
// ever removed. Prior content is in git history.
export default function ChiefOfStaffPage() {
  redirect("/services/ai-chief-of-staff");
}
