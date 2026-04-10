const { MongoClient, ObjectId } = require('mongodb');
const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);

export default async function handler(req, res) {
    const { method, query } = req;
    const { accion, h } = query;

    try {
        await client.connect();
        const db = client.db('archivo_creativo');
        const proyectos = db.collection('proyectos');

        // LOGIN (Usando el método del hash por URL que es más seguro para móvil)
        if (accion === 'login') {
            const hashCorrecto = "c0e1cd8fc8386315b37205f95cd4918b8820715968f4b0c6bd910ce0c78045ba";
            return res.status(h === hashCorrecto ? 200 : 401).json({ success: h === hashCorrecto });
        }

        if (accion === 'listar') {
            const data = await proyectos.find({}).sort({ fecha: -1 }).toArray();
            return res.status(200).json(data);
        }

        if (accion === 'guardar' && method === 'POST') {
            const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
            await proyectos.insertOne(body);
            return res.status(200).json({ success: true });
        }

        // ... resto de lógica ...
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
}
