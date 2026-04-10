const { MongoClient, ObjectId } = require('mongodb');
const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);

export default async function handler(req, res) {
    const { method, query } = req;
    const { accion } = query;

    try {
        await client.connect();
        const db = client.db('archivo_creativo');
        const proyectos = db.collection('proyectos');

        // Lógica de Login
        if (accion === 'login' && method === 'POST') {
            const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
            // El hash de la clave "Neiva200208"
            if (body.hash === "dbb4f2edde8ba5dd237c1bab5b89519350393f7ea738ac6f7b482875 36e948b3) {
                return res.status(200).json({ success: true });
            }
            return res.status(401).json({ success: false });
        }

        // Listar proyectos
        if (accion === 'listar') {
            const data = await proyectos.find({}).sort({ fecha: -1 }).toArray();
            return res.status(200).json(data);
        }

        // Guardar proyecto
        if (accion === 'guardar' && method === 'POST') {
            const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
            await proyectos.insertOne(body);
            return res.status(200).json({ success: true });
        }

        // Eliminar proyecto
        if (accion === 'eliminar' && method === 'DELETE') {
            await proyectos.deleteOne({ _id: new ObjectId(query.id) });
            return res.status(200).json({ success: true });
        }

    } catch (e) {
        return res.status(500).json({ error: e.message });
    }
}
