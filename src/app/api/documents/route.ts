import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) return new Response("Unauthorized", { status: 401 });
  const user = await prisma.user.findUnique({ where: { email: session.user.email } });
  if (!user) return new Response("Unauthorized", { status: 401 });
  const docs = await prisma.document.findMany({ where: { userId: user.id }, orderBy: { createdAt: "desc" } });
  return new Response(JSON.stringify(docs), { status: 200 });
}


