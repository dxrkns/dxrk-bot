import { EmbedChannelDB } from "../../database/models/modelsIndex";
import { checkAdmin } from "../../helper/getPermissions";
import { Command } from "../../structures/Command";

export default new Command({
  name: "delete-convert-channel",
  description: "Delete embed conversion tracking.",
  title: "Delete Convert Channel",
  category: "Embed",
  masterCommand: false,
  permissionType: ["Admins"],
  userPermissions: ["ADMINISTRATOR"],
  options: [
    {
      name: "input-channel",
      type: "CHANNEL",
      required: true,
      description: "Tag the input channel.",
    },
  ],

  run: async ({ interaction, args }) => {
    try {
      const isAdmin = checkAdmin(interaction);
      if (!isAdmin) return interaction.editReply({ content: `Access Denied.` });
      const inputChannel = args.getChannel("input-channel");

      const trackings = await EmbedChannelDB.findAll({
        where: {
          guildId: interaction.guildId,
          inputChannelId: inputChannel.id,
        },
      });

      if (trackings.length < 1)
        return interaction.editReply({
          content: `No tracking found for channel ${inputChannel}`,
        });

      await EmbedChannelDB.destroy({
        where: {
          guildId: interaction.guildId,
          inputChannelId: inputChannel.id,
        },
      });

      await interaction.editReply({
        content: `Deleted all trackings for ${inputChannel}`,
      });
    } catch (error) {
      console.log(error);
      return interaction.editReply({ content: `Error Occured. Try again.` });
    }
  },
});
