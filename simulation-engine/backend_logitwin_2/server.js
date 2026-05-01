const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());

const ordersRoute     = require("./routes/orders");
const sapSyncRoute    = require("./routes/sapSync");
const containersRoute = require("./routes/containers");

app.get("/", (req, res) => {
  res.json({
    service: "LogiTwin Simulation Engine",
    status: "online",
    endpoints: [
      { method: "GET", path: "/orders",                 description: "Pedidos enriquecidos (VBAK + LIPS + VEKP)" },
      { method: "GET", path: "/sap/status",             description: "Status da sincronização S/4HANA" },
      { method: "GET", path: "/containers/suggestions", description: "Sugestão inteligente de alocação de contentores" },
    ],
  });
});

app.use("/orders",     ordersRoute);
app.use("/sap",        sapSyncRoute);
app.use("/containers", containersRoute);

app.use((req, res) => {
  res.status(404).json({
    error:    "Rota não encontrada",
    method:   req.method,
    path:     req.originalUrl,
    hint:     "Acesse GET / para listar os endpoints disponíveis",
  });
});

app.listen(3001, () => {
  console.log("Servidor rodando na porta 3001");
});
