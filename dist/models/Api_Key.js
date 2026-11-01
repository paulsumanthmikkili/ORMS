"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Api_key = void 0;
const sequelize_1 = require("sequelize");
const database_1 = require("../config/database");
const Vendor_1 = require("./Vendor");
const Envirnoment_1 = require("./Envirnoment");
const project_1 = require("./project");
class Api_key extends sequelize_1.Model {
}
exports.Api_key = Api_key;
Api_key.init({
    api_key_id: {
        type: sequelize_1.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    api_key_name: { type: sequelize_1.DataTypes.STRING, allowNull: false },
    vendor_id: {
        type: sequelize_1.DataTypes.INTEGER, allowNull: false,
        references: { model: Vendor_1.Vendor, key: "id" },
    },
    environment_id: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        references: { model: Envirnoment_1.Environment, key: "environment_id" },
    },
    project_id: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        references: { model: project_1.Project, key: "project_id" },
    },
    usage_limit: { type: sequelize_1.DataTypes.INTEGER },
    monthly_cost: { type: sequelize_1.DataTypes.DECIMAL },
    status: { type: sequelize_1.DataTypes.BOOLEAN, defaultValue: false },
    permission: { type: sequelize_1.DataTypes.BOOLEAN, defaultValue: false },
}, {
    sequelize: database_1.sequelize,
    tableName: "Api_key",
    timestamps: false,
});
