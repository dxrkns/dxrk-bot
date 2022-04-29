import { AutoPublishDB } from "../../database/models/modelsIndex";
import { Command } from "../../structures/Command";
import { checkAdmin } from "../../helper/getPermissions";
import { MessageEmbed } from "discord.js";
import { bot } from "../../bot";

export default new Command({
  name: "list-auto-publish",
  description: "List auto publishes..",
  title: "List Auto Publish",
  category: "Publish",
  masterCommand: false,
  permissionType: ["Admins"],
  userPermissions: ["ADMINISTRATOR"],

  run: async ({ interaction }) => {
    try {
      const isAdmin = checkAdmin(interaction);
      if (!isAdmin) return interaction.editReply({ content: `Access Denied.` });

      const publishes = await AutoPublishDB.findAll({
        where: { guildId: interaction.guildId },
      });

      if (publishes.length < 1)
        return interaction.editReply({
          content: `No auto publish data found for the server.`,
        });
      const guild = interaction.guild;
      publishes.forEach((publish, i) => {
        const publishChannel = guild.channels.cache.get(publish.channel);

        const admin = guild.members.cache.get(publish.adminId);
        const trackingEmbed = new MessageEmbed()
          .setTitle(`Tracking ${i + 1}/${publishes.length}`)
          .addFields(
            { name: `Channel`, value: `${publishChannel}`, inline: true },
            {
              name: `Set By`,
              value: `${admin ? admin : publish.adminName}`,
              inline: true,
            }
          )
          .setFooter({
            text: `${bot.user.username}`,
            iconURL: bot.user.avatarURL(),
          });
        interaction.followUp({ embeds: [trackingEmbed], ephemeral: true });
      });
    } catch (error) {
      console.log(error);
      return interaction.editReply({ content: `Error Occured. Try again.` });
    }
  },
});
