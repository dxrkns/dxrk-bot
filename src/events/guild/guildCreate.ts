import { bot } from "../../bot";
import { Event } from "../../structures/Events";
import { setGuildPermissions } from "../../structures/SetPermissions";

export default new Event("guildCreate", async (guild) => {
  try {
    const commands = bot.commands.map((cmd) => cmd);
    guild.commands
      .set(commands)
      // .then((commandCollection) => {
      //   setGuildPermissions({ guild, commands, commandCollection });
      // })
      .catch((err) => console.log(err));
    console.log(`Registered commands ${commands.length} to ${guild.name}..`);
  } catch (error) {
    return console.log(error);
  }
});
