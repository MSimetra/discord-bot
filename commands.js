'use strict';

const puppeteer = require('puppeteer');

const fetchSiteData = async (url) => {
  const browser = await puppeteer.launch({
    // executablePath: '/usr/bin/google-chrome',
    headless: 'false',
    // args: ['--no-sandbox'],
  });
  const page = await browser.newPage();
  await page.goto(url);

  const currency = await page.evaluate(() => {
    return Array.from(
      document.querySelectorAll('#exchangeRates > tbody > tr > td:nth-child(2)'),
      x => x.textContent
    );
  })
  const rates = await page.evaluate(() => {
    return Array.from(
      document.querySelectorAll('#exchangeRates > tbody > tr > td:nth-child(5)'),
      x => parseFloat(x.textContent.replace(',', '.'))
    );
  })

  const allRates = [];
  for (let i = 0; i < currency.length; i++) {
    const currentCurrency = {};
    currentCurrency.name = currency[i];
    currentCurrency.exchange_rate = rates[i];
    allRates.push(currentCurrency);
  }

  const desiredRates = ['USD', 'EUR', 'PLN', 'GBP', 'JPY'];
  const finalData = allRates.filter(rate => desiredRates.includes(rate.name))

  await browser.close();
  return finalData;
}

module.exports = { fetchSiteData };