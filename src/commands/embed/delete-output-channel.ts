import { EmbedChannelDB } from "../../database/models/modelsIndex";
import { checkAdmin } from "../../helper/getPermissions";
import { Command } from "../../structures/Command";

export default new Command({
  name: "delete-output-channel",
  description: "Delete output channle from an embed conversion tracking.",
  title: "Delete Output Channel",
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
    {
      name: "output-channel",
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
      const outputChannel = args.getChannel("output-channel");

      const tracking = await EmbedChannelDB.findOne({
        where: {
          guildId: interaction.guildId,
          inputChannelId: inputChannel.id,
          outputChannelId: outputChannel.id,
        },
      });

      if (!tracking)
        return interaction.editReply({
          content: `No tracking found for input channel ${inputChannel} and output channel ${outputChannel}`,
        });

      tracking.destroy();

      await interaction.editReply({
        content: `${outputChannel} no longer tracks ${inputChannel}`,
      });
    } catch (error) {
      console.log(error);
      return interaction.editReply({ content: `Error Occured. Try again.` });
    }
  },
});
