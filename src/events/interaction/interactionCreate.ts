import { bot } from "../../bot";
import { Event } from "../../structures/Events";
import { CommandInteractionOptionResolver } from "discord.js";
import { ExtendedInteraction } from "../../typings/Command.type";

export default new Event("interactionCreate", async (interaction) => {
  if (!interaction.isCommand()) return;
  await interaction.deferReply({ ephemeral: true });
  const command = bot.commands.get(interaction.commandName);
  if (!command) return;
  command.run({
    args: interaction.options as CommandInteractionOptionResolver,
    bot,
    interaction: interaction as ExtendedInteraction,
  });
});
