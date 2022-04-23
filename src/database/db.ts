import { Sequelize } from "sequelize";
import pg from "pg";

if (process.env.environment === "prod" || process.env.environment === "debug")
  pg.defaults.ssl = { rejectUnauthorized: false };

export default new Sequelize(process.env.DATABASE_URL);
// export default new Sequelize(
//   process.env.db_name,
//   process.env.db_user,
//   process.env.db_pass,
//   {
//     host: process.env.db_host,
//     dialect: "postgres",
//     port: parseFloat(process.env.db_port),
//   }
// );
