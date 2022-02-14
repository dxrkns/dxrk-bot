import { Sequelize } from "sequelize";

export default new Sequelize(process.env.db_Url);
