import { NextFunction, Request, Response } from "express";
import { z } from "zod";

const sendValidationErrors = (res: Response, error: z.ZodError) => {
    return res.status(422).json({
        status: "failed",
        success: false,
        message: "Validation failed",
        errors: error.issues.map((issue) => ({
            field: issue.path.join("."),
            message: issue.message
        }))
    });
};

export const ValidateBody = (schema: z.ZodType) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const result = schema.safeParse(req.body);
        if (!result.success) {
            return sendValidationErrors(res, result.error);
        }

        req.body = result.data;
        return next();
    };
};

export const ValidateParams = (schema: z.ZodType) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const result = schema.safeParse(req.params);
        if (!result.success) {
            return sendValidationErrors(res, result.error);
        }

        return next();
    };
};
