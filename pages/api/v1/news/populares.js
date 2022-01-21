const axios = require('axios');
const cheerio = require('cheerio');

export default function handler(req, res) {  
 
    axios('https://somoskudasai.com/')
     .then(response => {
       
       const datos =cheerio.load(response.data);
       const populares = [];
         
       datos('.ar-featured .swiper-slide', response.data).each(function(){
               const title = datos(this).find('a').attr('aria-label');
               const img = datos(this).find('img').attr('src');
               const url = datos(this).find('a').attr('href');
               populares.push({title, img, url});
           });
   
        
   
       res.status(200).json({ Populares: populares });
   
     }).catch(err => console.log(err));
   }
   