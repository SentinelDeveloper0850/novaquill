import Redis from "ioredis";

// Optional Redis client for distributed rate limiting
let redis: Redis | null = null;
try {
	if (process.env.REDIS_URL) {
		redis = new Redis(process.env.REDIS_URL);
		redis.on("error", () => {});
	}
} catch {}

// In-memory fallback
const recent: Record<string, number[]> = {};
const MAX_ENTRIES = 1000; // Prevent memory growth

export async function rateLimitOk(key: string, limit = 20, perMs = 60_000): Promise<boolean> {
	if (redis) {
		const now = Date.now();
		const windowKey = `rl:${key}:${Math.floor(now / perMs)}`;
		const count = await redis.incr(windowKey);
		if (count === 1) {
			await redis.pexpire(windowKey, perMs);
		}
		return count <= limit;
	}
	// In-memory fallback
	const now = Date.now();
	const arr = recent[key] ||= [];
	while (arr.length && now - arr[0] > perMs) arr.shift();
	if (arr.length >= limit) return false;
	arr.push(now);
	if (arr.length > MAX_ENTRIES) arr.splice(0, arr.length - MAX_ENTRIES);
	return true;
}

export function isAllowedOrigin(req: Request): boolean {
	const origin = req.headers.get("origin");
	// Allow same-origin requests
	if (!origin) return true;
	try {
		const url = new URL(origin);
		const allowed = process.env.NEXTAUTH_URL || "http://localhost:3000";
		const allowedHost = new URL(allowed).host;
		if (url.host === allowedHost) return true;
		if (process.env.NODE_ENV === "development" && url.hostname === "localhost") return true;
		const additionalOrigins = process.env.ALLOWED_ORIGINS;
		if (additionalOrigins) {
			const allowedOrigins = additionalOrigins.split(",").map((o) => o.trim());
			if (allowedOrigins.includes(url.host)) return true;
		}
		return false;
	} catch {
		return false;
	}
}

export function cleanupRateLimits(): void {
	const now = Date.now();
	const oneHour = 60 * 60 * 1000;
	Object.keys(recent).forEach((key) => {
		const arr = recent[key];
		while (arr?.length && now - arr[0] > oneHour) arr.shift();
		if (arr?.length === 0) delete recent[key];
	});
}

if (typeof window === "undefined") {
	setInterval(cleanupRateLimits, 60 * 60 * 1000);
}


