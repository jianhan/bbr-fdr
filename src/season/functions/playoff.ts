import Root = cheerio.Root;
// eslint-disable-next-line @typescript-eslint/no-var-requires
const puppeteer = require('puppeteer');

export const extractPlayoff = ($: Root, year: number) => {
  $('table#all_playoffs  tr').map((i, el) => {
    const t = year;
  });
};

export const fetchPlayoffHtml = async (url: string): Promise<string> => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(url);
  await page.waitForSelector('table#all_playoffs');
  const bodyHTML = await page.evaluate(() => document.body.innerHTML);
  await browser.close();
  return bodyHTML;
};
