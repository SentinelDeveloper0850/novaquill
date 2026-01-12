import { prisma } from "@/lib/prisma";
import { isAllowedOrigin, rateLimitOk } from "@/lib/guard";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

function isAdminEmail(email: string | null | undefined): boolean {
	if (!email) return false;
	const list = (process.env.ADMIN_EMAILS || "").split(",").map((s) => s.trim().toLowerCase()).filter(Boolean);
	if (list.length === 0) return false;
	return list.includes(email.toLowerCase());
}

export async function POST(request: Request) {
	if (!isAllowedOrigin(request)) return new Response("Forbidden", { status: 403 });
	const ip = request.headers.get("x-forwarded-for") || "local";
	if (!(await rateLimitOk(`an:${ip}`, 60, 60_000))) return new Response("Rate limit", { status: 429 });
	const { name } = (await request.json().catch(() => ({}))) as { name?: string };
	if (!name) return new Response("Bad Request", { status: 400 });
	await prisma.eventCounter.upsert({
		where: { name },
		update: { count: { increment: 1 } },
		create: { name, count: 1 },
	});
	return new Response(null, { status: 204 });
}

export async function GET() {
	const session = await getServerSession(authOptions);
	if (!isAdminEmail(session?.user?.email)) return new Response("Forbidden", { status: 403 });
	const rows = await prisma.eventCounter.findMany({ orderBy: { name: "asc" } });
	return new Response(JSON.stringify(rows), { status: 200 });
}


