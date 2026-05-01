/**
 * exportBacklog.ts
 *
 * Exporta a lista de pedidos críticos / em aging para CSV (Excel) e PDF.
 * Implementação zero-dep: gera CSV puro e PDF via window.print() com layout customizado.
 */

import type { Order } from "@/types";
import { getPendingDays, getPendingAlertLevel, formatWeight, formatDate } from "@/lib/stats";

interface BacklogRow {
  pedido: string;
  cliente: string;
  status: string;
  diasParado: number;
  nivel: string;
  peso: string;
  entregas: number;
  localizacao: string;
  container: string;
  criadoEm: string;
}

function toBacklogRow(order: Order): BacklogRow {
  const level = getPendingAlertLevel(order);
  const labelMap = {
    critical:    "CRITICO (>30d)",
    approaching: "AGING (15-29d)",
    warning:     "ATENCAO (7-14d)",
    none:        "OK",
  };

  return {
    pedido:      order.orderNumber,
    cliente:     "—",
    status:      order.status,
    diasParado:  getPendingDays(order),
    nivel:       labelMap[level],
    peso:        formatWeight(order.totalWeight),
    entregas:    order.deliveries.length,
    localizacao: order.primaryLocation,
    container:   order.primaryContainer ?? "—",
    criadoEm:    order.createdAt ? formatDate(order.createdAt) : "—",
  };
}

function escapeCsv(value: string | number): string {
  const s = String(value);
  if (/[",\n;]/.test(s)) {
    return `"${s.replace(/"/g, '""')}"`;
  }
  return s;
}

function downloadFile(content: string, filename: string, mime: string) {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function exportBacklogCSV(orders: Order[]) {
  const rows = orders.map(toBacklogRow);
  const headers = [
    "Pedido", "Cliente", "Status", "Dias Parado",
    "Nivel", "Peso Total", "Entregas", "Localizacao",
    "Container", "Criado Em",
  ];

  const csv = [
    headers.join(";"),
    ...rows.map(r => [
      r.pedido, r.cliente, r.status, r.diasParado,
      r.nivel, r.peso, r.entregas, r.localizacao,
      r.container, r.criadoEm,
    ].map(escapeCsv).join(";")),
  ].join("\n");

  const ts = new Date().toISOString().slice(0, 10);
  downloadFile(`﻿${csv}`, `logitwin-backlog-${ts}.csv`, "text/csv;charset=utf-8");
}

export function exportBacklogPDF(orders: Order[]) {
  const rows = orders.map(toBacklogRow);
  const ts = new Date().toLocaleString("pt-BR");

  const html = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="UTF-8">
<title>Relatório de Backlog — LogiTwin</title>
<style>
  @page { size: A4 landscape; margin: 1.2cm; }
  * { box-sizing: border-box; }
  body { font-family: -apple-system, "Segoe UI", system-ui, sans-serif; color: #0f172a; margin: 0; padding: 0; }
  header { border-bottom: 3px solid #1e3a8a; padding-bottom: 12px; margin-bottom: 18px; display: flex; justify-content: space-between; align-items: flex-end; }
  h1 { margin: 0; font-size: 22px; color: #1e3a8a; }
  .subtitle { font-size: 11px; color: #64748b; margin-top: 4px; }
  .meta { font-size: 10px; color: #475569; text-align: right; line-height: 1.5; }
  .summary { display: flex; gap: 16px; margin-bottom: 18px; }
  .kpi { flex: 1; padding: 10px 14px; background: #f8fafc; border-left: 3px solid #1e3a8a; border-radius: 4px; }
  .kpi-label { font-size: 9px; text-transform: uppercase; letter-spacing: 1px; color: #64748b; font-weight: 600; }
  .kpi-value { font-size: 18px; font-weight: 700; color: #0f172a; margin-top: 2px; }
  table { width: 100%; border-collapse: collapse; font-size: 10px; }
  thead th { background: #1e3a8a; color: white; padding: 8px 6px; text-align: left; font-size: 9px; text-transform: uppercase; letter-spacing: 0.5px; }
  tbody td { padding: 6px; border-bottom: 1px solid #e2e8f0; }
  tbody tr.critical { background: #fef2f2; }
  tbody tr.approaching { background: #fff7ed; }
  tbody tr.warning { background: #fffbeb; }
  .nivel-tag { display: inline-block; padding: 2px 6px; border-radius: 3px; font-size: 9px; font-weight: 700; }
  .nivel-critical    { background: #dc2626; color: white; }
  .nivel-approaching { background: #ea580c; color: white; }
  .nivel-warning     { background: #f59e0b; color: white; }
  .nivel-none        { background: #10b981; color: white; }
  footer { margin-top: 24px; padding-top: 12px; border-top: 1px solid #e2e8f0; font-size: 9px; color: #94a3b8; display: flex; justify-content: space-between; }
  .signatures { display: flex; gap: 60px; margin-top: 36px; padding-top: 12px; }
  .sig { flex: 1; border-top: 1px solid #475569; padding-top: 6px; font-size: 10px; text-align: center; color: #475569; }
</style>
</head>
<body>
<header>
  <div>
    <h1>LogiTwin · Relatório de Backlog</h1>
    <div class="subtitle">Conformidade ITIL · Auditoria de Pedidos Pendentes</div>
  </div>
  <div class="meta">
    Gerado em: <strong>${ts}</strong><br>
    Total: <strong>${rows.length}</strong> pedido(s)<br>
    Sistema: <strong>S/4HANA</strong>
  </div>
</header>

<div class="summary">
  <div class="kpi">
    <div class="kpi-label">Críticos (&gt;30d)</div>
    <div class="kpi-value">${rows.filter(r => r.nivel.startsWith("CRITICO")).length}</div>
  </div>
  <div class="kpi">
    <div class="kpi-label">Aging (15–29d)</div>
    <div class="kpi-value">${rows.filter(r => r.nivel.startsWith("AGING")).length}</div>
  </div>
  <div class="kpi">
    <div class="kpi-label">Atenção (7–14d)</div>
    <div class="kpi-value">${rows.filter(r => r.nivel.startsWith("ATENCAO")).length}</div>
  </div>
  <div class="kpi">
    <div class="kpi-label">Total no relatório</div>
    <div class="kpi-value">${rows.length}</div>
  </div>
</div>

<table>
<thead>
<tr>
  <th>Pedido</th><th>Status</th><th>Dias</th><th>Nível</th>
  <th>Peso</th><th>Entregas</th><th>Localização</th>
  <th>Container</th><th>Criado em</th>
</tr>
</thead>
<tbody>
${rows.map(r => {
  const cssClass = r.nivel.startsWith("CRITICO") ? "critical"
    : r.nivel.startsWith("AGING") ? "approaching"
    : r.nivel.startsWith("ATENCAO") ? "warning" : "";
  const tagClass = r.nivel.startsWith("CRITICO") ? "nivel-critical"
    : r.nivel.startsWith("AGING") ? "nivel-approaching"
    : r.nivel.startsWith("ATENCAO") ? "nivel-warning" : "nivel-none";
  return `<tr class="${cssClass}">
    <td><strong>${r.pedido}</strong></td>
    <td>${r.status}</td>
    <td><strong>${r.diasParado}d</strong></td>
    <td><span class="nivel-tag ${tagClass}">${r.nivel}</span></td>
    <td>${r.peso}</td>
    <td>${r.entregas}</td>
    <td>${r.localizacao}</td>
    <td>${r.container}</td>
    <td>${r.criadoEm}</td>
  </tr>`;
}).join("")}
</tbody>
</table>

<div class="signatures">
  <div class="sig">Coordenador de Logística</div>
  <div class="sig">Gestor de Operações</div>
  <div class="sig">Auditoria ITIL</div>
</div>

<footer>
  <span>LogiTwin Dashboard · Documento gerado automaticamente</span>
  <span>Relatório de auditoria — Conformidade com padrões ITIL</span>
</footer>

<script>
  window.onload = function() { setTimeout(function() { window.print(); }, 250); };
</script>
</body>
</html>`;

  const win = window.open("", "_blank", "width=1200,height=800");
  if (!win) {
    alert("Bloqueador de pop-ups ativo. Permita pop-ups para gerar o PDF.");
    return;
  }
  win.document.write(html);
  win.document.close();
}
