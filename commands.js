'use strict';

const puppeteer = require('puppeteer');

async function fetchSiteData(url) {
  const browser = await puppeteer.launch({ headless: 'false' });
  const page = await browser.newPage();
  await page.goto(url);
  const data = await page.evaluate(() => {
    return Array.from(
      document.querySelectorAll('td[type="average"] > a.sc-1x32wa2-7.ciClTw'),
      x => x.textContent
    );
  })
  await browser.close();
  return data;
}

module.exports = { fetchSiteData };