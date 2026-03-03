export type SubscriptionCheckoutPlan = "monthly" | "annual";

const SUBSCRIPTION_PLAN_CONFIG = {
  monthly: {
    slug: "monthly",
    eurAmount: 9,
    itemName: "NovaQuill Pro (Monthly)",
    dbPlan: "MONTHLY" as const,
    frequency: 3 as const, // PayFast: monthly
  },
  annual: {
    slug: "annual",
    eurAmount: 90,
    itemName: "NovaQuill Pro (Annual)",
    dbPlan: "ANNUAL" as const,
    frequency: 6 as const, // PayFast: annual
  },
} as const;

export function parseSubscriptionCheckoutPlan(value: string | null | undefined): SubscriptionCheckoutPlan | null {
  const normalized = (value ?? "").trim().toLowerCase();
  if (normalized === "monthly" || normalized === "annual") {
    return normalized;
  }
  return null;
}

export function getSubscriptionPlanConfig(plan: SubscriptionCheckoutPlan) {
  return SUBSCRIPTION_PLAN_CONFIG[plan];
}

export function amountToCents(amount: number): number {
  return Math.round(amount * 100);
}

export function centsToAmountString(cents: number): string {
  return (cents / 100).toFixed(2);
}

export function parseAmountToCents(raw: string | number | null | undefined): number | null {
  if (raw === null || raw === undefined) return null;
  const normalized = String(raw).trim();
  if (!normalized) return null;

  const parsed = Number.parseFloat(normalized);
  if (!Number.isFinite(parsed) || parsed <= 0) return null;
  return Math.round(parsed * 100);
}

export function parseCents(raw: string | number | null | undefined): number | null {
  if (raw === null || raw === undefined) return null;
  const normalized = String(raw).trim();
  if (!/^\d+$/.test(normalized)) return null;

  const parsed = Number.parseInt(normalized, 10);
  if (!Number.isSafeInteger(parsed) || parsed <= 0) return null;
  return parsed;
}

export function createCheckoutReference(userId: string, plan: SubscriptionCheckoutPlan, amountCents: number): string {
  return `nq_${userId}_${plan}_${amountCents}_${Date.now()}`;
}

export type ParsedCheckoutReference = {
  userId: string;
  plan: SubscriptionCheckoutPlan;
  amountCents: number | null;
};

export function parseCheckoutReference(raw: string | null | undefined): ParsedCheckoutReference | null {
  const value = (raw ?? "").trim();
  if (!value) return null;

  const currentFormat = /^nq_([^_]+)_(monthly|annual)_(\d+)_(\d+)$/.exec(value);
  if (currentFormat) {
    const [, userId, plan, amountCentsRaw] = currentFormat;
    return {
      userId,
      plan: plan as SubscriptionCheckoutPlan,
      amountCents: parseCents(amountCentsRaw),
    };
  }

  // Legacy checkout references did not encode amount cents.
  const legacyFormat = /^nq_([^_]+)_(monthly|annual)_(\d+)$/.exec(value);
  if (legacyFormat) {
    const [, userId, plan] = legacyFormat;
    return {
      userId,
      plan: plan as SubscriptionCheckoutPlan,
      amountCents: null,
    };
  }

  return null;
}
