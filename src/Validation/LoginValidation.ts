import { z } from "zod";

export const LoginValidation = z.object({
    email: z.string().trim().email("Enter a valid email"),
    password: z.string().trim().min(8, "Password must be at least 8 characters")
});
