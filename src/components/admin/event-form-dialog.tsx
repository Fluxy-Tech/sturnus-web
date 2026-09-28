"use client";

import { type FormEvent, useEffect, useState } from "react";
import useSWR from "swr";
import { toast } from "sonner";
import { Trash2 } from "lucide-react";
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
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { api, errorMessage } from "@/lib/api";
import { fromDateTimeInputs, toDateInput, toTimeInput } from "@/lib/format";
import { EVENT_STATUS_LABELS, type EventStatus, type Lead, type LeadEvent } from "@/types/domain";

/// Radix Select não aceita value "" — "none" = evento sem lead.
const NO_LEAD = "none";
const DEFAULT_DURATION_MIN = 60;

interface EventFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /// Presente = edição; ausente = criação.
  event?: LeadEvent | null;
  defaultDate?: Date | null;
  defaultLeadId?: string | null;
  onSaved: () => void;
}

function initialState(event: LeadEvent | null | undefined, defaultDate?: Date | null, defaultLeadId?: string | null) {
  if (event) {
    const start = new Date(event.startsAt);
    const end = new Date(event.endsAt);
    return {
      title: event.title,
      leadId: event.leadId ?? NO_LEAD,
      date: toDateInput(start),
      startTime: toTimeInput(start),
      endTime: toTimeInput(end),
      status: event.status,
      description: event.description ?? "",
    };
  }
  // Sem data: próxima hora cheia.
  const start = defaultDate ? new Date(defaultDate) : new Date();
  if (!defaultDate) start.setHours(start.getHours() + 1, 0, 0, 0);
  const end = new Date(start.getTime() + DEFAULT_DURATION_MIN * 60_000);
  return {
    title: "Reunião de apresentação",
    leadId: defaultLeadId ?? NO_LEAD,
    date: toDateInput(start),
    startTime: toTimeInput(start),
    endTime: toTimeInput(end),
    status: "scheduled" as EventStatus,
    description: "",
  };
}

export function EventFormDialog({ open, onOpenChange, event, defaultDate, defaultLeadId, onSaved }: EventFormDialogProps) {
  const { data: leads } = useSWR<Lead[]>(open ? "/api/leads" : null);
  const [form, setForm] = useState(() => initialState(event, defaultDate, defaultLeadId));
  const [saving, setSaving] = useState(false);

  // Reabre sempre com os dados do evento/slot clicado.
  useEffect(() => {
    if (open) setForm(initialState(event, defaultDate, defaultLeadId));
  }, [open, event, defaultDate, defaultLeadId]);

  function update<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const startsAt = fromDateTimeInputs(form.date, form.startTime);
    const endsAt = fromDateTimeInputs(form.date, form.endTime);
    if (endsAt <= startsAt) {
      toast.error("O horário de término precisa ser depois do início.");
      return;
    }

    const payload = {
      title: form.title,
      leadId: form.leadId === NO_LEAD ? null : form.leadId,
      startsAt: startsAt.toISOString(),
      endsAt: endsAt.toISOString(),
      status: form.status,
      description: form.description.trim() || null,
    };

    setSaving(true);
    try {
      if (event) {
        await api.patch(`/api/events/${event.id}`, payload);
        toast.success("Evento atualizado.");
      } else {
        await api.post("/api/events", payload);
        toast.success("Evento criado.");
      }
      onSaved();
      onOpenChange(false);
    } catch (err) {
      toast.error(errorMessage(err, "Não foi possível salvar o evento."));
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!event) return;
    try {
      await api.delete(`/api/events/${event.id}`);
      toast.success("Evento excluído.");
      onSaved();
      onOpenChange(false);
    } catch (err) {
      toast.error(errorMessage(err, "Não foi possível excluir o evento."));
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>{event ? "Editar evento" : "Novo evento"}</DialogTitle>
          <DialogDescription>Reuniões, ligações e follow-ups com os leads.</DialogDescription>
        </DialogHeader>

        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="event-title">Título</Label>
            <Input id="event-title" required value={form.title} onChange={(e) => update("title", e.target.value)} />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label>Lead</Label>
            <Select value={form.leadId} onValueChange={(value) => update("leadId", value)}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Selecione um lead" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={NO_LEAD}>Sem lead vinculado</SelectItem>
                {(leads ?? []).map((lead) => (
                  <SelectItem key={lead.id} value={lead.id}>
                    {lead.name} · {lead.company}
                  </SelectItem>
                ))}
                {/* Lead do evento ainda carregando: mantém o valor visível. */}
                {!leads && form.leadId !== NO_LEAD && (
                  <SelectItem value={form.leadId}>{event?.lead?.name ?? "Carregando…"}</SelectItem>
                )}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="event-date">Data</Label>
              <Input
                id="event-date"
                type="date"
                required
                value={form.date}
                onChange={(e) => update("date", e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="event-start">Início</Label>
              <Input
                id="event-start"
                type="time"
                required
                value={form.startTime}
                onChange={(e) => update("startTime", e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="event-end">Término</Label>
              <Input
                id="event-end"
                type="time"
                required
                value={form.endTime}
                onChange={(e) => update("endTime", e.target.value)}
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <Label>Status</Label>
            <Select value={form.status} onValueChange={(value) => update("status", value as EventStatus)}>
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(EVENT_STATUS_LABELS).map(([value, label]) => (
                  <SelectItem key={value} value={value}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="event-description">Descrição</Label>
            <Textarea
              id="event-description"
              rows={3}
              placeholder="Pauta, link da reunião, observações…"
              value={form.description}
              onChange={(e) => update("description", e.target.value)}
            />
          </div>

          <DialogFooter className="items-center justify-between sm:justify-between">
            {event ? (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button type="button" variant="ghost" size="sm" className="text-destructive">
                    <Trash2 className="size-4" /> Excluir
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Excluir evento &quot;{event.title}&quot;?</AlertDialogTitle>
                    <AlertDialogDescription>Esta ação não pode ser desfeita.</AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                    <AlertDialogAction variant="destructive" onClick={handleDelete}>
                      Excluir
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            ) : (
              <span />
            )}
            <div className="flex gap-2">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancelar
              </Button>
              <Button type="submit" disabled={saving}>
                {saving ? "Salvando..." : "Salvar"}
              </Button>
            </div>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
