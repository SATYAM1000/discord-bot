import dotenv from "dotenv";
dotenv.config();

export const envConfig = {
  ENV: process.env.ENV,
  DISCORD_BOT_TOKEN: process.env.DISCORD_BOT_TOKEN,
  PREFIX: process.env.PREFIX,
};
