const express = require("express");

const router = express.Router();

const protect = require(
  "../middleware/auth"
);


const {
  addCredential,
  getPlatforms,
  getCredentialsByPlatform,
  getCredential,
  deleteCredential,
  updateCredential,
} = require(
  "../controllers/credentialController"
);

router.use(protect);

router.post("/", addCredential);

router.put(
  "/:id",
  updateCredential
);

router.get("/platforms", getPlatforms);

router.get(
  "/platform/:platform",
  getCredentialsByPlatform
);

router.get("/:id", getCredential);

router.delete("/:id", deleteCredential);

module.exports = router;