const Redis = require('ioredis');

export default async function handler(req, res) {
	const client = new Redis(process.env.REDIS_URL);
	const reply = await client.get('directorio');
	res.status(200).send({ Directorio: JSON.parse(reply) });
	client.quit();
}