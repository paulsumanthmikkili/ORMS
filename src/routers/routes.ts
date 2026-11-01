import { Router } from "express";
import {
    Dashboard,
    GetDashboardApiData,
    GetAllUsers,
    GetUserById,
    Register,
    Login,
    DeleteUser,
    Transcation,
    DeveloperData
    
} from "../controllers/Controller";
import { AuthenticateRequest } from "../Middlewares/DashBoard_MiddleWare";
import { LoginValidation } from "../Validation/LoginValidation";

import { RegisterValidation } from "../Validation/RegisterValidation";
import { ValidateBody, ValidateParams } from "../Validation/Validate";
import { UserIdValidation } from "../Validation/ResourceValidation";

const router = Router();

router.post("/register", ValidateBody(RegisterValidation), Register);
router.post("/login", ValidateBody(LoginValidation), Login);
router.get("/dashboard", AuthenticateRequest, Dashboard);
router.get("/all-users", GetAllUsers);
router.get("/users/:id", ValidateParams(UserIdValidation), GetUserById);

router.get("/dashboard/api-keys", AuthenticateRequest, GetDashboardApiData);
router.delete("/delete/:id",DeleteUser );
router.post('/transcation',Transcation);
router.post('/developer-creation',DeveloperData)
export default router;
