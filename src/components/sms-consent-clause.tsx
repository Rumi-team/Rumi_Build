// Carrier-vetting requirement: this SMS opt-in / no-sharing language is fetched
// by US A2P 10DLC vetting and must appear VERBATIM and identically on both the
// Terms (§5) and Privacy (§4) pages. Keep it in one place so the two copies
// cannot drift. Do not reword without re-checking the campaign registration.
export function SmsConsentClause() {
  return (
    <div className="space-y-4 text-base text-zinc-300 leading-relaxed">
      <p>
        Consent. By providing your mobile phone number and agreeing to be
        contacted — including verbally during a phone call with Rumi or our
        automated voice agent, by submitting a form, or by texting an opt-in
        keyword such as START or YES — you consent to receive text messages from
        Rumi at the number provided. Consent is not a condition of any purchase.
      </p>
      <p>
        Types of messages: confirmations of a request or inquiry you made,
        appointment or service follow-ups, and customer-care communications.
        Message frequency varies depending on your interactions. Message and
        data rates may apply.
      </p>
      <p>
        Opting out: reply STOP to any message to cancel; after you send STOP we
        will send one confirmation and no further texts unless you opt in again.
        Reply HELP or email support@rumi.build for help. Mobile carriers are not
        liable for delayed or undelivered messages.
      </p>
      <p>
        We do not sell, rent, or share your mobile opt-in information or phone
        number with third parties or affiliates for their own marketing or
        promotional purposes.
      </p>
    </div>
  );
}
