
import {
    CreationOptional,
    DataTypes,
    InferAttributes,
    InferCreationAttributes,
    Model,
} from "sequelize";

import { sequelize } from "../config/database";

class ServerLog extends Model<
    InferAttributes<ServerLog>,
    InferCreationAttributes<ServerLog>
> {
    declare log_id: CreationOptional<number>;
    declare user_id: CreationOptional<number | null>;
    declare request_body: CreationOptional<object | null>;
    declare error_message: string;
    declare route: string;
    declare created_at: CreationOptional<Date>;
    declare update_at: CreationOptional<Date>;
}

ServerLog.init(
    {
        log_id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        request_body: {
            type: DataTypes.JSONB,
            allowNull: true,
        },
        error_message: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        route: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        created_at: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW,
        },
         update_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
    },
    {
        sequelize,
        tableName: "server_logs",
        timestamps: true,
    }
);

export { ServerLog };
