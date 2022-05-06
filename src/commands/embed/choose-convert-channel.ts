import { EmbedChannelDB } from "../../database/models/modelsIndex";
import { Command } from "../../structures/Command";
import { v4 as uuidV4 } from "uuid";
import { checkAdmin } from "../../helper/getPermissions";

export default new Command({
  name: "choose-convert-channel",
  description: "Set channels for input and out of embed messages.",
  title: "Choose Convert Channel",
  category: "Embed",
  masterCommand: false,
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
    try {
      const isAdmin = checkAdmin(interaction);
      if (!isAdmin) return interaction.editReply({ content: `Access Denied.` });
      const inputChannel = args.getChannel("input");
      const outputChannel = args.getChannel("output");

      if (
        inputChannel.type !== "GUILD_NEWS" &&
        inputChannel.type !== "GUILD_TEXT"
      )
        return interaction.editReply({
          content: `${inputChannel} is not a text channel. Only text channel allowed`,
        });

      if (
        outputChannel.type !== "GUILD_NEWS" &&
        outputChannel.type !== "GUILD_TEXT"
      )
        return interaction.editReply({
          content: `${outputChannel} is not a text channel. Only text channel allowed`,
        });

      const tracking = await EmbedChannelDB.findOne({
        where: {
          inputChannelId: inputChannel.id,
          outputChannelId: outputChannel.id,
          guildId: interaction.guildId,
        },
      });
      if (tracking)
        return interaction.editReply({
          content: `Tracking already added for the info provided.`,
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
    } catch (error) {
      console.log(error);
      return interaction.editReply({ content: `Error Occured. Try again.` });
    }
  },
});
