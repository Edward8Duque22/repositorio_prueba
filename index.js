const { MongoClient, ObjectId } = require('mongodb');
const client = new MongoClient(process.env.MONGODB_URI);

export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,DELETE,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') return res.status(200).end();

    const { method, query } = req;
    const { accion, h, id } = query;

    try {
        await client.connect();
        const db = client.db('archivo_creativo');
        const proyectos = db.collection('proyectos');

        // LOGIN
        if (accion === 'login') {
            const hashCorrecto = "c0e1cd8fc8386315b37205f95cd4918b8820715968f4b0c6bd910ce0c78045ba"; // 12345
            return res.status(h === hashCorrecto ? 200 : 401).json({ success: h === hashCorrecto });
        }

        // LISTAR
        if (accion === 'listar') {
            const data = await proyectos.find({}).sort({ fecha: -1 }).toArray();
            return res.status(200).json(data);
        }

        // GUARDAR
        if (accion === 'guardar' && method === 'POST') {
            let body = req.body;
            if (typeof body === 'string') body = JSON.parse(body);
            await proyectos.insertOne(body);
            return res.status(200).json({ success: true });
        }

        // ELIMINAR
        if (accion === 'eliminar' && method === 'DELETE') {
            await proyectos.deleteOne({ _id: new ObjectId(id) });
            return res.status(200).json({ success: true });
        }

    } catch (e) {
        return res.status(500).json({ error: e.message });
    }
}
