const axios = require('axios');
const cheerio = require('cheerio');

const Redis = require('ioredis');

export default async function handler(req, res) {
	 const client = new Redis(process.env.REDIS_URL);

	const reply = await client.get('lastEpisodes');
		 if (reply) {
			 res.status(200).send(reply);

		 }
	else {
		return new Promise((resolve, reject) => {
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
					client.set('lastEpisodes', JSON.stringify(LastEpisodios), 'EX', 1800);
					res.status(200).json({ LastEpisodios: LastEpisodios });
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
