const axios = require('axios');
const cheerio = require('cheerio');

export default function handler(req, res) {
	return new Promise((resolve, reject) => {
		axios('https://myanimelist.net/anime/season/later')
			.then(response => {
				const datos = cheerio.load(response.data);
				const Futuros = [];


				datos('div.seasonal-anime', response.data).is(function() {

					const title = datos(this).find('a.link-title').text().trim();
					let img = '';
				  if (datos(this).find('img').attr('src')) {
		      			 img = datos(this).find('img').attr('src');
					 }
					else {
							 img = datos(this).find('img').attr('data-src');
						 }

					const link = datos(this).find('a').attr('href');

					Futuros.push({ title, img, link });
				});

				res.status(200).json({ FuturosAnimes: Futuros });
				resolve();
			})
			.catch(error => {
				res.json(error);
				res.status(404).end();
				resolve();
			});
	});
}