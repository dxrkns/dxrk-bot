import { Command } from "../../structures/Command";

export default new Command({
  name: "ping",
  description: "Replies delay time of reply in milli secs.",
  userPermissions: ["ADMINISTRATOR"],
  run: async ({ interaction, bot }) => {
    interaction.editReply({ content: `${bot.ws.ping}\ms delay.` });
  },
});
