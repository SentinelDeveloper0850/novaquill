import { getEurToZarRate } from "@/lib/fx";

export async function GET() {
  const rate = await getEurToZarRate();
  return new Response(JSON.stringify({ EUR_ZAR: rate }), { status: 200 });
}


