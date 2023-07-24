'use strict';

require('dotenv').config();
const { saveDataToDB, getDataFromDB } = require('./model.js');
const { fetchSiteData } = require('./commands.js');
const { Client, GatewayIntentBits } = require('discord.js');
const { ToadScheduler, SimpleIntervalJob, AsyncTask } = require('toad-scheduler');
const token = process.env.DISCORD_TOKEN;
const url = process.env.RATES_URL;
const channelID = process.env.CHANNEL_ID;
const scheduler = new ToadScheduler();
const bot = new Client({
  intents: [GatewayIntentBits.Guilds,
  GatewayIntentBits.GuildMessages,
  GatewayIntentBits.MessageContent,
  ],
});

const updateDataTask = new AsyncTask(
  'simple task',
  async () => {
    const pageData = await fetchSiteData(url);
    await saveDataToDB(pageData);
    console.log('data updated');
  },
  (err) => console.log(err)
)
const updateDataJob = new SimpleIntervalJob({ seconds: 25, }, updateDataTask)

const sendDataTask = new AsyncTask(
  'simple task',
  async () => {
    const dataFromDB = await getDataFromDB();
    const answerData = dataFromDB.map(
      currency => `${currency.name}: ${currency.exchange_rate}`
    );
    const botAnswer = answerData.join('\n');
    const channel = bot.channels.cache.get(channelID);
    channel.send(botAnswer);
  },
  (err) => console.log(err)
)
const sendDataJob = new SimpleIntervalJob({ seconds: 10, }, sendDataTask)

bot.on('messageCreate', async (message) => {
  if (message.author.bot) {
    return;
  }
  if (message.content.startsWith('/start')) {
    scheduler.addSimpleIntervalJob(updateDataJob);
    scheduler.addSimpleIntervalJob(sendDataJob)
  }
  if (message.content.startsWith('/stop')) {
    console.log('scheduler stopped');
    scheduler.stop()
  }
});

bot.login(token);