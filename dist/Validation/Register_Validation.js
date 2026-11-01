"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RegisterValidation = void 0;
const zod_1 = require("zod");
exports.RegisterValidation = zod_1.z.object({
    name: zod_1.z.string().trim().min(3, "Name must contain at least 3 character"),
    email: zod_1.z.string().trim().email("Enter valid email"),
    password: zod_1.z.string().trim().min(8, "password must contain at least 8 character")
        .regex(/[A-Z]/, "At least one Uppercase letter required")
        .regex(/[a-z]/, "At least one lowerCase letter required")
        .regex(/[0-9]/, "At Least one digit")
        .regex(/[@$!%*?&]/, "At least one special symbol required"),
    confirmPassword: zod_1.z.string().trim().min(8, "password must contain at least 8 character")
        .regex(/[A-Z]/, "At least one Uppercase letter required")
        .regex(/[a-z]/, "At least one lowerCase letter required")
        .regex(/[0-9]/, "At Least one digit")
        .regex(/[@$!%*?&]/, "At least one special symbol required")
}).refine((values) => values.password === values.confirmPassword, {
    path: ["confirmPassword"],
    message: "Password and confirm password must match"
});
