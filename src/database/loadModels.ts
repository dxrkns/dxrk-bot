import db from "./db";

export default () => {
  db.authenticate()
    .then(() => {
      console.log("DB Connected...");
    })
    .catch((err) => console.log(err));
};
