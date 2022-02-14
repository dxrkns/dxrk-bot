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
import { setGuildPermissions } from "./SetPermissions";

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
    if (guildId) {
      const guild = this.guilds.cache.get(guildId);
      guild.commands
        .set(commands)
        .then((commandCollection) => {
          setGuildPermissions({ guild, commands, commandCollection });
        })
        .catch((err) => console.log(err));
      console.log(
        `Registering commands to ${this.guilds.cache.get(guildId)?.name}`
      );
    } else {
      this.application?.commands.set(commands);
      console.log(`Registering commands globally`);
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
