import { MessageEmbed } from "discord.js";
import { EmbedChannelDB } from "../../database/models/modelsIndex";
import { checkAdmin } from "../../helper/getPermissions";
import { Command } from "../../structures/Command";

export default new Command({
  name: "list-channel-trackings",
  description: "List all the trackings for a channel.",
  title: "List Channel Trackings",
  category: "Embed",
  masterCommand: false,
  permissionType: ["Admins"],
  options: [
    {
      name: "input-channel",
      type: "CHANNEL",
      description: `Tag the input channel.`,
      required: true,
    },
  ],

  run: async ({ interaction, bot, args }) => {
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
          content: `No trackings found for the channel ${inputChannel}.`,
        });
      const guild = interaction.guild;
      trackings.forEach((tracking, i) => {
        const inputChannel = guild.channels.cache.get(tracking.inputChannelId);
        const outputChannel = guild.channels.cache.get(
          tracking.outputChannelId
        );
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
    } catch (error) {
      console.log(error);
      return interaction.editReply({ content: `Error Occured. Try again.` });
    }
  },
});
