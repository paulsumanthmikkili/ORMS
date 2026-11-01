import {sequelize} from "../config/database";
import { InferAttributes,InferCreationAttributes,CreationOptional, Model, ForeignKey, DataTypes } from "sequelize";
import {Environment} from '../models/Envirnoment'

class Project extends Model<InferAttributes<Project>,InferCreationAttributes<Project>>{
    declare project_id:CreationOptional<number>;
    declare project_name:string;
    declare environment_id:ForeignKey<Environment["environment_id"]>;
}

Project.init({
    project_id:{type:DataTypes.INTEGER,allowNull:false,autoIncrement:true,primaryKey:true},
    project_name:{type:DataTypes.STRING,allowNull:false},
    environment_id:{type:DataTypes.INTEGER,allowNull:false,references:{
        model:Environment,
        key:"environment_id"
    }}
},{
    sequelize,
    tableName:"Project"
})

export {Project}