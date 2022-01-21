// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
const axios = require('axios');
const cheerio = require('cheerio');

export default function handler(req, res) {  
 
 axios('https://somoskudasai.com/')
  .then(response => {
	
    const datos =cheerio.load(response.data);
    const populares = [];
		const recientes = [];
		const otros = [];
		const reviews = [];

		// Populares
    datos('.ar-featured .swiper-slide', response.data).each(function(){
			const title = datos(this).find('a').attr('aria-label');
			const img = datos(this).find('img').attr('src');
			const url = datos(this).find('a').attr('href');
			populares.push({title, img, url});
		});

		// Recientes
		datos('.news-list .ar.por', response.data).each(function(){
			const title = datos(this).find('a').attr('aria-label');
			const img = datos(this).find('img').attr('src');
			const url = datos(this).find('a').attr('href');
			recientes.push({title, img , url});
		});

		// Mas noticias
		datos('div.dg.gt1 article.ar.lg.por', response.data).each(function(){
			const title = datos(this).find('a').attr('aria-label');
			const img = datos(this).find('img').attr('src');
			const url = datos(this).find('a').attr('href');
			otros.push({title, img, url});
		});

		// Reviews
		datos('.ar-reviews .swiper-slide', response.data).each(function(){
			const title = datos(this).find('a').attr('aria-label');
			const img = datos(this).find('img').attr('src');
			const url = datos(this).find('a').attr('href');
			reviews.push({title, img, url});
		});

    res.status(200).json({ populares: populares, recientes: recientes, reviews: reviews , masNoticias: otros, });

  }).catch(err => console.log(err));
}
