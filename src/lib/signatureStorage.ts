import crypto from "crypto";
import { decryptBuffer, encryptBuffer } from "@/lib/crypto";

const DATA_URL_IMAGE_PREFIX = "data:image/";
const MAX_SIGNATURE_DATA_URL_BYTES = 3 * 1024 * 1024;

function normalizeDataUrl(value: string): string {
  return value.trim();
}

export function validateSignatureDataUrl(dataUrl: string): { ok: true } | { ok: false; error: string } {
  const normalized = normalizeDataUrl(dataUrl);
  if (!normalized.startsWith(DATA_URL_IMAGE_PREFIX)) {
    return { ok: false, error: "Invalid signature format" };
  }
  if (!normalized.includes(";base64,")) {
    return { ok: false, error: "Invalid signature format" };
  }
  if (Buffer.byteLength(normalized, "utf8") > MAX_SIGNATURE_DATA_URL_BYTES) {
    return { ok: false, error: "Signature is too large" };
  }
  return { ok: true };
}

export function hashSignatureDataUrl(dataUrl: string): string {
  return crypto.createHash("sha256").update(normalizeDataUrl(dataUrl), "utf8").digest("hex");
}

export function encryptSignatureDataUrl(dataUrl: string): Buffer {
  return encryptBuffer(Buffer.from(normalizeDataUrl(dataUrl), "utf8"));
}

export function decryptSignatureDataUrl(payload: Buffer): string {
  return decryptBuffer(payload).toString("utf8");
}

