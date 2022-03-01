import { Command } from "../../structures/Command";

export default new Command({
  name: "ping",
  description: "Sends delay time of reply in milli secs.",
  title: "Ping",
  category: "Utilities",
  permissionType: ["OpenToAll"],

  run: async ({ interaction, bot }) => {
    interaction.editReply({ content: `${bot.ws.ping}\ms delay.` });
  },
});
