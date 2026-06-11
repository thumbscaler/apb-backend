const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const MasterPassword = require("../models/MasterPassword");

const setupMasterPassword = async (req, res) => {
  try {
    const { password } = req.body;

    if (!password) {
      return res.status(400).json({
        message: "Password is required",
      });
    }

    const existingMasterPassword =
      await MasterPassword.findOne();

    if (existingMasterPassword) {
      return res.status(403).json({
        message:
          "Master password has already been set and cannot be changed.",
      });
    }

    const salt = await bcrypt.genSalt(10);

    const passwordHash = await bcrypt.hash(
      password,
      salt
    );

    await MasterPassword.create({
      passwordHash,
    });

    return res.status(201).json({
      message: "Vault created successfully",
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

const login = async (req, res) => {
  try {
    const { password } = req.body;

    const master = await MasterPassword.findOne();

    if (!master) {
      return res.status(404).json({
        message: "Vault not initialized",
      });
    }

    const isMatch = await bcrypt.compare(
      password,
      master.passwordHash
    );

    if (!isMatch) {
      return res.status(401).json({
        message: "Invalid password",
      });
    }

    const token = jwt.sign(
      { vault: true },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    res.json({
      token,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const checkSetup = async (req, res) => {
  try {
    const master = await MasterPassword.findOne();

    res.json({
      isSetup: !!master,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  setupMasterPassword,
  login,
  checkSetup,
};