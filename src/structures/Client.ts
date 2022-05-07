import {
  Client,
  Collection,
  ApplicationCommandDataResolvable,
  ClientEvents,
} from "discord.js";
import { CommandType } from "../typings/Command.type";
import glob from "glob";
import { promisify } from "util";
import { RegisterCommandsOptions } from "../typings/Client.type";
import { Event } from "./Events";

const glopPromise = promisify(glob);
export class ExtendClient extends Client {
  commands: Collection<string, CommandType> = new Collection();
  constructor() {
    super({ intents: 32767 });
  }
  start() {
    this.registerModules();
    this.login(process.env.botToken);
  }

  async importFile(filePath: string) {
    return (await import(filePath))?.default;
  }

  async registerCommands({ commands, guildId }: RegisterCommandsOptions) {
    if (process.env.environment === "dev")
      return console.log(
        `Running in ${process.env.environment || "no"} environment.`
      );
    const commonCommands = commands.filter(
      (command) => command.masterCommand === false
    );
    this.guilds.cache.forEach((guild) => {
      guild.commands.set(commonCommands).catch((err) => console.log(err));
    });
    console.log(
      `Registering ${commonCommands.length} commands to ${this.guilds.cache.size} servers.`
    );
    if (process.env.masterServerId) {
      const masterGuild = this.guilds.cache.get(process.env.masterServerId);
      masterGuild.commands.set(commands).catch((err) => console.log(err));
      console.log(
        `Registering ${commands.length} commands to ${masterGuild.name}.`
      );
    }
  }

  async registerModules() {
    //Commands
    const slashCommands: CommandType[] = [];
    const commandFiles = await glopPromise(
      `${__dirname}/../commands/*/*{.ts,.js}`
    );

    commandFiles.forEach(async (filePath) => {
      const command: CommandType = await this.importFile(filePath);
      if (!command.name) return;
      if (command.userPermissions) command.defaultPermission = false;

      this.commands.set(command.name, command);
      slashCommands.push(command);
    });

    this.on("ready", () => {
      this.registerCommands({
        commands: slashCommands,
        guildId: process.env.guildId,
      });
    });

    //Events
    const eventFiles = await glopPromise(`${__dirname}/../events/*/*{.ts,.js}`);
    eventFiles.forEach(async (filePath) => {
      const event: Event<keyof ClientEvents> = await this.importFile(filePath);
      this.on(event.event, event.run);
    });
  }
}
