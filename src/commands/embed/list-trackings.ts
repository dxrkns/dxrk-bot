import { MessageEmbed } from "discord.js";
import { EmbedChannelDB } from "../../database/models/modelsIndex";
import { Command } from "../../structures/Command";

export default new Command({
  name: "list-trackings",
  description: "List all the trackings.",
  title: "List Trackings",
  category: "Embed",
  permissionType: ["Admins"],
  userPermissions: ["ADMINISTRATOR"],

  run: async ({ interaction, bot }) => {
    const trackings = await EmbedChannelDB.findAll({
      where: { guildId: interaction.guildId },
    });

    if (trackings.length < 1)
      return interaction.editReply({
        content: `No trackings found for the server.`,
      });
    const guild = interaction.guild;
    trackings.forEach((tracking, i) => {
      const inputChannel = guild.channels.cache.get(tracking.inputChannelId);
      const outputChannel = guild.channels.cache.get(tracking.outputChannelId);
      const admin = guild.members.cache.get(tracking.adminId);
      const trackingEmbed = new MessageEmbed()
        .setTitle(`Tracking ${i + 1}/${trackings.length}`)
        .addFields(
          { name: `Input Channel`, value: `${inputChannel}`, inline: true },
          { name: `Output Channel`, value: `${outputChannel}`, inline: true },
          {
            name: `Set By`,
            value: `${admin ? admin : tracking.adminName}`,
            inline: true,
          }
        )
        .setFooter({
          text: `${bot.user.username}`,
          iconURL: bot.user.avatarURL(),
        });
      interaction.followUp({ embeds: [trackingEmbed], ephemeral: true });
    });
  },
});
