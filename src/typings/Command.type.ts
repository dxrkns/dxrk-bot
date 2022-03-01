import { ExtendClient } from "../structures/Client";
import {
  ChatInputApplicationCommandData,
  CommandInteraction,
  CommandInteractionOptionResolver,
  PermissionResolvable,
  GuildMember,
  ApplicationCommand,
  Guild,
  Collection,
} from "discord.js";

export interface ExtendedInteraction extends CommandInteraction {
  member: GuildMember;
}

interface RunOptions {
  bot: ExtendClient;
  interaction: ExtendedInteraction;
  args: CommandInteractionOptionResolver;
}

type RunFunction = (option: RunOptions) => any;

type IPermissionType = "BotOwner" | "ServerOwner" | "Admins" | "OpenToAll";

export type CommandType = {
  userPermissions?: PermissionResolvable;
  title: string;
  category: string; //Can be Name of the folder file is in
  permissionType: IPermissionType[];
  run: RunFunction;
} & ChatInputApplicationCommandData;

export type SetPermissions = {
  guild?: Guild;
  commandCollection: Collection<string, ApplicationCommand<{}>>;
  commands: CommandType[];
};
