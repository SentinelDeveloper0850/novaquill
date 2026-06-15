import { v2 as cloudinary } from "cloudinary";

function required(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`${name} is not set`);
  return value;
}

let configured = false;

function configure(): void {
  if (configured) return;
  cloudinary.config({
    cloud_name: required("CLOUDINARY_CLOUD_NAME"),
    api_key: required("CLOUDINARY_API_KEY"),
    api_secret: required("CLOUDINARY_API_SECRET"),
    secure: true,
  });
  configured = true;
}

export function isCloudinaryEnabled(): boolean {
  return Boolean(process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET);
}

export function assertStorageConfigured(): void {
  if (process.env.NODE_ENV === "production" && !isCloudinaryEnabled()) {
    throw new Error("Cloudinary storage must be configured in production");
  }
}

export function makeCloudinaryPublicId(userId: string, filename: string): string {
  const safeName = filename.replace(/[^a-zA-Z0-9._-]+/g, "_").replace(/\.pdf$/i, "") || "document";
  return `novaquill/documents/${userId}/${Date.now()}_${safeName}`;
}

export async function uploadCloudinaryRaw(publicId: string, body: Buffer): Promise<string> {
  configure();
  const dataUri = `data:application/octet-stream;base64,${body.toString("base64")}`;
  const result = await cloudinary.uploader.upload(dataUri, {
    public_id: publicId,
    resource_type: "raw",
    overwrite: false,
    unique_filename: false,
  });
  return `cloudinary:${result.public_id}`;
}

export async function readCloudinaryRaw(storagePath: string): Promise<Buffer> {
  configure();
  const publicId = storagePath.replace(/^cloudinary:/, "");
  const resource = await cloudinary.api.resource(publicId, { resource_type: "raw" });
  const url = resource.secure_url || resource.url;
  if (!url) throw new Error("Cloudinary resource URL is missing");

  const response = await fetch(url, { cache: "no-store" });
  if (!response.ok) throw new Error(`Failed to read Cloudinary document: ${response.status}`);
  return Buffer.from(await response.arrayBuffer());
}

export async function deleteCloudinaryRaw(storagePath: string): Promise<void> {
  configure();
  const publicId = storagePath.replace(/^cloudinary:/, "");
  await cloudinary.uploader.destroy(publicId, { resource_type: "raw", invalidate: true });
}
