import { AutoPublishDB } from "../../database/models/modelsIndex";
import { Command } from "../../structures/Command";
import { v4 as uuidV4 } from "uuid";
import { checkAdmin } from "../../helper/getPermissions";

export default new Command({
  name: "auto-publish",
  description: "Set announcement channel for auto publish..",
  title: "Auto Publish",
  category: "Publish",
  masterCommand: false,
  permissionType: ["Admins"],
  userPermissions: ["ADMINISTRATOR"],
  options: [
    {
      name: "channel",
      type: "CHANNEL",
      required: true,
      description: "Set the announcement channel to auto publish.",
    },
  ],

  run: async ({ interaction, args }) => {
    try {
      const isAdmin = checkAdmin(interaction);
      if (!isAdmin) return interaction.editReply({ content: `Access Denied.` });
      const channel = args.getChannel("channel");

      if (channel.type !== "GUILD_NEWS")
        return interaction.editReply({
          content: `${channel} is not a announcement/news channel.`,
        });

      await AutoPublishDB.create({
        id: uuidV4(),
        channel: channel.id,
        guildId: interaction.guildId,
        guildName: interaction.guild.name,
        adminId: interaction.user.id,
        adminName: `${interaction.user.username}#${interaction.user.discriminator}`,
      });

      await interaction.editReply({
        content: `Auto Publishing set for ${channel}.`,
      });
    } catch (error) {
      console.log(error);
      return interaction.editReply({ content: `Error Occured. Try again.` });
    }
  },
});
