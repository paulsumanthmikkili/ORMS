import swaggerAutogen from "swagger-autogen";

const swagger = swaggerAutogen({
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