# LogiTwin — Digital Twin para Gestão Logística

**Transformando dados complexos em visibilidade operacional em tempo real.**

O **LogiTwin** é uma solução de Gêmeo Digital validada pelo **Programa Centelha (Nota 4.20)** e acelerada globalmente pela **Fundação Wadhwani (Ignite)**. O objetivo é eliminar a "invisibilidade" entre sistemas ERP e a operação física do pátio logístico.

---

## Como rodar o projeto localmente

Você vai precisar de **Node.js 18+** instalado. Abra **dois terminais**.

**Terminal 1 — Backend (Motor de Simulação)**

```bash
cd simulation-engine/backend_logitwin_2
npm install
node server.js
```

Confirme que aparece: `Servidor rodando na porta 3001`

**Terminal 2 — Frontend (Dashboard)**

```bash
cd frontend-dashboard/frontend_logitwin_2
npm install
npm run dev
```

Acesse: **http://localhost:3000**

> O backend precisa estar rodando antes de abrir o frontend.

---

## O que o sistema faz

**Painel de Monitoramento SAP** — exibe o status da conexão com o S/4HANA em tempo real, incluindo latência de cada tabela (VBAK, LIPS, VEKP) e total de registros sincronizados.

**Indicador de Aging de Pedidos** — alertas visuais em 3 níveis:
- Amarelo (7–14 dias): atenção
- Laranja (15–29 dias): aging — faltam X dias para ficar crítico
- Vermelho (30+ dias): crítico — ação imediata

**Exportação de Relatório de Backlog** — botão no dashboard exporta todos os pedidos com atraso em:
- **PDF** — layout ITIL com KPIs, tabela colorida e linhas de assinatura para reuniões de diretoria e auditoria
- **CSV (Excel)** — para análise e tratamento de dados

**Sugestão de Alocação de Contentores** — o sistema identifica as entregas sem container e sugere os 3 containers ativos mais próximos (por localização física + capacidade disponível), com score de otimização.

---

## Estrutura do repositório

```
logitwin-dev-team/
├── frontend-dashboard/
│   └── frontend_logitwin_2/     # Next.js 14 + TypeScript + Tailwind
├── simulation-engine/
│   └── backend_logitwin_2/      # Node.js + Express
│       ├── routes/              # orders, sapSync, containers
│       ├── services/            # dataService, sapSyncService, containerSuggestionService
│       └── data/data.json       # dump SAP simulado (VBAK, LIPS, VEKP)
├── data-samples/
└── documentacao/
```

## Endpoints da API

| Método | Rota | Descrição |
|--------|------|-----------|
| GET | `/orders` | Pedidos enriquecidos (VBAK + LIPS + VEKP) |
| GET | `/sap/status` | Status da sincronização S/4HANA |
| GET | `/containers/suggestions` | Sugestão de alocação de contentores |

---

## Problema e Solução

No dia a dia logístico, existe um gap crítico entre o dado sistêmico e a realidade do pátio. Gestores muitas vezes não têm visibilidade imediata de cargas paradas, atrasos de faturamento por falta de unidades de manuseio ou gargalos de SLA.

O LogiTwin atua como camada de inteligência e visualização:
- Visibilidade em tempo real de cargas e containers
- Gestão por exceção com alertas automáticos e preventivos
- Estrutura de dados espelhada no padrão SAP para integração futura
- Relatórios de auditoria prontos para conformidade ITIL

---

## Time

- **Product Owner:** Tarcísio Fernandes
- **Desenvolvimento (Residência Tecnológica — Porto Digital):** Jordy Arlego, Luiza e Mai
- **Mentoria:** Rafael Rodrigues
