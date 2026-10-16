"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import fluxyIcon from "@/assets/IconeAzulSemFundo.png";
import fluxyIconWhite from "@/assets/IconeBrancoSemFundo.png";
import { cn } from "@/lib/utils";

/// Cores de cada capítulo da página. A seção marca `data-chapter` e o
/// cabeçalho assume o fundo e a tinta do capítulo que está passando por baixo.
export const CHAPTERS = {
  paper: { bg: "var(--color-paper)", ink: "var(--color-navy)", dark: false },
  sky: { bg: "var(--color-sky)", ink: "var(--color-navy)", dark: false },
  brand: { bg: "var(--color-brand)", ink: "#ffffff", dark: true },
  navy: { bg: "var(--color-navy)", ink: "var(--color-paper)", dark: true },
  night: { bg: "var(--color-night)", ink: "var(--color-paper)", dark: true },
} as const;

export type Chapter = keyof typeof CHAPTERS;

const NAV_LINKS = [
  { href: "/#agentes-de-ia", label: "Agentes de IA" },
  { href: "/#produtos", label: "Produtos" },
  { href: "/#cases", label: "Cases" },
  { href: "/#sobre", label: "Sobre" },
  // Portal dos clientes da plataforma de agentes (Agent Console), não o admin do site.
  { href: "https://portal.sturnusflow.com.br/", label: "Portal Agentes" },
];

/// Capítulo sob o cabeçalho: observa as seções com data-chapter e pega a que
/// cruza a faixa do topo da tela.
function useChapterUnderHeader() {
  const [chapter, setChapter] = useState<Chapter>("paper");

  useEffect(() => {
    const sections = document.querySelectorAll<HTMLElement>("[data-chapter]");
    if (!sections.length) return;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setChapter(entry.target.getAttribute("data-chapter") as Chapter);
        }
      },
      { rootMargin: "0px 0px -92% 0px", threshold: 0 },
    );
    sections.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return chapter;
}

/// Barra simples: marca, links e uma ação. `transparent` é para páginas com
/// foto escura no topo (política de privacidade): texto branco sobre a foto.
export function SiteHeader({ transparent = false }: { transparent?: boolean }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const chapter = useChapterUnderHeader();
  const colors = CHAPTERS[chapter];
  const clear = transparent && !mobileOpen;
  const dark = clear || colors.dark;

  return (
    <header
      className="site fixed inset-x-0 top-0 z-50 transition-[background-color,color] duration-300"
      style={{ backgroundColor: clear ? "transparent" : colors.bg, color: clear ? "#ffffff" : colors.ink }}
    >
      <div className="flex h-[72px] items-center justify-between gap-6 px-4 sm:px-8">
        <Link href="/#top" className="flex items-center gap-2.5" onClick={() => setMobileOpen(false)}>
          <Image src={dark ? fluxyIconWhite : fluxyIcon} alt="" className="size-8 object-contain" priority />
          <span className="display text-[1.375rem] leading-none">Sturnus Flow</span>
        </Link>

        <nav aria-label="Principal" className="hidden items-center gap-8 text-[0.9375rem] font-medium lg:flex">
          {NAV_LINKS.map((link) => (
            <a key={link.label} href={link.href} className="text-link">
              {link.label}
            </a>
          ))}
          <Link
            href="/contato"
            className={cn("pill !py-3", dark ? "bg-white text-navy hover:bg-sky" : "bg-brand text-white hover:bg-brand-deep")}
          >
            Fale conosco
          </Link>
        </nav>

        <button
          type="button"
          onClick={() => setMobileOpen((open) => !open)}
          aria-expanded={mobileOpen}
          aria-controls="menu-mobile"
          className="text-[1.0625rem] font-medium lg:hidden"
        >
          {mobileOpen ? "Fechar" : "Menu"}
        </button>
      </div>

      {mobileOpen && (
        <nav
          id="menu-mobile"
          aria-label="Principal"
          className="animate-in fade-in slide-in-from-top-2 flex flex-col gap-1 px-4 pt-2 pb-8 duration-200 lg:hidden"
        >
          {NAV_LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className="display py-2 text-[2.25rem]"
            >
              {link.label}
            </a>
          ))}
          <Link
            href="/contato"
            onClick={() => setMobileOpen(false)}
            className={cn("pill mt-4 w-fit", dark ? "bg-white text-navy" : "bg-brand text-white")}
          >
            Fale conosco
          </Link>
        </nav>
      )}
    </header>
  );
}

/// true depois que o visitante passa da foto escura do topo — usado pela
/// política de privacidade pra tirar o cabeçalho do modo transparente.
export function usePastHero(heroRef: React.RefObject<HTMLElement | null>) {
  const [pastHero, setPastHero] = useState(false);

  useEffect(() => {
    function handleScroll() {
      const hero = heroRef.current;
      if (!hero) return;
      const heroTop = hero.offsetTop;
      const heroBottom = heroTop + hero.offsetHeight;
      const insideHero = window.scrollY >= heroTop - 1 && window.scrollY < heroBottom;
      setPastHero(!insideHero);
    }
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [heroRef]);

  return pastHero;
}
