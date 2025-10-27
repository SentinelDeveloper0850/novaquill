import { NextRequest, NextResponse } from "next/server";
import { buildSignature } from "@/lib/payfast";
import { prisma } from "@/lib/prisma";
import { prisma as db } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  const body = await req.text();
  const params = Object.fromEntries(new URLSearchParams(body).entries());
  // Verify signature
  const expected = buildSignature(params, process.env.PAYFAST_PASSPHRASE);
  if ((params.signature || "").toLowerCase() !== expected.toLowerCase()) {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  // Basic status handling
  const email = params.email_address as string | undefined;
  const payment_status = params.payment_status;
  if (email) {
    if (payment_status === "COMPLETE" || payment_status === "COMPLETE_PAYMENT") {
      await prisma.user.updateMany({ where: { email }, data: { subscription: "PRO" } });
      await db.eventCounter.upsert({ where: { name: "upgrade_pro" }, update: { count: { increment: 1 } }, create: { name: "upgrade_pro", count: 1 } });
    } else if (payment_status === "CANCELLED" || payment_status === "FAILED") {
      await prisma.user.updateMany({ where: { email }, data: { subscription: "FREE" } });
    }
  }
  return NextResponse.json({ ok: true });
}


