import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { saveUserPdf } from "@/lib/storage";

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) return new Response("Unauthorized", { status: 401 });
  const user = await prisma.user.findUnique({ where: { email: session.user.email } });
  if (!user) return new Response("Unauthorized", { status: 401 });

  const formData = await request.formData();
  const file = formData.get("file");
  const filename = String(formData.get("filename") || "signed.pdf");
  if (!(file instanceof Blob)) return new Response("Invalid file", { status: 400 });
  const arrayBuf = await file.arrayBuffer();
  const saved = await saveUserPdf(user.id, filename, arrayBuf);
  const doc = await prisma.document.create({
    data: {
      userId: user.id,
      filename,
      mimeType: "application/pdf",
      size: saved.size,
      path: saved.absPath,
    },
  });
  return new Response(JSON.stringify({ id: doc.id }), { status: 201 });
}


