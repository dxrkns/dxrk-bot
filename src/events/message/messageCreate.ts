import { bot as botInfo } from "../../bot";
import { Event } from "../../structures/Events";

export default new Event("messageCreate", async (message) => {
  try {
    if (message.author.bot) return;

    if (
      !process.env.guildId ||
      (message.guild.id !== process.env.guildId && !process.env.multiServer)
    )
      return;

    const channel = message.channel;
    if (!channel.isText() || channel.type === "DM") return;
    const bot = await message.guild.members.fetch(botInfo.user.id);
    if (!bot.permissions.has(["MANAGE_MESSAGES"]))
      return console.log("Permission not granted.");
    if (!message.content) return;
    const content = message.content;
    await message.delete();
    await message.channel.send({ content });
  } catch (error) {
    return console.log(`Error Occured.`);
  }
});
