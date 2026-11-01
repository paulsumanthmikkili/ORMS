"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Project = void 0;
const database_1 = require("../config/database");
const sequelize_1 = require("sequelize");
const Envirnoment_1 = require("../models/Envirnoment");
class Project extends sequelize_1.Model {
}
exports.Project = Project;
Project.init({
    project_id: { type: sequelize_1.DataTypes.INTEGER, allowNull: false, autoIncrement: true, primaryKey: true },
    project_name: { type: sequelize_1.DataTypes.STRING, allowNull: false },
    environment_id: { type: sequelize_1.DataTypes.INTEGER, allowNull: false, references: {
            model: Envirnoment_1.Environment,
            key: "environment_id"
        } }
}, {
    sequelize: database_1.sequelize,
    tableName: "Project"
});
