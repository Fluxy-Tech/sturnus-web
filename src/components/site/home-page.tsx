"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  BookOpen,
  BarChart3,
  Bot,
  CalendarCheck,
  Code2,
  CreditCard,
  ExternalLink,
  Clock,
  Gauge,
  Globe,
  Headset,
  LayoutDashboard,
  Lightbulb,
  Package,
  Palette,
  Plug,
  Rocket,
  Search,
  ShoppingCart,
  Smartphone,
  Target,
  Trophy,
  Workflow,
} from "lucide-react";
import heroImage from "@/assets/ImagemParaTop.jpg";
import conversaImage from "@/assets/Conversa.png";
import embarcarImage from "@/assets/EmbarcarNaViagem.png";
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
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { CookieConsentBanner } from "@/components/site/cookie-consent-banner";
import { SiteFooter } from "@/components/site/site-footer";
import { SiteHeader, usePastHero } from "@/components/site/site-header";
import { cn } from "@/lib/utils";

const SOFTWARE_FEATURES = [
  {
    icon: Code2,
    title: "Sistemas sob medida",
    description: "o software se adapta ao seu processo, e não o contrário.",
  },
  {
    icon: LayoutDashboard,
    title: "Painéis e CRMs",
    description: "clientes, vendas e processos internos centralizados num só lugar.",
  },
  {
    icon: Workflow,
    title: "Automação de processos",
    description: "rotinas automáticas no lugar de tarefas repetitivas e planilhas.",
  },
  {
    icon: Plug,
    title: "Integrações e APIs",
    description: "conectamos ERPs, CRMs e plataformas que você já usa.",
  },
  {
    icon: BarChart3,
    title: "Dashboards e relatórios",
    description: "indicadores da operação em tempo real para decidir mais rápido.",
  },
];

/// Ilustração da seção de Softwares: um painel administrativo montado em CSS,
/// no mesmo formato da vitrine do Ecommerce.
function SoftwareMockup() {
  const stats = [
    { label: "Pedidos", value: "1.284", tone: "text-primary" },
    { label: "Receita", value: "R$ 86 mil", tone: "text-success" },
    { label: "Tickets", value: "32", tone: "text-warning" },
  ];
  const bars = [40, 65, 50, 80, 60, 95, 75];
  const rows = [
    { name: "Pedido #1042", status: "Aprovado", tone: "bg-success/15 text-success" },
    { name: "Pedido #1041", status: "Em separação", tone: "bg-warning/20 text-warning-foreground" },
    { name: "Pedido #1040", status: "Enviado", tone: "bg-primary/15 text-primary" },
    { name: "Pedido #1039", status: "Entregue", tone: "bg-success/15 text-success" },
    { name: "Pedido #1038", status: "Aprovado", tone: "bg-success/15 text-success" },
  ];

  return (
    <div className="bg-card border-border w-full max-w-xl overflow-hidden rounded-none border shadow-xl">
      <div className="border-border flex items-center gap-1.5 border-b px-4 py-3">
        <span className="size-2.5 rounded-full bg-red-400" />
        <span className="size-2.5 rounded-full bg-yellow-400" />
        <span className="size-2.5 rounded-full bg-green-400" />
        <span className="bg-muted text-muted-foreground ml-3 flex-1 truncate rounded-md px-3 py-1 text-[11px]">
          painel.suaempresa.com.br
        </span>
      </div>
      <div className="flex">
        <div className="bg-muted/40 border-border flex w-12 shrink-0 flex-col items-center gap-5 border-r py-5">
          <span className="bg-primary text-primary-foreground flex size-7 items-center justify-center rounded-md">
            <LayoutDashboard className="size-4" />
          </span>
          <BarChart3 className="text-muted-foreground size-4" />
          <Package className="text-muted-foreground size-4" />
          <Workflow className="text-muted-foreground size-4" />
        </div>
        <div className="flex min-w-0 flex-1 flex-col gap-4 p-5">
          <span className="font-[family-name:var(--font-display)] text-sm font-semibold">Visão geral</span>
          <div className="grid grid-cols-3 gap-2">
            {stats.map((stat) => (
              <div key={stat.label} className="border-border rounded-md border p-2">
                <p className="text-muted-foreground text-[10px]">{stat.label}</p>
                <p className={cn("text-sm font-semibold", stat.tone)}>{stat.value}</p>
              </div>
            ))}
          </div>
          <div className="border-border flex h-56 items-end gap-2 rounded-md border p-3">
            {bars.map((height, i) => (
              <span key={i} className="bg-primary/70 flex-1 rounded-sm" style={{ height: `${height}%` }} />
            ))}
          </div>
          <div className="flex flex-col gap-1.5">
            {rows.map((row) => (
              <div key={row.name} className="border-border flex items-center justify-between rounded-md border px-2 py-1.5">
                <span className="text-[11px] font-medium">{row.name}</span>
                <span className={cn("rounded px-1.5 py-0.5 text-[10px] font-medium", row.tone)}>{row.status}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

const WEBSITE_FEATURES = [
  {
    icon: Palette,
    title: "Design exclusivo",
    description: "layout criado a partir da identidade visual da sua marca.",
  },
  {
    icon: Smartphone,
    title: "Responsivo",
    description: "navegação perfeita no celular, tablet e computador.",
  },
  {
    icon: Search,
    title: "Otimizado para o Google (SEO)",
    description: "estrutura pensada para sua empresa ser encontrada.",
  },
  {
    icon: Gauge,
    title: "Rápido e seguro",
    description: "páginas leves, com HTTPS e boas práticas de desempenho.",
  },
  {
    icon: Target,
    title: "Focado em conversão",
    description: "formulários e chamadas que transformam visitantes em clientes.",
  },
];

/// Ilustração da seção de Sites Web: uma landing page montada em CSS, no
/// mesmo formato da vitrine do Ecommerce.
function WebsiteMockup() {
  return (
    <div className="bg-card border-border w-full max-w-xl overflow-hidden rounded-none border shadow-xl">
      <div className="border-border flex items-center gap-1.5 border-b px-4 py-3">
        <span className="size-2.5 rounded-full bg-red-400" />
        <span className="size-2.5 rounded-full bg-yellow-400" />
        <span className="size-2.5 rounded-full bg-green-400" />
        <span className="bg-muted text-muted-foreground ml-3 flex-1 truncate rounded-md px-3 py-1 text-[11px]">
          suaempresa.com.br
        </span>
      </div>
      <div className="flex items-center justify-between px-4 py-3">
        <span className="font-[family-name:var(--font-display)] text-sm font-semibold">Sua Empresa</span>
        <div className="flex items-center gap-3">
          {["Início", "Sobre", "Serviços"].map((item) => (
            <span key={item} className="text-muted-foreground text-[10px]">
              {item}
            </span>
          ))}
          <span className="bg-primary text-primary-foreground rounded px-2 py-0.5 text-[10px]">Contato</span>
        </div>
      </div>
      <div className="from-primary to-primary/70 text-primary-foreground mx-4 flex flex-col gap-2 rounded-lg bg-gradient-to-br px-6 py-16">
        <p className="font-[family-name:var(--font-display)] text-lg leading-tight font-semibold">
          Sua marca com presença profissional na internet
        </p>
        <span className="h-1.5 w-3/4 rounded-full bg-white/40" />
        <span className="h-1.5 w-1/2 rounded-full bg-white/40" />
        <span className="text-primary mt-2 w-fit rounded bg-white px-2.5 py-1 text-[10px] font-semibold">
          Fale conosco
        </span>
      </div>
      <div className="grid grid-cols-3 gap-3 p-4">
        {[Palette, Gauge, Search].map((Icon, i) => (
          <div key={i} className="border-border flex flex-col items-center gap-3 rounded-lg border px-4 py-8">
            <span className="bg-primary/10 text-primary flex size-8 items-center justify-center rounded-md">
              <Icon className="size-4" />
            </span>
            <span className="bg-muted h-1.5 w-full rounded-full" />
            <span className="bg-muted h-1.5 w-2/3 rounded-full" />
          </div>
        ))}
      </div>
    </div>
  );
}

const AI_AGENT_FEATURES = [
  {
    icon: Clock,
    title: "Atendimento 24/7",
    description: "resposta imediata a qualquer hora, sem fila de espera.",
  },
  {
    icon: Target,
    title: "Qualificação de leads",
    description: "o agente faz as perguntas certas e separa quem está pronto para comprar.",
  },
  {
    icon: BookOpen,
    title: "Treinado com os dados da sua empresa",
    description: "anexe catálogos, preços e políticas e ele responde com precisão.",
  },
  {
    icon: CalendarCheck,
    title: "Agenda",
    description: "marca reuniões com seus clientes direto na conversa.",
  },
  {
    icon: Headset,
    title: "Transbordo para humanos",
    description: "passa a conversa para o seu time com todo o histórico quando precisar.",
  },
];

const ECOMMERCE_FEATURES = [
  {
    icon: Smartphone,
    title: "Design responsivo",
    description: "experiência de compra impecável no celular e no computador.",
  },
  {
    icon: CreditCard,
    title: "Pagamentos integrados",
    description: "Pix, cartão e boleto com checkout simples e seguro.",
  },
  {
    icon: Package,
    title: "Gestão de pedidos e estoque",
    description: "acompanhe vendas, produtos e entregas em um só painel.",
  },
];

/// Casos de sucesso — pra adicionar um cliente, coloque a logo em src/assets e
/// inclua um item aqui.
const SUCCESS_CASES = [
  {
    name: "Viva Vino",
    category: "E-commerce",
    logo: vivaVinoLogo,
    description: "Loja virtual de vinhos desenvolvida pela Sturnus Flow, do catálogo ao checkout.",
    url: "https://vivavinoudi.com.br/",
    linkLabel: "Visitar a loja",
  },
  {
    name: "Fluxy Gestão",
    category: "Software",
    logo: fluxyGestaoLogo,
    description: "Sistema de gestão web desenvolvido sob medida pela Sturnus Flow.",
    url: "https://gestao.fluxytechnologies.com.br/",
    linkLabel: "Acessar o sistema",
  },
];

/// Mínimo de cards numa "volta" do carrossel — com poucos clientes a lista é
/// repetida pra trilha preencher a tela sem buraco no loop.
const MIN_CASES_PER_LOOP = 6;

/// Carrossel infinito dos casos de sucesso, no mesmo estilo do LogoMarquee
/// (trilha duplicada deslizando -50%, pausa no hover).
function SuccessCasesMarquee() {
  const repeat = Math.max(1, Math.ceil(MIN_CASES_PER_LOOP / SUCCESS_CASES.length));
  const loop = Array.from({ length: repeat }, () => SUCCESS_CASES).flat();

  return (
    <div className="relative flex w-full min-w-0 overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
      <div className="animate-marquee-slow flex w-max items-stretch gap-6 py-4 hover:[animation-play-state:paused]">
        {[...loop, ...loop].map((item, index) => (
          <a
            key={`${item.name}-${index}`}
            href={item.url}
            target="_blank"
            rel="noreferrer"
            // Só a 1ª cópia fica acessível; as repetições existem pra animação.
            aria-hidden={index >= SUCCESS_CASES.length || undefined}
            tabIndex={index >= SUCCESS_CASES.length ? -1 : undefined}
            className="bg-card border-border group flex w-72 shrink-0 flex-col border shadow-sm transition-shadow hover:shadow-lg"
          >
            <div className="border-border flex h-44 items-center justify-center border-b bg-white p-6">
              <Image src={item.logo} alt={item.name} className="h-full w-auto object-contain" />
            </div>
            <div className="flex flex-1 flex-col gap-2 p-5">
              <Badge variant="secondary" className="w-fit">
                {item.category}
              </Badge>
              <h3 className="font-[family-name:var(--font-display)] text-lg font-semibold">{item.name}</h3>
              <p className="text-muted-foreground flex-1 text-sm">{item.description}</p>
              <span className="text-primary mt-2 flex items-center gap-1 text-sm font-medium group-hover:underline">
                {item.linkLabel} <ExternalLink className="size-3.5" />
              </span>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}

/// Ilustração da seção de Ecommerce: uma vitrine de loja montada em CSS (não
/// há foto de e-commerce nos assets da marca).
function StoreMockup() {
  const products = [
    { name: "Produto 1", price: "R$ 129,90", tone: "bg-primary/20" },
    { name: "Produto 2", price: "R$ 89,90", tone: "bg-success/20" },
    { name: "Produto 3", price: "R$ 249,90", tone: "bg-warning/25" },
    { name: "Produto 4", price: "R$ 59,90", tone: "bg-primary/10" },
  ];

  return (
    <div className="bg-card border-border w-full max-w-xl overflow-hidden rounded-none border shadow-xl">
      <div className="border-border flex items-center gap-1.5 border-b px-4 py-3">
        <span className="size-2.5 rounded-full bg-red-400" />
        <span className="size-2.5 rounded-full bg-yellow-400" />
        <span className="size-2.5 rounded-full bg-green-400" />
        <span className="bg-muted text-muted-foreground ml-3 flex-1 truncate rounded-md px-3 py-1 text-[11px]">
          sualoja.com.br
        </span>
      </div>
      <div className="flex items-center justify-between px-4 py-3">
        <span className="font-[family-name:var(--font-display)] text-sm font-semibold">Sua Loja</span>
        <span className="text-primary relative">
          <ShoppingCart className="size-5" />
          <span className="bg-primary text-primary-foreground absolute -top-1.5 -right-2 flex size-4 items-center justify-center rounded-full text-[9px] font-semibold">
            2
          </span>
        </span>
      </div>
      <div className="bg-primary text-primary-foreground mx-4 rounded-lg px-5 py-8">
        <p className="text-xs font-semibold tracking-widest uppercase opacity-80">Coleção nova</p>
        <p className="font-[family-name:var(--font-display)] text-lg font-semibold">Frete grátis acima de R$ 199</p>
      </div>
      <div className="grid grid-cols-2 gap-3 p-4">
        {products.map((product) => (
          <div key={product.name} className="border-border flex flex-col gap-2 rounded-lg border p-2">
            <div className={cn("flex h-32 items-center justify-center rounded-md", product.tone)}>
              <Package className="text-foreground/40 size-7" />
            </div>
            <span className="text-xs font-medium">{product.name}</span>
            <div className="flex items-center justify-between">
              <span className="text-primary text-xs font-semibold">{product.price}</span>
              <span className="bg-primary text-primary-foreground rounded px-1.5 py-0.5 text-[10px]">Comprar</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

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

function LogoMarquee() {
  return (
    <div className="relative flex w-full min-w-0 overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
      <div className="animate-marquee flex w-max items-center gap-16 py-4 hover:[animation-play-state:paused]">
        {[...BRAND_LOGOS, ...BRAND_LOGOS].map((logo, index) => (
          <Image
            key={`${logo.name}-${index}`}
            src={logo.src}
            alt={logo.name}
            className="h-16 w-auto shrink-0 object-contain grayscale transition-all hover:grayscale-0"
          />
        ))}
      </div>
    </div>
  );
}

export function HomePage() {
  const heroRef = useRef<HTMLDivElement>(null);
  const pastHero = usePastHero(heroRef);

  return (
    <div className="bg-dot-grid min-h-screen">
      <SiteHeader transparent={!pastHero} />
      <CookieConsentBanner />

      {/* Hero */}
      <section id="top" className="relative w-full scroll-mt-20">
        <div ref={heroRef} className="relative h-screen w-full overflow-hidden">
          <Image src={heroImage} alt="Atendimento Fluxy" priority fill sizes="100vw" className="object-cover" />
          <div className="absolute inset-0 bg-black/55" />
          <div className="absolute inset-0 flex items-end pb-16 sm:pb-20">
            <div className="mx-auto flex w-full max-w-6xl flex-col items-center gap-8 px-4 text-center sm:flex-row sm:items-end sm:justify-between sm:px-0 sm:text-left">
              <h1 className="w-full font-[family-name:var(--font-display)] text-3xl font-bold text-white sm:text-4xl lg:text-5xl">
                Empresas buscam grandes resultados em relatórios, conversões e eficiência. A Sturnus Flow faz acontecer.
              </h1>
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto flex max-w-6xl flex-col gap-52 px-4 py-28 lg:px-0">
        {/* Agentes de IA — da primeira conversa ao aquecimento de leads */}
        <section id="agentes-de-ia" className="grid scroll-mt-24 items-stretch gap-6 lg:grid-cols-2 lg:gap-16">
          <div className="flex flex-col items-center justify-center gap-4 text-center lg:items-start lg:text-left">
            <span className="text-primary flex items-center gap-2 text-xs font-semibold tracking-widest uppercase">
              <Bot className="size-4" /> Agentes de IA
            </span>
            <h2 className="font-[family-name:var(--font-display)] text-2xl font-semibold sm:text-3xl">
              Da primeira conversa ao aquecimento de seus leads para gerar grandes resultados.
            </h2>
            <p className="text-muted-foreground text-base sm:text-lg">
              Nossos agentes de IA atendem seus clientes no WhatsApp 24 horas por dia, com a linguagem da sua marca.
              Eles respondem dúvidas, qualificam leads e conduzem cada conversa até a venda — e passam para o seu time
              quando precisa de um toque humano.
            </p>
            <ul className="flex flex-col gap-3 text-left">
              {AI_AGENT_FEATURES.map((feature) => (
                <li key={feature.title} className="flex items-start gap-3">
                  <span className="bg-primary/10 text-primary flex size-8 shrink-0 items-center justify-center rounded-lg">
                    <feature.icon className="size-4" />
                  </span>
                  <span className="text-sm">
                    <span className="font-semibold">{feature.title}</span>
                    <span className="text-muted-foreground">: {feature.description}</span>
                  </span>
                </li>
              ))}
            </ul>
            <Link href="/contato" className={cn(buttonVariants({ size: "lg" }), "mt-2 w-fit text-base")}>
              Quero um agente de IA
            </Link>
          </div>
          <div className="flex items-center justify-center">
            <Image
              src={conversaImage}
              alt="Conversa da Fluxy no WhatsApp"
              className="h-[420px] w-auto max-w-full object-cover sm:h-[480px] lg:h-[560px]"
            />
          </div>
        </section>

        {/* Ecommerce */}
        <section
          id="ecommerce"
          className="grid scroll-mt-24 items-stretch gap-6 lg:min-h-[420px] lg:grid-cols-2 lg:gap-16"
        >
          <div className="order-last flex items-center justify-center lg:order-first">
            <StoreMockup />
          </div>
          <div className="flex flex-col items-center justify-center gap-4 text-center lg:items-start lg:text-left">
            <span className="text-primary flex items-center gap-2 text-xs font-semibold tracking-widest uppercase">
              <ShoppingCart className="size-4" /> Ecommerce
            </span>
            <h2 className="font-[family-name:var(--font-display)] text-2xl font-semibold sm:text-3xl">
              Sua loja virtual pronta para vender todos os dias.
            </h2>
            <p className="text-muted-foreground text-base sm:text-lg">
              Criamos e-commerces rápidos, bonitos e fáceis de administrar, do catálogo ao checkout, para sua loja
              vender todos os dias enquanto você cuida do negócio.
            </p>
            <ul className="flex flex-col gap-3 text-left">
              {ECOMMERCE_FEATURES.map((feature) => (
                <li key={feature.title} className="flex items-start gap-3">
                  <span className="bg-primary/10 text-primary flex size-8 shrink-0 items-center justify-center rounded-lg">
                    <feature.icon className="size-4" />
                  </span>
                  <span className="text-sm">
                    <span className="font-semibold">{feature.title}</span>
                    <span className="text-muted-foreground">: {feature.description}</span>
                  </span>
                </li>
              ))}
            </ul>
            {/* Serviço à parte, contratado separadamente — não faz parte da loja. */}
            <div className="border-primary/40 bg-primary/5 flex w-full items-start gap-3 rounded-lg border border-dashed p-3 text-left">
              <span className="bg-primary/10 text-primary flex size-8 shrink-0 items-center justify-center rounded-lg">
                <Lightbulb className="size-4" />
              </span>
              <span className="text-sm">
                <span className="text-primary mb-0.5 block text-[11px] font-semibold tracking-widest uppercase">
                  Uma dica rápida
                </span>
                <span className="text-muted-foreground">
                  Você pode contratar nosso sistema de{" "}
                  <a href="#agentes-de-ia" className="text-foreground font-semibold hover:underline">
                    agentes de IA
                  </a>{" "}
                  para vendas no WhatsApp.
                </span>
              </span>
            </div>
            <Link href="/contato" className={cn(buttonVariants({ size: "lg" }), "mt-2 w-fit text-base")}>
              Quero minha loja virtual
            </Link>
          </div>
        </section>

        {/* Sites Web */}
        <section
          id="sites-web"
          className="grid scroll-mt-24 items-stretch gap-6 lg:min-h-[420px] lg:grid-cols-2 lg:gap-16"
        >
          <div className="order-last flex items-center justify-center">
            <WebsiteMockup />
          </div>
          <div className="flex flex-col items-center justify-center gap-4 text-center lg:items-start lg:text-left">
            <span className="text-primary flex items-center gap-2 text-xs font-semibold tracking-widest uppercase">
              <Globe className="size-4" /> Sites Web
            </span>
            <h2 className="font-[family-name:var(--font-display)] text-2xl font-semibold sm:text-3xl">
              Um site profissional que apresenta e vende a sua empresa.
            </h2>
            <p className="text-muted-foreground text-base sm:text-lg">
              Desenvolvemos sites institucionais e landing pages modernos, rápidos e fáceis de encontrar, para sua
              empresa causar uma ótima primeira impressão e gerar novos contatos todos os dias.
            </p>
            <ul className="flex flex-col gap-3 text-left">
              {WEBSITE_FEATURES.map((feature) => (
                <li key={feature.title} className="flex items-start gap-3">
                  <span className="bg-primary/10 text-primary flex size-8 shrink-0 items-center justify-center rounded-lg">
                    <feature.icon className="size-4" />
                  </span>
                  <span className="text-sm">
                    <span className="font-semibold">{feature.title}</span>
                    <span className="text-muted-foreground">: {feature.description}</span>
                  </span>
                </li>
              ))}
            </ul>
            <Link href="/contato" className={cn(buttonVariants({ size: "lg" }), "mt-2 w-fit text-base")}>
              Quero meu site
            </Link>
          </div>
        </section>

        {/* Softwares */}
        <section
          id="softwares"
          className="grid scroll-mt-24 items-stretch gap-6 lg:min-h-[420px] lg:grid-cols-2 lg:gap-16"
        >
          <div className="order-last flex items-center justify-center lg:order-first">
            <SoftwareMockup />
          </div>
          <div className="flex flex-col items-center justify-center gap-4 text-center lg:items-start lg:text-left">
            <span className="text-primary flex items-center gap-2 text-xs font-semibold tracking-widest uppercase">
              <Code2 className="size-4" /> Softwares
            </span>
            <h2 className="font-[family-name:var(--font-display)] text-2xl font-semibold sm:text-3xl">
              Software sob medida para a sua operação.
            </h2>
            <p className="text-muted-foreground text-base sm:text-lg">
              Do sistema interno à integração entre plataformas, desenvolvemos soluções que se encaixam no seu
              processo, com acompanhamento e evolução contínua depois da entrega.
            </p>
            <ul className="flex flex-col gap-3 text-left">
              {SOFTWARE_FEATURES.map((feature) => (
                <li key={feature.title} className="flex items-start gap-3">
                  <span className="bg-primary/10 text-primary flex size-8 shrink-0 items-center justify-center rounded-lg">
                    <feature.icon className="size-4" />
                  </span>
                  <span className="text-sm">
                    <span className="font-semibold">{feature.title}</span>
                    <span className="text-muted-foreground">: {feature.description}</span>
                  </span>
                </li>
              ))}
            </ul>
            <Link href="/contato" className={cn(buttonVariants({ size: "lg" }), "mt-2 w-fit text-base")}>
              Quero um software sob medida
            </Link>
          </div>
        </section>

        {/* Casos de sucesso */}
        <section id="cases" className="grid scroll-mt-24 items-center gap-6 lg:grid-cols-2 lg:gap-16">
          <div className="flex flex-col items-center gap-4 text-center lg:items-start lg:text-left">
            <span className="text-primary flex items-center gap-2 text-xs font-semibold tracking-widest uppercase">
              <Trophy className="size-4" /> Casos de sucesso
            </span>
            <h2 className="font-[family-name:var(--font-display)] text-2xl font-semibold sm:text-3xl">
              Clientes que já crescem com a Sturnus Flow
            </h2>
            <p className="text-muted-foreground text-base sm:text-lg">
              Conheça alguns dos projetos que desenvolvemos para nossos clientes.
            </p>
          </div>

          <div className="flex min-w-0 items-center justify-center">
            <SuccessCasesMarquee />
          </div>
        </section>

        {/* Integrações com terceiros */}
        <section className="grid items-stretch gap-6 lg:grid-cols-2 lg:gap-16">
          <div className="order-last flex min-w-0 items-center justify-center lg:order-first">
            <LogoMarquee />
          </div>
          <div className="flex flex-col items-center justify-center gap-4 text-center lg:items-start lg:text-left">
            <span className="text-primary flex items-center gap-2 text-xs font-semibold tracking-widest uppercase">
              <Plug className="size-4" /> Conecte sua operação
            </span>
            <h2 className="font-[family-name:var(--font-display)] text-2xl font-semibold sm:text-3xl">
              Integração com terceiros
            </h2>
            <p className="text-muted-foreground text-base sm:text-lg">
              A Sturnus Flow se integra perfeitamente às ferramentas que você já utiliza, conectando sua operação de
              forma simples e imediata.
            </p>
          </div>
        </section>

        {/* Sobre nós */}
        <section id="sobre" className="grid scroll-mt-24 items-center gap-6 lg:grid-cols-2 lg:gap-16">
          <div className="flex flex-col items-center gap-4 text-center lg:items-start lg:text-left">
            <span className="text-primary flex items-center gap-2 text-xs font-semibold tracking-widest uppercase">
              <Rocket className="size-4" /> Sobre nós
            </span>
            <h2 className="font-[family-name:var(--font-display)] text-2xl font-semibold sm:text-3xl">
              Grandes conquistas começam com boas conexões.
            </h2>
            <p className="text-muted-foreground text-base sm:text-lg">
              Para a Sturnus Flow, cada projeto é único. Não acreditamos em fórmulas prontas nem em relações
              puramente comerciais: queremos parceiros dispostos a transformar ideias em grandes resultados.
            </p>
            <p className="text-muted-foreground text-base sm:text-lg">
              Levamos cada entrega a sério, unindo comprometimento, agilidade nas tomadas de decisão e pontualidade
              rigorosa. Por trás de cada solução, existe uma equipe apaixonada, um ambiente dinâmico e um cuidado
              genuíno com todas as pessoas envolvidas no processo.
            </p>
            <p className="text-foreground text-base font-medium sm:text-lg">
              É assim que criamos soluções eficientes, marcantes e verdadeiramente diferentes.
            </p>
            <Link href="/contato" className={cn(buttonVariants({ size: "lg" }), "mt-2 w-fit text-base")}>
              Embarque com a gente
            </Link>
          </div>
          <Image
            src={embarcarImage}
            alt="Embarque na jornada Sturnus Flow"
            sizes="(min-width: 1024px) 50vw, 100vw"
            className="h-auto w-full shadow-2xl"
          />
        </section>
      </div>

      <SiteFooter />
    </div>
  );
}
