const axios = require('axios');
const cheerio = require('cheerio');


export default function handler(req, res) {
	axios('https://www.animefenix.com/')
		.then(response => {
			const datos = cheerio.load(response.data);
			const LastEpisodios = [];

			datos('.capitulos-grid .item', response.data).each(function() {
				const title = datos(this).find('div.overtitle').text().split('\n').join('');
				const episodios = datos(this).find('div.overepisode').text().split('\n').join('') ;
				const url = datos(this).find('a').attr('href').split('https://www.animefenix.com/')[1];
				const imagen = datos(this).find('img').attr('src');
				LastEpisodios.push({ title, episodios, url, imagen });
			});

			res.status(200).json({ LastEpisodios: LastEpisodios });

		}).catch(err => console.log(err));
}
