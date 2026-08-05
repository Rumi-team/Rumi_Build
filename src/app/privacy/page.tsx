import type { Metadata } from "next";
import { Nav } from "@/components/nav";
import { Footer } from "@/components/footer";
import { EnglishMain } from "@/components/english-main";
import { SmsConsentClause } from "@/components/sms-consent-clause";

const TITLE = "Privacy Policy — Rumi AI";
const DESCRIPTION =
  "How Rumi AI LLC collects, uses, shares, and protects your information, including our SMS / text-messaging consent terms and our commitment not to sell or share mobile opt-in data.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  // The root layout's canonical is "/" and is inherited wholesale, so a page
  // without its own declares itself the homepage. Relative, so it resolves
  // through metadataBase and follows the canonical host.
  alternates: { canonical: "/privacy" },
  // `openGraph` is inherited wholesale for the same reason, so without this the
  // page shipped its own canonical beside the homepage's og:url and og:title.
  // It matters more here than on a marketing page: this URL is fetched and
  // previewed by carriers during A2P/SMS campaign vetting, and a preview that
  // titles itself "Hire AI employees … from $300/mo" is not the policy document
  // they asked for.
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: "/privacy",
    siteName: "Rumi AI",
    type: "website",
    images: [{ url: "/og-image.png?v=2", width: 1200, height: 630 }],
  },
};

export default function PrivacyPage() {
  return (
    <>
      <Nav />
      <EnglishMain className="pt-16">
        {/* Header */}
        <section className="py-20 px-6">
          <div className="mx-auto max-w-3xl">
            <p className="eyebrow mb-3">Legal</p>
            <h1 className="text-4xl md:text-5xl font-black tracking-h1 leading-[1.1] text-ink mb-4">
              Privacy Policy
            </h1>
            <p className="text-sm text-muted">Effective May 26, 2026</p>
          </div>
        </section>

        {/* Body */}
        <section className="pb-20 px-6 border-t border-line">
          <div className="mx-auto max-w-3xl pt-12 space-y-10">
            <div>
              <h2 className="text-xl font-bold tracking-h2 text-ink mb-3">
                1. Introduction
              </h2>
              <p className="text-base text-muted leading-relaxed">
                Rumi AI LLC (&ldquo;Rumi,&rdquo; &ldquo;we,&rdquo;
                &ldquo;us,&rdquo; or &ldquo;our&rdquo;) provides done-for-you
                digital presence and multilingual customer communications for
                local businesses. Rumi AI is founded and based in Los Angeles.
                This Privacy Policy explains what
                information we collect, how we use and share it, and the choices
                you have. It applies to our website and to the services we
                provide, including our inbound phone line and SMS program.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-bold tracking-h2 text-ink mb-3">
                2. Information we collect
              </h2>
              <p className="text-base text-muted leading-relaxed mb-3">
                We collect the following categories of information:
              </p>
              <ul className="list-disc space-y-2 pl-5 text-base text-muted leading-relaxed">
                <li>Your name.</li>
                <li>
                  Your mobile phone number, including the inbound caller ID
                  (ANI) captured when you call our phone line.
                </li>
                <li>
                  The details of the service request or inquiry you make, and
                  recordings or transcripts of your calls with Rumi or our
                  automated voice agent.
                </li>
                <li>
                  Site-usage and analytics data, such as pages viewed and
                  general device and interaction information.
                </li>
              </ul>
            </div>

            <div>
              <h2 className="text-xl font-bold tracking-h2 text-ink mb-3">
                3. How we use information
              </h2>
              <p className="text-base text-muted leading-relaxed mb-3">
                We use the information we collect to:
              </p>
              <ul className="list-disc space-y-2 pl-5 text-base text-muted leading-relaxed">
                <li>Respond to and fulfill the request or inquiry you made.</li>
                <li>
                  Send confirmations and customer-care follow-ups related to
                  your request.
                </li>
                <li>Operate, maintain, and improve the Services.</li>
                <li>Comply with our legal obligations.</li>
              </ul>
            </div>

            <div>
              <h2 className="text-xl font-bold tracking-h2 text-ink mb-3">
                4. SMS / text messaging &amp; consent
              </h2>
              <SmsConsentClause />
            </div>

            <div>
              <h2 className="text-xl font-bold tracking-h2 text-ink mb-3">
                5. How we share information
              </h2>
              <p className="text-base text-muted leading-relaxed mb-3">
                We share personal information only with service providers and
                processors acting on our behalf, under contract and only as
                needed to provide the Services. These providers fall into the
                following categories:
              </p>
              <ul className="list-disc space-y-2 pl-5 text-base text-muted leading-relaxed mb-3">
                <li>Telephony and messaging providers.</li>
                <li>AI transcription and processing providers.</li>
                <li>Cloud hosting and analytics providers.</li>
              </ul>
              <p className="text-base text-muted leading-relaxed">
                We may also disclose information when required by law or to
                protect our rights. We never sell your personal information, and,
                as stated in our SMS terms above, we do not share mobile opt-in
                information or phone numbers with third parties or affiliates for
                their own marketing purposes.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-bold tracking-h2 text-ink mb-3">
                6. Your choices
              </h2>
              <p className="text-base text-muted leading-relaxed">
                You can opt out of text messages at any time by replying STOP to
                any message from us. To access, correct, or delete the personal
                information we hold about you, email us at{" "}
                <a
                  href="mailto:support@rumi.build"
                  className="text-accent hover:text-accent-hover underline"
                >
                  support@rumi.build
                </a>{" "}
                and we will respond as required by applicable law.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-bold tracking-h2 text-ink mb-3">
                7. Data retention
              </h2>
              <p className="text-base text-muted leading-relaxed">
                We retain personal information for as long as needed to provide
                the Services, fulfill the purposes described in this policy,
                resolve disputes, and comply with our legal obligations. When
                information is no longer needed, we delete or de-identify it.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-bold tracking-h2 text-ink mb-3">
                8. Security
              </h2>
              <p className="text-base text-muted leading-relaxed">
                We use reasonable administrative, technical, and physical
                safeguards designed to protect personal information. No method of
                transmission or storage is completely secure, however, and we
                cannot guarantee absolute security.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-bold tracking-h2 text-ink mb-3">
                9. Children&rsquo;s privacy
              </h2>
              <p className="text-base text-muted leading-relaxed">
                The Services are intended for businesses and are not directed to
                children under 13. We do not knowingly collect personal
                information from children. If you believe a child has provided us
                with personal information, contact us and we will delete it.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-bold tracking-h2 text-ink mb-3">
                10. Changes to this policy
              </h2>
              <p className="text-base text-muted leading-relaxed">
                We may update this Privacy Policy from time to time. When we do,
                we will revise the effective date above and, where appropriate,
                provide additional notice. Your continued use of the Services
                after changes take effect constitutes acceptance of the updated
                policy.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-bold tracking-h2 text-ink mb-3">
                11. Contact
              </h2>
              <p className="text-base text-muted leading-relaxed">
                Questions about this Privacy Policy or your data? Contact us at{" "}
                <a
                  href="mailto:support@rumi.build"
                  className="text-accent hover:text-accent-hover underline"
                >
                  support@rumi.build
                </a>
                .
              </p>
            </div>
          </div>
        </section>
      </EnglishMain>
      <Footer />
    </>
  );
}
