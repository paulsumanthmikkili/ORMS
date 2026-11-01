"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
dotenv_1.default.config();
const DashBoard = (req, res, next) => {
    try {
        let bearerToken = req.headers.authorization;
        if (!bearerToken) {
            res.status(404).json({
                status: "failed",
                success: false,
                message: "Bearer Token missing "
            });
            return;
        }
        let token = bearerToken.split(" ")[1];
        if (!token) {
            res.status(404).json({
                status: "failed",
                success: false,
                message: "Bearer Token missing "
            });
            return;
        }
        const decoded = jsonwebtoken_1.default.verify(token, process.env.jwt_secret);
    }
    catch (error) {
    }
};
