import { Model, BuildOptions, Sequelize, DataTypes } from "sequelize";
import db from "../db";
// change CollectionChannel
export interface IEmbedChannel {
  id: string;
  inputChannelId: string;
  outputChannelId: string;
  guildId: string;
  guildName: string;
  adminId: string;
  adminName: string;
}

export interface EmbedChannelModel
  extends Model<IEmbedChannel>,
    IEmbedChannel {}

export class EmbedChannel extends Model<EmbedChannelModel, IEmbedChannel> {}

export type EmbedChannelStatic = typeof Model & {
  new (values?: object, options?: BuildOptions): EmbedChannelModel;
};

function EmbedChannelFactory(sequelize: Sequelize): EmbedChannelStatic {
  return <EmbedChannelStatic>sequelize.define(
    "EmbedChannel",
    {
      id: { type: DataTypes.STRING, primaryKey: true },
      inputChannelId: { type: DataTypes.STRING, allowNull: false },
      outputChannelId: { type: DataTypes.STRING, allowNull: false },
      guildId: { type: DataTypes.STRING, allowNull: false },
      guildName: { type: DataTypes.STRING, allowNull: false },
      adminId: { type: DataTypes.STRING, allowNull: false },
      adminName: { type: DataTypes.STRING, allowNull: false },
    },
    { freezeTableName: true }
  );
}
export const EmbedChannelDB = EmbedChannelFactory(db);
