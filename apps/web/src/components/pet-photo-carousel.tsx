"use client";

import { useState } from "react";

interface PetPhotoCarouselProps {
  imageUrls: string[];
  name: string;
}

export function PetPhotoCarousel({ imageUrls, name }: PetPhotoCarouselProps) {
  const [index, setIndex] = useState(0);
  const hasMultiple = imageUrls.length > 1;

  if (imageUrls.length === 0) {
    return (
      <div className="w-full h-72 bg-gray-100 flex items-center justify-center text-gray-400">
        Sem fotos
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Imagens */}
      <div className="overflow-hidden">
        <div
          className="flex transition-transform duration-300"
          style={{ transform: `translateX(-${index * 100}%)` }}
        >
          {imageUrls.map((url, i) => (
            <img
              key={i}
              src={url}
              alt={`${name} - foto ${i + 1}`}
              className="w-full object-cover shrink-0 max-h-96"
              style={{ minWidth: "100%" }}
            />
          ))}
        </div>
      </div>

      {/* Seta esquerda */}
      {hasMultiple && index > 0 && (
        <button
          onClick={() => setIndex((i) => i - 1)}
          className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center shadow-sm"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-gray-700">
            <path fillRule="evenodd" d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z" clipRule="evenodd" />
          </svg>
        </button>
      )}

      {/* Seta direita */}
      {hasMultiple && index < imageUrls.length - 1 && (
        <button
          onClick={() => setIndex((i) => i + 1)}
          className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center shadow-sm"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-gray-700">
            <path fillRule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clipRule="evenodd" />
          </svg>
        </button>
      )}

      {/* Dots + contador */}
      {hasMultiple && (
        <div className="absolute bottom-3 left-0 right-0 flex flex-col items-center gap-1.5">
          <div className="flex gap-1.5">
            {imageUrls.map((_, i) => (
              <button
                key={i}
                onClick={() => setIndex(i)}
                className={`w-1.5 h-1.5 rounded-full transition-colors ${
                  i === index ? "bg-white" : "bg-white/50"
                }`}
              />
            ))}
          </div>
          <span className="text-xs text-white/80 bg-black/20 backdrop-blur-sm rounded-full px-2 py-0.5">
            {index + 1} / {imageUrls.length}
          </span>
        </div>
      )}
    </div>
  );
}
