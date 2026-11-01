"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserIdValidation = exports.CreateProjectValidation = exports.CreateEnvironmentValidation = void 0;
const zod_1 = require("zod");
exports.CreateEnvironmentValidation = zod_1.z.object({
    environmentName: zod_1.z.string().trim().min(1, "Environment name is required").max(100)
});
exports.CreateProjectValidation = zod_1.z.object({
    projectName: zod_1.z.string().trim().min(1, "Project name is required").max(100),
    environmentId: zod_1.z.number().int().positive()
});
exports.UserIdValidation = zod_1.z.object({
    id: zod_1.z.string().regex(/^[1-9]\d*$/, "User id must be a positive integer")
});
