const axios = require('axios');
const cheerio = require('cheerio');

export default function handler(req, res) {
	return new Promise((resolve, reject) => {
		axios('https://somoskudasai.com/')
			.then(response => {
				const datos = cheerio.load(response.data);
				const reviews = [];

				datos('.ar-reviews .swiper-slide', response.data).each(function() {
					const title = datos(this).find('a').attr('aria-label');
					const img = datos(this).find('img').attr('src');
					const url = datos(this).find('a').attr('href');
					reviews.push({ title, img, url });
				});

				res.status(200).json({ Reviews: reviews });
				resolve();
			})
			.catch(error => {
				res.json(error);
				res.status(404).end();
				resolve();
			});
	});
}
