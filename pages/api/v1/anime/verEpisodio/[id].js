const axios = require('axios');
const cheerio = require('cheerio');

export default function handler(req, res) {

	axios(`https://www.animefenix.com/ver/${req.query.id}`)
		.then(response => {

			const $ = cheerio.load(response.data);
	        const names = $('ul.episode-page__servers-list > li').toArray().map((element) => $(element).text().trim());


			// const script = $($('script').toArray().filter((element) => $(element).html().includes('var video = [];'))[0]).html(); // ya esta en el codigo

			const script = $('.player-container').find('script').html();

			const serverUrl = script.match(/(?<=src=["'])([^"'])*/gm).map(it => {
			 		return it.replace('..', '').replace('/stream/amz.php', 'https://www.animefenix.com/stream/amz.php');
			});

          	const serverList = [];

			 	names.forEach((name, i) => serverList.push({ name, url: serverUrl[i] }));
		 	return serverList.map(it => {
			 		if (it.name == 'M') it.name = 'Mega';
			 		return it;
			 	});
		})
		.then(serverList => {
			res.json(serverList);
		})
		.catch(err => {
			console.log(err);
			res.json([]);
		});
}

