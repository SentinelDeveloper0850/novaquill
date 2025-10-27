import { prisma } from "@/lib/prisma";
import { hash } from "bcryptjs";

export async function POST(request: Request) {
  const body = await request.json();
  const { name, email, password } = body as { name?: string; email?: string; password?: string };
  if (!email || !password) {
    return new Response(JSON.stringify({ error: "Email and password required" }), { status: 400 });
  }
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return new Response(JSON.stringify({ error: "User already exists" }), { status: 409 });
  }
  const passwordHash = await hash(password, 12);
  const user = await prisma.user.create({ data: { name: name || null, email, passwordHash } });
  return new Response(JSON.stringify({ id: user.id, email: user.email }), { status: 201 });
}


