"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LogServerError = void 0;
const log_1 = require("../models/log");
const LogServerError = async (req, error) => {
    try {
        const errorMessage = error instanceof Error
            ? error.message
            : String(error);
        const requestBody = req.body && typeof req.body === "object"
            ? { ...req.body }
            : null;
        if (requestBody) {
            for (const key of Object.keys(requestBody)) {
                if (/password|token|secret|authorization|api.?key/i.test(key)) {
                    requestBody[key] = "[REDACTED]";
                }
            }
        }
        await log_1.ServerLog.create({
            user_id: req.user?.userId ?? null,
            request_body: requestBody,
            error_message: errorMessage,
            route: `${req.method} ${req.path}`,
        });
    }
    catch (loggingError) {
        // Logging failure must not hide the original error.
        console.error("Failed to save server log:", loggingError);
    }
};
exports.LogServerError = LogServerError;
