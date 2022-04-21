import { bot } from "../../bot";
import { Event } from "../../structures/Events";
import loadModels from "../../database/loadModels";

export default new Event("ready", () => {
  console.log(`${bot.user.username} is online`);
  loadModels();
});
