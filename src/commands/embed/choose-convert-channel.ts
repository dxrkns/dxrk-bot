import { EmbedChannelDB } from "../../database/models/modelsIndex";
import { Command } from "../../structures/Command";
import { v4 as uuidV4 } from "uuid";

export default new Command({
  name: "choose-convert-channel",
  description: "Set channels for input and out of embed messages.",
  title: "Choose Convert Channel",
  category: "Utilities",
  permissionType: ["Admins"],
  userPermissions: ["ADMINISTRATOR"],
  options: [
    {
      name: "input",
      type: "CHANNEL",
      required: true,
      description: "Set the channel to track messages from.",
    },
    {
      name: "output",
      type: "CHANNEL",
      required: true,
      description: "Set the channel to post messages from input channel.",
    },
  ],

  run: async ({ interaction, args }) => {
    const inputChannel = args.getChannel("input");
    const outputChannel = args.getChannel("output");

    if (inputChannel.type !== "GUILD_TEXT")
      return interaction.editReply({
        content: `${inputChannel} is not a text channel. Only text channel allowed`,
      });

    if (outputChannel.type !== "GUILD_TEXT")
      return interaction.editReply({
        content: `${outputChannel} is not a text channel. Only text channel allowed`,
      });

    await EmbedChannelDB.create({
      id: uuidV4(),
      inputChannelId: inputChannel.id,
      outputChannelId: outputChannel.id,
      guildId: interaction.guildId,
      guildName: interaction.guild.name,
      adminId: interaction.user.id,
      adminName: `${interaction.user.username}#${interaction.user.discriminator}`,
    });

    await interaction.editReply({
      content: `Tracking set for ${inputChannel} in ${outputChannel}`,
    });
  },
});
