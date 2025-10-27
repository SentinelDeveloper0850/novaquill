import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { readFileAbsolute, deleteFileAbsolute } from "@/lib/storage";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) return new Response("Unauthorized", { status: 401 });
  const doc = await prisma.document.findUnique({ where: { id } });
  if (!doc) return new Response("Not found", { status: 404 });
  const user = await prisma.user.findUnique({ where: { email: session.user.email } });
  if (!user || doc.userId !== user.id) return new Response("Forbidden", { status: 403 });
  const data = await readFileAbsolute(doc.path);
  return new Response(new Uint8Array(data), {
    status: 200,
    headers: { "Content-Type": doc.mimeType, "Content-Disposition": `attachment; filename="${doc.filename}"` },
  });
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) return new Response("Unauthorized", { status: 401 });
  const doc = await prisma.document.findUnique({ where: { id } });
  if (!doc) return new Response("Not found", { status: 404 });
  const user = await prisma.user.findUnique({ where: { email: session.user.email } });
  if (!user || doc.userId !== user.id) return new Response("Forbidden", { status: 403 });
  await prisma.document.delete({ where: { id } });
  await deleteFileAbsolute(doc.path);
  return new Response(null, { status: 204 });
}


