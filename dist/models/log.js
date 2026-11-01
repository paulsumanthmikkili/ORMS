"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServerLog = void 0;
const sequelize_1 = require("sequelize");
const database_1 = require("../config/database");
class ServerLog extends sequelize_1.Model {
}
exports.ServerLog = ServerLog;
ServerLog.init({
    log_id: {
        type: sequelize_1.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    user_id: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: true,
    },
    request_body: {
        type: sequelize_1.DataTypes.JSONB,
        allowNull: true,
    },
    error_message: {
        type: sequelize_1.DataTypes.TEXT,
        allowNull: false,
    },
    route: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    created_at: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: false,
        defaultValue: sequelize_1.DataTypes.NOW,
    },
    update_at: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: false,
        defaultValue: sequelize_1.DataTypes.NOW,
    },
}, {
    sequelize: database_1.sequelize,
    tableName: "server_logs",
    timestamps: true,
});
