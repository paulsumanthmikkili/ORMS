
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

class Permisssion extends Model<
    InferAttributes<Permisssion>,
    InferCreationAttributes<Permisssion>
> {
    declare permission_id: CreationOptional<number>;
    declare permission_name: string;
    declare vendor_id: ForeignKey<Vendor["id"]>;
}

Permisssion.init(
    {
        permission_id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        permission_name: { type: DataTypes.STRING, allowNull: false },
        vendor_id: {
            type: DataTypes.INTEGER,
            references: { model: Vendor, key: "id" },
        },
    },
    {
        sequelize,
        tableName: "Permisssion",
        timestamps: false,
    },
);

export {Permisssion};