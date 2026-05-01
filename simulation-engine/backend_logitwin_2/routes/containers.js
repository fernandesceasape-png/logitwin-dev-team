const express = require("express");
const router = express.Router();

const { getContainerSuggestions } = require("../services/containerSuggestionService");

router.get("/suggestions", (req, res) => {
  res.json(getContainerSuggestions());
});

module.exports = router;
