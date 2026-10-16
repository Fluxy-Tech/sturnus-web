import type { Metadata } from "next";
import { Epilogue } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";

// Fonte das páginas públicas (uma família em dois pesos + o 900 dos títulos).
// O admin segue com a fonte do tema; quem usa esta é a classe .site.
const epilogue = Epilogue({
  subsets: ["latin"],
  weight: ["400", "500", "900"],
  variable: "--font-epilogue",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Sturnus Flow",
  description:
    "Agentes de IA no WhatsApp, lojas virtuais, sites e sistemas sob medida para empresas que querem vender mais, com menos esforço.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={epilogue.variable} suppressHydrationWarning>
      <head>
        {/* Os estados escondidos das animações de entrada só valem com JS
            rodando; sem ele o conteúdo aparece direto. */}
        <script dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('js')" }} />
      </head>
      <body>
        <Toaster richColors position="top-right" />
        {children}
      </body>
    </html>
  );
}
