const axios = require('axios');
const cheerio = require('cheerio');

export default function handler(req, res) {

	const url = `https://www.animefenix.com/ver/${req.query.id}`;
	const serverList = [];

	const getData = async () => {
		const response = await axios(url);
		const $ = cheerio.load(response.data);

	 	const names = $('ul.episode-page__servers-list > li').toArray().map((element) => $(element).text().trim());
		const urldefe = $('.player-container').find('script').html().match(/(?<=src=["'])([^"'])*/gm);


		const getvideo = async () => {

			names.forEach((name, i) => {
			   const urlpage = urldefe[i].replace('amp;', '');
			   const pagevideo = axios(urlpage);

			   pagevideo.then(respo => {
					const $$ = cheerio.load(respo.data);

					const livideo = $$('script').html().match(/(?<=src=["'])([^"'])*/gm).map(it => {
					  return it.replace('..', '').replace('/stream/amz.php?', 'https://www.animefenix.com/stream/amz.php').replace('/stream/fl.php?v=https://', 'https://www.animefenix.com/redirect.php?player=22&code=');
					});


					serverList.push({ name, url: livideo[0] });
					if (serverList.length == names.length) {
						res.json(serverList.map(it => {
							if (it.name == 'M') it.name = 'Mega';
							return it;
						}));
					}

				});
			});
		};
		getvideo();
	};
	getData();
}

