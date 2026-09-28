import type { EventStatus } from "@/types/domain";

export const EVENT_STATUS_CHIP_CLASSES: Record<EventStatus, string> = {
  scheduled: "bg-primary/15 text-primary",
  done: "bg-success/15 text-success",
  canceled: "bg-muted text-muted-foreground line-through",
};

export const EVENT_STATUS_DOT_CLASSES: Record<EventStatus, string> = {
  scheduled: "bg-primary",
  done: "bg-success",
  canceled: "bg-muted-foreground",
};

export function formatDateTime(iso: string) {
  return new Date(iso).toLocaleString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
}

const pad = (n: number) => String(n).padStart(2, "0");

/// Valor pro <input type="date"> no fuso local.
export function toDateInput(date: Date) {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

/// Valor pro <input type="time"> no fuso local.
export function toTimeInput(date: Date) {
  return `${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

/// Junta os valores de <input type="date"> + <input type="time"> num Date local.
export function fromDateTimeInputs(date: string, time: string) {
  const [year, month, day] = date.split("-").map(Number);
  const [hours, minutes] = time.split(":").map(Number);
  return new Date(year, month - 1, day, hours, minutes);
}

export function whatsappUrl(phone: string) {
  return `https://wa.me/${phone.replace(/\D/g, "")}`;
}
