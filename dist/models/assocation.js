"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Vendor_1 = require("./Vendor");
const Permission_1 = require("./Permission");
const Envirnoment_1 = require("./Envirnoment");
const Api_Key_1 = require("./Api_Key");
const project_1 = require("./project");
Vendor_1.Vendor.hasOne(Permission_1.Permisssion, {
    foreignKey: "vendor_id",
    as: "Permission"
});
Permission_1.Permisssion.belongsTo(Vendor_1.Vendor, {
    foreignKey: "vendor_id",
    as: "Vendor"
});
//api
Vendor_1.Vendor.hasMany(Api_Key_1.Api_key, {
    foreignKey: "vendor_id",
    as: "api_keys",
});
Api_Key_1.Api_key.belongsTo(Vendor_1.Vendor, {
    foreignKey: "vendor_id",
    as: "Vendor",
});
Envirnoment_1.Environment.hasMany(Api_Key_1.Api_key, {
    foreignKey: "environment_id",
    as: "apiKeys",
});
Api_Key_1.Api_key.belongsTo(Envirnoment_1.Environment, {
    foreignKey: "environment_id",
    as: "environment",
});
Envirnoment_1.Environment.hasMany(project_1.Project, {
    foreignKey: "environment_id",
    as: "projects",
});
project_1.Project.belongsTo(Envirnoment_1.Environment, {
    foreignKey: "environment_id",
    as: "environment",
});
