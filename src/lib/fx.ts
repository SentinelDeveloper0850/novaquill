let cachedRate: { value: number; ts: number } | null = null;

export async function getEurToZarRate(): Promise<number> {
  const now = Date.now();
  if (cachedRate && now - cachedRate.ts < 1000 * 60 * 60) {
    return cachedRate.value;
  }
  try {
    const res = await fetch("https://api.exchangerate.host/latest?base=EUR&symbols=ZAR", { cache: "no-store" });
    const data = (await res.json()) as { rates?: { ZAR?: number } };
    const rate = data?.rates?.ZAR;
    if (typeof rate === "number" && rate > 0) {
      cachedRate = { value: rate, ts: now };
      return rate;
    }
  } catch {}
  // Fallback static safeguard rate; adjust as needed
  return 20.0;
}

export async function eurToZar(amountEur: number): Promise<number> {
  const rate = await getEurToZarRate();
  return Math.round(amountEur * rate * 100) / 100;
}


