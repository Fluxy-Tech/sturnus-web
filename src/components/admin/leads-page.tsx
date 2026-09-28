"use client";

import { useDeferredValue, useState } from "react";
import useSWR from "swr";
import { Download, Search, UserPlus, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { formatPhone } from "@/components/ui/phone-input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatDateTime } from "@/lib/format";
import type { Lead } from "@/types/domain";
import { LeadSheet } from "./lead-sheet";

const DAY_MS = 24 * 60 * 60 * 1000;

function exportCsv(leads: Lead[]) {
  const escape = (value: string) => `"${value.replace(/"/g, '""')}"`;
  const header = ["Nome", "Empresa", "Telefone", "E-mail", "Estágio", "Recebido em"];
  const rows = leads.map((lead) =>
    [lead.name, lead.company, formatPhone(lead.phone), lead.email, lead.stageName ?? "", formatDateTime(lead.createdAt)]
      .map(escape)
      .join(";"),
  );
  // BOM pro Excel abrir acentuação certo.
  const blob = new Blob([`﻿${[header.join(";"), ...rows].join("\n")}`], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `leads-${new Date().toISOString().slice(0, 10)}.csv`;
  link.click();
  URL.revokeObjectURL(url);
}

function StatCard({ label, value, icon: Icon }: { label: string; value: number; icon: typeof Users }) {
  return (
    <div className="bg-card border-border flex items-center gap-4 rounded-xl border p-5">
      <span className="bg-primary/10 text-primary flex size-10 items-center justify-center rounded-lg">
        <Icon className="size-5" />
      </span>
      <div>
        <p className="text-muted-foreground text-xs font-medium uppercase">{label}</p>
        <p className="font-[family-name:var(--font-display)] text-2xl font-semibold">{value.toLocaleString("pt-BR")}</p>
      </div>
    </div>
  );
}

export function LeadsPage() {
  const [search, setSearch] = useState("");
  const deferredSearch = useDeferredValue(search.trim());
  const { data: leads, isLoading, mutate } = useSWR<Lead[]>(
    deferredSearch ? `/api/leads?q=${encodeURIComponent(deferredSearch)}` : "/api/leads",
    { keepPreviousData: true },
  );
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const list = leads ?? [];
  const now = Date.now();
  const last7 = list.filter((lead) => now - new Date(lead.createdAt).getTime() < 7 * DAY_MS).length;
  const today = list.filter((lead) => new Date(lead.createdAt).toDateString() === new Date().toDateString()).length;

  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-[family-name:var(--font-display)] text-2xl font-semibold">Leads</h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Solicitações de agendamento recebidas pelo formulário do site.
          </p>
        </div>
        <Button variant="outline" size="sm" disabled={list.length === 0} onClick={() => exportCsv(list)}>
          <Download className="size-4" /> Exportar CSV
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label={deferredSearch ? "Encontrados" : "Total de leads"} value={list.length} icon={Users} />
        <StatCard label="Últimos 7 dias" value={last7} icon={UserPlus} />
        <StatCard label="Hoje" value={today} icon={UserPlus} />
      </div>

      <div className="relative max-w-sm">
        <Search className="text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2" />
        <Input
          placeholder="Buscar por nome, empresa, e-mail ou telefone"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9"
        />
      </div>

      <div className="bg-card border-border overflow-hidden rounded-xl border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Empresa</TableHead>
              <TableHead>Telefone</TableHead>
              <TableHead>E-mail</TableHead>
              <TableHead>Estágio</TableHead>
              <TableHead>Recebido em</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {list.map((lead) => (
              <TableRow key={lead.id} className="hover:bg-muted/40 cursor-pointer" onClick={() => setSelectedId(lead.id)}>
                <TableCell className="font-medium">{lead.name}</TableCell>
                <TableCell>{lead.company}</TableCell>
                <TableCell className="whitespace-nowrap">{formatPhone(lead.phone)}</TableCell>
                <TableCell>{lead.email}</TableCell>
                <TableCell>{lead.stageName ? <Badge variant="secondary">{lead.stageName}</Badge> : "—"}</TableCell>
                <TableCell className="text-muted-foreground whitespace-nowrap">{formatDateTime(lead.createdAt)}</TableCell>
              </TableRow>
            ))}
            {list.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="text-muted-foreground py-10 text-center">
                  {isLoading ? "Carregando…" : deferredSearch ? "Nenhum lead encontrado." : "Nenhum lead recebido ainda."}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <LeadSheet
        leadId={selectedId}
        onOpenChange={(open) => !open && setSelectedId(null)}
        onChanged={() => void mutate()}
      />
    </div>
  );
}
