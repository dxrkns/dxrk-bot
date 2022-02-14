import { bot } from "../../bot";
import { Event } from "../../structures/Events";
import db from "../../database/db";

export default new Event("ready", () => {
  console.log(`${bot.user.username} is online`);

  // db.authenticate()
  //   .then(() => {
  //     console.log("DB Connected...");
  //   })
  //   .catch((err) => console.log(err));
});
