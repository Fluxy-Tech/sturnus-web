import type { Metadata } from "next";
import { Toaster } from "sonner";
import "./globals.css";

export const metadata: Metadata = {
  title: "Sturnus Flow",
  description:
    "Automatize seu funil de vendas. A Sturnus Flow cria jornadas conversacionais completas no WhatsApp para escalar seus resultados com precisão.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>
        <Toaster richColors position="top-right" />
        {children}
      </body>
    </html>
  );
}
