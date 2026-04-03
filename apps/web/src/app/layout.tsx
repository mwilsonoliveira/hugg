import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Hugg",
  description: "Conectando pets desabrigados a novos lares.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
