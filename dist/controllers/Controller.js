"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetDashboardApiData = exports.GetUserById = exports.GetVendorApiKeys = exports.CreateProject = exports.CreateEnvironment = exports.GetAllApiKeys = exports.CreateApiKey = exports.GetAllUsers = exports.Dashboard = exports.Login = exports.Register = void 0;
const Api_Key_1 = require("../models/Api_Key");
const Envirnoment_1 = require("../models/Envirnoment");
const Vendor_1 = require("../models/Vendor");
const argon2_1 = __importDefault(require("argon2"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const project_1 = require("../models/project");
const serverlogs_1 = require("../serverlogs/serverlogs");
const toCamelCase = (key) => key.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
const serializeResponse = (value) => {
    if (Array.isArray(value)) {
        return value.map(serializeResponse);
    }
    if (value instanceof Date || value === null || typeof value !== "object") {
        return value;
    }
    const plainValue = "toJSON" in value && typeof value.toJSON === "function"
        ? value.toJSON()
        : value;
    return Object.fromEntries(Object.entries(plainValue).map(([key, item]) => [
        toCamelCase(key),
        serializeResponse(item)
    ]));
};
// Register
const Register = async (req, res) => {
    try {
        const { name, email, password, confirmPassword } = req.body;
        console.log("entered");
        const exist = await Vendor_1.Vendor.findOne({ where: { email } });
        // if (exist) {
        //     return res.status(409).json({
        //         status: "failed",
        //         success: false,
        //         message: "User already exists"
        //     });
        // }
        const hashPassword = await argon2_1.default.hash(password);
        const vendor = await Vendor_1.Vendor.create({ name, email, password: hashPassword });
        return res.status(201).json({
            status: "success",
            success: true,
            message: "User registered successfully",
            data: serializeResponse({
                id: vendor.id,
                name: vendor.name,
                email: vendor.email,
                phone_number: vendor.phone_number,
                created_at: vendor.created_at,
                updated_at: vendor.updated_at
            })
        });
    }
    catch (error) {
        console.error("Failed to register user:", error);
        console.log("failed to register", error);
        await (0, serverlogs_1.LogServerError)(req, error);
        return res.status(500).json({
            status: "failed",
            success: false,
            message: "Internal server error"
        });
    }
};
exports.Register = Register;
//login
const Login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const userExist = await Vendor_1.Vendor.findOne({ where: { email } });
        if (!userExist) {
            return res.status(400).json({
                status: "failed",
                success: false,
                message: "User does not exist; please register"
            });
        }
        const hashPassword = await argon2_1.default.verify(userExist.password, password);
        if (!hashPassword) {
            return res.status(400).json({
                status: "failed",
                success: false,
                message: "Incorrect password"
            });
        }
        const tokenData = {
            userId: userExist.id,
            username: userExist.name,
            email: userExist.email
        };
        const secret = process.env.JWT_SECRET;
        if (!secret) {
            return res.status(500).json({
                status: "failed",
                success: false,
                message: "JWT secret is not configured"
            });
        }
        const refreshSecret = process.env.JWT_Refresh;
        if (!refreshSecret) {
            return res.status(500).json({
                status: "failed",
                success: false,
                message: "JWT refresh secret is not configured"
            });
        }
        const accessToken = jsonwebtoken_1.default.sign(tokenData, secret, { expiresIn: "1h" });
        const refreshToken = jsonwebtoken_1.default.sign(tokenData, refreshSecret, { expiresIn: "28d" });
        return res.status(200).json({
            status: "success",
            success: true,
            accessToken,
            refreshToken
        });
    }
    catch (error) {
        console.error("Failed to log in:", error);
        await (0, serverlogs_1.LogServerError)(req, error);
        return res.status(500).json({
            status: "failed",
            success: false,
            message: "Internal server error"
        });
    }
};
exports.Login = Login;
// Dashboard
const Dashboard = async (req, res) => {
    try {
        return res.status(200).json({
            status: "success",
            success: true,
            data: serializeResponse(req.user)
        });
    }
    catch (error) {
        await (0, serverlogs_1.LogServerError)(req, error);
        console.error("Failed to load dashboard:", error);
        return res.status(500).json({
            status: "failed",
            success: false,
            message: "Internal server error"
        });
    }
};
exports.Dashboard = Dashboard;
const GetAllUsers = async (req, res) => {
    try {
        const vendors = await Vendor_1.Vendor.findAll({
            attributes: ["id", "name", "email", "phone_number", "created_at", "updated_at"]
        });
        return res.status(200).json({
            status: "success",
            success: true,
            data: serializeResponse(vendors)
        });
    }
    catch (error) {
        await (0, serverlogs_1.LogServerError)(req, error);
        console.error("Failed to get users:", error);
        return res.status(500).json({
            status: "failed",
            success: false,
            message: "Internal server error"
        });
    }
};
exports.GetAllUsers = GetAllUsers;
const CreateApiKey = async (req, res) => {
    try {
        const { name, environmentId, projectId, usageLimit, setPermission } = req.body;
        const user = req.user;
        if (!user) {
            return res.status(401).json({
                status: "failed",
                success: false,
                message: "Authentication is required"
            });
        }
        const environment = await Envirnoment_1.Environment.findByPk(environmentId);
        if (!environment) {
            return res.status(404).json({
                status: "failed",
                success: false,
                message: "Environment not found"
            });
        }
        const project = await project_1.Project.findOne({ where: { project_id: projectId, environment_id: environmentId } });
        if (!project) {
            return res.status(404).json({
                status: "failed",
                success: false,
                message: "Project not found for the selected environment"
            });
        }
        const apiKey = await Api_Key_1.Api_key.create({
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
        await (0, serverlogs_1.LogServerError)(req, error);
        console.error("Failed to create API key:", error);
        return res.status(500).json({
            status: "failed",
            success: false,
            message: "Internal server error"
        });
    }
};
exports.CreateApiKey = CreateApiKey;
const GetAllApiKeys = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({
                status: "failed",
                success: false,
                message: "Authentication is required"
            });
        }
        const apiKeys = await Api_Key_1.Api_key.findAll({
            where: { vendor_id: req.user.userId },
            include: [
                {
                    model: Envirnoment_1.Environment,
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
        await (0, serverlogs_1.LogServerError)(req, error);
        console.error("Failed to get API keys:", error);
        return res.status(500).json({
            status: "failed",
            success: false,
            message: "Internal server error"
        });
    }
};
exports.GetAllApiKeys = GetAllApiKeys;
const CreateEnvironment = async (req, res) => {
    try {
        const { environmentName } = req.body;
        const environment = await Envirnoment_1.Environment.create({ environment_name: environmentName });
        return res.status(201).json({
            status: "success",
            success: true,
            message: "Environment created successfully",
            data: serializeResponse(environment)
        });
    }
    catch (error) {
        await (0, serverlogs_1.LogServerError)(req, error);
        console.error("Failed to create environment:", error);
        return res.status(500).json({
            status: "failed",
            success: false,
            message: "Internal server error"
        });
    }
};
exports.CreateEnvironment = CreateEnvironment;
const CreateProject = async (req, res) => {
    try {
        const { projectName, environmentId } = req.body;
        const environment = await Envirnoment_1.Environment.findByPk(environmentId);
        if (!environment) {
            return res.status(404).json({
                status: "failed",
                success: false,
                message: "Environment is not available"
            });
        }
        const data = await project_1.Project.create({
            project_name: projectName,
            environment_id: environment.environment_id
        });
        return res.status(201).json({
            status: "success",
            success: true,
            message: "Project created successfully",
            data: serializeResponse(data)
        });
    }
    catch (error) {
        await (0, serverlogs_1.LogServerError)(req, error);
        console.error("Failed to create project:", error);
        return res.status(500).json({
            status: "failed",
            success: false,
            message: "Internal server error"
        });
    }
};
exports.CreateProject = CreateProject;
const GetVendorApiKeys = async (req, res) => {
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
        const customerApiKeys = await Vendor_1.Vendor.findByPk(user.userId, {
            include: [{
                    model: Api_Key_1.Api_key,
                    as: "api_keys"
                }]
        });
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
    }
    catch (error) {
        await (0, serverlogs_1.LogServerError)(req, error);
        console.error("Failed to fetch vendor API keys:", error);
        return res.status(500).json({
            status: "failed",
            success: false,
            message: "Internal server error"
        });
    }
};
exports.GetVendorApiKeys = GetVendorApiKeys;
//one - to -one
const GetUserById = async (req, res) => {
    try {
        const id = Number(req.params.id);
        const vendor = await Vendor_1.Vendor.findByPk(id, {
            attributes: ["id", "name", "email", "phone_number", "created_at", "updated_at"]
        });
        if (!vendor) {
            return res.status(404).json({
                status: "failed",
                success: false,
                message: {
                    message: "User does not exist in the database",
                }
            });
        }
        else {
            return res.status(200).json({
                status: "success",
                success: true,
                message: {
                    message: "User data",
                    data: serializeResponse(vendor)
                }
            });
        }
    }
    catch (error) {
        await (0, serverlogs_1.LogServerError)(req, error);
        console.error("Failed to get user:", error);
        return res.status(500).json({
            status: "failed",
            success: false,
            message: "Internal server error"
        });
    }
};
exports.GetUserById = GetUserById;
const GetDashboardApiData = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({
                status: "failed",
                success: false,
                message: "Authentication is required"
            });
        }
        const apiKeys = await Api_Key_1.Api_key.findAll({ where: { vendor_id: req.user.userId } });
        return res.status(200).json({
            status: "success",
            success: true,
            data: serializeResponse(apiKeys)
        });
    }
    catch (error) {
        await (0, serverlogs_1.LogServerError)(req, error);
        console.error("Failed to load dashboard API data:", error);
        return res.status(500).json({
            status: "failed",
            success: false,
            message: "Internal server error"
        });
    }
};
exports.GetDashboardApiData = GetDashboardApiData;
