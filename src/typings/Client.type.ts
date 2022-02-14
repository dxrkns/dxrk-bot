import { ApplicationCommandDataResolvable } from "discord.js";
import { CommandType } from "./Command.type";
export interface RegisterCommandsOptions {
  guildId?: string;
  commands: CommandType[];
}
