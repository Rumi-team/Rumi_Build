import type { Metadata } from "next";
import { Nav } from "@/components/nav";
import { Footer } from "@/components/footer";
import { SmsConsentClause } from "@/components/sms-consent-clause";

export const metadata: Metadata = {
  title: "Terms & Conditions — Rumi Build",
  description:
    "The terms and conditions governing your use of Rumi's lead-generation and multilingual communications services, including our SMS / text-messaging program.",
};

export default function TermsPage() {
  return (
    <>
      <Nav />
      <main className="pt-16">
        {/* Header */}
        <section className="py-20 px-6">
          <div className="mx-auto max-w-3xl">
            <p className="eyebrow mb-3">Legal</p>
            <h1 className="text-4xl md:text-5xl font-black tracking-h1 leading-[1.1] text-ink mb-4">
              Terms &amp; Conditions
            </h1>
            <p className="text-sm text-muted">Effective May 26, 2026</p>
          </div>
        </section>

        {/* Body */}
        <section className="pb-20 px-6 border-t border-line">
          <div className="mx-auto max-w-3xl pt-12 space-y-10">
            <div>
              <h2 className="text-xl font-bold tracking-h2 text-ink mb-3">
                1. Agreement to these Terms
              </h2>
              <p className="text-base text-muted leading-relaxed">
                These Terms &amp; Conditions (&ldquo;Terms&rdquo;) govern your
                access to and use of the websites, products, and services
                (collectively, the &ldquo;Services&rdquo;) provided by Rumi, Inc.
                (&ldquo;Rumi,&rdquo; &ldquo;we,&rdquo; &ldquo;us,&rdquo; or
                &ldquo;our&rdquo;). By accessing or using the Services, or by
                engaging Rumi to provide services to your business, you agree to
                be bound by these Terms. If you do not agree, do not use the
                Services.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-bold tracking-h2 text-ink mb-3">
                2. Our Services
              </h2>
              <p className="text-base text-muted leading-relaxed">
                Rumi provides lead generation and multilingual customer
                communications for local businesses in Southern California. The
                Services may include advertising, multilingual landing pages, an
                automated multilingual phone agent, lead routing, and related
                support, as described on our{" "}
                <a
                  href="/evaluate"
                  className="text-accent hover:text-accent-hover underline"
                >
                  free evaluation
                </a>{" "}
                page and in any order or statement of work you agree to with us.
                We may update, add, or remove features over time.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-bold tracking-h2 text-ink mb-3">
                3. Eligibility
              </h2>
              <p className="text-base text-muted leading-relaxed">
                You must be at least 18 years old to use the Services. If you use
                the Services on behalf of a business or other entity, you
                represent that you have the authority to bind that entity to
                these Terms, and &ldquo;you&rdquo; refers to that entity.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-bold tracking-h2 text-ink mb-3">
                4. Plans, billing &amp; refunds
              </h2>
              <p className="text-base text-muted leading-relaxed">
                Paid plans are billed monthly in advance. You may cancel at any
                time after your first month; cancellation takes effect at the end
                of the then-current billing period. Our money-back guarantee and
                lead-rollover terms are described on our{" "}
                <a
                  href="/evaluate"
                  className="text-accent hover:text-accent-hover underline"
                >
                  free evaluation
                </a>{" "}
                page and apply as stated there. Plan details, lead limits, and
                any per-lead charges are scoped on your free evaluation call and
                set out in your quote, and may change with notice for future
                billing periods. Except as
                described in our money-back guarantee or as required by law, fees
                already paid are non-refundable.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-bold tracking-h2 text-ink mb-3">
                5. SMS / text-messaging program
              </h2>
              <SmsConsentClause />
            </div>

            <div>
              <h2 className="text-xl font-bold tracking-h2 text-ink mb-3">
                6. Acceptable use
              </h2>
              <p className="text-base text-muted leading-relaxed">
                You agree not to misuse the Services. You will not use the
                Services to violate any law or regulation; send unlawful,
                deceptive, or unsolicited messages; infringe the rights of
                others; interfere with or disrupt the Services; attempt to gain
                unauthorized access to our systems; or submit false contact
                information or provide consent on behalf of another person
                without their authorization. You are responsible for the accuracy
                of the information and consents you provide to us.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-bold tracking-h2 text-ink mb-3">
                7. Intellectual property
              </h2>
              <p className="text-base text-muted leading-relaxed">
                The Services, including all software, text, designs, and other
                content we provide (excluding your own content), are owned by
                Rumi or its licensors and are protected by intellectual-property
                laws. We grant you a limited, non-exclusive, non-transferable
                right to use the Services for your business while these Terms are
                in effect. You retain ownership of the content and data you
                provide to us and grant us the rights needed to operate and
                improve the Services and to provide them to you.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-bold tracking-h2 text-ink mb-3">
                8. Third-party services
              </h2>
              <p className="text-base text-muted leading-relaxed">
                The Services rely on third-party providers — for example,
                telephony, AI transcription and processing, payment processing,
                cloud hosting, and analytics. Your use of those services may be
                subject to their own terms, and we are not responsible for
                third-party services we do not control.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-bold tracking-h2 text-ink mb-3">
                9. Disclaimers
              </h2>
              <p className="text-base text-muted leading-relaxed">
                The Services are provided &ldquo;as is&rdquo; and &ldquo;as
                available&rdquo; without warranties of any kind, whether express
                or implied, including implied warranties of merchantability,
                fitness for a particular purpose, and non-infringement. We do not
                warrant that the Services will be uninterrupted or error-free, or
                that any particular volume, quality, or outcome of leads will be
                achieved, except as expressly stated in a plan or written
                agreement.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-bold tracking-h2 text-ink mb-3">
                10. Limitation of liability
              </h2>
              <p className="text-base text-muted leading-relaxed">
                To the maximum extent permitted by law, Rumi will not be liable
                for any indirect, incidental, special, consequential, or punitive
                damages, or for any loss of profits, revenue, data, or goodwill.
                Our total liability for any claim arising out of or relating to
                the Services will not exceed the total fees you paid to Rumi in
                the three (3) months immediately preceding the event giving rise
                to the claim.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-bold tracking-h2 text-ink mb-3">
                11. Indemnification
              </h2>
              <p className="text-base text-muted leading-relaxed">
                You agree to indemnify and hold harmless Rumi and its officers,
                employees, and agents from any claims, damages, liabilities, and
                expenses (including reasonable legal fees) arising out of your use
                of the Services, your content, your violation of these Terms, or
                your violation of any law or the rights of a third party.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-bold tracking-h2 text-ink mb-3">
                12. Changes to these Terms
              </h2>
              <p className="text-base text-muted leading-relaxed">
                We may update these Terms from time to time. When we do, we will
                revise the effective date above and, where appropriate, provide
                additional notice. Your continued use of the Services after
                changes take effect constitutes acceptance of the updated Terms.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-bold tracking-h2 text-ink mb-3">
                13. Governing law
              </h2>
              <p className="text-base text-muted leading-relaxed">
                These Terms are governed by the laws of the State of California,
                without regard to its conflict-of-laws rules. The state and
                federal courts located in California will have exclusive
                jurisdiction over any dispute arising out of or relating to these
                Terms or the Services, and you consent to venue in those courts.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-bold tracking-h2 text-ink mb-3">
                14. Contact
              </h2>
              <p className="text-base text-muted leading-relaxed">
                Questions about these Terms? Contact us at{" "}
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
      </main>
      <Footer />
    </>
  );
}
