import { Message } from "discord.js";
import { AutoPublishDB } from "../../database/models/autoPublish.model";

export const publishMessage = async (message: Message<boolean>) => {
  try {
    if (message.channel.type !== "GUILD_NEWS") return;
    const publish = await AutoPublishDB.findOne({
      where: { channel: message.channelId },
    });
    if (!publish) return;
    await message.crosspost();
  } catch (error) {
    return console.log(error);
  }
};
