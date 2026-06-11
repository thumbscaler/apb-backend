const Credential = require("../models/Credential");
const CryptoJS = require("crypto-js");

const addCredential = async (req, res) => {
    try {
        const {
            platform,
            username,
            email,
            password,
        } = req.body;

        const encryptedPassword =
            CryptoJS.AES.encrypt(
                password,
                process.env.ENCRYPTION_KEY
            ).toString();

        const credential =
            await Credential.create({
                platform,
                username,
                email,
                encryptedPassword,
            });

        res.status(201).json(credential);
    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
};

const getPlatforms = async (req, res) => {
    try {
        const credentials =
            await Credential.find();

        const grouped = {};

        credentials.forEach((item) => {
            grouped[item.platform] =
                (grouped[item.platform] || 0) + 1;
        });

        const platforms =
            Object.keys(grouped).map(
                (platform) => ({
                    platform,
                    count: grouped[platform],
                })
            );

        res.json(platforms);
    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
};

const getCredentialsByPlatform =
    async (req, res) => {
        try {
            const credentials =
                await Credential.find({
                    platform: req.params.platform,
                });

            res.json(credentials);
        } catch (error) {
            res.status(500).json({
                message: error.message,
            });
        }
    };

const getCredential = async (
    req,
    res
) => {
    try {
        const credential =
            await Credential.findById(
                req.params.id
            );

        if (!credential) {
            return res.status(404).json({
                message: "Credential not found",
            });
        }

        const decryptedPassword =
            CryptoJS.AES.decrypt(
                credential.encryptedPassword,
                process.env.ENCRYPTION_KEY
            ).toString(CryptoJS.enc.Utf8);

        res.json({
            ...credential.toObject(),
            password: decryptedPassword,
        });
    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
};

const deleteCredential = async (
    req,
    res
) => {
    try {
        const credential =
            await Credential.findById(
                req.params.id
            );

        if (!credential) {
            return res.status(404).json({
                message: "Credential not found",
            });
        }

        await credential.deleteOne();

        res.json({
            message:
                "Credential deleted successfully",
        });
    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
};

const updateCredential = async (req, res) => {
    try {
        const credential = await Credential.findById(
            req.params.id
        );

        if (!credential) {
            return res.status(404).json({
                message: "Credential not found",
            });
        }

        const {
            platform,
            username,
            email,
            password,
        } = req.body;

        credential.platform =
            platform ?? credential.platform;

        credential.username =
            username ?? credential.username;

        credential.email =
            email ?? credential.email;

        if (password && password.trim() !== "") {
            credential.encryptedPassword =
                CryptoJS.AES.encrypt(
                    password,
                    process.env.ENCRYPTION_KEY
                ).toString();
        }

        const updatedCredential =
            await credential.save();

        res.json(updatedCredential);
    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
};

module.exports = {
    addCredential,
    getPlatforms,
    getCredentialsByPlatform,
    getCredential,
    deleteCredential,
    updateCredential,
};