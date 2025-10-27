import { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

function getRequiredEnv(name: string): string {
	const value = process.env[name];
	if (!value) throw new Error(`${name} is not set`);
	return value;
}

export function isS3Enabled(): boolean {
	return Boolean(process.env.AWS_S3_BUCKET && process.env.AWS_REGION && (process.env.AWS_ACCESS_KEY_ID || process.env.AWS_ROLE_ARN));
}

export function getS3Client(): S3Client {
	const region = getRequiredEnv("AWS_REGION");
	const endpoint = process.env.AWS_S3_ENDPOINT;
	const forcePathStyle = Boolean(process.env.AWS_S3_FORCE_PATH_STYLE === "true");
	return new S3Client({
		region,
		endpoint,
		forcePathStyle,
	});
}

export async function s3PutObject(params: { bucket?: string; key: string; body: Uint8Array | Buffer; contentType?: string; }): Promise<void> {
	const client = getS3Client();
	const Bucket = params.bucket || getRequiredEnv("AWS_S3_BUCKET");
	await client.send(new PutObjectCommand({
		Bucket,
		Key: params.key,
		Body: params.body,
		ContentType: params.contentType || "application/octet-stream",
	}));
}

export async function s3GetObject(params: { bucket?: string; key: string; }): Promise<Uint8Array> {
	const client = getS3Client();
	const Bucket = params.bucket || getRequiredEnv("AWS_S3_BUCKET");
	const res = await client.send(new GetObjectCommand({ Bucket, Key: params.key }));
	const arrayBuffer = await res.Body!.transformToByteArray();
	return new Uint8Array(arrayBuffer);
}

export async function s3DeleteObject(params: { bucket?: string; key: string; }): Promise<void> {
	const client = getS3Client();
	const Bucket = params.bucket || getRequiredEnv("AWS_S3_BUCKET");
	await client.send(new DeleteObjectCommand({ Bucket, Key: params.key }));
}

export async function createPresignedGetUrl(params: { bucket?: string; key: string; expiresInSeconds?: number; }): Promise<string> {
	const client = getS3Client();
	const Bucket = params.bucket || getRequiredEnv("AWS_S3_BUCKET");
	const command = new GetObjectCommand({ Bucket, Key: params.key });
	return getSignedUrl(client, command, { expiresIn: params.expiresInSeconds ?? 300 });
}
