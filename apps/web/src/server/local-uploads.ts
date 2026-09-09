import { randomUUID } from "node:crypto";
import path from "node:path";

export const MAX_LOCAL_UPLOAD_BYTES = 5 * 1024 * 1024;
export const LOCAL_UPLOAD_TYPES = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
} as const;

export function localUploadsEnabled() {
  return process.env.NODE_ENV === "development";
}

export function validateLocalUpload(file: { type: string; size: number }) {
  if (!(file.type in LOCAL_UPLOAD_TYPES)) throw new Error("Formato de imagem inválido");
  if (file.size <= 0 || file.size > MAX_LOCAL_UPLOAD_BYTES) throw new Error("A imagem deve ter no máximo 5 MB");
}

export function createLocalUploadName(contentType: keyof typeof LOCAL_UPLOAD_TYPES) {
  return `${randomUUID()}.${LOCAL_UPLOAD_TYPES[contentType]}`;
}

export function isValidLocalUploadName(filename: string) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}\.(?:jpg|png|webp)$/i.test(filename);
}

export function localUploadsDirectory() {
  return path.join(process.cwd(), ".local", "uploads");
}

export function localUploadPath(filename: string) {
  if (!isValidLocalUploadName(filename)) throw new Error("Nome de arquivo inválido");
  return path.join(localUploadsDirectory(), filename);
}

export function contentTypeForFilename(filename: string) {
  if (filename.endsWith(".jpg")) return "image/jpeg";
  if (filename.endsWith(".png")) return "image/png";
  if (filename.endsWith(".webp")) return "image/webp";
  return "application/octet-stream";
}
