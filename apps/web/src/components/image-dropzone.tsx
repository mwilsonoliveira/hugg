"use client";

import { Image } from "lucide-react";
import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { upload } from "@vercel/blob/client";

interface ImageDropzoneProps {
  value: string[];
  onChange: (urls: string[]) => void;
  error?: string;
}

export function ImageDropzone({ value, onChange, error }: ImageDropzoneProps) {
  const [previews, setPreviews] = useState<string[]>(value);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string>();

  const uploadFile = useCallback(async (file: File) => {
    if (process.env.NODE_ENV !== "development") {
      return upload(`pets/${file.name}`, file, { access: "public", handleUploadUrl: "/api/uploads" });
    }

    const formData = new FormData();
    formData.set("file", file);
    const response = await fetch("/api/uploads/local", { method: "POST", body: formData });
    const result = await response.json();
    if (!response.ok) throw new Error(result.error ?? "Falha no upload local");
    return result as { url: string };
  }, []);

  const onDrop = useCallback(
    async (accepted: File[]) => {
      const available = Math.max(0, 5 - previews.length);
      if (accepted.length > available) {
        setUploadError("É possível cadastrar no máximo 5 fotos.");
        accepted = accepted.slice(0, available);
      }
      if (!accepted.length) return;
      setUploading(true);
      setUploadError(undefined);
      try {
        const blobs = await Promise.all(accepted.map(uploadFile));
        const next = [...previews, ...blobs.map((blob) => blob.url)];
        setPreviews(next);
        onChange(next);
      } catch (uploadFailure) {
        setUploadError(uploadFailure instanceof Error ? uploadFailure.message : "Não foi possível enviar as fotos. Tente novamente.");
      } finally {
        setUploading(false);
      }
    },
    [onChange, previews, uploadFile],
  );

  const remove = (index: number) => {
    setPreviews((prev) => {
      const next = prev.filter((_, i) => i !== index);
      onChange(next);
      return next;
    });
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/jpeg": [], "image/png": [], "image/webp": [] },
    multiple: true,
    maxFiles: 5,
    maxSize: 5 * 1024 * 1024,
    disabled: uploading || previews.length >= 5,
  });

  return (
    <div className="flex flex-col gap-3">
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-colors ${
          isDragActive
            ? "border-orange-400 bg-orange-50"
            : error
              ? "border-red-300 bg-red-50"
              : "border-gray-200 hover:border-orange-300 hover:bg-gray-50"
        }`}
      >
        <input {...getInputProps()} />
        <div className="flex w-full justify-center">
          <Image className="text-gray-400 mb-2" size={32} />
        </div>
        <p className="text-sm text-gray-500">
          {uploading
            ? "Enviando fotos..."
            : isDragActive
            ? "Solte as fotos aqui..."
            : (
              <>
                <span className="hidden sm:inline">Arraste fotos ou clique para selecionar</span>
                <span className="sm:hidden">Toque para anexar imagens</span>
              </>
            )}
        </p>
        <p className="text-xs text-gray-400 mt-1">PNG, JPG, WEBP</p>
      </div>

      {previews.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {previews.map((url, i) => (
            <div key={i} className="relative w-20 h-20">
              <img
                src={url}
                alt={`foto ${i + 1}`}
                className="w-full h-full object-cover rounded-lg"
              />
              <button
                type="button"
                onClick={() => remove(i)}
                className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center text-xs leading-none"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}

      {(error || uploadError) && <p className="text-xs text-red-500">{error ?? uploadError}</p>}
    </div>
  );
}
