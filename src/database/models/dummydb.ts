import { Model, BuildOptions, Sequelize, DataTypes } from "sequelize";
import db from "../db";
// change CollectionChannel
export interface IDatabase {
  id: string;
  //interfaces
}

export interface DatabaseModel extends Model<IDatabase>, IDatabase {}

export class Database extends Model<DatabaseModel, IDatabase> {}

export type DatabaseStatic = typeof Model & {
  new (values?: object, options?: BuildOptions): DatabaseModel;
};

function DatabaseFactory(sequelize: Sequelize): DatabaseStatic {
  return <DatabaseStatic>sequelize.define("Database", {
    id: { type: DataTypes.STRING, primaryKey: true },
    //db values
  });
}
export const DatabaseDB = DatabaseFactory(db);
