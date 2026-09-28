"use client";

import { type FormEvent, useState } from "react";
import useSWR from "swr";
import { toast } from "sonner";
import {
  DndContext,
  PointerSensor,
  useDraggable,
  useDroppable,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { Building2, Check, Pencil, Plus, Trash2, X } from "lucide-react";
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
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { formatPhone } from "@/components/ui/phone-input";
import { api, errorMessage } from "@/lib/api";
import { cn } from "@/lib/utils";
import type { CrmStage, Lead } from "@/types/domain";
import { LeadSheet } from "./lead-sheet";

function LeadCard({ lead, onOpen }: { lead: Lead; onOpen: () => void }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({ id: lead.id });

  return (
    <button
      ref={setNodeRef}
      type="button"
      onClick={onOpen}
      style={transform ? { transform: CSS.Translate.toString(transform) } : undefined}
      className={cn(
        "bg-card border-border flex w-full flex-col gap-1 rounded-lg border p-3 text-left shadow-sm",
        isDragging && "z-10 opacity-70",
      )}
      {...listeners}
      {...attributes}
    >
      <div className="flex items-center gap-2.5">
        <div className="bg-primary/15 text-primary flex size-9 shrink-0 items-center justify-center rounded-full text-sm font-medium">
          {(lead.name || "?").trim().charAt(0).toUpperCase()}
        </div>
        <div className="flex min-w-0 flex-col">
          <span className="truncate text-sm font-medium">{lead.name}</span>
          <span className="text-muted-foreground truncate text-xs">{formatPhone(lead.phone)}</span>
        </div>
      </div>
      <div className="border-border mt-1 flex items-center justify-between gap-2 border-t pt-2">
        <span className="text-muted-foreground flex min-w-0 items-center gap-1 truncate text-[11px]">
          <Building2 className="size-3 shrink-0" /> {lead.company}
        </span>
        <span className="text-muted-foreground shrink-0 text-[10px]">
          {new Date(lead.createdAt).toLocaleDateString("pt-BR")}
        </span>
      </div>
    </button>
  );
}

function StageColumn({
  stage,
  onOpenLead,
  onRename,
  onDelete,
}: {
  stage: CrmStage;
  onOpenLead: (leadId: string) => void;
  onRename: (stageId: string, name: string) => Promise<void>;
  onDelete: (stageId: string) => Promise<void>;
}) {
  const { setNodeRef, isOver } = useDroppable({ id: stage.id });
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(stage.name);
  const [saving, setSaving] = useState(false);

  function startEditing() {
    setName(stage.name);
    setEditing(true);
  }

  async function handleSave() {
    const trimmed = name.trim();
    if (!trimmed || trimmed === stage.name) {
      setEditing(false);
      return;
    }
    setSaving(true);
    try {
      await onRename(stage.id, trimmed);
      setEditing(false);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div
      ref={setNodeRef}
      className={cn(
        "bg-muted/40 flex w-72 shrink-0 flex-col gap-3 rounded-xl border p-3 transition-colors",
        isOver ? "border-primary" : "border-border",
      )}
    >
      <div className="flex items-center justify-between gap-2 px-1">
        {editing ? (
          <div className="flex flex-1 items-center gap-1">
            <Input
              autoFocus
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSave();
                if (e.key === "Escape") setEditing(false);
              }}
              className="h-7 text-sm"
            />
            <Button type="button" variant="ghost" size="icon" className="size-7" disabled={saving} onClick={handleSave}>
              <Check className="size-3.5" />
            </Button>
            <Button type="button" variant="ghost" size="icon" className="size-7" onClick={() => setEditing(false)}>
              <X className="size-3.5" />
            </Button>
          </div>
        ) : (
          <>
            <div className="flex min-w-0 items-center gap-1.5">
              <h3 className="truncate text-sm font-semibold">{stage.name}</h3>
              <Badge variant="secondary">{stage.leads.length}</Badge>
            </div>
            <div className="flex shrink-0 items-center gap-0.5">
              <Button type="button" variant="ghost" size="icon" className="size-7" onClick={startEditing}>
                <Pencil className="size-3.5" />
              </Button>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button type="button" variant="ghost" size="icon" className="size-7">
                    <Trash2 className="text-destructive size-3.5" />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Excluir estágio &quot;{stage.name}&quot;?</AlertDialogTitle>
                    <AlertDialogDescription>
                      Os leads deste estágio não são excluídos — vão para o primeiro estágio do Kanban. Esta ação não
                      pode ser desfeita.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                    <AlertDialogAction variant="destructive" onClick={() => onDelete(stage.id)}>
                      Excluir
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </>
        )}
      </div>

      <div className="flex min-h-16 flex-col gap-2">
        {stage.leads.map((lead) => (
          <LeadCard key={lead.id} lead={lead} onOpen={() => onOpenLead(lead.id)} />
        ))}
        {stage.leads.length === 0 && <p className="text-muted-foreground px-1 text-xs">Nenhum lead aqui.</p>}
      </div>
    </div>
  );
}

function NewStageDialog({ onCreated }: { onCreated: () => void }) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [saving, setSaving] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      await api.post("/api/crm/stages", { name });
      setName("");
      setOpen(false);
      onCreated();
    } catch (err) {
      toast.error(errorMessage(err, "Não foi possível criar o estágio."));
    } finally {
      setSaving(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm">
          <Plus className="size-4" /> Novo estágio
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Novo estágio</DialogTitle>
        </DialogHeader>
        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="stage-name">Nome</Label>
            <Input id="stage-name" required autoFocus value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={saving}>
              {saving ? "Criando..." : "Criar"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export function CrmPage() {
  const { data, mutate } = useSWR<{ stages: CrmStage[] }>("/api/crm");
  const [selectedLeadId, setSelectedLeadId] = useState<string | null>(null);
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 8 } }));

  const stages = data?.stages ?? [];

  async function handleRenameStage(stageId: string, name: string) {
    try {
      await api.patch(`/api/crm/stages/${stageId}`, { name });
      await mutate();
    } catch (err) {
      toast.error(errorMessage(err, "Não foi possível renomear o estágio."));
    }
  }

  async function handleDeleteStage(stageId: string) {
    try {
      await api.delete(`/api/crm/stages/${stageId}`);
      await mutate();
    } catch (err) {
      toast.error(errorMessage(err, "Não foi possível excluir o estágio."));
    }
  }

  async function handleDragEnd(event: DragEndEvent) {
    const leadId = String(event.active.id);
    const targetStageId = event.over ? String(event.over.id) : null;
    if (!targetStageId || !data) return;

    const currentStage = stages.find((s) => s.leads.some((l) => l.id === leadId));
    if (!currentStage || currentStage.id === targetStageId) return;

    const lead = currentStage.leads.find((l) => l.id === leadId)!;
    const targetStage = stages.find((s) => s.id === targetStageId);

    // Otimista: move o card entre as colunas localmente antes da resposta da API.
    const optimisticStages = stages.map((stage) => {
      if (stage.id === currentStage.id) return { ...stage, leads: stage.leads.filter((l) => l.id !== leadId) };
      if (stage.id === targetStageId) {
        return {
          ...stage,
          leads: [{ ...lead, stageId: targetStageId, stageName: targetStage?.name ?? null }, ...stage.leads],
        };
      }
      return stage;
    });
    await mutate({ stages: optimisticStages }, { revalidate: false });

    try {
      await api.patch(`/api/leads/${leadId}`, { stageId: targetStageId });
    } catch (err) {
      toast.error(errorMessage(err, "Não foi possível mover o lead."));
    } finally {
      await mutate();
    }
  }

  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="font-[family-name:var(--font-display)] text-2xl font-semibold">CRM</h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Acompanhe seus leads em formato Kanban e arraste os cards entre os estágios.
          </p>
        </div>
        <NewStageDialog onCreated={() => void mutate()} />
      </div>

      {!data ? (
        <p className="text-muted-foreground text-sm">Carregando…</p>
      ) : (
        <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
          <div className="flex gap-4 overflow-x-auto pb-4">
            {stages.map((stage) => (
              <StageColumn
                key={stage.id}
                stage={stage}
                onOpenLead={setSelectedLeadId}
                onRename={handleRenameStage}
                onDelete={handleDeleteStage}
              />
            ))}
          </div>
        </DndContext>
      )}

      <LeadSheet
        leadId={selectedLeadId}
        onOpenChange={(open) => !open && setSelectedLeadId(null)}
        onChanged={() => void mutate()}
      />
    </div>
  );
}
