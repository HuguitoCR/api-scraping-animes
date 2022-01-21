const axios = require('axios');
const cheerio = require('cheerio');


export default function handler(req, res) {  
 
    axios('https://somoskudasai.com/')
     .then(response => {
       
       const datos =cheerio.load(response.data);
   
           const recientes = [];
     
           datos('.news-list .ar.por', response.data).each(function(){
               const title = datos(this).find('a').attr('aria-label');
               const img = datos(this).find('img').attr('src');
               const url = datos(this).find('a').attr('href');
               recientes.push({title, img , url});
           });
   
       res.status(200).json({ Recientes: recientes });
   
     }).catch(err => console.log(err));
   }
   