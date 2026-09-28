import { CalendarCheck, Clock, ShieldCheck } from "lucide-react";
import { CookieConsentBanner } from "@/components/site/cookie-consent-banner";
import { LeadForm } from "@/components/site/lead-form";
import { SiteFooter } from "@/components/site/site-footer";
import { SiteHeader } from "@/components/site/site-header";

const HIGHLIGHTS = [
  { icon: CalendarCheck, text: "Agendamento no seu horário" },
  { icon: Clock, text: "Retorno em até 1 dia útil" },
  { icon: ShieldCheck, text: "Dados protegidos pela LGPD" },
];

/// Tela de contato: texto e "modal" de captação (card do LeadForm)
/// centralizados, sobre fundo branco.
export function ContactPage() {
  return (
    <div className="bg-dot-grid flex min-h-screen flex-col">
      <SiteHeader />
      <CookieConsentBanner />

      <main className="bg-background text-foreground relative flex flex-1 items-center justify-center overflow-hidden px-4 pt-[65px]">
        {/* Manchas de azul claro desfocadas nos cantos da tela. */}
        <div className="bg-primary/20 pointer-events-none absolute -top-32 -left-32 size-[28rem] rounded-full blur-3xl" />
        <div className="pointer-events-none absolute -top-24 -right-40 size-96 rounded-full bg-sky-300/25 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-40 -left-24 size-96 rounded-full bg-sky-300/25 blur-3xl" />
        <div className="bg-primary/20 pointer-events-none absolute -right-32 -bottom-32 size-[28rem] rounded-full blur-3xl" />

        <div className="relative flex w-full max-w-xl flex-col items-center gap-6 py-16 text-center">
          <div className="flex flex-col items-center gap-4">
            <span className="text-primary text-xs font-semibold tracking-widest uppercase">Contato</span>
            <h1 className="font-[family-name:var(--font-display)] text-3xl font-bold sm:text-4xl">
              Fale com um de nossos especialistas
            </h1>
            <ul className="flex flex-wrap justify-center gap-2">
              {HIGHLIGHTS.map(({ icon: Icon, text }) => (
                <li
                  key={text}
                  className="bg-primary/10 text-primary flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium"
                >
                  <Icon className="size-3.5" /> {text}
                </li>
              ))}
            </ul>
          </div>

          <LeadForm />

          <p className="text-muted-foreground text-sm sm:text-base">
            Agentes de IA, e-commerces, sites ou softwares sob medida: conte quem você é e nossa equipe entra em
            contato para entender o seu projeto.
          </p>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
