import { MessageEmbed, Util } from "discord.js";
import { bot } from "../../bot";
import { EmbedChannelDB } from "../../database/models/modelsIndex";
import { Event } from "../../structures/Events";

export default new Event("messageCreate", async (message) => {
  console.log(message.channel.id, message.guild.id);
  if (message.channel.type !== "GUILD_TEXT") return;
  const tracking = await EmbedChannelDB.findOne({
    where: { inputChannelId: message.channelId, guildId: message.guildId },
  });
  if (!tracking) return;
  const guild = message.guild;
  const outputChannel = guild.channels.cache.get(tracking.outputChannelId);

  if (!outputChannel || outputChannel.type !== "GUILD_TEXT") return;

  const messages = Util.splitMessage(message.content);

  const author = message.author;
  messages.forEach((message, i) => {
    const channelEmbed = new MessageEmbed()
      .setAuthor({
        name: author.username,
        iconURL: author.avatarURL(),
      })
      .setDescription(message)
      .setFooter({
        text: `Part ${i + 1}/${messages.length}  •  ${bot.user.username}`,
        iconURL: bot.user.avatarURL(),
      })
      .setTimestamp();

    outputChannel.send({ embeds: [channelEmbed] });
  });
});
