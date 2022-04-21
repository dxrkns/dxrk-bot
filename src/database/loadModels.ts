import db from "./db";
import { EmbedChannelDB } from "./models/modelsIndex";

export default () => {
  db.authenticate()
    .then(() => {
      console.log("DB Connected...");
      EmbedChannelDB.sync();
    })
    .catch((err) => console.log(err));
};
