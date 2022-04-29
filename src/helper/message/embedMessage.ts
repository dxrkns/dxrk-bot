import { Message, MessageEmbed, Util } from "discord.js";
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
      where: {
        inputChannelId: message.channelId,
        guildId: message.guildId,
      },
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

    const channelEmbed = new MessageEmbed().setAuthor({
      name: author?.username,
      iconURL: author?.avatarURL(),
    });

    if (message.content && message.embeds.length > 0) {
      message.embeds.forEach((embed) => {
        outputChannel.send({
          content: author.username,
          embeds: [embed],
        });
      });
    } else if (message.embeds.length > 0) {
      message.embeds.forEach((embed) => {
        outputChannel.send({
          content: author.username,
          embeds: [embed],
        });
      });
    } else {
      let fileCount = 0,
        stickerCount = 0,
        textCount = 0,
        mutiImageCount = 0;
      if (message.content) {
        messages.forEach((message, i) => {
          channelEmbed.setDescription(message);
        });
        textCount++;
      }

      if (stickers.length > 0) {
        stickers.forEach((sticker, i) => {
          channelEmbed.addField(`Sticker`, `${sticker?.name}`);
          stickerCount++;
        });
      }

      if (attachments.length === 1) {
        const attachment = attachments[0];
        const type = attachment.contentType.split(`/`);
        if (!type) channelEmbed.addField(`Attachement`, `${attachment.url}`);
        if (type[0] === "image") channelEmbed.setImage(attachment.url);
        else channelEmbed.addField(`File`, attachment.url);
        fileCount++;
      }

      if (attachments.length > 1) {
        attachments.forEach((attachment, i) => {
          try {
            const url = attachment.url;
            const type = attachment.contentType.split(`/`);
            if (!type)
              channelEmbed.addField(
                `Attachement ${i + 1}`,
                `${attachment.url}`
              );
            if (type[0] === "image") {
              const attachmentEmbed = new MessageEmbed()
                .setAuthor({
                  name: author?.username,
                  iconURL: author?.avatarURL(),
                })
                .setImage(url);
              if (message.content) {
                attachmentEmbed.setDescription(message.content);
                outputChannel.send({
                  embeds: [attachmentEmbed],
                });
              } else
                outputChannel.send({
                  embeds: [attachmentEmbed],
                });
              mutiImageCount++;
            } else {
              channelEmbed.addField(`File`, url);
              fileCount++;
            }
          } catch (error) {
            return console.log(error);
          }
        });
      }

      if (
        fileCount > 0 ||
        stickerCount > 0 ||
        (textCount > 0 && mutiImageCount === 0)
      )
        await outputChannel.send({ embeds: [channelEmbed] });
    }
  } catch (error) {
    return console.log(error);
  }
};
