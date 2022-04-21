import { EmbedChannelDB } from "../../database/models/modelsIndex";
import { checkAdmin } from "../../helper/getPermissions";
import { Command } from "../../structures/Command";

export default new Command({
  name: "delete-convert-channel",
  description: "Delete embed conversion tracking.",
  title: "Delete Convert Channel",
  category: "Embed",
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
    const isAdmin = checkAdmin(interaction);
    if (!isAdmin) return interaction.editReply({ content: `Access Denied.` });
    const inputChannel = args.getChannel("input-channel");

    const tracking = await EmbedChannelDB.findOne({
      where: { guildId: interaction.guildId, inputChannelId: inputChannel.id },
    });

    if (!tracking)
      return interaction.editReply({
        content: `No tracking found for channel ${inputChannel}`,
      });

    await tracking.destroy();

    await interaction.editReply({
      content: `Deleted tracking for ${inputChannel}`,
    });
  },
});