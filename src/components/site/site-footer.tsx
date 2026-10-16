"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const FOOTER_LINKS = [
  { href: "/#agentes-de-ia", label: "Agentes de IA" },
  { href: "/#ecommerce", label: "Ecommerce" },
  { href: "/#sites-web", label: "Sites" },
  { href: "/#softwares", label: "Softwares" },
  { href: "/#cases", label: "Cases" },
  { href: "https://portal.sturnusflow.com.br/", label: "Portal Agentes" },
];

/// Hora de Brasília ao vivo; só renderiza no cliente pra não divergir do HTML
/// gerado no servidor.
function BrasiliaClock() {
  const [now, setNow] = useState<string | null>(null);

  useEffect(() => {
    const format = () =>
      new Intl.DateTimeFormat("pt-BR", { hour: "2-digit", minute: "2-digit", timeZone: "America/Sao_Paulo" }).format(
        new Date(),
      );
    setNow(format());
    const timer = setInterval(() => setNow(format()), 15_000);
    return () => clearInterval(timer);
  }, []);

  return <span className="display text-[2.5rem] tabular-nums">{now ?? "--:--"}</span>;
}

/// Rodapé em placas: a última fileira do quadro, todas as células usadas.
export function SiteFooter() {
  return (
    <footer className="site bg-paper p-2 sm:p-3" data-chapter="paper">
      <div className="grid grid-cols-2 gap-1.5 sm:gap-2 lg:grid-cols-12">
        <div className="bg-navy text-paper col-span-2 flex h-40 items-center justify-center lg:order-5 lg:col-span-8 lg:h-80">
          <span className="display text-[12vw] lg:text-[8.5vw]">Sturnus Flow</span>
        </div>

        <Link
          href="/contato"
          className="group bg-brand hover:bg-brand-deep col-span-2 flex h-40 flex-col justify-between p-5 text-white transition-colors lg:order-6 lg:col-span-4 lg:h-80"
        >
          <span className="display text-[1.75rem]">Fale com um especialista</span>
          <svg
            aria-hidden
            viewBox="0 0 48 48"
            className="size-12 self-end transition-transform duration-200 ease-[var(--ease-lux)] group-hover:translate-x-1 group-hover:-translate-y-1"
          >
            <path d="M10 38 38 10M16 10h22v22" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
          </svg>
        </Link>

        <nav aria-label="Rodapé" className="bg-mist col-span-1 flex flex-col gap-1.5 p-5 lg:order-2 lg:col-span-3 lg:h-56">
          {FOOTER_LINKS.map((link) => (
            <a key={link.label} href={link.href} className="text-link w-fit text-base">
              {link.label}
            </a>
          ))}
        </nav>

        <div className="bg-mist col-span-1 flex flex-col justify-between p-5 lg:order-4 lg:col-span-3 lg:h-56">
          <span className="text-base font-medium">Escreva pra gente</span>
          <a href="mailto:sturnusflow@gmail.com" className="text-link text-lg font-medium break-all sm:text-xl">
            sturnusflow@gmail.com
          </a>
        </div>

        <div className="bg-mist col-span-1 flex flex-col justify-between p-5 lg:order-3 lg:col-span-2 lg:h-56">
          <span className="text-base font-medium">Horário de Brasília</span>
          <BrasiliaClock />
        </div>

        <div className="bg-mist col-span-1 flex flex-col justify-between gap-4 p-5 lg:order-1 lg:col-span-4 lg:h-56">
          <p className="text-2xl leading-tight font-medium">Tecnologia que vende por você.</p>
          <div className="flex flex-col gap-1 text-sm">
            <Link href="/politica-de-privacidade" className="text-link w-fit">
              Política de privacidade
            </Link>
            <span>© {new Date().getFullYear()} Sturnus Flow</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
