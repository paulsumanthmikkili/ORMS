
import { Request } from "express";
import { ServerLog } from "../models/log";

interface LogRequest extends Request {
    user?: {
        userId: number;
        username: string;
        email: string;
    };
}

export const LogServerError = async (
    req: LogRequest,
    error: unknown
): Promise<void> => {
    try {
        const errorMessage =
            error instanceof Error
                ? error.message
                : String(error);

    
        const requestBody =
            req.body && typeof req.body === "object"
                ? { ...req.body }
                : null;

        if (requestBody) {
            for (const key of Object.keys(requestBody)) {
                if (
                    /password|token|secret|authorization|api.?key/i.test(key)
                ) {
                    requestBody[key] = "[REDACTED]";
                }
            }
        }

        await ServerLog.create({
            user_id: req.user?.userId ?? null,
            request_body: requestBody,
            error_message: JSON.stringify(error) as any,
            route: `${req.method} ${req.path}`,
        });
    } catch (loggingError) {
        // Logging failure must not hide the original error.
        console.error("Failed to save server log:", loggingError);
    }
};
