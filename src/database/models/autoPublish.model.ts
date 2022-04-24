import { Model, BuildOptions, Sequelize, DataTypes } from "sequelize";
import db from "../db";

export interface IAutoPublish {
  id: string;
  channel: string;
  guildId: string;
  guildName: string;
  adminId: string;
  adminName: string;
}

export interface AutoPublishModel extends Model<IAutoPublish>, IAutoPublish {}

export class AutoPublish extends Model<AutoPublishModel, IAutoPublish> {}

export type AutoPublishStatic = typeof Model & {
  new (values?: object, options?: BuildOptions): AutoPublishModel;
};

function AutoPublishFactory(sequelize: Sequelize): AutoPublishStatic {
  return <AutoPublishStatic>sequelize.define(
    "AutoPublish",
    {
      id: { type: DataTypes.STRING, primaryKey: true },
      channel: { type: DataTypes.STRING, allowNull: false },
      guildId: { type: DataTypes.STRING, allowNull: false },
      guildName: { type: DataTypes.STRING, allowNull: false },
      adminId: { type: DataTypes.STRING, allowNull: false },
      adminName: { type: DataTypes.STRING, allowNull: false },
    },
    { freezeTableName: true }
  );
}
export const AutoPublishDB = AutoPublishFactory(db);
