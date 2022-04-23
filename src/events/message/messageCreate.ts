import { MessageEmbed, Util } from "discord.js";
import { bot } from "../../bot";
import { EmbedChannelDB } from "../../database/models/modelsIndex";
import { Event } from "../../structures/Events";

export default new Event("messageCreate", async (message) => {
  try {
    if (
      message.channel.type !== "GUILD_TEXT" &&
      message.channel.type !== "GUILD_NEWS"
    )
      return;
    const tracking = await EmbedChannelDB.findOne({
      where: { inputChannelId: message.channelId, guildId: message.guildId },
    });
    if (!tracking) return;
    const guild = message.guild;
    const outputChannel = guild.channels.cache.get(tracking.outputChannelId);

    if (
      !outputChannel ||
      (outputChannel.type !== "GUILD_TEXT" &&
        outputChannel.type !== "GUILD_NEWS")
    )
      return;

    const messages = Util.splitMessage(message.content);

    const author = message.author;
    messages.forEach((message, i) => {
      const channelEmbed = new MessageEmbed()
        .setAuthor({
          name: author.username,
          iconURL: author.avatarURL(),
        })
        .setDescription(message);

      outputChannel.send({ embeds: [channelEmbed] });
    });
  } catch (error) {
    return console.log(error);
  }
});
