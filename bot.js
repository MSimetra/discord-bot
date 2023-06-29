'use strict';

require('dotenv').config();
const { Client, GatewayIntentBits } = require('discord.js');
const { saveDataToDB } = require('./db.js');
const { fetchSiteData } = require('./commands.js');

const bot = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

bot.on('messageCreate', async (message) => {
  if (message.author.bot) return; 
  if (message.content.startsWith('/fetch')) {
    const args = message.content.slice().trim().split(' ');
    const url = args[1];
    console.log({url});
    if (!url) { return message.reply('Please provide url!'); }

    const pageData = await fetchSiteData(url);
    if (!pageData) {
      return message.reply('Unable to fetch data for the given site.');
    }
    console.log({pageData});
    // await saveDataToDB(pageData);
    // displayData(message, pageData, args[1]);
  } else {
    return message.reply('Please use a valid command!');
  }
});

function displayData(message, data, requestedPage) {

}

bot.login(process.env.DISCORD_TOKEN);