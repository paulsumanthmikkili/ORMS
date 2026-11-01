import { z } from "zod";

export const CreateApiKeyValidation = z.object({
    name: z.string().trim().min(3, "Name must contain at least 3 characters").max(50, "Name must contain at most 50 characters"),
    environmentId: z.number().int().positive(),
    projectId: z.number().int().positive(),
    usageLimit: z.number().int().positive().optional(),
    setPermission: z.boolean()
});