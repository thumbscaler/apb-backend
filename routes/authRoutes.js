const express = require("express");

const router = express.Router();

const {
  setupMasterPassword,
  login,
  checkSetup,
} = require("../controllers/authController");

router.get("/setup-status", checkSetup);

router.post("/setup", setupMasterPassword);

router.post("/login", login);

module.exports = router;