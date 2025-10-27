import { NextRequest } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { buildForm, buildSignature, getPayfastEndpoint } from "@/lib/payfast";
import { eurToZar } from "@/lib/fx";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ plan: string }> }
) {
  const { plan } = await params;
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    const base = process.env.NEXTAUTH_URL || "http://localhost:3000";
    const login = new URL(`/login`, base);
    login.searchParams.set("next", `/api/subscribe/${plan}`);
    return Response.redirect(login.toString(), 302);
  }

  const env: "sandbox" | "live" = (process.env.PAYFAST_ENV as "sandbox" | "live") === "live" ? "live" : "sandbox";
  const merchant_id = process.env.PAYFAST_MERCHANT_ID || "";
  const merchant_key = process.env.PAYFAST_MERCHANT_KEY || "";
  const passphrase = process.env.PAYFAST_PASSPHRASE || undefined;

  const isAnnual = plan === "annual";
  // EUR pricing, convert to ZAR for PayFast
  const amountEur = isAnnual ? 90 : 9;
  const amountZar = await eurToZar(amountEur);
  const item_name = isAnnual ? "NovaQuill Pro (Annual)" : "NovaQuill Pro (Monthly)";

  const return_url = `${process.env.NEXTAUTH_URL || "http://localhost:3000"}/dashboard`;
  const cancel_url = `${process.env.NEXTAUTH_URL || "http://localhost:3000"}/pricing`;
  const notify_url = `${process.env.NEXTAUTH_URL || "http://localhost:3000"}/api/payfast/itn`;

  const paramsMap = {
    merchant_id,
    merchant_key,
    currency_code: "ZAR",
    return_url,
    cancel_url,
    notify_url,
    name_first: session.user.name || "",
    email_address: session.user.email || "",
    amount: amountZar.toFixed(2),
    item_name,
    // Recurring subscription
    subscription_type: 1,
    billing_date: new Date().toISOString().slice(0, 10),
    recurring_amount: amountZar.toFixed(2),
    frequency: isAnnual ? 6 : 3, // 6=annually, 3=monthly per PayFast
    cycles: 0, // 0 = indefinite
  } as const;

  const signature = buildSignature(paramsMap, passphrase);
  const action = getPayfastEndpoint(env);
  const html = buildForm({ ...paramsMap, signature }, action);
  return new Response(html, { 
    status: 200, 
    headers: { "Content-Type": "text/html; charset=utf-8" } 
  });
}


