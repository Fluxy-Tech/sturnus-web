import { CookieConsentBanner } from "@/components/site/cookie-consent-banner";
import { LeadForm } from "@/components/site/lead-form";
import { SiteFooter } from "@/components/site/site-footer";
import { SiteHeader } from "@/components/site/site-header";

const HIGHLIGHTS = ["Agendamento no seu horário", "Retorno em até 1 dia útil", "Dados protegidos pela LGPD"];

/// Tela de contato: campo azul-marinho com o convite à esquerda e o
/// formulário de captação sobre papel à direita, no mesmo sistema de
/// capítulos da home.
export function ContactPage() {
  return (
    <div className="site flex min-h-svh flex-col">
      <SiteHeader />
      <CookieConsentBanner />

      <main data-chapter="navy" className="grid flex-1 lg:grid-cols-2">
        <div className="bg-navy text-paper flex flex-col justify-between gap-12 px-4 pt-[calc(72px+10svh)] pb-12 sm:px-8 lg:min-h-[100svh] lg:pl-[8.33vw]">
          <div className="flex max-w-[34rem] flex-col gap-8">
            <h1 className="display text-[13vw] lg:text-[clamp(3.5rem,6vw,6rem)]">
              Vamos
              <br />
              conversar?
            </h1>
            <p className="text-xl leading-relaxed">
              Agentes de IA, e-commerces, sites ou softwares sob medida: conte quem você é e um especialista entra em
              contato para entender o seu projeto.
            </p>
          </div>
          <ul className="flex flex-col gap-2 text-lg">
            {HIGHLIGHTS.map((text) => (
              <li key={text}>{text}</li>
            ))}
          </ul>
        </div>

        <div className="bg-sky flex items-center justify-center px-4 py-12 sm:px-8 lg:pt-[calc(72px+4svh)]">
          <div className="w-full max-w-xl">
            <LeadForm />
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
