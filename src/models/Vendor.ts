import { Model,InferAttributes,InferCreationAttributes,CreationOptional, DataTypes } from "sequelize";
import { sequelize } from "../config/database";

class Vendor extends Model<InferAttributes<Vendor>,InferCreationAttributes<Vendor>>{
        declare id:CreationOptional<number>;
        declare name:string;
        declare email:string;
        declare password:string;
        declare created_at:CreationOptional<Date>;
        declare updated_at:CreationOptional<Date>;
        declare phone_number: string | null;
}
Vendor.init({
    id:{type:DataTypes.INTEGER,autoIncrement:true,primaryKey:true},
    name:{type:DataTypes.STRING,allowNull:false},
    email:{type:DataTypes.STRING,allowNull:false,unique:true},
    password:{type:DataTypes.STRING,allowNull:false},
    created_at:{type:DataTypes.DATE,allowNull:false},
    updated_at:{type:DataTypes.DATE,allowNull:false},
    phone_number: {
    type: DataTypes.STRING,
    allowNull: true,
},
},{
    sequelize,
    tableName:"Vendor",
    timestamps:true,
    createdAt: "created_at",
    updatedAt: "updated_at",
    hooks:{
        beforeCreate:(Vendor,option)=>{
            console.log("before created Hokk:Hashing password",);
        }
    },
    paranoid:true,
    deletedAt:"deleteAt"
})


export {Vendor};