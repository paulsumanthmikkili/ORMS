"use strict";

const renamedColumns = [
  ["Api_key", "Api_key_id", "api_key_id"],
  ["Api_key", "Api_key_name", "api_key_name"],
  ["Api_key", "Environment_id", "environment_id"],
  ["Api_key", "Project_id", "project_id"],
  ["Api_key", "UsageLimit", "usage_limit"],
  ["Api_key", "Monthly_Cost", "monthly_cost"],
  ["Api_key", "Status", "status"],
  ["Permisssion", "Permission_id", "permission_id"],
  ["Permisssion", "Permission_name", "permission_name"],
  ["Project", "Envirnoment_id", "environment_id"],
  ["Vendor", "createAt", "created_at"],
  ["Vendor", "updateAt", "updated_at"],
];

module.exports = {
  async up(queryInterface) {
    for (const [tableName, oldName, newName] of renamedColumns) {
      await queryInterface.renameColumn(tableName, oldName, newName);
    }
  },

  async down(queryInterface) {
    for (const [tableName, oldName, newName] of [...renamedColumns].reverse()) {
      await queryInterface.renameColumn(tableName, newName, oldName);
    }
  },
};
