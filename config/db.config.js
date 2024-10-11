import mongoose from "mongoose";
import { envConfig } from "./env.config.js";
import { logger } from "./logger.config.js";

export const connectToDB = async () => {
  try {
    const connection = await mongoose.connect(envConfig.DATABASE_URL);
    logger.info("DB_CONNECTED", {
      meta: {
        message: "Database connected successfully!",
        host: connection.connection.host,
        port: connection.connection.port,
        timestamp: new Date().toISOString(),
        env: envConfig.ENV,
      },
    });
  } catch (error) {
    logger.error("DB_ERROR: ", error);
    process.exit(1);
  }
};
