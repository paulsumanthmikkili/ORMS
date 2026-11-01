"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const database_1 = require("../config/database");
class Useraccount extends sequelize_1.Model {
}
Useraccount.init({
    user_id: { type: sequelize_1.DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    name: { type: sequelize_1.DataTypes.STRING, allowNull: false },
    created_on: { type: sequelize_1.DataTypes.DATE },
    update_at: { type: sequelize_1.DataTypes.DATE },
    Status: { type: sequelize_1.DataTypes.BOOLEAN, defaultValue: true },
}, {
    sequelize: database_1.sequelize,
    tableName: "Useraccount",
    timestamps: true,
});
class Environment extends sequelize_1.Model {
}
Environment.init({
    Environment_id: {
        type: sequelize_1.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    Environment_name: { type: sequelize_1.DataTypes.STRING, allowNull: false },
}, {
    sequelize: database_1.sequelize,
    tableName: "Environment",
    timestamps: false,
});
class Api_key extends sequelize_1.Model {
}
Api_key.init({
    Api_key_id: {
        type: sequelize_1.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    Api_key_name: { type: sequelize_1.DataTypes.STRING, allowNull: false },
    User_id: {
        type: sequelize_1.DataTypes.INTEGER,
        references: { model: Useraccount, key: "user_id" },
    },
    Environment_id: {
        type: sequelize_1.DataTypes.INTEGER,
        references: { model: Environment, key: "Environment_id" },
    },
    UsageLimit: { type: sequelize_1.DataTypes.INTEGER },
    Monthly_Cost: { type: sequelize_1.DataTypes.DECIMAL },
    Status: { type: sequelize_1.DataTypes.BOOLEAN, defaultValue: false },
    permission: { type: sequelize_1.DataTypes.BOOLEAN, defaultValue: false },
}, {
    sequelize: database_1.sequelize,
    tableName: "Api_key",
    timestamps: false,
});
class project extends sequelize_1.Model {
}
project.init({
    project_id: {
        type: sequelize_1.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    project_name: { type: sequelize_1.DataTypes.STRING, allowNull: false },
    User_id: {
        type: sequelize_1.DataTypes.INTEGER,
        references: { model: Useraccount, key: "user_id" },
    },
    Environment_id: {
        type: sequelize_1.DataTypes.INTEGER,
        references: { model: Environment, key: "Environment_id" },
    },
}, {
    sequelize: database_1.sequelize,
    tableName: "Projects",
    timestamps: false,
});
class Permisssion extends sequelize_1.Model {
}
Permisssion.init({
    Permission_id: {
        type: sequelize_1.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    Permission_name: { type: sequelize_1.DataTypes.STRING, allowNull: false },
    User_id: {
        type: sequelize_1.DataTypes.INTEGER,
        references: { model: Useraccount, key: "user_id" },
    },
}, {
    sequelize: database_1.sequelize,
    tableName: "Permisssion",
    timestamps: false,
});
exports.default = { Useraccount, Api_key, Permisssion, Environment, project };
