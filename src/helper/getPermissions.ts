import { bot } from "../bot";
import { ExtendedInteraction } from "../typings/Command.type";

export const checkOwner = async (interaction: ExtendedInteraction) => {
  const app = await bot.application.fetch();

  if (interaction.user.id === app.owner.id) return true;
  else false;
};

export const checkServerOwner = (interaction: ExtendedInteraction) => {
  if (interaction.guild.ownerId === interaction.user.id) return true;
  else false;
};

export const checkAdmin = async (interaction: ExtendedInteraction) => {
  if (
    interaction.member.id === interaction.guild.ownerId ||
    interaction.member.permissions.has("ADMINISTRATOR")
  )
    return true;
  return false;
};
