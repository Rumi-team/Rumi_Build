import Stripe from "stripe";

let _stripe: Stripe | null = null;

export function getStripe(): Stripe {
  if (_stripe) return _stripe;
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) {
    throw new Error("STRIPE_SECRET_KEY is not set");
  }
  _stripe = new Stripe(key, { typescript: true });
  return _stripe;
}

export const STRIPE_PRICE_ID_30MIN = process.env.STRIPE_PRICE_ID_30MIN || "";
export const STRIPE_WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET || "";
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://rumi.build";
