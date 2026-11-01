"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Permisssion = void 0;
const sequelize_1 = require("sequelize");
const database_1 = require("../config/database");
const Vendor_1 = require("./Vendor");
class Permisssion extends sequelize_1.Model {
}
exports.Permisssion = Permisssion;
Permisssion.init({
    permission_id: {
        type: sequelize_1.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    permission_name: { type: sequelize_1.DataTypes.STRING, allowNull: false },
    vendor_id: {
        type: sequelize_1.DataTypes.INTEGER,
        references: { model: Vendor_1.Vendor, key: "id" },
    },
}, {
    sequelize: database_1.sequelize,
    tableName: "Permisssion",
    timestamps: false,
});
