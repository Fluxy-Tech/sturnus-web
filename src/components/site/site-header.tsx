"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Bot, ChevronDown, Code2, Globe, Menu, ShoppingCart, X } from "lucide-react";
import fluxyIcon from "@/assets/IconeAzulSemFundo.png";
import fluxyIconWhite from "@/assets/IconeBrancoSemFundo.png";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

// Ainda não há página própria por serviço: cada item leva à seção dele na
// home.
const SERVICES = [
  { href: "/#agentes-de-ia", label: "Agentes de IA", description: "Atendimento e vendas no WhatsApp com IA", icon: Bot },
  { href: "/#ecommerce", label: "Ecommerces", description: "Lojas virtuais prontas para vender", icon: ShoppingCart },
  { href: "/#sites-web", label: "Sites Web", description: "Sites institucionais e landing pages", icon: Globe },
  { href: "/#softwares", label: "Softwares", description: "Sistemas sob medida para sua operação", icon: Code2 },
];

const NAV_LINKS = [
  { href: "/#cases", label: "Cases" },
  { href: "/#sobre", label: "Sobre" },
  { href: "/contato", label: "Entrar em contato" },
  // Portal dos clientes da plataforma de agentes (Agent Console), não o admin do site.
  { href: "https://portal.sturnusflow.com.br/", label: "Portal Agentes" },
];

export function SiteHeader({ transparent = false }: { transparent?: boolean }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false);
  // Com o menu mobile aberto, o painel do dropdown precisa de um fundo sólido
  // pra ser legível por cima do hero — então o header some do modo
  // transparente enquanto ele estiver aberto, mesmo que "transparent" siga
  // true (usuário ainda no topo da página).
  const solid = !transparent || mobileOpen;

  const linkClass = cn("transition-colors", solid ? "text-black hover:text-black/70" : "text-white hover:text-white/70");
  const mobileLinkClass = "text-foreground hover:text-foreground/70 py-2 transition-colors";

  return (
    <header
      className={cn("fixed inset-x-0 top-0 z-50 transition-colors", solid ? "border-b bg-background/95 backdrop-blur" : "bg-transparent")}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4">
        <a href="/#top" className="flex items-center gap-2">
          <Image src={solid ? fluxyIcon : fluxyIconWhite} alt="Sturnus Flow" className="h-8 w-8 object-contain" />
        </a>
        <nav className="hidden items-center gap-8 text-base font-medium sm:flex">
          <a href="/#top" className={linkClass}>
            Início
          </a>
          <DropdownMenu modal={false}>
            <DropdownMenuTrigger className={cn("group flex items-center gap-1 outline-none", linkClass)}>
              Serviços
              <ChevronDown className="size-4 transition-transform group-data-[state=open]:rotate-180" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="center" sideOffset={12} className="w-80 p-2">
              {SERVICES.map((service) => (
                <DropdownMenuItem key={service.label} asChild className="items-start gap-3 p-2.5">
                  <a href={service.href}>
                    <span className="bg-primary/10 text-primary flex size-9 shrink-0 items-center justify-center rounded-lg">
                      <service.icon className="size-5" />
                    </span>
                    <span className="flex flex-col">
                      <span className="text-sm font-semibold">{service.label}</span>
                      <span className="text-muted-foreground text-xs">{service.description}</span>
                    </span>
                  </a>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          {NAV_LINKS.map((link) => (
            <a key={link.label} href={link.href} className={linkClass}>
              {link.label}
            </a>
          ))}
        </nav>
        <button
          type="button"
          onClick={() => setMobileOpen((open) => !open)}
          aria-label={mobileOpen ? "Fechar menu" : "Abrir menu"}
          aria-expanded={mobileOpen}
          className={cn("sm:hidden", solid ? "text-black" : "text-white")}
        >
          {mobileOpen ? <X className="size-6" /> : <Menu className="size-6" />}
        </button>
      </div>
      {mobileOpen && (
        <nav className="border-border flex flex-col items-center gap-1 border-t px-4 py-4 text-base font-medium sm:hidden">
          <a href="/#top" className={mobileLinkClass} onClick={() => setMobileOpen(false)}>
            Início
          </a>
          <button
            type="button"
            onClick={() => setMobileServicesOpen((open) => !open)}
            aria-expanded={mobileServicesOpen}
            className={cn(mobileLinkClass, "flex items-center gap-1")}
          >
            Serviços
            <ChevronDown className={cn("size-4 transition-transform", mobileServicesOpen && "rotate-180")} />
          </button>
          {mobileServicesOpen && (
            <div className="bg-muted/50 mb-1 flex w-full max-w-xs flex-col gap-1 rounded-lg p-2">
              {SERVICES.map((service) => (
                <a
                  key={service.label}
                  href={service.href}
                  onClick={() => setMobileOpen(false)}
                  className="hover:bg-accent flex items-center gap-3 rounded-md px-2 py-2 text-sm"
                >
                  <service.icon className="text-primary size-4 shrink-0" />
                  {service.label}
                </a>
              ))}
            </div>
          )}
          {NAV_LINKS.map((link) => (
            <a key={link.label} href={link.href} className={mobileLinkClass} onClick={() => setMobileOpen(false)}>
              {link.label}
            </a>
          ))}
        </nav>
      )}
    </header>
  );
}

/// "Fora da faixa do hero escuro" — cabeçalho fica sólido depois de passar do
/// hero (sobre o conteúdo claro abaixo); só fica transparente enquanto a
/// imagem escura do hero está atrás dele.
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
