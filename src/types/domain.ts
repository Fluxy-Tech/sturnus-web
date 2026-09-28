export interface Lead {
  id: string;
  name: string;
  company: string;
  /// Só dígitos, com DDI (ex: "5534997801829").
  phone: string;
  email: string;
  source: string;
  notes: string | null;
  stageId: string | null;
  stageName: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CrmStage {
  id: string;
  name: string;
  position: number;
  leads: Lead[];
}

export type EventStatus = "scheduled" | "done" | "canceled";

export const EVENT_STATUS_LABELS: Record<EventStatus, string> = {
  scheduled: "Agendado",
  done: "Realizado",
  canceled: "Cancelado",
};

export interface LeadEvent {
  id: string;
  leadId: string | null;
  lead: { id: string; name: string; company: string } | null;
  title: string;
  description: string | null;
  startsAt: string;
  endsAt: string;
  status: EventStatus;
  createdAt: string;
}

export interface LeadDetail extends Lead {
  events: LeadEvent[];
}
