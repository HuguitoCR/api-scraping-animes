const axios = require('axios');
const cheerio = require('cheerio');
const Redis = require('ioredis');

export default async function handler(req, res) {
	const client = new Redis(process.env.REDIS_URL);
	const reply = await client.get('populares');

	if (reply) {
		res.status(200).send({ Populares: JSON.parse(reply) });
	}
	else {
		return new Promise((resolve, reject) => {
			axios('https://somoskudasai.com/')
				.then(response => {
					const datos = cheerio.load(response.data);
					const populares = [];

					datos('.ar-featured .swiper-slide', response.data).each(function() {
						const title = datos(this).find('a').attr('aria-label');
						const img = datos(this).find('img').attr('src');
						const url = datos(this).find('a').attr('href');
						populares.push({ title, img, url });
					});
					client.set('populares', JSON.stringify(populares), 'EX', 5400);

					res.status(200).json({ Populares: populares });
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
