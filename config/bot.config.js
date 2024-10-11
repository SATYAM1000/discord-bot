import { logger } from "./logger.config.js";
import { envConfig } from "./env.config.js";
import { connectToDB } from "./db.config.js";

export const startDiscordBot = async (client) => {
  try {
    await connectToDB();

    await client.login(envConfig.DISCORD_BOT_TOKEN);
    logger.info("BOT_STARTED", {
      meta: {
        message: "Bot logged in successfully!",
        timestamp: new Date().toISOString(),
        env: envConfig.ENV,
      },
    });

  } catch (error) {
    console.log(error);
    logger.error("BOT_ERROR: ", error);
    process.exit(1);
  }
};
