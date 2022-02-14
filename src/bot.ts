import { ExtendClient } from "./structures/Client";

require("dotenv").config();
export const bot = new ExtendClient();
bot.start();
