"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ValidateParams = exports.ValidateBody = void 0;
const sendValidationErrors = (res, error) => {
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
const ValidateBody = (schema) => {
    return (req, res, next) => {
        const result = schema.safeParse(req.body);
        if (!result.success) {
            return sendValidationErrors(res, result.error);
        }
        req.body = result.data;
        return next();
    };
};
exports.ValidateBody = ValidateBody;
const ValidateParams = (schema) => {
    return (req, res, next) => {
        const result = schema.safeParse(req.params);
        if (!result.success) {
            return sendValidationErrors(res, result.error);
        }
        return next();
    };
};
exports.ValidateParams = ValidateParams;
