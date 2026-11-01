import { NextFunction, Request, Response } from "express";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";

dotenv.config();

export interface ActiveSession {
    userId: number;
    username: string;
    email: string;
}

export interface Authenticate extends Request {
    user?: ActiveSession;
}

export const AuthenticateRequest = (req: Authenticate, res: Response, next: NextFunction) => {
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
        const decoded = jwt.verify(token, secret);
        if (
            typeof decoded === "string"
            || typeof decoded.userId !== "number"
            || typeof decoded.username !== "string"
            || typeof decoded.email !== "string"
        ) {
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
    } catch (error) {
        if (error instanceof jwt.JsonWebTokenError || error instanceof jwt.TokenExpiredError) {
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
