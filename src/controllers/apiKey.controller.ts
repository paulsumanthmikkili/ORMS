import { Request, Response } from "express";
import { Authenticate } from "../Middlewares/DashBoard_MiddleWare";
import { Api_key } from "../models/Api_Key";
import { Environment } from "../models/Envirnoment";
import { Vendor } from "../models/Vendor"
import { Project } from "../models/project";
import { LogServerError } from "../serverlogs/serverlogs";
import { serializeResponse } from "../helpers/h";

export const CreateApiKey = async (req: Authenticate, res: Response) => {
    try {
        const { name, environmentId, projectId, usageLimit, setPermission } = req.body as {
            name: string,
            environmentId: number,
            projectId: number,
            usageLimit?: number,
            setPermission: boolean
        }
        const user = req.user;
        if (!user) {
            return res.status(401).json({
                status: "failed",
                success: false,
                message: "Authentication is required"
            });
        }

        const environment = await Environment.findByPk(environmentId);

        if (!environment) {
            return res.status(404).json({
                status: "failed",
                success: false,
                message: "Environment not found"
            });
        }
        const project = await Project.findOne({ where: { project_id: projectId, environment_id: environmentId } });
        if (!project) {
            return res.status(404).json({
                status: "failed",
                success: false,
                message: "Project not found for the selected environment"
            });
        }

        const apiKey = await Api_key.create({
            api_key_name: name,
            vendor_id: user.userId,
            environment_id: environment.environment_id,
            project_id: project.project_id,
            usage_limit: usageLimit,
            permission: setPermission
        });

        return res.status(201).json({
            status: "success",
            success: true,
            message: "API key created successfully",
            data: serializeResponse(apiKey)
        });
    }
    catch (error) {
         await LogServerError(req, error);
        console.error("Failed to create API key:", error);
        return res.status(500).json({
            status: "failed",
            success: false,
            message: "Internal server error"
        });
    }
}

export const GetAllApiKeys = async (req: Authenticate, res: Response) => {
    try {
        if (!req.user) {
            return res.status(401).json({
                status: "failed",
                success: false,
                message: "Authentication is required"
            });
        }
        const apiKeys = await Api_key.findAll({
            where: { vendor_id: req.user.userId },
            include: [
                {
                    model: Environment,
                    as: "environment",
                },
            ],
        });
        return res.status(200).json({
            status: "success",
            success: true,
            message: "API keys retrieved successfully",
            data: serializeResponse(apiKeys)
        });
    }
    catch (error) {
         await LogServerError(req, error);
        console.error("Failed to get API keys:", error);
        return res.status(500).json({
            status: "failed",
            success: false,
            message: "Internal server error"
        });
    }
}
export const CreateEnvironment = async (req: Request, res: Response) => {
    try {
        const { environmentName } = req.body as { environmentName: string };
        const environment = await Environment.create({ environment_name: environmentName });
        return res.status(201).json({
            status: "success",
            success: true,
            message: "Environment created successfully",
            data: serializeResponse(environment)
        })
    } catch (error) {
         await LogServerError(req, error);
        console.error("Failed to create environment:", error);
        return res.status(500).json({
            status: "failed",
            success: false,
            message: "Internal server error"
        });
    }
}

export const CreateProject = async (req: Request, res: Response) => {
    try {
        const { projectName, environmentId } = req.body as {
            projectName: string,
            environmentId: number
        };
        const environment = await Environment.findByPk(environmentId);
        if (!environment) {
            return res.status(404).json({
                status: "failed",
                success: false,
                message: "Environment is not available"
            });
        }

        const data = await Project.create({
            project_name: projectName,
            environment_id: environment.environment_id
        });
        return res.status(201).json({
            status: "success",
            success: true,
            message: "Project created successfully",
            data: serializeResponse(data)
        });
    } catch (error) {
         await LogServerError(req, error);
        console.error("Failed to create project:", error);
        return res.status(500).json({
            status: "failed",
            success: false,
            message: "Internal server error"
        });
    }
}

export const GetVendorApiKeys = async (req: Authenticate, res: Response) => {
    try {
        const user = req.user;
        if (!user || typeof user !== "object" || typeof user.userId !== "number") {
            return res.status(401).json({
                status: "failed",
                success: false,
                message: "Authenticated vendor information is missing"
            });
        }
        //Eagger loading
        const customerApiKeys = await Vendor.findByPk(user.userId, {
            include: [{
                model: Api_key,
                as: "api_keys"
            }]
        }) as (Vendor & { api_keys?: Api_key[] }) | null;

        if (!customerApiKeys) {
            return res.status(404).json({
                status: "failed",
                success: false,
                message: "Vendor not found"
            });
        }

        return res.status(200).json({
            status: "success",
            success: true,
            data: serializeResponse(customerApiKeys.api_keys ?? [])
        });
    } catch (error) {
         await LogServerError(req, error);
        console.error("Failed to fetch vendor API keys:", error);
        return res.status(500).json({
            status: "failed",
            success: false,
            message: "Internal server error"
        });
    }
}