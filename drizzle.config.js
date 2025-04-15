/**@type {import("drizzle-kit").config} */

module.exports = {
    schema: "./utils/schema.js", // Ensure this path is correct
    dialect: "postgresql",
    dbCredentials: {
      url: "postgresql://neondb_owner:npg_YyNm5piUbB8L@ep-wispy-shape-a88kgwbh-pooler.eastus2.azure.neon.tech/neondb?sslmode=require",
    },
  };
  