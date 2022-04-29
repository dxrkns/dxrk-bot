import { bot } from "../../bot";
import { Event } from "../../structures/Events";

export default new Event("guildCreate", async (guild) => {
  try {
    if (process.env.masterServerId && process.env.masterServerId === guild.id) {
      const commands = bot.commands.map((cmd) => cmd);
      guild.commands.set(commands).catch((err) => console.log(err));

      console.log(`Registered commands ${commands.length} to ${guild.name}..`);
    } else {
      const commonCommands = bot.commands.filter((cmd) => !cmd.masterCommand);
      const commands = commonCommands.map((cmd) => cmd);
      guild.commands.set(commands).catch((err) => console.log(err));

      console.log(`Registered commands ${commands.length} to ${guild.name}..`);
    }
  } catch (error) {
    return console.log(error);
  }
});
