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

        if (accion === 'listar') {
            const data = await proyectos.find({}).sort({ fecha: -1 }).toArray();
            return res.status(200).json(data);
        }

        if (accion === 'guardar' && method === 'POST') {
            await proyectos.insertOne(req.body);
            return res.status(200).json({ success: true });
        }

        if (accion === 'eliminar' && method === 'DELETE') {
            await proyectos.deleteOne({ _id: new ObjectId(query.id) });
            return res.status(200).json({ success: true });
        }

        if (accion === 'login' && method === 'POST') {
            const { hash } = req.body;
            if (hash === "0de9ebb2d149151b9d9671cb653be33cbb4b1e1269404e3575f5d242efe3c67e) {
                return res.status(200).json({ success: true });
            }
            return res.status(401).json({ success: false });
        }
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
}
