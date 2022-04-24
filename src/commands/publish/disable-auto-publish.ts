import { AutoPublishDB } from "../../database/models/modelsIndex";
import { Command } from "../../structures/Command";
import { checkAdmin } from "../../helper/getPermissions";

export default new Command({
  name: "disable-auto-publish",
  description: "Disable auto publish..",
  title: "Disable Auto Publish",
  category: "Publish",
  permissionType: ["Admins"],
  userPermissions: ["ADMINISTRATOR"],
  options: [
    {
      name: "channel",
      type: "CHANNEL",
      required: true,
      description: "Tag the channel.",
    },
  ],

  run: async ({ interaction, args }) => {
    try {
      const isAdmin = checkAdmin(interaction);
      if (!isAdmin) return interaction.editReply({ content: `Access Denied.` });
      const channel = args.getChannel("channel");
      const publish = await AutoPublishDB.findOne({
        where: { channel: channel.id, guildId: interaction.guildId },
      });

      if (!publish)
        return interaction.editReply({
          content: `No auto publish data found for ${channel}`,
        });
      await publish.destroy();

      await interaction.editReply({
        content: `Auto Publishing disabled for ${channel}.`,
      });
    } catch (error) {
      console.log(error);
      return interaction.editReply({ content: `Error Occured. Try again.` });
    }
  },
});
