"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthenticateRequest = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
dotenv_1.default.config();
const AuthenticateRequest = (req, res, next) => {
    const authorization = req.get("authorization");
    if (!authorization) {
        res.status(401).json({
            status: "failed",
            success: false,
            message: "Authorization token is required"
        });
        return;
    }
    const tokenMatch = authorization.trim().match(/^Bearer\s+(\S+)$/i);
    if (!tokenMatch) {
        res.status(401).json({
            status: "failed",
            success: false,
            message: "A valid bearer token is required"
        });
        return;
    }
    const token = tokenMatch[1];
    const secret = process.env.JWT_SECRET;
    if (!secret) {
        res.status(500).json({
            status: "failed",
            success: false,
            message: "JWT secret is not configured"
        });
        return;
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(token, secret);
        if (typeof decoded === "string"
            || typeof decoded.userId !== "number"
            || typeof decoded.username !== "string"
            || typeof decoded.email !== "string") {
            res.status(401).json({
                status: "failed",
                success: false,
                message: "Invalid or expired token"
            });
            return;
        }
        req.user = {
            userId: decoded.userId,
            username: decoded.username,
            email: decoded.email
        };
        next();
    }
    catch (error) {
        if (error instanceof jsonwebtoken_1.default.JsonWebTokenError || error instanceof jsonwebtoken_1.default.TokenExpiredError) {
            res.status(401).json({
                status: "failed",
                success: false,
                message: "Invalid or expired token"
            });
            return;
        }
        next(error);
    }
};
exports.AuthenticateRequest = AuthenticateRequest;
