"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateApiKeyValidation = void 0;
const zod_1 = require("zod");
exports.CreateApiKeyValidation = zod_1.z.object({
    name: zod_1.z.string().trim().min(3, "Name must contain at least 3 characters").max(50, "Name must contain at most 50 characters"),
    environmentId: zod_1.z.number().int().positive(),
    projectId: zod_1.z.number().int().positive(),
    usageLimit: zod_1.z.number().int().positive().optional(),
    setPermission: zod_1.z.boolean()
});
