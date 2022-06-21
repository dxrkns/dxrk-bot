import { bot } from "../../bot";
import { Event } from "../../structures/Events";

export default new Event("ready", () => {
  console.log(`${bot.user.username} is online`);
});
