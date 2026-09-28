"use client";

import { type FormEvent, useState } from "react";
import Link from "next/link";
import { CalendarCheck, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PhoneInput } from "@/components/ui/phone-input";
import { api, errorMessage } from "@/lib/api";

const EMPTY_FORM = { name: "", company: "", phone: "55", email: "", website: "" };

/// Formulário de captação da seção "Contato" — no lugar do botão de WhatsApp,
/// grava o lead direto no CRM do admin.
export function LeadForm() {
  const [form, setForm] = useState(EMPTY_FORM);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  function update<K extends keyof typeof EMPTY_FORM>(key: K, value: string) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError(null);
    // Só o DDI preenchido = telefone vazio.
    if (form.phone.replace(/\D/g, "").length < 10) {
      setError("Informe um telefone válido.");
      return;
    }
    setLoading(true);
    try {
      await api.post("/api/leads", form);
      setSent(true);
      setForm(EMPTY_FORM);
    } catch (err) {
      setError(errorMessage(err, "Não foi possível enviar agora. Tente novamente em instantes."));
    } finally {
      setLoading(false);
    }
  }

  if (sent) {
    return (
      <div className="bg-card text-card-foreground border-border flex w-full flex-col items-center gap-3 rounded-none border p-8 text-center shadow-xl">
        <CheckCircle2 className="text-success size-12" />
        <h3 className="font-[family-name:var(--font-display)] text-xl font-semibold">Solicitação recebida!</h3>
        <p className="text-muted-foreground text-sm">
          Obrigado pelo interesse. Um de nossos especialistas vai entrar em contato em breve para agendar a conversa.
        </p>
        <Button variant="outline" size="sm" className="mt-2" onClick={() => setSent(false)}>
          Enviar outra solicitação
        </Button>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-card text-card-foreground border-border flex w-full flex-col gap-4 rounded-none border p-6 text-left shadow-xl sm:p-8"
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="lead-name">Nome</Label>
          <Input
            id="lead-name"
            required
            autoComplete="name"
            placeholder="Seu nome"
            value={form.name}
            onChange={(e) => update("name", e.target.value)}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="lead-company">Empresa</Label>
          <Input
            id="lead-company"
            required
            autoComplete="organization"
            placeholder="Nome da empresa"
            value={form.company}
            onChange={(e) => update("company", e.target.value)}
          />
        </div>
      </div>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="lead-phone">Telefone</Label>
        <PhoneInput id="lead-phone" value={form.phone} onChange={(value) => update("phone", value)} />
      </div>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="lead-email">E-mail</Label>
        <Input
          id="lead-email"
          type="email"
          required
          autoComplete="email"
          placeholder="voce@empresa.com"
          value={form.email}
          onChange={(e) => update("email", e.target.value)}
        />
      </div>

      {/* Honeypot anti-spam: invisível pra pessoas, bots costumam preencher. */}
      <input
        type="text"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="hidden"
        value={form.website}
        onChange={(e) => update("website", e.target.value)}
      />

      {error && <p className="text-destructive text-sm">{error}</p>}

      <Button type="submit" size="lg" disabled={loading} className="mt-1 text-base">
        <CalendarCheck className="size-4" /> {loading ? "Enviando..." : "Solicitar agendamento"}
      </Button>
      <p className="text-muted-foreground text-center text-xs">
        Ao enviar, você concorda com a nossa{" "}
        <Link href="/politica-de-privacidade" className="text-primary hover:underline">
          política de privacidade
        </Link>
        .
      </p>
    </form>
  );
}
