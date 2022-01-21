// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
const axios = require('axios');
const cheerio = require('cheerio');

export default function handler(req, res) {  
 
 axios('https://somoskudasai.com/')
  .then(response => {
	
    const datos =cheerio.load(response.data);
    const populares = [];
		const recientes = [];
		const reviews = [];

    datos('.ar-featured .swiper-slide', response.data).each(function(){
			const title = datos(this).find('a').attr('aria-label');
			const url = datos(this).find('a').attr('href');
			populares.push({title, url});
		});

		datos('.news-list .ar', response.data).each(function(){
			const title = datos(this).find('a').attr('aria-label');
			const url = datos(this).find('a').attr('href');
			recientes.push({title, url});
		});

		datos('.ar-reviews .swiper-slide', response.data).each(function(){
			const title = datos(this).find('a').attr('aria-label');
			const url = datos(this).find('a').attr('href');
			reviews.push({title, url});
		});

    res.status(200).json({ recientes: recientes, populares: populares, reviews: reviews });

  }).catch(err => console.log(err));
}
