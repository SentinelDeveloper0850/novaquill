import { prisma } from "@/lib/prisma";
import { isAllowedOrigin, rateLimitOk } from "@/lib/guard";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

function ym(date = new Date()) {
	return date.getFullYear() * 100 + (date.getMonth() + 1);
}

export async function GET() {
	// Lightweight rate limit for anonymous polling
	const session = await getServerSession(authOptions);
	if (!session?.user?.email) {
		return new Response(JSON.stringify({ subscription: "ANON", used: 0, limit: 0 }), { status: 200 });
	}
	const user = await prisma.user.findUnique({ where: { email: session.user.email } });
	if (!user) return new Response("Not found", { status: 404 });
	const isPro = user.subscription === "PRO";
	const currentYm = ym();
	const used = user.usageYearMonth === currentYm ? user.docsUsedThisMonth : 0;
	return new Response(
		JSON.stringify({ subscription: isPro ? "PRO" : "FREE", used, limit: isPro ? null : 3 }),
		{ status: 200 }
	);
}

export async function POST() {
	// Enforce origin and rate limit
	if (!isAllowedOrigin(new Request("http://local"))) return new Response(JSON.stringify({ error: "Forbidden" }), { status: 403 });
	const key = "usage:" + Date.now().toString().slice(0, 10);
	if (!(await rateLimitOk(key, 200, 60_000))) return new Response(JSON.stringify({ error: "Rate limit" }), { status: 429 });
	const session = await getServerSession(authOptions);
	if (!session?.user?.email) {
		return new Response(JSON.stringify({ error: "Not authenticated" }), { status: 401 });
	}
	const user = await prisma.user.findUnique({ where: { email: session.user.email } });
	if (!user) return new Response("Not found", { status: 404 });
	const currentYm = ym();
	const isPro = user.subscription === "PRO";
	const currentUsed = user.usageYearMonth === currentYm ? user.docsUsedThisMonth : 0;
	if (!isPro && currentUsed >= 3) {
		return new Response(JSON.stringify({ error: "Limit reached" }), { status: 402 });
	}
	const updated = await prisma.user.update({
		where: { id: user.id },
		data: {
			usageYearMonth: currentYm,
			docsUsedThisMonth: currentUsed + 1,
		},
		select: { docsUsedThisMonth: true },
	});
	return new Response(JSON.stringify({ used: updated.docsUsedThisMonth }), { status: 200 });
}


