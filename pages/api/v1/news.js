// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
const { chromium } = require("playwright-chromium");

export default function handler(req, res) {  
  (async () => {
    const browser = await chromium.launch({ chromiumSandbox: false });
    const page = await browser.newPage();
    await page.goto("https://somoskudasai.com/");

    const news = await page.evaluate(() => {
      const noticias = [];
      const newsContainer = document.querySelectorAll(
        "div.news-list.dg.gg1.gt1.xs-gt2.md-gt3.xl-gt4.xl-gg2"
      );

      newsContainer.forEach((newss) => {
        newss.querySelectorAll("article.ar.por").forEach((item) => {
          const title = item.querySelector(
            "h2.ar-title.white-co.mab.fz4.lg-fz5"
          ).innerText;
          const link = item.querySelector("a.lnk-blk").href;
          const image = item.querySelector(
            "img.attachment-post-thumbnail.size-post-thumbnail.wp-post-image"
          ).src;

          noticias.push({
            title,
            link,
            image,
          });
        });
      });

      return noticias;
    });

    res.status(200).json({ news });

    await browser.close();
  })();
}
