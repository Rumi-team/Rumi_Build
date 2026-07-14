import { redirect } from "next/navigation";

// The productized "services" menu (the persian-leads lead-gen offer) was retired
// (implementation guide §7). Language-reach detail now lives on the industry
// pages. Anyone hitting the old /services URL is sent to the Industries hub.
export default function ServicesPage() {
  redirect("/industries");
}
