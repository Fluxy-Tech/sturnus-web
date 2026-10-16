"use client";

import { Fragment, useEffect, useMemo, useRef, useState } from "react";
import {
  BatteryFull,
  CalendarCheck,
  Camera,
  CheckCheck,
  ChevronLeft,
  CreditCard,
  Mic,
  Phone,
  Plus,
  SendHorizontal,
  Signal,
  Video,
  Wifi,
} from "lucide-react";
import { useInView, usePrefersReducedMotion } from "@/lib/use-in-view";
import { cn } from "@/lib/utils";

/// Recursos do agente que cada mensagem do roteiro demonstra — a seção usa
/// isso pra destacar o item da lista que está "acontecendo" na conversa.
export type AgentFeatureId = "always-on" | "qualify" | "knowledge" | "checkout" | "schedule" | "handoff";

type ChatMessage = {
  from: "user" | "agent" | "human";
  text: string;
  time: string;
  feature?: AgentFeatureId;
  /// Horários oferecidos pelo agente; `picked` acende depois que o cliente escolhe.
  slots?: { options: string[]; picked: string };
  /// Cartão anexado à mensagem: convite de agenda ou link de pagamento.
  card?: { kind: "event" | "payment"; title: string; lines: string[] };
};

export type ChatScript = {
  id: string;
  /// Rótulo do botão que escolhe este roteiro.
  label: string;
  contact: { name: string; initial: string; color: string };
  messages: ChatMessage[];
};

/// Roteiros da demonstração, um por tipo de negócio. `**texto**` vira negrito.
/// Empresas e pessoas são fictícias.
export const CHAT_SCRIPTS: ChatScript[] = [
  {
    id: "loja",
    label: "Loja virtual",
    contact: { name: "Empório Cerrado", initial: "E", color: "#7a1f3d" },
    messages: [
      { from: "user", time: "23:12", text: "Oi! Vocês têm vinho tinto até R$ 150 pra presente?" },
      {
        from: "agent",
        time: "23:12",
        feature: "always-on",
        text: "Oi! Sou a **Lia**, assistente do **Empório Cerrado**. Mesmo às 23h, tô por aqui.",
      },
      {
        from: "agent",
        time: "23:12",
        feature: "knowledge",
        text: "Separei três que fazem sucesso:\n• Malbec Reserva, R$ 119\n• Tempranillo Crianza, R$ 138\n• Carménère Gran Reserva, R$ 149",
      },
      { from: "user", time: "23:13", text: "O Malbec! Entrega amanhã cedo?" },
      {
        from: "agent",
        time: "23:13",
        feature: "knowledge",
        text: "Entrega sim, a partir das 9h. Quer embalagem de presente? É **cortesia**.",
      },
      { from: "user", time: "23:13", text: "Quero sim, pode fechar" },
      {
        from: "agent",
        time: "23:14",
        feature: "checkout",
        text: "Pedido montado. É só pagar por aqui:",
        card: { kind: "payment", title: "Malbec Reserva + presente", lines: ["R$ 119,00 · Pix ou cartão", "Entrega amanhã, 9h às 12h"] },
      },
      { from: "user", time: "23:15", text: "Paguei no Pix" },
      {
        from: "agent",
        time: "23:15",
        feature: "checkout",
        text: "Pagamento confirmado! Te aviso por aqui quando o pedido sair pra entrega. Boa noite!",
      },
    ],
  },
  {
    id: "clinica",
    label: "Clínica",
    contact: { name: "Clínica Aurora", initial: "A", color: "#0f766e" },
    messages: [
      { from: "user", time: "07:42", text: "Bom dia, queria marcar consulta com dermatologista" },
      {
        from: "agent",
        time: "07:42",
        feature: "qualify",
        text: "Bom dia! Sou a **Lia**, assistente da **Clínica Aurora**.\n\nA consulta seria particular ou pelo convênio?",
      },
      { from: "user", time: "07:43", text: "Convênio Unimed" },
      {
        from: "agent",
        time: "07:43",
        feature: "knowledge",
        text: "Atendemos Unimed, sem custo adicional. A consulta dura cerca de 30 minutos.",
      },
      {
        from: "agent",
        time: "07:43",
        feature: "schedule",
        text: "Tenho estes horários livres na quinta:",
        slots: { options: ["08:30", "10:00", "15:30"], picked: "10:00" },
      },
      { from: "user", time: "07:44", text: "10:00" },
      {
        from: "agent",
        time: "07:44",
        feature: "schedule",
        text: "Agendado! Te lembro um dia antes por aqui.",
        card: { kind: "event", title: "Consulta dermatológica", lines: ["Quinta, 10:00 · 30 min", "Dra. Helena Prado"] },
      },
      { from: "user", time: "07:45", text: "Preciso levar algum exame?" },
      {
        from: "agent",
        time: "07:45",
        feature: "handoff",
        text: "Vou te passar pra **Carla**, da recepção. Ela já está com todo o histórico da conversa.",
      },
      {
        from: "human",
        time: "07:46",
        feature: "handoff",
        text: "**Carla**:\nOi! Só a carteirinha e um documento com foto. Até quinta!",
      },
    ],
  },
  {
    id: "imobiliaria",
    label: "Imobiliária",
    contact: { name: "Morada Imóveis", initial: "M", color: "#9a5b13" },
    messages: [
      { from: "user", time: "21:05", text: "Oi, o apê de 3 quartos do Instagram ainda está disponível?" },
      {
        from: "agent",
        time: "21:05",
        feature: "qualify",
        text: "Oi! Sou o **Téo**, da **Morada Imóveis**. Está sim!\n\nVocê pensa em comprar ou alugar, e em qual faixa de valor?",
      },
      { from: "user", time: "21:06", text: "Comprar, até 650 mil" },
      {
        from: "agent",
        time: "21:06",
        feature: "knowledge",
        text: "Cabe certinho: **R$ 620 mil**, 3 quartos com suíte, 2 vagas e 98 m². Aceita financiamento e FGTS.",
      },
      { from: "user", time: "21:07", text: "Dá pra visitar no sábado?" },
      {
        from: "agent",
        time: "21:07",
        feature: "schedule",
        text: "Claro! Sábado tenho:",
        slots: { options: ["09:00", "11:00", "14:00"], picked: "11:00" },
      },
      { from: "user", time: "21:07", text: "11h" },
      {
        from: "agent",
        time: "21:08",
        feature: "schedule",
        text: "Visita marcada.",
        card: { kind: "event", title: "Visita: apê 3 quartos", lines: ["Sábado, 11:00", "Com o corretor Rafael"] },
      },
      {
        from: "agent",
        time: "21:08",
        feature: "handoff",
        text: "Vou te apresentar o **Rafael**, que vai te receber. Ele já sabe tudo o que você procura.",
      },
      {
        from: "human",
        time: "21:09",
        feature: "handoff",
        text: "**Rafael**:\nOlá! Separei mais duas opções na sua faixa pra ver no sábado. Até lá!",
      },
    ],
  },
];

type Step =
  | { kind: "wait"; ms: number }
  | { kind: "typing" }
  | { kind: "show" }
  | { kind: "compose"; text: string }
  | { kind: "send" }
  | { kind: "reset" };

const TYPE_DELAY_MS = 38;

/// Transforma o roteiro numa fila de passos: o cliente digita na caixa de
/// texto e envia; o agente fica "digitando…" por um tempo proporcional ao
/// tamanho da resposta antes dela aparecer.
function buildSteps(messages: ChatMessage[]): Step[] {
  return [
    { kind: "wait", ms: 600 },
    ...messages.flatMap((message): Step[] => {
      if (message.from === "user") {
        return [{ kind: "compose", text: message.text }, { kind: "send" }, { kind: "wait", ms: 650 }];
      }
      const thinking = Math.min(2200, 700 + message.text.length * 12);
      return [{ kind: "typing" }, { kind: "wait", ms: thinking }, { kind: "show" }, { kind: "wait", ms: 1100 }];
    }),
    { kind: "wait", ms: 5000 },
    { kind: "reset" },
  ];
}

function renderRichText(text: string) {
  return text.split(/(\*\*[^*]+\*\*)/g).map((part, i) =>
    part.startsWith("**") ? (
      <strong key={i} className="font-semibold">
        {part.slice(2, -2)}
      </strong>
    ) : (
      <Fragment key={i}>{part}</Fragment>
    ),
  );
}

function TypingBubble() {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-1 flex w-fit items-center gap-1 rounded-xl rounded-tl-sm bg-white px-3.5 py-3 shadow-[0_1px_0.5px_rgb(11_20_26/0.13)] duration-300">
      {[0, 150, 300].map((delay) => (
        <span
          key={delay}
          className="animate-typing-dot size-1.5 rounded-full bg-neutral-400"
          style={{ animationDelay: `${delay}ms` }}
        />
      ))}
    </div>
  );
}

function MessageBubble({ message, read, settled }: { message: ChatMessage; read: boolean; settled: boolean }) {
  const outgoing = message.from === "user";
  const CardIcon = message.card?.kind === "payment" ? CreditCard : CalendarCheck;

  return (
    <div
      className={cn(
        "animate-in fade-in slide-in-from-bottom-2 flex max-w-[85%] flex-col gap-2 px-2.5 pt-1.5 pb-1 text-[13px] leading-snug text-neutral-900 shadow-[0_1px_0.5px_rgb(11_20_26/0.13)] duration-300",
        outgoing ? "self-end rounded-xl rounded-tr-sm bg-[#d9fdd3]" : "self-start rounded-xl rounded-tl-sm bg-white",
      )}
    >
      <p className="whitespace-pre-line">{renderRichText(message.text)}</p>

      {message.slots && (
        <div className="flex gap-1.5">
          {message.slots.options.map((slot) => (
            <span
              key={slot}
              className={cn(
                "flex-1 rounded-md border py-1 text-center text-[12px] font-medium tabular-nums transition-colors duration-500",
                settled && slot === message.slots?.picked
                  ? "border-[#1e56e9] bg-[#1e56e9] text-white"
                  : "border-[#1e56e9]/30 text-[#1e56e9]",
              )}
            >
              {slot}
            </span>
          ))}
        </div>
      )}

      {message.card && (
        <div className="flex items-center gap-2.5 rounded-lg border border-[#1e56e9]/15 bg-[#1e56e9]/5 p-2">
          <span className="flex size-8 shrink-0 items-center justify-center rounded-md bg-[#1e56e9] text-white">
            <CardIcon className="size-4" />
          </span>
          <span className="flex min-w-0 flex-col">
            <span className="truncate text-[12px] font-semibold">{message.card.title}</span>
            {message.card.lines.map((line) => (
              <span key={line} className="text-[11px] text-neutral-600 tabular-nums">
                {line}
              </span>
            ))}
          </span>
        </div>
      )}

      <span className="-mt-1 flex items-center justify-end gap-1 self-end text-[10px] text-neutral-500 tabular-nums">
        {message.time}
        {outgoing && (
          <CheckCheck className={cn("size-3.5 transition-colors duration-500", read ? "text-[#53bdeb]" : "text-neutral-400")} />
        )}
      </span>
    </div>
  );
}

/// Celular montado em CSS com uma conversa de WhatsApp acontecendo em tempo
/// real entre um cliente e o agente de IA. Só roda enquanto está na tela; com
/// "reduzir movimento" ativo mostra a conversa inteira, parada. Trocar de
/// roteiro remonta o componente (key) e a conversa recomeça do zero.
export function AgentChatDemo({
  script,
  onFeatureChange,
}: {
  script: ChatScript;
  onFeatureChange?: (feature: AgentFeatureId | null) => void;
}) {
  const rootRef = useRef<HTMLDivElement>(null);
  const chatRef = useRef<HTMLDivElement>(null);
  const inView = useInView(rootRef, { threshold: 0.25 });
  const reducedMotion = usePrefersReducedMotion();
  const steps = useMemo(() => buildSteps(script.messages), [script]);

  const [cursor, setCursor] = useState(0);
  const [shown, setShown] = useState(0);
  const [typing, setTyping] = useState(false);
  const [draft, setDraft] = useState("");

  const running = inView && !reducedMotion;
  const visibleCount = reducedMotion ? script.messages.length : shown;
  const messages = script.messages.slice(0, visibleCount);

  // Motor do roteiro: cada passo agenda o próximo. Sair da tela limpa o
  // timer e a conversa continua de onde parou quando o visitante voltar.
  useEffect(() => {
    if (!running) return;
    const step = steps[cursor];
    const advance = () => setCursor((c) => c + 1);
    let timer: ReturnType<typeof setTimeout>;

    switch (step.kind) {
      case "wait":
        timer = setTimeout(advance, step.ms);
        break;
      case "typing":
        timer = setTimeout(() => {
          setTyping(true);
          advance();
        }, 0);
        break;
      case "show":
        timer = setTimeout(() => {
          setTyping(false);
          setShown((s) => s + 1);
          advance();
        }, 0);
        break;
      case "compose":
        timer =
          draft.length < step.text.length
            ? setTimeout(() => setDraft(step.text.slice(0, draft.length + 1)), TYPE_DELAY_MS)
            : setTimeout(advance, 450);
        break;
      case "send":
        timer = setTimeout(() => {
          setDraft("");
          setShown((s) => s + 1);
          advance();
        }, 0);
        break;
      case "reset":
        timer = setTimeout(() => {
          setShown(0);
          setTyping(false);
          setCursor(0);
        }, 0);
        break;
    }

    return () => clearTimeout(timer);
  }, [running, cursor, draft, steps]);

  // Rola só a área da conversa (scrollIntoView rolaria a página inteira).
  useEffect(() => {
    const el = chatRef.current;
    if (!el || reducedMotion) return;
    el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
  }, [shown, typing, reducedMotion]);

  const activeFeature = reducedMotion ? null : ([...messages].reverse().find((m) => m.feature)?.feature ?? null);
  useEffect(() => {
    onFeatureChange?.(activeFeature);
  }, [activeFeature, onFeatureChange]);

  const lastUserIndex = messages.findLastIndex((m) => m.from === "user");

  return (
    <figure ref={rootRef} data-ui className="relative flex justify-center">
      <figcaption className="sr-only">
        Exemplo de conversa no WhatsApp entre um cliente e o agente de IA de {script.contact.name}:{" "}
        {script.messages
          .map((m) => `${m.from === "human" ? "" : m.from === "user" ? "Cliente: " : "Agente: "}${m.text.replaceAll("**", "")}`)
          .join(" ")}
      </figcaption>

      <div
        aria-hidden
        className="relative h-[540px] w-[290px] rounded-[3rem] bg-neutral-900 p-2.5 ring-1 ring-black/10 sm:h-[600px] sm:w-[330px]"
      >
        <div className="relative flex h-full flex-col overflow-hidden rounded-[2.4rem] bg-[#efeae2] font-sans">
          {/* Barra de status + dynamic island */}
          <div className="relative flex items-center justify-between bg-[#f6f5f3] px-7 pt-3.5 pb-1 text-[12px] font-semibold text-neutral-900 tabular-nums">
            <span>{script.messages[0].time}</span>
            <span className="absolute top-2.5 left-1/2 h-6 w-24 -translate-x-1/2 rounded-full bg-neutral-900" />
            <span className="flex items-center gap-1">
              <Signal className="size-3.5" />
              <Wifi className="size-3.5" />
              <BatteryFull className="size-4" />
            </span>
          </div>

          {/* Cabeçalho do contato */}
          <div className="flex items-center gap-2 border-b border-black/5 bg-[#f6f5f3] px-2 pt-1 pb-2">
            <ChevronLeft className="size-5 shrink-0 text-neutral-800" />
            <span
              className="flex size-9 shrink-0 items-center justify-center rounded-full text-[15px] font-semibold text-white"
              style={{ backgroundColor: script.contact.color }}
            >
              {script.contact.initial}
            </span>
            <span className="flex min-w-0 flex-1 flex-col">
              <span className="truncate text-[14px] leading-tight font-semibold text-neutral-900">
                {script.contact.name}
              </span>
              <span
                className={cn(
                  "truncate text-[11px] leading-tight transition-colors",
                  typing ? "font-medium text-[#128a4e]" : "text-neutral-600",
                )}
              >
                {typing ? "digitando…" : "online"}
              </span>
            </span>
            <Video className="size-5 shrink-0 text-neutral-700" />
            <Phone className="mr-1 size-4 shrink-0 text-neutral-700" />
          </div>

          {/* Conversa */}
          <div
            ref={chatRef}
            className="bg-chat-wallpaper flex flex-1 flex-col gap-1.5 overflow-y-auto px-3 py-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            <span className="mx-auto mb-1 rounded-md bg-white/90 px-2.5 py-0.5 text-[11px] text-neutral-600 shadow-[0_1px_0.5px_rgb(11_20_26/0.13)]">
              Hoje
            </span>
            {messages.map((message, index) => (
              <MessageBubble
                key={index}
                message={message}
                read={index < lastUserIndex || (index === lastUserIndex && (typing || index < messages.length - 1))}
                settled={index < messages.length - 1}
              />
            ))}
            {typing && <TypingBubble />}
          </div>

          {/* Caixa de texto: o cliente "digita" aqui antes de enviar. */}
          <div className="flex items-end gap-1.5 bg-[#f6f5f3] px-2 pt-2 pb-5">
            <Plus className="mb-1.5 size-5 shrink-0 text-neutral-700" />
            <div className="flex min-h-8 min-w-0 flex-1 items-center rounded-2xl border border-black/5 bg-white px-3 py-1.5 text-[13px] leading-snug">
              {draft ? (
                <span className="text-neutral-900">
                  {draft}
                  <span className="ml-px inline-block h-3.5 w-px animate-pulse bg-[#1e56e9] align-middle" />
                </span>
              ) : (
                <span className="text-neutral-400">Mensagem</span>
              )}
            </div>
            {draft ? (
              <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-[#1daa61] text-white">
                <SendHorizontal className="size-4" />
              </span>
            ) : (
              <span className="flex shrink-0 items-center gap-2 pb-1.5 text-neutral-700">
                <Camera className="size-5" />
                <Mic className="size-5" />
              </span>
            )}
          </div>
        </div>
      </div>
    </figure>
  );
}
