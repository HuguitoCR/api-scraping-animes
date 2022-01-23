import Directory from '/public/Directorio.json';

export default function handler(req, res) {
	res.status(200).json(Directory);
}

