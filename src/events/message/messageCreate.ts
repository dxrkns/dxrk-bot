import { MessageEmbed, Util } from "discord.js";
import { bot } from "../../bot";
import { EmbedChannelDB } from "../../database/models/modelsIndex";
import { embedMessage } from "../../helper/message/embedMessage";
import { publishMessage } from "../../helper/message/publishMessage";
import { Event } from "../../structures/Events";

export default new Event("messageCreate", async (message) => {
  await embedMessage(message);
  await publishMessage(message);
});
