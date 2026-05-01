const data = require("../data/data.json");

const TABLE_LATENCY_MS = {
  VBAK: 1200,
  LIPS: 1450,
  VEKP: 980,
};

function getSyncStatus() {
  const { vbak_header, lips_items, vekp_units } = data.sap_data_dump;
  const now = new Date();

  const tables = [
    {
      name: "VBAK",
      description: "Cabeçalho de Pedidos de Venda",
      records: vbak_header.length,
      latencyMs: TABLE_LATENCY_MS.VBAK,
      status: "online",
    },
    {
      name: "LIPS",
      description: "Itens de Entrega",
      records: lips_items.length,
      latencyMs: TABLE_LATENCY_MS.LIPS,
      status: "online",
    },
    {
      name: "VEKP",
      description: "Unidades de Manuseio (Containers)",
      records: vekp_units.length,
      latencyMs: TABLE_LATENCY_MS.VEKP,
      status: "online",
    },
  ];

  const totalRecords = tables.reduce((sum, t) => sum + t.records, 0);
  const avgLatency = tables.reduce((sum, t) => sum + t.latencyMs, 0) / tables.length;

  return {
    connection: {
      system: "S/4HANA",
      host: "sap-prod.logitwin.local",
      client: "100",
      status: "connected",
      lastSync: now.toISOString(),
      avgLatencyMs: Math.round(avgLatency),
      totalRecords,
    },
    tables,
  };
}

module.exports = { getSyncStatus };
