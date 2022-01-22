const axios = require('axios');
const cheerio = require('cheerio');

export default function handler(req, res) {
	axios(`https://www.animefenix.com/animes?q=${req.query.q}`)
		.then(response => {
			const datos = cheerio.load(response.data);
			const results = [];

			datos('div.list-series article.serie-card', response.data).each(function() {
				const title = datos(this).find('a').attr('title');
				const id = datos(this).find('a').attr('href').split('https://www.animefenix.com/')[1];
				const imagen = datos(this).find('img').attr('src');
				results.push({ title, imagen, id });
			});

			res.status(200).json({ Resultados: results });

		}).catch(err => console.log(err));
}