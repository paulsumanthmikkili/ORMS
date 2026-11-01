"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const swagger_autogen_1 = __importDefault(require("swagger-autogen"));
const swagger = (0, swagger_autogen_1.default)({
    openapi: "3.0.0",
});
const outputFile = "./src/swagger-output.json";
const endpointsFiles = ["./src/routers/routes.ts"];
const doc = {
    info: {
        title: "Vendor Project API",
        version: "1.0.0",
        description: "Vendor project API documentation",
    },
    servers: [
        {
            url: "http://localhost:5000/api",
        },
    ],
};
swagger(outputFile, endpointsFiles, doc);
