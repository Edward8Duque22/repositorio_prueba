const { MongoClient, ObjectId } = require('mongodb');
const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);

export default async function handler(req, res) {
    // Configuración para evitar errores de CORS y métodos
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') return res.status(200).end();

    const { method, query } = req;
    const { accion } = query;

    try {
        await client.connect();
        const db = client.db('archivo_creativo');
        const proyectos = db.collection('proyectos');

        // --- LÓGICA DE LOGIN ---
        if (accion === 'login' && method === 'POST') {
            // Esta línea asegura que leamos el hash correctamente sin importar cómo llegue
            const data = req.body;
            const hashRecibido = typeof data === 'string' ? JSON.parse(data).hash : data.hash;

            const hashCorrecto = "c0e1cd8fc8386315b37205f95cd4918b8820715968f4b0c6bd910ce0c78045ba"; // 12345

            if (hashRecibido === hashCorrecto) {
                return res.status(200).json({ success: true });
            } else {
                return res.status(401).json({ success: false, msg: "Clave no coincide" });
            }
        }

        // --- OTRAS ACCIONES (Listar, Guardar, Eliminar) ---
        if (accion === 'listar') {
            const result = await proyectos.find({}).sort({ fecha: -1 }).toArray();
            return res.status(200).json(result);
        }

        if (accion === 'guardar' && method === 'POST') {
            const nuevo = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
            await proyectos.insertOne(nuevo);
            return res.status(200).json({ success: true });
        }

        if (accion === 'eliminar' && method === 'DELETE') {
            await proyectos.deleteOne({ _id: new ObjectId(query.id) });
            return res.status(200).json({ success: true });
        }

    } catch (e) {
        return res.status(500).json({ error: e.message });
    }
}
