import { z } from "zod";

export const CreateEnvironmentValidation = z.object({
    environmentName: z.string().trim().min(1, "Environment name is required").max(100)
});

export const CreateProjectValidation = z.object({
    projectName: z.string().trim().min(1, "Project name is required").max(100),
    environmentId: z.number().int().positive()
});

export const UserIdValidation = z.object({
    id: z.string().regex(/^[1-9]\d*$/, "User id must be a positive integer")
});
