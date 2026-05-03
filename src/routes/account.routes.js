const express = require("express");
const router = express.Router();

// Define your account routes here
router.get("/", (req, res) => {
  res.json({ message: "Welcome to the Account API" });
});

module.exports = router;