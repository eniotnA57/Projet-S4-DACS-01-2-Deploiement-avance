const puppeteer = require('puppeteer');

async function fetchWethenewImage(productName) {
  const slug = productName.toLowerCase().replace(/\s+/g, '-').normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  const url = `https://wethenew.com/products/${slug}`;
  try {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 10000 });

    const imageUrl = await page.$eval('img[src*="cdn.shopify"]', img => img.src);

    await browser.close();
    return imageUrl;
  } catch (err) {
    console.error(`Erreur scraping pour ${productName} :`, err.message);
    return '';
  }
}

module.exports = fetchWethenewImage;
