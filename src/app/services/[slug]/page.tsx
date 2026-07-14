import { redirect } from "next/navigation";

// The persian-leads service page was retired (implementation guide §7): the
// URL/content language mismatch and the stale pricing/"open role" copy are gone,
// and language-reach detail folds into the industry pages instead. Any old
// /services/<slug> link (including /services/persian-leads) redirects to the
// Industries hub so nothing dead-ends.
export default function ServiceDetailPage() {
  redirect("/industries");
}
