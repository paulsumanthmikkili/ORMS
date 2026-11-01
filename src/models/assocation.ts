import { Vendor } from "./Vendor";
import { Permisssion } from "./Permission";
import { Environment } from "./Envirnoment";
import { Api_key } from "./Api_Key";
import { Project } from "./project";



Vendor.hasOne(Permisssion,{
    foreignKey:"vendor_id",
    as:"Permission"
})

Permisssion.belongsTo(Vendor,{
    foreignKey:"vendor_id", 
    as:"Vendor"
})

//api
Vendor.hasMany(Api_key, {
  foreignKey: "vendor_id",
  as: "api_keys",
});

Api_key.belongsTo(Vendor, {
  foreignKey: "vendor_id",
  as: "Vendor",
});


Environment.hasMany(Api_key, {
  foreignKey: "environment_id",
  as: "apiKeys",
});

Api_key.belongsTo(Environment, {
  foreignKey: "environment_id",
  as: "environment",
});


Environment.hasMany(Project, {
  foreignKey: "environment_id",
  as: "projects",
});


Project.belongsTo(Environment, {
  foreignKey: "environment_id",
  as: "environment",
});

