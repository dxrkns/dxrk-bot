import db from "./db";
import { EmbedChannelDB, AutoPublishDB } from "./models/modelsIndex";

export default () => {
  db.authenticate()
    .then(() => {
      console.log("DB Connected...");
      EmbedChannelDB.sync();
      AutoPublishDB.sync();
    })
    .catch((err) => console.log(err));
};
