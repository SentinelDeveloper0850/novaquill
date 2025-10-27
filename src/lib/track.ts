export async function track(name: string): Promise<void> {
  try {
    await fetch("/api/analytics", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name }),
      keepalive: true,
    });
  } catch {
    // ignore
  }
}


