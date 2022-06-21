import { Client, ClientEvents } from "discord.js";
import glob from "glob";
import { promisify } from "util";
import { Event } from "./Events";

const glopPromise = promisify(glob);
export class ExtendClient extends Client {
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

  async registerModules() {
    //Events
    const eventFiles = await glopPromise(`${__dirname}/../events/*/*{.ts,.js}`);
    eventFiles.forEach(async (filePath) => {
      const event: Event<keyof ClientEvents> = await this.importFile(filePath);
      this.on(event.event, event.run);
    });
  }
}
