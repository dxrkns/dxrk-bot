import { checkAdmin } from "../../helper/getPermissions";
import { Command } from "../../structures/Command";

export default new Command({
  name: "leave-server",
  description: "Leave a server.",
  title: "Leave Servers",
  category: "Master",
  masterCommand: true,
  permissionType: ["Admins"],
  //   userPermissions: ["ADMINISTRATOR"],
  options: [
    {
      name: `server-id`,
      type: `STRING`,
      description: `Enter server id to leave.`,
      required: true,
    },
  ],
  run: async ({ interaction, bot, args }) => {
    try {
      if (
        !process.env.masterServerId ||
        interaction.guildId !== process.env.masterServerId
      )
        return interaction.editReply({ content: `Access Denied` });
      const isAdmin = checkAdmin(interaction);
      if (!isAdmin) return interaction.editReply({ content: `Access Denied.` });
      const id = args.getString(`server-id`);
      if (id === process.env.masterServerId)
        return interaction.editReply({
          content: `Cannot leave Master Server.`,
        });
      const guild = bot.guilds.cache.get(id);
      if (!guild)
        return interaction.editReply({
          content: `No guild found with id: ${id}`,
        });

      await guild.leave();
      await interaction.editReply({
        content: `Succesfully left \`${guild.name}\``,
      });
    } catch (error) {
      console.log(error);
      interaction.editReply({ content: `Errro Occured.` });
    }
  },
});
