"use client";

import { type FormEvent, useEffect, useState } from "react";
import useSWR from "swr";
import { toast } from "sonner";
import { CalendarPlus, Mail, MessageCircle, Trash2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PhoneInput } from "@/components/ui/phone-input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sheet, SheetBody, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Textarea } from "@/components/ui/textarea";
import { api, errorMessage } from "@/lib/api";
import { EVENT_STATUS_CHIP_CLASSES, formatDateTime, formatTime, whatsappUrl } from "@/lib/format";
import { cn } from "@/lib/utils";
import { EVENT_STATUS_LABELS, type CrmStage, type LeadDetail, type LeadEvent } from "@/types/domain";
import { EventFormDialog } from "./event-form-dialog";

interface LeadSheetProps {
  leadId: string | null;
  onOpenChange: (open: boolean) => void;
  /// Chamado depois de qualquer alteração — a tela de trás revalida.
  onChanged: () => void;
}

/// Detalhe do lead: edição dos dados, estágio no CRM, anotações e agenda.
export function LeadSheet({ leadId, onOpenChange, onChanged }: LeadSheetProps) {
  const { data: lead, mutate } = useSWR<LeadDetail>(leadId ? `/api/leads/${leadId}` : null);
  const { data: board } = useSWR<{ stages: CrmStage[] }>(leadId ? "/api/crm" : null);
  const [form, setForm] = useState({ name: "", company: "", phone: "", email: "", notes: "", stageId: "" });
  const [saving, setSaving] = useState(false);
  const [eventDialog, setEventDialog] = useState<{ open: boolean; event: LeadEvent | null }>({
    open: false,
    event: null,
  });

  useEffect(() => {
    if (!lead) return;
    setForm({
      name: lead.name,
      company: lead.company,
      phone: lead.phone,
      email: lead.email,
      notes: lead.notes ?? "",
      stageId: lead.stageId ?? "",
    });
  }, [lead]);

  function update<K extends keyof typeof form>(key: K, value: string) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  async function handleSave(e: FormEvent) {
    e.preventDefault();
    if (!lead) return;
    setSaving(true);
    try {
      await api.patch(`/api/leads/${lead.id}`, {
        name: form.name,
        company: form.company,
        phone: form.phone,
        email: form.email,
        notes: form.notes.trim() || null,
        ...(form.stageId ? { stageId: form.stageId } : {}),
      });
      toast.success("Lead atualizado.");
      await mutate();
      onChanged();
    } catch (err) {
      toast.error(errorMessage(err, "Não foi possível salvar o lead."));
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!lead) return;
    try {
      await api.delete(`/api/leads/${lead.id}`);
      toast.success("Lead excluído.");
      onChanged();
      onOpenChange(false);
    } catch (err) {
      toast.error(errorMessage(err, "Não foi possível excluir o lead."));
    }
  }

  return (
    <Sheet open={leadId !== null} onOpenChange={onOpenChange}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>{lead?.name ?? "Carregando…"}</SheetTitle>
          <SheetDescription>
            {lead ? `${lead.company} · recebido em ${formatDateTime(lead.createdAt)}` : " "}
          </SheetDescription>
          {lead && (
            <div className="mt-2 flex flex-wrap gap-2">
              <a
                href={whatsappUrl(lead.phone)}
                target="_blank"
                rel="noreferrer"
                className={buttonVariants({ size: "sm", variant: "outline" })}
              >
                <MessageCircle className="size-4" /> WhatsApp
              </a>
              <a href={`mailto:${lead.email}`} className={buttonVariants({ size: "sm", variant: "outline" })}>
                <Mail className="size-4" /> E-mail
              </a>
              <Button size="sm" onClick={() => setEventDialog({ open: true, event: null })}>
                <CalendarPlus className="size-4" /> Agendar
              </Button>
            </div>
          )}
        </SheetHeader>

        <SheetBody>
          {!lead ? (
            <p className="text-muted-foreground text-sm">Carregando…</p>
          ) : (
            <div className="flex flex-col gap-8">
              <form className="flex flex-col gap-4" onSubmit={handleSave}>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="flex flex-col gap-1.5">
                    <Label htmlFor="lead-name">Nome</Label>
                    <Input id="lead-name" required value={form.name} onChange={(e) => update("name", e.target.value)} />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <Label htmlFor="lead-company">Empresa</Label>
                    <Input
                      id="lead-company"
                      required
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
                    value={form.email}
                    onChange={(e) => update("email", e.target.value)}
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label>Estágio no CRM</Label>
                  <Select value={form.stageId} onValueChange={(value) => update("stageId", value)}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Sem estágio" />
                    </SelectTrigger>
                    <SelectContent>
                      {(board?.stages ?? []).map((stage) => (
                        <SelectItem key={stage.id} value={stage.id}>
                          {stage.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="lead-notes">Anotações</Label>
                  <Textarea
                    id="lead-notes"
                    rows={4}
                    placeholder="Contexto da negociação, dores do cliente, próximos passos…"
                    value={form.notes}
                    onChange={(e) => update("notes", e.target.value)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button type="button" variant="ghost" size="sm" className="text-destructive">
                        <Trash2 className="size-4" /> Excluir lead
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Excluir o lead &quot;{lead.name}&quot;?</AlertDialogTitle>
                        <AlertDialogDescription>
                          Os eventos da agenda vinculados a ele também são excluídos. Esta ação não pode ser desfeita.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction variant="destructive" onClick={handleDelete}>
                          Excluir
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                  <Button type="submit" disabled={saving}>
                    {saving ? "Salvando..." : "Salvar alterações"}
                  </Button>
                </div>
              </form>

              <section className="flex flex-col gap-3">
                <h3 className="text-sm font-semibold">Agenda</h3>
                {lead.events.length === 0 ? (
                  <p className="text-muted-foreground text-sm">Nenhum evento com este lead ainda.</p>
                ) : (
                  <ul className="flex flex-col gap-2">
                    {lead.events.map((event) => (
                      <li key={event.id}>
                        <button
                          type="button"
                          onClick={() => setEventDialog({ open: true, event })}
                          className="border-border hover:bg-muted/40 flex w-full items-center justify-between gap-3 rounded-lg border p-3 text-left"
                        >
                          <div className="min-w-0">
                            <p className="truncate text-sm font-medium">{event.title}</p>
                            <p className="text-muted-foreground text-xs">
                              {formatDateTime(event.startsAt)} – {formatTime(event.endsAt)}
                            </p>
                          </div>
                          <span
                            className={cn(
                              "shrink-0 rounded px-2 py-0.5 text-[11px] font-medium",
                              EVENT_STATUS_CHIP_CLASSES[event.status],
                            )}
                          >
                            {EVENT_STATUS_LABELS[event.status]}
                          </span>
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </section>
            </div>
          )}
        </SheetBody>

        <EventFormDialog
          open={eventDialog.open}
          onOpenChange={(open) => setEventDialog((current) => ({ ...current, open }))}
          event={eventDialog.event}
          defaultLeadId={leadId}
          onSaved={() => {
            void mutate();
            onChanged();
          }}
        />
      </SheetContent>
    </Sheet>
  );
}
