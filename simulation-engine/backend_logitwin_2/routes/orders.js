const express = require("express");
const router = express.Router();

const { getOrders } = require("../services/dataService");

router.get("/", (req, res) => {
  const data = getOrders();
  res.json(data);
});

module.exports = router;