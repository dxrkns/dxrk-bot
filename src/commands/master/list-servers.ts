import { MessageEmbed } from "discord.js";
import { checkAdmin } from "../../helper/getPermissions";
import { Command } from "../../structures/Command";

export default new Command({
  name: "list-servers",
  description: "List all the servers bot joined.",
  title: "List Servers",
  category: "Master",
  masterCommand: true,
  permissionType: ["Admins"],
  //   userPermissions: ["ADMINISTRATOR"],

  run: async ({ interaction, bot }) => {
    try {
      if (
        !process.env.masterServerId ||
        interaction.guildId !== process.env.masterServerId
      )
        return interaction.editReply({ content: `Access Denied` });
      const isAdmin = checkAdmin(interaction);
      if (!isAdmin) return interaction.editReply({ content: `Access Denied.` });
      const guilds = bot.guilds.cache.map((guild) => guild);
      guilds.forEach((guild, i) => {
        const owner = bot.users.cache.get(guild.ownerId);
        const guildEmbed = new MessageEmbed()
          .setAuthor({
            name: `${guild.name}`,
            iconURL: guild.iconURL(),
            url: guild.iconURL(),
          })
          .addFields(
            { name: `Server ID`, value: guild.id, inline: true },
            {
              name: `Owner/Id`,
              value: `${owner || guild.ownerId}`,
              inline: true,
            }
          )
          .setFooter({ text: `Server ${i + 1} of ${guilds.length}` });
        if (guild.bannerURL) guildEmbed.setImage(guild.bannerURL());
        interaction.followUp({ embeds: [guildEmbed], ephemeral: true });
      });
    } catch (error) {
      console.log(error);
      interaction.editReply({ content: `Error Occured.` });
    }
  },
});
