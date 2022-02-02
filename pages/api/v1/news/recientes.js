const axios = require('axios');
const cheerio = require('cheerio');
const Redis = require('ioredis');

export default async function handler(req, res) {
	const client = new Redis(process.env.REDIS_URL);
	const reply = await client.get('recientes');

	if (reply) {
		res.status(200).send({ Recientes: JSON.parse(reply) });
	}
	else {
		return new Promise((resolve, reject) => {
			axios('https://somoskudasai.com/')
				.then(response => {
					const datos = cheerio.load(response.data);
					const recientes = [];

					datos('.news-list .ar.por', response.data).each(function() {
						const title = datos(this).find('a').attr('aria-label');
						const img = datos(this).find('img').attr('src');
						const url = datos(this).find('a').attr('href');
						const fecha = datos(this).find('span.db').text().trim();
						recientes.push({ title, img, url, fecha });
					});
					client.set('recientes', JSON.stringify(recientes), 'EX', 5400);

					res.status(200).json({ Recientes: recientes });
					resolve();
				})
				.catch(error => {
					res.json(error);
					res.status(404).end();
					resolve();
				});
		});
	}
	client.quit();
}
