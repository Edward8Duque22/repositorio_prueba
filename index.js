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
    // Aseguramos que el servidor lea bien los datos enviados
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
    
    // Comparamos el hash recibido con el de la clave "12345"
    if (body.hash === "c0e1cd8fc8386315b37205f95cd4918b8820715968f4b0c6bd910ce0c78045ba") {
        return res.status(200).json({ success: true });
    } else {
        return res.status(401).json({ success: false });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
}
