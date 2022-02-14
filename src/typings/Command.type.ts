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

export type CommandType = {
  userPermissions?: PermissionResolvable;
  run: RunFunction;
} & ChatInputApplicationCommandData;

export type SetPermissions = {
  guild?: Guild;
  commandCollection: Collection<string, ApplicationCommand<{}>>;
  commands: CommandType[];
};
