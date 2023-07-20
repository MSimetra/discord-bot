'use strict';

require('dotenv').config();
const { saveDataToDB, getDataFromDB } = require('./db.js');
const { fetchSiteData } = require('./commands.js');
const { Client, GatewayIntentBits } = require('discord.js');
const bot = new Client({
  intents: [GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

bot.on('messageCreate', async (message) => {
  if (message.author.bot) return;
  if (message.content.startsWith('/fetch')) {
    const args = message.content.slice().trim().split(' ');
    const url = args[1];
    if (!url) { return message.reply('Please provide url!'); }

    const pageData = await fetchSiteData(url);
    if (!pageData) {
      return message.reply('Unable to fetch data for the given site.');
    }
    await saveDataToDB(pageData)

    const dataFromDB = await getDataFromDB();
    const answerData = dataFromDB.map(
      currency => `${currency.name}: ${currency.exchange_rate}`
    );
    const botAnswer = answerData.join('\n');
    return message.reply(botAnswer);
  }
});

bot.login(process.env.DISCORD_TOKEN);