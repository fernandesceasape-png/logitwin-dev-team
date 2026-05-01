const express = require("express");
const router = express.Router();

const { getSyncStatus } = require("../services/sapSyncService");

router.get("/status", (req, res) => {
  res.json(getSyncStatus());
});

module.exports = router;
