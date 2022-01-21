
import Rutas from '../../public/Rutas.json';

export default function handler(req, res) {

 res.status(200).json({ Info_Api: Rutas });

}