"use client";

import { useState, type ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  BarChart3,
  Gauge,
  LayoutDashboard,
  Package,
  Palette,
  Search,
  ShoppingCart,
  Workflow,
} from "lucide-react";
import embarcarImage from "@/assets/EmbarcarNaViagem.png";
import heroImage from "@/assets/Espaço de trabalho minimalista com foco e serenidade.png";
import solucoesImage from "@/assets/ImagemParaSolucoes.jpg";
import vivaVinoLogo from "@/assets/VivaVino.png";
import fluxyGestaoLogo from "@/assets/FluxyGestao.png";
import rdStationLogo from "@/assets/RDStation.png";
import sankhyaLogo from "@/assets/Sankhya.png";
import pipedriveLogo from "@/assets/Pipedrive.png";
import googleLogo from "@/assets/Google.png";
import blingLogo from "@/assets/Bling.jpg";
import asaasLogo from "@/assets/Asaas.png";
import activeCampaignLogo from "@/assets/ActiveCampaign.png";
import hubspotLogo from "@/assets/HubSpot.jpg";
import { AgentChatDemo, CHAT_SCRIPTS, type AgentFeatureId } from "@/components/site/agent-chat-demo";
import { CookieConsentBanner } from "@/components/site/cookie-consent-banner";
import { SiteFooter } from "@/components/site/site-footer";
import { SiteHeader, type Chapter } from "@/components/site/site-header";
import { useRevealOnScroll } from "@/lib/use-reveal";
import { cn } from "@/lib/utils";

/// Seta das pílulas; anda alguns pixels no hover (.pill-arrow no CSS).
function Arrow({ className }: { className?: string }) {
  return (
    <svg aria-hidden viewBox="0 0 20 20" className={cn("pill-arrow size-5", className)}>
      <path d="M3 10h13M11 5l5 5-5 5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* Agentes de IA                                                       */
/* ------------------------------------------------------------------ */

const AI_AGENT_FEATURES: { id: AgentFeatureId; title: string; description: string }[] = [
  { id: "always-on", title: "Atendimento 24/7", description: "resposta imediata a qualquer hora, sem fila de espera." },
  {
    id: "qualify",
    title: "Qualificação de leads",
    description: "faz as perguntas certas e separa quem está pronto para comprar.",
  },
  {
    id: "knowledge",
    title: "Treinado com os seus dados",
    description: "catálogo, preços e políticas na ponta da língua.",
  },
  { id: "checkout", title: "Vende na conversa", description: "envia o link de pagamento e confirma o pedido no chat." },
  { id: "schedule", title: "Agenda", description: "marca consultas, visitas e reuniões direto na conversa." },
  {
    id: "handoff",
    title: "Transbordo para humanos",
    description: "passa a conversa para o seu time com todo o histórico.",
  },
];

/// Metade escura: o visitante escolhe o negócio (o que entra). Metade clara:
/// o agente atendendo esse negócio no WhatsApp (o que sai).
function AgentsChapter() {
  const [scriptId, setScriptId] = useState(CHAT_SCRIPTS[0].id);
  const [activeFeature, setActiveFeature] = useState<AgentFeatureId | null>(null);
  const script = CHAT_SCRIPTS.find((s) => s.id === scriptId) ?? CHAT_SCRIPTS[0];

  return (
    <section
      id="agentes-de-ia"
      data-chapter="navy"
      data-reveal
      aria-labelledby="agentes-titulo"
      className="grid scroll-mt-[72px] lg:scroll-mt-0 lg:grid-cols-2"
    >
      <h2 id="agentes-titulo" className="sr-only">
        Agentes de IA: seu melhor vendedor não dorme.
      </h2>

      <div className="bg-navy text-paper flex flex-col justify-between gap-12 px-4 pt-24 pb-8 sm:px-8 lg:gap-60 lg:pt-[calc(72px+4vh)] lg:pl-[8.33vw]">
        <div className="flex max-w-[36rem] flex-col gap-7">
          <p data-part style={{ "--i": 0 } as React.CSSProperties} className="text-2xl leading-snug font-medium text-pretty">
            Escolha um negócio e veja o agente atender, vender e agendar sozinho, no WhatsApp.
          </p>

          <div data-part style={{ "--i": 1 } as React.CSSProperties} className="flex flex-wrap gap-2" role="group" aria-label="Tipo de negócio">
            {CHAT_SCRIPTS.map((s) => (
              <button
                key={s.id}
                type="button"
                aria-pressed={s.id === scriptId}
                onClick={() => setScriptId(s.id)}
                className={cn(
                  "pill",
                  s.id === scriptId ? "bg-brand text-white" : "bg-white/10 text-paper hover:bg-white/20",
                )}
              >
                {s.label}
              </button>
            ))}
          </div>

          <ul data-part style={{ "--i": 2 } as React.CSSProperties} className="grid gap-x-8 gap-y-4 sm:grid-cols-2">
            {AI_AGENT_FEATURES.map((feature) => {
              const active = feature.id === activeFeature;
              return (
                <li
                  key={feature.id}
                  className={cn(
                    "flex flex-col gap-0.5 text-base leading-snug transition-[opacity,transform] duration-500 ease-[var(--ease-lux)]",
                    active ? "-translate-y-0.5 opacity-100" : "opacity-70",
                  )}
                >
                  <span className={cn("font-medium transition-colors duration-500", active && "text-[#9db8ff]")}>
                    {feature.title}
                  </span>
                  <span>{feature.description}</span>
                </li>
              );
            })}
          </ul>

          <Link
            href="/contato"
            data-part
            style={{ "--i": 3 } as React.CSSProperties}
            className="pill hidden w-fit bg-white text-navy hover:bg-sky lg:inline-flex"
          >
            Quero um agente de IA <Arrow />
          </Link>
        </div>

        <p aria-hidden className="display text-[11vw] lg:text-[clamp(2.5rem,5vw,5rem)]">
          Seu melhor
          <br />
          vendedor
        </p>
      </div>

      <div className="bg-paper flex flex-col justify-between gap-10 px-4 pt-8 pb-10 sm:px-8 lg:gap-8 lg:pt-[calc(72px+3vh)] lg:pb-8">
        <div data-part style={{ "--i": 2 } as React.CSSProperties} className="order-2 flex justify-center lg:order-1">
          <AgentChatDemo key={script.id} script={script} onFeatureChange={setActiveFeature} />
        </div>
        <div className="order-1 lg:order-2 lg:self-end">
          <p aria-hidden className="display text-[11vw] lg:text-[clamp(2.5rem,5vw,5rem)]">
            não dorme.
          </p>
        </div>
        <Link href="/contato" className="pill bg-brand order-3 w-fit text-white lg:hidden">
          Quero um agente de IA <Arrow />
        </Link>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Produtos: vitrines montadas em HTML (fragmentos de interface)        */
/* ------------------------------------------------------------------ */

function BrowserChrome({ url, children }: { url: string; children: ReactNode }) {
  return (
    <div data-ui className="w-full overflow-hidden rounded-xl bg-white text-neutral-900 ring-1 ring-black/10">
      <div className="flex items-center gap-1.5 border-b border-black/5 px-4 py-3"> {/* taste-skill-ignore */}
        <span className="size-2.5 rounded-full bg-[#ff5f57]" />
        <span className="size-2.5 rounded-full bg-[#febc2e]" />
        <span className="size-2.5 rounded-full bg-[#28c840]" />
        <span className="ml-3 flex-1 truncate rounded-md bg-neutral-100 px-3 py-1 font-sans text-[11px] text-neutral-600">
          {url}
        </span>
      </div>
      <div className="font-sans">{children}</div>
    </div>
  );
}

function StoreMockup() {
  const products = [
    { name: "Malbec Reserva", price: "R$ 119,90", tone: "bg-[#7a1f3d]/15" },
    { name: "Kit Queijos da Serra", price: "R$ 89,90", tone: "bg-[#c99a2e]/20" },
    { name: "Tempranillo Crianza", price: "R$ 138,00", tone: "bg-[#7a1f3d]/25" },
    { name: "Taças de cristal (2)", price: "R$ 64,90", tone: "bg-[#1e56e9]/10" },
  ];

  return (
    <BrowserChrome url="sualoja.com.br">
      <div className="flex items-center justify-between px-5 py-3">
        <span className="text-sm font-semibold">Sua Loja</span>
        <span className="relative text-[#1e56e9]">
          <ShoppingCart className="size-5" />
          <span className="absolute -top-1.5 -right-2 flex size-4 items-center justify-center rounded-full bg-[#1e56e9] text-[9px] font-semibold text-white">
            2
          </span>
        </span>
      </div>
      <div className="mx-5 rounded-lg bg-[#0e1d4a] px-5 py-7 text-white">
        <p className="text-xs opacity-80">Coleção de inverno</p>
        <p className="text-lg font-semibold">Frete grátis acima de R$ 199</p>
      </div>
      <div className="grid grid-cols-2 gap-3 p-5 sm:grid-cols-4">
        {products.map((product) => (
          <div key={product.name} className="flex flex-col gap-2">
            <div className={cn("flex aspect-square items-center justify-center rounded-md", product.tone)}>
              <Package className="size-6 text-neutral-900/30" />
            </div>
            <span className="truncate text-xs font-medium">{product.name}</span>
            <div className="flex items-center justify-between gap-1">
              <span className="text-xs font-semibold text-[#1e56e9]">{product.price}</span>
              <span className="rounded bg-[#1e56e9] px-1.5 py-0.5 text-[10px] text-white">Comprar</span>
            </div>
          </div>
        ))}
      </div>
    </BrowserChrome>
  );
}

function WebsiteMockup() {
  return (
    <BrowserChrome url="suaempresa.com.br">
      <div className="flex items-center justify-between px-5 py-3">
        <span className="text-sm font-semibold">Sua Empresa</span>
        <div className="flex items-center gap-3">
          {["Início", "Sobre", "Serviços"].map((item) => (
            <span key={item} className="text-[11px] text-neutral-500">
              {item}
            </span>
          ))}
          <span className="rounded bg-[#1e56e9] px-2 py-0.5 text-[11px] text-white">Contato</span>
        </div>
      </div>
      <div className="mx-5 flex flex-col gap-2 rounded-lg bg-[#1e56e9] px-6 py-14 text-white">
        <p className="max-w-[18ch] text-xl leading-tight font-semibold">Sua marca com presença profissional na internet</p>
        <span className="mt-2 w-fit rounded bg-white px-2.5 py-1 text-[11px] font-semibold text-[#1e56e9]">Fale conosco</span>
      </div>
      <div className="grid grid-cols-3 gap-3 p-5">
        {[
          { Icon: Palette, label: "Design exclusivo" },
          { Icon: Gauge, label: "Carrega em 1s" },
          { Icon: Search, label: "No topo do Google" },
        ].map(({ Icon, label }) => (
          <div key={label} className="flex flex-col items-start gap-2 rounded-lg bg-neutral-50 p-3">
            <Icon className="size-4 text-[#1e56e9]" />
            <span className="text-[11px] font-medium">{label}</span>
          </div>
        ))}
      </div>
    </BrowserChrome>
  );
}

function SoftwareMockup() {
  const stats = [
    { label: "Pedidos", value: "1.284", tone: "text-[#1e56e9]" },
    { label: "Receita", value: "R$ 86,4 mil", tone: "text-emerald-700" },
    { label: "Tickets", value: "32", tone: "text-amber-600" },
  ];
  const bars = [40, 65, 50, 80, 60, 95, 75, 88];
  const rows = [
    { name: "Pedido #1042", status: "Aprovado", tone: "bg-emerald-50 text-emerald-700" },
    { name: "Pedido #1041", status: "Em separação", tone: "bg-amber-50 text-amber-700" },
    { name: "Pedido #1040", status: "Enviado", tone: "bg-blue-50 text-blue-700" },
  ];

  return (
    <BrowserChrome url="painel.suaempresa.com.br">
      <div className="flex">
        <div className="flex w-12 shrink-0 flex-col items-center gap-5 bg-neutral-50 py-5">
          <span className="flex size-7 items-center justify-center rounded-md bg-[#1e56e9] text-white">
            <LayoutDashboard className="size-4" />
          </span>
          <BarChart3 className="size-4 text-neutral-400" />
          <Package className="size-4 text-neutral-400" />
          <Workflow className="size-4 text-neutral-400" />
        </div>
        <div className="flex min-w-0 flex-1 flex-col gap-4 p-5">
          <span className="text-sm font-semibold">Visão geral</span>
          <div className="grid grid-cols-3 gap-2">
            {stats.map((stat) => (
              <div key={stat.label} className="rounded-md bg-neutral-50 p-2.5">
                <p className="text-[10px] text-neutral-500">{stat.label}</p>
                <p className={cn("text-sm font-semibold tabular-nums", stat.tone)}>{stat.value}</p>
              </div>
            ))}
          </div>
          <div className="flex h-36 items-end gap-2 rounded-md bg-neutral-50 p-3">
            {bars.map((height, i) => (
              <span
                key={i}
                className="flex-1 origin-bottom rounded-sm bg-[#1e56e9]/80"
                style={{ height: `${height}%` }}
              />
            ))}
          </div>
          <div className="flex flex-col gap-1.5">
            {rows.map((row) => (
              <div key={row.name} className="flex items-center justify-between rounded-md bg-neutral-50 px-2.5 py-1.5">
                <span className="text-[11px] font-medium">{row.name}</span>
                <span className={cn("rounded px-1.5 py-0.5 text-[10px] font-medium", row.tone)}>{row.status}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </BrowserChrome>
  );
}

type Product = {
  id: string;
  chapter: Chapter;
  tab: string;
  name: string;
  category: string;
  description: string;
  features: string[];
  cta: string;
  mockup: ReactNode;
  note?: ReactNode;
};

const PRODUCTS: Product[] = [
  {
    id: "ecommerce",
    chapter: "brand",
    tab: "bg-paper text-navy",
    name: "Ecommerce",
    category: "Lojas virtuais",
    description:
      "Sua loja virtual pronta para vender todos os dias. Rápida, bonita e fácil de administrar, do catálogo ao checkout.",
    features: [
      "Experiência de compra impecável no celular e no computador",
      "Pix, cartão e boleto com checkout simples e seguro",
      "Pedidos, produtos e estoque num só painel",
    ],
    cta: "Quero minha loja virtual",
    mockup: <StoreMockup />,
    note: (
      <>
        Combine com um{" "}
        <a href="#agentes-de-ia" className="text-link font-medium underline">
          agente de IA
        </a>{" "}
        e venda também pelo WhatsApp.
      </>
    ),
  },
  {
    id: "sites-web",
    chapter: "sky",
    tab: "bg-navy text-paper",
    name: "Sites Web",
    category: "Sites e landing pages",
    description:
      "Um site profissional que apresenta e vende a sua empresa, feito para causar ótima primeira impressão e gerar contatos todos os dias.",
    features: [
      "Layout exclusivo, a partir da identidade da sua marca",
      "Rápido, seguro e responsivo em qualquer tela",
      "Estrutura pensada para aparecer no Google",
      "Formulários e chamadas que viram clientes",
    ],
    cta: "Quero meu site",
    mockup: <WebsiteMockup />,
  },
  {
    id: "softwares",
    chapter: "night",
    tab: "bg-brand text-white",
    name: "Softwares",
    category: "Sistemas sob medida",
    description:
      "Software que se adapta ao seu processo, e não o contrário. Do sistema interno à integração entre plataformas, com evolução contínua depois da entrega.",
    features: [
      "Painéis e CRMs com clientes, vendas e processos num só lugar",
      "Rotinas automáticas no lugar de planilhas e tarefas repetitivas",
      "Integração com os ERPs, CRMs e plataformas que você já usa",
      "Indicadores em tempo real para decidir mais rápido",
    ],
    cta: "Quero um software sob medida",
    mockup: <SoftwareMockup />,
  },
];

const CHAPTER_CLASSES: Record<Chapter, string> = {
  paper: "bg-paper text-navy",
  sky: "bg-sky text-navy",
  brand: "bg-brand text-white",
  navy: "bg-navy text-paper",
  night: "bg-night text-paper",
};

/// Cada produto é uma pasta: uma faixa de cor chapada com a aba do nome
/// subindo da borda de cima.
function ProductFolder({ product }: { product: Product }) {
  const dark = product.chapter === "brand" || product.chapter === "night";

  return (
    <article
      id={product.id}
      data-chapter={product.chapter}
      data-reveal
      className={cn(
        "scroll-mt-[72px]",
        CHAPTER_CLASSES[product.chapter],
      )}
    >
      <div className="flex h-16 items-end justify-between gap-4 px-4 sm:px-8">
        <h3 className={cn("folder-tab display flex h-11 shrink-0 items-center pr-12 pl-5 text-xl whitespace-nowrap sm:text-2xl", product.tab)}>
          {product.name}
        </h3>
        <span className="pb-3 text-right text-sm font-medium sm:text-base">{product.category}</span>
      </div>

      <div className="grid gap-10 px-4 pt-10 pb-16 sm:px-8 lg:grid-cols-12 lg:gap-6 lg:pt-14">
        <div data-part style={{ "--i": 1 } as React.CSSProperties} className="lg:col-span-7">
          {product.mockup}
        </div>
        <div className="flex flex-col gap-6 lg:col-span-4 lg:col-start-9">
          <p data-part style={{ "--i": 0 } as React.CSSProperties} className="text-xl leading-snug font-medium text-pretty lg:text-2xl">
            {product.description}
          </p>
          <ul data-part style={{ "--i": 2 } as React.CSSProperties} className="flex flex-col gap-2.5 text-lg">
            {product.features.map((feature) => (
              <li key={feature} className="leading-snug">
                {feature}
              </li>
            ))}
          </ul>
          {product.note && (
            <p data-part style={{ "--i": 3 } as React.CSSProperties} className="text-lg">
              {product.note}
            </p>
          )}
          <Link
            href="/contato"
            data-part
            style={{ "--i": 4 } as React.CSSProperties}
            className={cn(
              "pill w-fit",
              dark ? "bg-white text-navy hover:bg-sky" : "bg-brand text-white hover:bg-brand-deep",
            )}
          >
            {product.cta} <Arrow />
          </Link>
        </div>
      </div>
    </article>
  );
}

/* ------------------------------------------------------------------ */
/* Cases e integrações                                                  */
/* ------------------------------------------------------------------ */

/// Casos de sucesso: pra adicionar um cliente, coloque a logo em src/assets e
/// inclua um item aqui.
const SUCCESS_CASES = [
  {
    name: "Viva Vino",
    category: "Ecommerce",
    logo: vivaVinoLogo,
    url: "https://vivavinoudi.com.br/",
    linkLabel: "Visitar a loja",
  },
  {
    name: "Fluxy Gestão",
    category: "Software",
    logo: fluxyGestaoLogo,
    url: "https://gestao.fluxytechnologies.com.br/",
    linkLabel: "Acessar o sistema",
  },
];

const BRAND_LOGOS = [
  { name: "RD Station", src: rdStationLogo },
  { name: "Sankhya", src: sankhyaLogo },
  { name: "Pipedrive", src: pipedriveLogo },
  { name: "Google", src: googleLogo },
  { name: "Bling", src: blingLogo },
  { name: "Asaas", src: asaasLogo },
  { name: "ActiveCampaign", src: activeCampaignLogo },
  { name: "HubSpot", src: hubspotLogo },
];

function CasesBoard() {
  return (
    <section id="cases" data-chapter="paper" data-reveal className="bg-paper scroll-mt-[72px] px-2 py-24 sm:px-3 lg:py-40">
      <div className="grid grid-cols-2 gap-1.5 sm:gap-2 lg:grid-cols-4">
        <div
          data-part
          className="bg-brand col-span-2 flex min-h-[220px] flex-col justify-between gap-6 p-6 text-white lg:min-h-0 lg:p-8"
        >
          <h2 className="display text-[clamp(2.5rem,3.6vw,3.5rem)]">
            Clientes e
            <br />
            integrações
          </h2>
          <p className="max-w-[36ch] text-lg">
            Projetos que já estão no ar e as ferramentas que conectamos à sua operação.
          </p>
        </div>

        {SUCCESS_CASES.map((item, i) => (
          <a
            key={item.name}
            href={item.url}
            target="_blank"
            rel="noreferrer"
            data-part
            style={{ "--i": i + 1 } as React.CSSProperties}
            className="group col-span-2 flex aspect-[3/2] flex-col justify-between bg-white p-6 sm:col-span-1 lg:p-8"
          >
            <span className="flex items-baseline justify-between gap-3">
              <span className="display text-[1.75rem]">{item.name}</span>
              <span className="text-sm">{item.category}</span>
            </span>
            <Image
              src={item.logo}
              alt={`Logo ${item.name}`}
              sizes="(min-width: 1024px) 20vw, 50vw"
              className="mx-auto h-20 w-auto object-contain transition-transform duration-500 ease-[var(--ease-lux)] group-hover:scale-105"
            />
            <span className="flex items-center gap-2 text-base font-medium">
              {item.linkLabel} <Arrow className="size-4" />
            </span>
          </a>
        ))}

        {BRAND_LOGOS.map((logo, i) => (
          <div
            key={logo.name}
            data-part
            style={{ "--i": 3 + (i % 4) } as React.CSSProperties}
            className="flex aspect-[3/2] items-center justify-center bg-white p-6"
          >
            <Image
              src={logo.src}
              alt={logo.name}
              sizes="(min-width: 1024px) 15vw, 40vw"
              className="h-12 w-auto object-contain lg:h-16"
            />
          </div>
        ))}
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Página                                                              */
/* ------------------------------------------------------------------ */

/// Canais de contato do bloco final da home.
const CONTACT_CHANNELS = [
  { label: "WhatsApp", value: "+55 34 99171-3923", href: "https://wa.me/5534991713923" },
  { label: "E-mail", value: "sturnusflow@gmail.com", href: "mailto:sturnusflow@gmail.com" },
  { label: "Tempo de resposta", value: "Até 1 dia útil" },
];

export function HomePage() {
  useRevealOnScroll();

  return (
    <div className="site min-h-svh">
      <SiteHeader />
      <CookieConsentBanner />

      <main>
        {/* Hero: um círculo gigante cortado pela borda da tela, com a foto do
            espaço de trabalho dentro. */}
        <section
          id="top"
          data-chapter="paper"
          className="bg-paper relative flex min-h-[100svh] flex-col overflow-hidden px-4 pt-[calc(72px+12svh)] sm:px-8 lg:justify-center lg:pt-[72px] lg:pl-[8vw]"
        >
          <div
            className="shutter bg-mist absolute top-[56svh] left-1/2 aspect-square w-[130vw] -translate-x-1/2 overflow-hidden rounded-full lg:top-[55%] lg:left-[80%] lg:w-[min(112vh,64vw)] lg:-translate-y-1/2"
          >
            {/* A foto é paisagem: o recorte quadrado puxa pra direita pra
                pegar a pessoa, já que a borda direita do círculo sai da tela
                no desktop. */}
            <Image
              src={heroImage}
              alt="Profissional sorrindo diante do notebook num espaço de trabalho claro e minimalista"
              priority
              fill
              sizes="(min-width: 1024px) 115vw, 230vw"
              quality={90}
              className="object-cover object-[72%_center]"
            />
          </div>

          <div className="relative flex max-w-[40rem] flex-col gap-6 lg:max-w-[44vw]">
            <h1 className="display text-[11.5vw] lg:text-[clamp(3.5rem,6.4vw,6.25rem)]">
              <span className="hero-line block overflow-hidden pb-[0.08em]">
                <span style={{ "--i": 0 } as React.CSSProperties}>Tecnologia</span>
              </span>
              <span className="hero-line -mt-[0.08em] block overflow-hidden pb-[0.08em]">
                <span style={{ "--i": 1 } as React.CSSProperties}>que vende.</span>
              </span>
            </h1>
            <p data-rise style={{ "--i": 0 } as React.CSSProperties} className="max-w-[32ch] text-lg leading-relaxed lg:text-xl">
              Agentes de IA no WhatsApp, lojas virtuais, sites e sistemas sob medida para a sua empresa vender
              mais, com menos esforço.
            </p>
            <div data-rise style={{ "--i": 1 } as React.CSSProperties}>
              <Link href="/contato" className="pill bg-brand hover:bg-brand-deep text-white">
                Quero vender mais <Arrow />
              </Link>
            </div>
          </div>
        </section>

        <AgentsChapter />

        {/* Produtos */}
        <section id="produtos" data-chapter="paper" aria-labelledby="produtos-titulo" className="scroll-mt-[72px]">
          <div data-reveal className="bg-paper grid gap-6 px-4 pt-32 pb-16 sm:px-8 lg:grid-cols-12 lg:pt-44 lg:pl-[8.33vw]">
            <h2 id="produtos-titulo" data-part className="display text-[clamp(2.5rem,1.2rem+5vw,5.5rem)] lg:col-span-6">
              Feito para
              <br />
              vender
            </h2>
            <p
              data-part
              style={{ "--i": 1 } as React.CSSProperties}
              className="max-w-[40ch] self-end text-xl leading-relaxed lg:col-span-4 lg:col-start-8"
            >
              Loja, site ou sistema: cada projeto nasce do seu processo e vai ao ar pronto para trazer clientes.
            </p>
          </div>
          <div>
            {PRODUCTS.map((product) => (
              <ProductFolder key={product.id} product={product} />
            ))}
          </div>
        </section>

        <CasesBoard />

        {/* Sobre: painel escuro recuado com a foto recortada em círculo. */}
        <section id="sobre" data-chapter="paper" data-reveal className="bg-paper scroll-mt-[72px] p-2.5 sm:p-5">
          <div className="bg-navy text-paper flex flex-col gap-12 overflow-hidden px-5 pt-14 lg:grid lg:grid-cols-12 lg:gap-6 lg:px-14 lg:pt-14 lg:pb-0">
            {/* Desktop: título e foto juntos na coluna da esquerda, a borda de
                baixo do painel corta a foto. Celular: título, textos e a foto
                por último (o wrapper vira "contents" e a ordem vem do order-*). */}
            <div className="contents lg:col-span-6 lg:flex lg:flex-col lg:gap-10">
              <h2 data-part className="display order-1 text-[7.2vw] lg:order-none lg:text-[clamp(2.5rem,4vw,4rem)]">
                Boas conexões,
                <br />
                grandes conquistas.
              </h2>
              <div className="relative order-3 mx-auto -mb-[22vw] aspect-square w-[86vw] overflow-hidden rounded-full lg:order-none lg:mx-0 lg:-mb-[6vw] lg:w-[min(34vw,560px)]">
                <Image
                  src={embarcarImage}
                  alt="Mulher na plataforma do metrô, pronta para embarcar"
                  fill
                  data-settle
                  // A foto é paisagem (16:9) recortada num círculo: renderizada, ela
                  // fica ~1,8x mais larga que o círculo. O sizes precisa refletir
                  // isso, senão o Next entrega uma versão pequena e a foto borra.
                  sizes="(min-width: 1024px) 62vw, 155vw"
                  quality={90}
                  className="object-cover object-[62%_center]"
                />
              </div>
            </div>

            <div className="order-2 flex flex-col gap-14 lg:order-none lg:col-span-4 lg:col-start-8 lg:pb-14">
              <div data-part style={{ "--i": 1 } as React.CSSProperties} className="flex flex-col gap-3">
                <h3 className="text-2xl font-medium">Cada projeto é único</h3>
                <p className="text-lg leading-relaxed">
                  Não acreditamos em fórmulas prontas nem em relações puramente comerciais. Queremos parceiros
                  dispostos a transformar ideias em grandes resultados.
                </p>
              </div>
              <div data-part style={{ "--i": 2 } as React.CSSProperties} className="flex flex-col gap-3">
                <h3 className="text-2xl font-medium">Compromisso de ponta a ponta</h3>
                <p className="text-lg leading-relaxed">
                  Agilidade nas decisões, pontualidade rigorosa e uma equipe apaixonada, com cuidado genuíno por
                  todas as pessoas envolvidas no processo.
                </p>
              </div>
              <Link
                href="/contato"
                data-part
                style={{ "--i": 3 } as React.CSSProperties}
                className="pill bg-brand hover:bg-brand-deep w-fit text-white"
              >
                Embarque com a gente <Arrow />
              </Link>
            </div>
          </div>
        </section>

        {/* Contato: convite à esquerda, canais à direita. */}
        <section
          id="contato-rapido"
          data-chapter="brand"
          data-reveal
          aria-labelledby="contato-titulo"
          className="bg-brand grid gap-12 px-4 py-24 text-white sm:px-8 lg:min-h-[90svh] lg:grid-cols-12 lg:items-center lg:gap-6 lg:py-32 lg:pl-[8.33vw]"
        >
          <div className="flex flex-col gap-8 lg:col-span-6">
            <h2 id="contato-titulo" data-part className="display text-[13vw] lg:text-[clamp(3.5rem,6vw,6rem)]">
              Vamos
              <br />
              conversar?
            </h2>
            <p data-part style={{ "--i": 1 } as React.CSSProperties} className="max-w-[34ch] text-xl leading-relaxed">
              Conte o que a sua empresa precisa. Um especialista responde e marca uma conversa no seu horário.
            </p>
            <Link
              href="/contato"
              data-part
              style={{ "--i": 2 } as React.CSSProperties}
              className="pill w-fit bg-white text-navy hover:bg-sky"
            >
              Falar com um especialista <Arrow />
            </Link>
          </div>

          <div className="flex flex-col gap-2 lg:col-span-5 lg:col-start-8">
            <div data-part style={{ "--i": 1 } as React.CSSProperties} className="relative aspect-[16/9] overflow-hidden">
              <Image
                src={solucoesImage}
                alt="Mulher caminhando com o celular na mão em frente a um prédio comercial"
                fill
                data-settle
                sizes="(min-width: 1024px) 40vw, 100vw"
                className="object-cover object-[50%_35%]"
              />
            </div>
            <ul className="flex flex-col gap-2">
              {CONTACT_CHANNELS.map((channel, i) => {
                const content = (
                  <>
                    <span className="text-base">{channel.label}</span>
                    <span className="text-xl font-medium [overflow-wrap:anywhere] sm:text-[1.75rem]">{channel.value}</span>
                  </>
                );
                return (
                  <li key={channel.label} data-part style={{ "--i": i + 2 } as React.CSSProperties}>
                    {channel.href ? (
                      <a
                        href={channel.href}
                        target={channel.href.startsWith("http") ? "_blank" : undefined}
                        rel="noreferrer"
                        className="group bg-brand-deep flex items-center justify-between gap-4 p-5 transition-colors hover:bg-navy"
                      >
                        <span className="flex min-w-0 flex-col gap-1">{content}</span>
                        <Arrow className="size-6 shrink-0" />
                      </a>
                    ) : (
                      <div className="bg-brand-deep flex flex-col gap-1 p-5">{content}</div>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
