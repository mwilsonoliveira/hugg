"use client";

import { useState } from "react";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { Send } from "lucide-react";
import { toast } from "sonner";

interface ShareButtonProps {
  petId: string;
  petName: string;
  situation: string;
  /** Tamanho do botão: "sm" para o card, "md" para a página de detalhe */
  size?: "sm" | "md";
}

export function ShareButton({ petId, petName, situation, size = "md" }: ShareButtonProps) {
  const [open, setOpen] = useState(false);

  const getUrl = () => `${window.location.origin}/pets/${petId}`;
  const getShareText = () => `${petName} está precisando de um lar. Conheça no hugg!`;

  const handleShare = async (e: React.MouseEvent) => {
    e.preventDefault();

    const url = getUrl();
    const text = getShareText();

    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({ title: `${petName} · hugg`, text, url });
        return;
      } catch {
        // Usuário cancelou ou erro — não faz nada, continua com o dropdown
        return;
      }
    }

    // Desktop fallback: abre o dropdown
    setOpen(true);
  };

  const copyLink = async (e: React.MouseEvent) => {
    e.preventDefault();
    await navigator.clipboard.writeText(getUrl());
    toast.success("Link copiado!");
    setOpen(false);
  };

  const openWindow = (url: string) => {
    window.open(url, "_blank", "noopener,noreferrer,width=600,height=500");
    setOpen(false);
  };

  const shareWhatsApp = (e: React.MouseEvent) => {
    e.preventDefault();
    openWindow(`https://wa.me/?text=${encodeURIComponent(`${getShareText()}\n${getUrl()}`)}`);
  };

  const shareFacebook = (e: React.MouseEvent) => {
    e.preventDefault();
    openWindow(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(getUrl())}`);
  };

  const shareX = (e: React.MouseEvent) => {
    e.preventDefault();
    openWindow(`https://twitter.com/intent/tweet?text=${encodeURIComponent(getShareText())}&url=${encodeURIComponent(getUrl())}`);
  };

  const btnClass =
    size === "sm"
      ? "w-8 h-8 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center shadow-sm transition-transform active:scale-90"
      : "flex items-center gap-1.5 text-sm font-medium text-gray-600 hover:text-gray-900 border border-gray-200 rounded-lg px-3 py-1.5 hover:bg-gray-50 transition-colors";

  const trigger = (
    <button onClick={handleShare} className={btnClass} aria-label="Compartilhar">
      <Send className={size === "sm" ? "w-4 h-4 text-gray-600" : "w-4 h-4"} />
      {size === "md" && <span>Compartilhar</span>}
    </button>
  );

  // Se a Web Share API está disponível (mobile), o trigger já cuida de tudo
  // O DropdownMenu só é relevante no desktop (fallback controlado por `open`)
  return (
    <DropdownMenu.Root open={open} onOpenChange={setOpen}>
      <DropdownMenu.Trigger asChild>{trigger}</DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content
          align="end"
          sideOffset={8}
          className="z-50 min-w-[200px] rounded-xl border border-gray-100 bg-white shadow-lg p-1 animate-in fade-in-0 zoom-in-95"
        >
          <DropdownMenu.Item asChild>
            <button
              onClick={copyLink}
              className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-700 rounded-lg hover:bg-gray-50 outline-none focus:bg-gray-50 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 text-gray-400 shrink-0">
                <path d="M12.232 4.232a2.5 2.5 0 013.536 3.536l-1.225 1.224a.75.75 0 001.061 1.06l1.224-1.224a4 4 0 00-5.656-5.656l-3 3a4 4 0 00.225 5.865.75.75 0 00.977-1.138 2.5 2.5 0 01-.142-3.667l3-3z" />
                <path d="M11.603 7.963a.75.75 0 00-.977 1.138 2.5 2.5 0 01.142 3.667l-3 3a2.5 2.5 0 01-3.536-3.536l1.225-1.224a.75.75 0 00-1.061-1.06l-1.224 1.224a4 4 0 105.656 5.656l3-3a4 4 0 00-.225-5.865z" />
              </svg>
              Copiar link
            </button>
          </DropdownMenu.Item>

          <DropdownMenu.Separator className="my-1 h-px bg-gray-100" />

          <DropdownMenu.Item asChild>
            <button
              onClick={shareWhatsApp}
              className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-700 rounded-lg hover:bg-gray-50 outline-none focus:bg-gray-50 transition-colors"
            >
              {/* WhatsApp */}
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-4 h-4 shrink-0 fill-[#25D366]">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              WhatsApp
            </button>
          </DropdownMenu.Item>

          <DropdownMenu.Item asChild>
            <button
              onClick={shareFacebook}
              className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-700 rounded-lg hover:bg-gray-50 outline-none focus:bg-gray-50 transition-colors"
            >
              {/* Facebook */}
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-4 h-4 shrink-0 fill-[#1877F2]">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
              Facebook
            </button>
          </DropdownMenu.Item>

          <DropdownMenu.Item asChild>
            <button
              onClick={shareX}
              className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-700 rounded-lg hover:bg-gray-50 outline-none focus:bg-gray-50 transition-colors"
            >
              {/* X / Twitter */}
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-4 h-4 shrink-0 fill-black">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
              X (Twitter)
            </button>
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}
