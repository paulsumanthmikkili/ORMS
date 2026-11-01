import { CreateApiKey, GetAllApiKeys, GetVendorApiKeys, CreateEnvironment, CreateProject } from "../controllers/apiKey.controller";
import { AuthenticateRequest } from "../Middlewares/DashBoard_MiddleWare";
import { CreateApiKeyValidation } from "../Validation/CreateApiMiddleware";
import { CreateEnvironmentValidation, CreateProjectValidation } from "../Validation/ResourceValidation";
import { ValidateBody } from "../Validation/Validate";
import { Router } from "express";


const apiKeyRoute = Router();

apiKeyRoute.post(
    "/api-keys",
    AuthenticateRequest,
    ValidateBody(CreateApiKeyValidation),
    CreateApiKey
);
apiKeyRoute.get("/api-keys", AuthenticateRequest, GetAllApiKeys);
apiKeyRoute.get("/vendor-api-keys", AuthenticateRequest, GetVendorApiKeys);
apiKeyRoute.post(
    "/environments",
    AuthenticateRequest,
    ValidateBody(CreateEnvironmentValidation),
    CreateEnvironment
);
apiKeyRoute.post(
    "/projects",
    AuthenticateRequest,
    ValidateBody(CreateProjectValidation),
    CreateProject
);
export default apiKeyRoute;
