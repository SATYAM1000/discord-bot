import { botServices } from "./services/service.js";

import { Client, GatewayIntentBits, PermissionsBitField } from "discord.js";
import { conversationStarters } from "./constants/constant.js";
import { startDiscordBot } from "./config/bot.config.js";

const monitoredChannels = new Set();

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
  ],
});


client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on("messageCreate", async (message) => {
  if (message.author.bot) {
    return;
  }

  if (message.content.startsWith("!monitor")) {
    monitoredChannels.add(message.channel.id);
    message.reply(`📡 Now monitoring ${message.channel.name}`);
  }

  if (message.content.startsWith("!stopmonitor")) {
    monitoredChannels.delete(message.channel.id);
    message.reply(`❌ Stopped monitoring ${message.channel.name}`);
  }
});

client.on("messageCreate", async (message) => {
  // if author is bot or channel is not monitored then return
  try {
    if (
      message.author.bot ||
      !monitoredChannels.has(message.channel.id || !message.content)
    ) {
      console.log("message author ", message.author.username);
      return;
    }

    const messageContent = message.content.toLowerCase();
    console.log("message content ", messageContent);

    if (
      conversationStarters.some((starter) => messageContent.includes(starter))
    ) {
      message.reply(
        `Hello ${message.author.username}! How can i assist you today?`
      );
    }

    if (messageContent === "!joke") {
      const { data } = await botServices.jokeGenerator();
      const { setup, punchline } = data;
      message.reply(`${setup} \n ${punchline}`);
    }

    if (messageContent === "!quote") {
      const { data } = await botServices.quoteGenerator();
      const quotes = data.quotes;
      message.reply(quotes[Math.floor(Math.random() * quotes.length)].quote);
    }
  } catch (error) {
    console.log(error);
  }
});

// moderation functions

client.on("messageCreate", async (message) => {
  if (message.author.bot) {
    return;
  }

  if (message.content.startsWith("!ban")) {
    const user = message.mentions.users.first();
    if (user) {
      await message.guild.members.ban(user);
    } else {
      message.reply("Please mention a user to ban");
    }
  }
});

client.on("messageCreate", async (message) => {
  if (message.content.startsWith("!kick")) {
    if (
      !message.member.permissions.has(PermissionsBitField.Flags.KickMembers)
    ) {
      return message.reply("You don't have permission to use this command.");
    }

    const member = message.mentions.members.first();
    if (!member) return message.reply("You need to mention a member to kick.");

    // Check if the bot has permissions to kick
    if (
      !message.guild.me.permissions.has(PermissionsBitField.Flags.KickMembers)
    ) {
      return message.reply("I don't have permission to kick members.");
    }

    if (
      member.roles.highest.position >= message.member.roles.highest.position
    ) {
      return message.reply(
        "I cannot kick this user because they have a higher or equal role."
      );
    }

    try {
      await member.kick();
      message.channel.send(`${member.user.tag} has been kicked.`);
    } catch (err) {
      console.error(err);
      message.reply(
        "I cannot kick this user. Check if I have the correct permissions."
      );
    }
  }
});

startDiscordBot(client);
