import { NextRequest, NextResponse } from "next/server";
import { buildSignature } from "@/lib/payfast";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  const body = await req.text();
  const params = Object.fromEntries(new URLSearchParams(body).entries());
  // Verify signature
  const expected = buildSignature(params, process.env.PAYFAST_PASSPHRASE);
  if ((params.signature || "").toLowerCase() !== expected.toLowerCase()) {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  // Basic config validation (helps prevent accepting spoofed notifications)
  const expectedMerchantId = process.env.PAYFAST_MERCHANT_ID;
  if (expectedMerchantId && params.merchant_id && params.merchant_id !== expectedMerchantId) {
    return NextResponse.json({ ok: false, error: "merchant_id mismatch" }, { status: 400 });
  }
  if (params.currency_code && params.currency_code !== "ZAR") {
    return NextResponse.json({ ok: false, error: "currency mismatch" }, { status: 400 });
  }

  // Idempotency / audit log (PayFast can retry ITNs)
  const pfPaymentId = (params.pf_payment_id || params.m_payment_id || "").trim();
  if (!pfPaymentId) {
    return NextResponse.json({ ok: false, error: "missing payment id" }, { status: 400 });
  }
  try {
    await prisma.payfastEvent.create({
      data: { pfPaymentId, payload: params },
    });
  } catch {
    // Likely duplicate (unique constraint); treat as idempotent success
    return NextResponse.json({ ok: true });
  }

  // Status handling
  const payment_status = params.payment_status;
  const userId = (params.custom_str1 || "").trim();
  const email = (params.email_address || "").trim().toLowerCase();
  const planRaw = (params.custom_str2 || "").trim().toLowerCase();

  const user = userId
    ? await prisma.user.findUnique({ where: { id: userId } })
    : email
      ? await prisma.user.findUnique({ where: { email } })
      : null;

  if (user) {
    if (payment_status === "COMPLETE" || payment_status === "COMPLETE_PAYMENT") {
      await prisma.user.update({
        where: { id: user.id },
        data: {
          subscription: "PRO",
          subscriptionPlan: planRaw === "annual" ? "ANNUAL" : planRaw === "monthly" ? "MONTHLY" : undefined,
          lastPaymentAt: new Date(),
          payfastLastPaymentId: pfPaymentId,
        },
      });
      await prisma.eventCounter.upsert({
        where: { name: "upgrade_pro" },
        update: { count: { increment: 1 } },
        create: { name: "upgrade_pro", count: 1 },
      });
    } else if (payment_status === "CANCELLED" || payment_status === "FAILED") {
      await prisma.user.update({
        where: { id: user.id },
        data: {
          subscription: "FREE",
          subscriptionPlan: null,
          payfastLastPaymentId: pfPaymentId,
        },
      });
    }
  }
  return NextResponse.json({ ok: true });
}


