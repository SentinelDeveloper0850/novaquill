import { promises as fs } from "fs";
import path from "path";
import { encryptBuffer, decryptBuffer } from "@/lib/crypto";
import { isS3Enabled, s3PutObject, s3GetObject, s3DeleteObject } from "@/lib/s3";

const BASE_DIR = path.join(process.cwd(), "storage", "documents");

export async function ensureUserDir(userId: string): Promise<string> {
	const dir = path.join(BASE_DIR, userId);
	await fs.mkdir(dir, { recursive: true });
	return dir;
}

function makeS3Key(userId: string, filename: string): string {
	const safeName = filename.replace(/[^a-zA-Z0-9._-]+/g, "_");
	return `${userId}/${Date.now()}_${safeName || "document"}.pdf`;
}

export async function saveUserPdf(
	userId: string,
	filename: string,
	data: ArrayBuffer
): Promise<{ relPath: string; absPath: string; size: number }> {
	const buffer = Buffer.from(data);
	const encrypted = encryptBuffer(buffer);

	if (isS3Enabled()) {
		const key = makeS3Key(userId, filename);
		await s3PutObject({ key, body: encrypted, contentType: "application/octet-stream" });
		const relPath = `s3:${key}`;
		return { relPath, absPath: relPath, size: buffer.byteLength };
	}

	const dir = await ensureUserDir(userId);
	const safeName = filename.replace(/[^a-zA-Z0-9._-]+/g, "_");
	const target = path.join(dir, `${Date.now()}_${safeName || "document"}.pdf`);
	await fs.writeFile(target, encrypted);
	const relPath = path.relative(process.cwd(), target);
	return { relPath, absPath: target, size: buffer.byteLength };
}

export async function readFileAbsolute(absPath: string): Promise<Buffer> {
	if (absPath.startsWith("s3:")) {
		const key = absPath.slice(3);
		const payload = await s3GetObject({ key });
		return decryptBuffer(Buffer.from(payload));
	}
	const payload = await fs.readFile(absPath);
	return decryptBuffer(payload);
}

export async function deleteFileAbsolute(absPath: string): Promise<void> {
	try {
		if (absPath.startsWith("s3:")) {
			const key = absPath.slice(3);
			await s3DeleteObject({ key });
			return;
		}
		await fs.unlink(absPath);
	} catch {
		// ignore
	}
}


