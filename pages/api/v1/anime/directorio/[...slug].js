const axios = require('axios');
const cheerio = require('cheerio');


export default function handler(req, res) {


	const url = 'https://www.animefenix.com/animes?page=';
	const Directorio = [];
	const inicio = 1;

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
		     const descripcion = HTML(this).find('p').text().split('\n').join('').split('"').join('');
			 Directorio.push({ id, title, imagen, descripcion });
		 });

		 if (page < $paginacion) {
			 getAnimes(page + 1);
		 }
		 else {
			 res.status(200).json({ Directorio: Directorio });
		 }
	 };
	 getAnimes(inicio);
	};
	getData();
}

