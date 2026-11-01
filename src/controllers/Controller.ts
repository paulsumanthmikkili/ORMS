import { Request, Response } from "express";
import { Authenticate } from "../Middlewares/DashBoard_MiddleWare";
import { Api_key } from "../models/Api_Key";
import { Vendor } from "../models/Vendor"
import argon2 from "argon2";
import jwt from "jsonwebtoken";
import { LogServerError } from "../serverlogs/serverlogs";
import { serializeResponse } from "../helpers/h";
import { Creation } from "../services/RabbitMq";
import { sequelize } from "../config/database";
import { Developer } from "../models/Develpoer";
import { success } from "zod";


export const Register = async (req: Request, res: Response) => {
    console.log("register hited")
    try {
        const { name, email, password,username, confirmPassword } = req.body as {
            name: string,
            email: string,
            username?: string;
            password: string,
            confirmPassword: string
        }
        console.log("entered")

        const exist = await Vendor.findOne({ where: { email } });
        
        if (exist) {
            return res.status(409).json({
                status: "failed",
                success: false,
                message: "User already exists"
            });
        }
        const hashPassword = await argon2.hash(password);
        const vendor = await Vendor.create({name, email, password: hashPassword });
        //call microservice endpoint here, vendor need to create in user microservice with diff usertype id.
        // await Micro(name,email,password,"vendor");
        console.log("microservice called");
        await Creation(name,email,password,username,"vendor")


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
        console.log("failed to register",error)
         await LogServerError(req, error);
        return res.status(500).json({
            status: "failed",
            success: false,
            message: "Internal server error"
        });
    }
}

//login
export const Login = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body as { email: string; password: string };
        const userExist = await Vendor.findOne({ where: { email } });
        if (!userExist) {
            return res.status(400).json({
                status: "failed",
                success: false,
                message: "User does not exist; please register"
            });
        }
        const hashPassword = await argon2.verify(userExist.password, password);
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

        const accessToken = jwt.sign(tokenData, secret, { expiresIn: "1h" });
        const refreshToken = jwt.sign(tokenData, refreshSecret, { expiresIn: "28d" });
        return res.status(200).json({
            status: "success",
            success: true,
            accessToken,
            refreshToken
        });
    } catch (error) {
        console.error("Failed to log in:", error);
         await LogServerError(req, error);
        return res.status(500).json({
            status: "failed",
            success: false,
            message: "Internal server error"
        });
    }
}


// Dashboard
export const Dashboard = async(req: Authenticate, res: Response) => {
    try {
        return res.status(200).json({
            status: "success",
            success: true,
            data: serializeResponse(req.user)
        });
    } catch (error) {
         await LogServerError(req, error);
        console.error("Failed to load dashboard:", error);
        
        return res.status(500).json({
            status: "failed",
            success: false,
            message: "Internal server error"
        });
    }
}
export const GetAllUsers = async (req: Request, res: Response) => {
    try {
        const vendors = await Vendor.findAll({
            attributes: ["id", "name", "email", "phone_number", "created_at", "updated_at"]
        });
        return res.status(200).json({
            status: "success",
            success: true,
            data: serializeResponse(vendors)
        });
    }
    catch (error) {
         await LogServerError(req, error);
        console.error("Failed to get users:", error);
        return res.status(500).json({
            status: "failed",
            success: false,
            message: "Internal server error"
        });
    }
}

//one - to -one
export const GetUserById = async (req: Request, res: Response) => {
    try {
        const id = Number(req.params.id);
        const vendor = await Vendor.findByPk(id, {
            attributes: ["id", "name", "email", "phone_number", "created_at", "updated_at"]
        });
        if (!vendor) {
            return res.status(404).json({
                status: "failed",
                success: false,
                message: {
                    message: "User does not exist in the database",
                }
            })
        }
        else {
            return res.status(200).json({
                status: "success",
                success: true,
                message: {
                    message: "User data",
                    data: serializeResponse(vendor)
                }
            })
        }
    } catch (error) {
         await LogServerError(req, error);
        console.error("Failed to get user:", error);
        return res.status(500).json({
            status: "failed",
            success: false,
            message: "Internal server error"
        })
    }
}

export const GetDashboardApiData = async (req: Authenticate, res: Response) => {
    try {
        if (!req.user) {
            return res.status(401).json({
                status: "failed",
                success: false,
                message: "Authentication is required"
            });
        }
        const apiKeys = await Api_key.findAll({ where: { vendor_id: req.user.userId } });
        return res.status(200).json({
            status: "success",
            success: true,
            data: serializeResponse(apiKeys)
        });
    } catch (error) {
         await LogServerError(req, error);
        console.error("Failed to load dashboard API data:", error);
        return res.status(500).json({
            status: "failed",
            success: false,
            message: "Internal server error"
        });
    }
}

export const DeveloperData=async(req:Request,res:Response)=>{
    const {email} =req.body as {
        email:string
    }
    const data=await Developer.findOne({
        where:{
            email:email
        }
    })
    if(data){
        return res.status(404).json({
            status:"failed",
            success:false,
            message:"email is already exisit in the developer table"
        })
    }
    else{
        await Developer.create({
            email:email
        })
        return res.status(200).json({
            status:"success",
            success:true,
            message:"Developer created successfully"
        })
    }
    
}


//parnodi delete
export const DeleteUser=async(req:Request,res:Response)=>{
    const id=req.params.id;
    const data=await Vendor.findOne({
        where:{
            id:id,
        },
        attributes:{
            exclude:["password"]
        }
    })
    if(!data){
        return res.status(404).json({
            status:"failed",
            success:false,
            message:"Vendor does not exist"
        })
    }
    else{
        await data.destroy();
        return res.status(200).json({
            status:"success",
            success:true,
            message:"user delete successsfully",
            data:data
        })
    }
}

//transcation
//managed transcation
export const Transcation = async (req: Request, res: Response) => {
    const { name, email, password } = req.body;

    try {
        const result = await sequelize.transaction(async (t) => {

            const user = await Vendor.create(
                {
                    name,
                    email,
                    password
                },
                {
                    transaction: t
                }
            );

            console.log("Vendor created inside transaction:", user.id);

            throw new Error("Testing transaction rollback");
        });

        return res.status(201).json({
            success: true,
            message: "Vendor created successfully",
            data: result
        });

    } catch (err) {
        console.log("Transaction failed. Rollback triggered:", err);

        return res.status(500).json({
            success: false,
            message: "Transaction failed. Changes rolled back."
        });
    }
};