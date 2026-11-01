"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoginValidation = void 0;
const zod_1 = require("zod");
exports.LoginValidation = zod_1.z.object({
    email: zod_1.z.string().trim().email("Enter a valid email"),
    password: zod_1.z.string().trim().min(8, "Password must be at least 8 characters")
});
