'use strict';

require('dotenv').config();
const { Client, GatewayIntentBits } = require('discord.js');
const puppeteer = require('puppeteer');
const Knex = require('knex');

const bot = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

const knex = Knex({
  client: 'mysql',
  connection: {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  },
});

bot.on('messageCreate', async (message) => {
  if (message.author.bot) return;

  if (message.content.startsWith('/')) {
    const args = message.content.slice(1).trim().split(' ');
    const command = args.shift().toLowerCase();

    if (command === 'fetch') {
      const url = args[0];
      if (!url) {
        return message.reply('Please provide url!');
      }

      const pageData = await fetchSiteData(url);
      if (!pageData) {
        return message.reply('Unable to fetch data for the given site.');
      }

      // await saveDataToDB(pageData);

      // displayData(message, pageData, args[1]);
    } else {
      return message.reply('Please use a valid command!');
    }
  }
});

async function fetchSiteData(url) {
  const browser = await puppeteer.launch({ headless: 'false' });
  const page = await browser.newPage();

  // actions on site

  await browser.close();

  return data;
}

async function saveDataToDB(data) {
  await knex('table_name').insert(data);
}

function displayData(message, data, requestedPage) {
  
}

bot.login(process.env.DISCORD_TOKEN);