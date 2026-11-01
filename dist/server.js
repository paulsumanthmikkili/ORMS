"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const routes_1 = __importDefault(require("./routers/routes"));
require("./models/assocation");
require("./models/log");
dotenv_1.default.config();
const PORT = Number(process.env.PORT ?? 5000);
const database_1 = require("./config/database");
const app = (0, express_1.default)();
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const swagger_output_json_1 = __importDefault(require("../src/swagger-output.json"));
app.use("/api-docs", swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swagger_output_json_1.default));
//middleware
app.use(express_1.default.json());
app.use(body_parser_1.default.urlencoded({ extended: true }));
app.use(express_1.default.static(__dirname));
app.use((0, cors_1.default)());
app.set('view engine', 'ejs');
app.set('./views', 'view');
app.use((0, cookie_parser_1.default)());
//routers
app.use('/api', routes_1.default);
const startServer = async () => {
    try {
        await database_1.sequelize.authenticate();
        console.log("Database connected successfully");
        await database_1.sequelize.sync({ alter: true });
        // console.log("Tables synchronized successfully");
        app.listen(PORT, () => {
            console.log(`server is running at http://localhost:${PORT}`);
        });
    }
    catch (error) {
        console.error("Server startup failed:", error);
        process.exitCode = 1;
    }
};
startServer();
