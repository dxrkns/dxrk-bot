import { Message, MessageAttachment, MessageEmbed, Util } from "discord.js";
import { bot } from "../../bot";
import { EmbedChannelDB } from "../../database/models/modelsIndex";

export const embedMessage = async (message: Message<boolean>) => {
  try {
    if (message.author.id === bot.user.id) return;

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
    const attachments = message.attachments.map((attachment) => attachment);
    const stickers = message.stickers.map((sticker) => sticker);
    const messages = Util.splitMessage(message.content);

    const author = message.author;
    if (message.content) {
      messages.forEach((message, i) => {
        const channelEmbed = new MessageEmbed()
          .setAuthor({
            name: author.username,
            iconURL: author.avatarURL(),
          })
          .setDescription(message);
        outputChannel.send({ embeds: [channelEmbed] });
      });
    }
    if (attachments.length > 0) {
      attachments.forEach(async (attachment, i) => {
        try {
          const attachmentEmbed = new MessageEmbed()
            .setAuthor({
              name: author.username,
              iconURL: author.avatarURL(),
            })
            .addField(`\u200b`, `Attachment - ${attachment.url}`);
          await outputChannel.send({
            embeds: [attachmentEmbed],
          });
        } catch (error) {
          return console.log(error);
        }
      });
    }

    if (stickers.length > 0) {
      stickers.forEach(async (sticker, i) => {
        const stickerEmbed = new MessageEmbed()
          .setAuthor({
            name: author.username,
            iconURL: author.avatarURL(),
          })
          .addField(`\u200b`, `Sticker - ${sticker.name}`);
        await outputChannel.send({
          embeds: [stickerEmbed],
        });
      });
    }
  } catch (error) {
    return console.log(error);
  }
};
