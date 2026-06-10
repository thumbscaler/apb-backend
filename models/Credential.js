const mongoose = require("mongoose");

const credentialSchema = new mongoose.Schema(
  {
    platform: {
      type: String,
      required: true,
    },

    username: {
      type: String,
    },

    email: {
      type: String,
    },

    encryptedPassword: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "Credential",
  credentialSchema
);