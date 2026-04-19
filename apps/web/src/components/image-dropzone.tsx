"use client";

import { Image } from "lucide-react";
import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";

interface ImageDropzoneProps {
  value: string[];
  onChange: (urls: string[]) => void;
  error?: string;
}

export function ImageDropzone({ value, onChange, error }: ImageDropzoneProps) {
  const [previews, setPreviews] = useState<{ url: string; dataUrl: string }[]>(
    value.map((u) => ({ url: u, dataUrl: u })),
  );

  const onDrop = useCallback(
    (accepted: File[]) => {
      accepted.forEach((file) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          const dataUrl = e.target?.result as string;
          setPreviews((prev) => {
            const next = [...prev, { url: dataUrl, dataUrl }];
            onChange(next.map((p) => p.dataUrl));
            return next;
          });
        };
        reader.readAsDataURL(file);
      });
    },
    [onChange],
  );

  const remove = (index: number) => {
    setPreviews((prev) => {
      const next = prev.filter((_, i) => i !== index);
      onChange(next.map((p) => p.dataUrl));
      return next;
    });
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [] },
    multiple: true,
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
          {isDragActive
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
          {previews.map((p, i) => (
            <div key={i} className="relative w-20 h-20">
              <img
                src={p.dataUrl}
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

      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}
