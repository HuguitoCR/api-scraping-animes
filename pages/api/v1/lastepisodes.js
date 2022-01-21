const { chromium } = require("playwright-chromium");

// scraping para obtener los ultimos Episodios agregados https://www.animefenix.com/
// y guardarlas en un archivo json

export default function handler(req, res) {
  (async () => {
    const browser = await chromium.launch({ chromiumSandbox: false });
    const page = await browser.newPage();
    await page.goto("https://www.animefenix.com/");

    const UltimosEpisodios = await page.evaluate(() => {
      const Episodios = [];
      const EpisodiosContainer =
        document.querySelectorAll("div.capitulos-grid");

      EpisodiosContainer.forEach((Epi) => {
        Epi.querySelectorAll("div.item").forEach((item) => {
          const id = item
            .querySelector("a")
            .getAttribute("href")
            .split("https://www.animefenix.com/")[1];
          const title = item.querySelector("div.overtitle").innerText;
          const image = item.querySelector("img").src;
          const episodio = item.querySelector(
            "div.overepisode.has-text-weight-semibold.is-size-7"
          ).innerText;
          Episodios.push({
            id,
            title,
            image,
            episodio,
          });
        });
      });

      return Episodios;
    });

    res.status(200).json({ UltimosEpisodios });

    await browser.close();
  })();
}
