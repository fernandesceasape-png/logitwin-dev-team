const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());

const ordersRoute = require("./routes/orders");

app.use("/orders", ordersRoute);

app.listen(3001, () => {
  console.log("Servidor rodando na porta 3001");
});
