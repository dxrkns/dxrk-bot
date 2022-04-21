import { MessageEmbed } from "discord.js";
import { checkAdmin, checkOwner } from "../../helper/getPermissions";
import { Command } from "../../structures/Command";
import { CommandType } from "../../typings/Command.type";

export default new Command({
  name: "help",
  description: "List all commands.",
  userPermissions: ["ADMINISTRATOR"],
  title: "Help",
  category: "Utilities",
  permissionType: ["ServerOwner", "BotOwner"],
  run: async ({ interaction, bot }) => {
    const isAdmin = checkAdmin(interaction);
    const isBotOwner = await checkOwner(interaction);
    if (!isAdmin && isBotOwner)
      return interaction.editReply({ content: `Access Denied.` });
    const commands: CommandType[] = [];
    bot.commands.map((command) => commands.push(command));

    commands.forEach(
      (
        {
          name,
          description,
          permissionType,
          userPermissions,
          title,
          category,
          options,
        },
        i
      ) => {
        const helpEmbed = new MessageEmbed()
          .setTitle(`${title} (${category})`)
          .setURL(bot.user.displayAvatarURL())
          .setFooter({
            text: `${i + 1} of ${commands.length}  •  ${bot.user.username}`,
            iconURL: bot.user.displayAvatarURL(),
          })
          .addFields(
            {
              name: `Command: \`/${name}\``,
              value: `**About**: \`${description}\``,
            },
            {
              name: `Pemission Required: \`${
                userPermissions ? userPermissions.toString() : "None"
              }\``,
              value: `**Type**: \`${permissionType.toString()}\``,
            }
          );
        if (options?.length > 0) {
          helpEmbed.addField(`\u200b`, `***__Arguments__***`);
          options.forEach(({ name, type }, i) => {
            helpEmbed.addFields({ name, value: `\`${type}\`` });
          });
        }
        interaction.followUp({ embeds: [helpEmbed], ephemeral: true });
      }
    );
  },
});