import {
    CreationOptional,
    DataTypes,
    ForeignKey,
    InferAttributes,
    InferCreationAttributes,
    Model,
} from "sequelize";
import { sequelize } from "../config/database";
import { Vendor } from "./Vendor";
import { Environment } from "./Envirnoment";
import { Project } from "./project";

class Api_key extends Model<
    InferAttributes<Api_key>,
    InferCreationAttributes<Api_key>
> {
    declare api_key_id: CreationOptional<number>;
    declare api_key_name: string;
    declare vendor_id: ForeignKey<Vendor["id"]>
    declare environment_id: ForeignKey<Environment["environment_id"]>;
    declare project_id: ForeignKey<Project["project_id"]>;
    declare usage_limit: CreationOptional<number | null>;
    declare monthly_cost: CreationOptional<number | null>;
    declare status: CreationOptional<boolean>;
    declare permission: CreationOptional<boolean>;
}

Api_key.init(
    {
        api_key_id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        api_key_name: { type: DataTypes.STRING, allowNull: false },
        vendor_id: {
            type: DataTypes.INTEGER,allowNull:false,
            references: { model: Vendor, key: "id" },
        },
        environment_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: { model: Environment, key: "environment_id" },
        },
        project_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: { model: Project, key: "project_id" },
        },
        usage_limit: { type: DataTypes.INTEGER },
        monthly_cost: { type: DataTypes.DECIMAL },
        status: { type: DataTypes.BOOLEAN, defaultValue: false },
        permission: { type: DataTypes.BOOLEAN, defaultValue: false },
    },
    {
        sequelize,
        tableName: "Api_key",
        timestamps: false,
    },
);

export {Api_key}