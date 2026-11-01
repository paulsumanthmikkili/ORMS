"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Environment = void 0;
const sequelize_1 = require("sequelize");
const database_1 = require("../config/database");
class Environment extends sequelize_1.Model {
}
exports.Environment = Environment;
Environment.init({
    environment_id: {
        type: sequelize_1.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    environment_name: { type: sequelize_1.DataTypes.STRING, allowNull: false },
}, {
    sequelize: database_1.sequelize,
    tableName: "Environment",
    timestamps: false,
});
