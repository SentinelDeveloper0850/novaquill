import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { deleteFileAbsolute } from "@/lib/storage";

export async function POST() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) return new Response("Unauthorized", { status: 401 });
  const user = await prisma.user.findUnique({ where: { email: session.user.email } });
  if (!user) return new Response("Unauthorized", { status: 401 });
  const docs = await prisma.document.findMany({ where: { userId: user.id } });
  for (const d of docs) {
    await deleteFileAbsolute(d.path);
  }
  await prisma.document.deleteMany({ where: { userId: user.id } });
  await prisma.account.deleteMany({ where: { userId: user.id } });
  await prisma.session.deleteMany({ where: { userId: user.id } });
  await prisma.user.delete({ where: { id: user.id } });
  return new Response(null, { status: 204 });
}



