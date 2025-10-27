import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { readFileAbsolute } from "@/lib/storage";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) return new Response("Unauthorized", { status: 401 });
  const user = await prisma.user.findUnique({ where: { email: session.user.email } });
  if (!user) return new Response("Unauthorized", { status: 401 });
  const docs = await prisma.document.findMany({ where: { userId: user.id } });
  const data = [] as Array<{ filename: string; bytes: string }>;
  for (const d of docs) {
    const buf = await readFileAbsolute(d.path);
    data.push({ filename: d.filename, bytes: Buffer.from(buf).toString("base64") });
  }
  const payload = { user: { id: user.id, name: user.name, email: user.email }, documents: data };
  return new Response(JSON.stringify(payload), {
    status: 200,
    headers: { "Content-Type": "application/json", "Content-Disposition": "attachment; filename=export.json" },
  });
}



