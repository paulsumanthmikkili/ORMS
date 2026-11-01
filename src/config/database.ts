// import process from 'process'
import { Sequelize } from "sequelize";
import dotenv from 'dotenv';
dotenv.config();

export const sequelize=new Sequelize({
    host:process.env.DB_HOST  ?? "localhost",
    database:process.env.DB_NAME,
    username:process.env.DB_USERNAME,
    password:process.env.DB_PASSWORD,
    port:Number(process.env.DB_PORT),
    dialect:"postgres"
})

