import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser'
import router from './routers/routes';
import './models/assocation';
import './models/log';
import './models/Develpoer'

dotenv.config();
const PORT=Number(process.env.PORT ?? 5000);
import {sequelize} from './config/database';
const app=express();
import swaggerUiExpress from "swagger-ui-express";
import swaggerDocument from '../src/swagger/swagger-output.json';
import apiKeyRoute from './routers/apiKey.route';

app.use(
  "/api-docs",
  swaggerUiExpress.serve,
  swaggerUiExpress.setup(swaggerDocument)
);
//middleware
app.use(express.json());
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static(__dirname));
app.use(cors());
app.set('view engine','ejs');
app.set('./views','view');
app.use(cookieParser());

//routers
app.use('/api',router);
app.use('/api-key',apiKeyRoute);


const startServer = async () => {
  try {
    await sequelize.authenticate();
    console.log("Database connected successfully");
    await sequelize.sync({alter:true});
    // console.log("Tables synchronized successfully");
    app.listen(PORT,()=>{
      console.log(`server is running at http://localhost:${PORT}`)
    });
  } catch (error) {
    console.error("Server startup failed:", error);
    process.exitCode = 1;
  }
};

startServer();







