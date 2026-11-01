import { z } from "zod";

export const RegisterValidation = z.object({
    name: z.string().trim().min(3, "Name must contain at least 3 character"),
    email: z.string().trim().email("Enter valid email"),
    username: z.string().trim().min(3, "min 3 character"),
    password: z.string().trim().min(8, "password must contain at least 8 character")
        .regex(/[A-Z]/, "At least one Uppercase letter required")
        .regex(/[a-z]/, "At least one lowerCase letter required")
        .regex(/[0-9]/, "At Least one digit")
        .regex(/[@$!%*?&]/, "At least one special symbol required"),
    confirmPassword: z.string().trim().min(8, "password must contain at least 8 character")
        .regex(/[A-Z]/, "At least one Uppercase letter required")
        .regex(/[a-z]/, "At least one lowerCase letter required")
        .regex(/[0-9]/, "At Least one digit")
        .regex(/[@$!%*?&]/, "At least one special symbol required")
}).refine((values) => values.password === values.confirmPassword, {
    path: ["confirmPassword"],
    message: "Password and confirm password must match"
});

