import {
    CreationOptional,
    DataTypes,
    InferAttributes,
    InferCreationAttributes,
    Model,
} from "sequelize";
import { sequelize } from "../config/database";

class Environment extends Model<
    InferAttributes<Environment>,
    InferCreationAttributes<Environment>
> {
    declare environment_id: CreationOptional<number>;
    declare environment_name: string;
}

Environment.init(
    {
        environment_id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        environment_name: { type: DataTypes.STRING, allowNull: false },
    },
    {
        sequelize,
        tableName: "Environment",
        timestamps: false,
    },
);

export {Environment}