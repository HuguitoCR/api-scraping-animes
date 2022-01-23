import Directory from '/public/directorio.json';

export default function handler(req, res) {
	res.status(200).json(Directory);
}

