const axios = require('axios');
const cheerio = require('cheerio');

export default function handler(req, res) {
	axios(`https://www.animefenix.com/${req.query.q}`)
		.then(response => {
			const datos = cheerio.load(response.data);
			const info = [];
			const episodes = [];

			datos('div.columns.is-mobile.is-multiline', response.data).is(function() {
				const img = datos(this).find('img').attr('src');
				const estado = datos(this).find('ul.has-text-light').text().split('\n')[2].split(':')[1].replace(' ', '');
				let siguienteEpisodio;
				try {
					siguienteEpisodio = datos(this).find('ul.has-text-light').children('li').children('span.has-text-orange').parent().text().split(':')[1].trim();
				}
				catch {
					siguienteEpisodio = null;
				}
				const titulo = datos(this).find('h1.title').text();
				const sinopsis = datos(this).find('p.sinopsis').text().replace(/\n/g, '').replace(/\"/g, '');
				// const generos = datos(this).find('a.button.is-small').text().replace(' ', '').replace('Á', 'A').split(/(?=[A-Z])/).join(' ').replace('Angeles', 'Ángeles').split(' ');
				const tipo = datos(this).find('ul.has-text-light').text().split('\n')[1].split(':')[1].trimStart();
				const totalEpisodios = datos(this).find('ul.has-text-light').text().split('\n')[3].split(':')[1].trimStart();
				info.push({ img, tipo, estado, totalEpisodios, siguienteEpisodio, titulo, sinopsis, generos });
			});

			datos('ul.anime-page__episode-list li', response.data).each(function() {
				const eps = datos(this).find('a').attr('href').split('https://www.animefenix.com/')[1];
				episodes.push(eps);
			});

			res.status(200).json({ Anime: info[0], Episodios: episodes });

		}).catch(err => console.log(err));
}