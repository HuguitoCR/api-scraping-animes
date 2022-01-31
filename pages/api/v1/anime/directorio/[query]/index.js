const axios = require('axios');
const cheerio = require('cheerio');


export default function handler(req, res) {
	const query = req.query.query;
	const url = `https://www.animefenix.com/animes?${query}&page=`;
	const Directorio = [];
	const inicio = 1;
	let contador = 0;

	console.time('Llamada principal');
	const getData = async () => {
	 	const response = await axios(url + inicio);
		const $ = cheerio.load(response.data);
		const $paginacion = $('li').last().prev().text();

		const getAnimes = async (page) => {
			const respu = await axios(url + page);
			const HTML = cheerio.load(respu.data);

			HTML('.list-series .serie-card', respu.data).each(function() {
				const id = HTML(this).find('a').attr('href').split('https://www.animefenix.com/')[1];
				const title = HTML(this).find('a.has-text-orange').text().split('\n').join('');
				const imagen = HTML(this).find('img').attr('src');
				const año = HTML(this).find('span.year').text();
				const estado = HTML(this).find('span.is-orange').text();
				const tipo = HTML(this).find('span.type').text();
				const descripcion = HTML(this).find('p').text().split('\n').join('').split('"').join('');
				Directorio.push({ id, title, imagen, año, estado, tipo, descripcion });
			});
			contador++;

			if (page < $paginacion && contador < 4) {
				getAnimes(page + 1);
			}
			else {
				res.status(200).json({ Directorio: Directorio });
				console.timeEnd('Llamada principal');
				console.log(Directorio.length);
				console.log(page);
				contador = 0;
			}
		};
		getAnimes(inicio);
	};
	getData();
}