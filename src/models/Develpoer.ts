import { sequelize } from "../config/database";
import { DataTypes,InferAttributes,InferCreationAttributes,Model ,CreationOptional} from "sequelize";

class Developer extends Model<InferAttributes<Developer>,InferCreationAttributes<Developer>>{
    declare id:CreationOptional<number>;
    declare email:string
    declare createdAt:CreationOptional<Date>;
    declare updatedAt:CreationOptional<Date>;
}
Developer.init({
    id:{
        type:DataTypes.INTEGER,autoIncrement:true,primaryKey:true,allowNull:false
    },
    email:{
        type:DataTypes.STRING,allowNull:false,unique:true
    },
    createdAt:{
        type:DataTypes.DATE,allowNull:false
    },
    updatedAt:{
        type:DataTypes.DATE,allowNull:false
    }
},{
    sequelize,
    tableName:'Developer',
    timestamps:true,
    createdAt:"createdAt",
    updatedAt:"updatedAt",
    paranoid:true,
    version:true
});

export {Developer}
