const { MongoClient, ObjectId } = require('mongodb');

const uri = process.env.MONGODB_URI; // Variable que pondrás en el panel de Vercel
const client = new MongoClient(uri);

export default async function handler(req, res) {
    const { method, query } = req;
    const { accion } = query;

    try {
        await client.connect();
        const db = client.db('archivo_creativo');
        const proyectos = db.collection('proyectos');
        const logs = db.collection('auditoria');

        // --- LOGIN ---
        if (accion === 'login' && method === 'POST') {
            const { hash } = req.body;
            if (hash === "c0e1cd8fc8386315b37205f95cd4918b8820715968f4b0c6bd910ce0c78045ba") {
                await logs.insertOne({ accion: "LOGIN_EXITOSO", fecha: new Date() });
                return res.status(200).json({ success: true });
            }
            await logs.insertOne({ accion: "LOGIN_FALLIDO", fecha: new Date() });
            return res.status(401).json({ success: false });
        }

        // --- LISTAR ---
        if (accion === 'listar' && method === 'GET') {
            const data = await proyectos.find({}).sort({ fecha: -1 }).toArray();
            return res.status(200).json(data);
        }

        // --- GUARDAR ---
        if (accion === 'guardar' && method === 'POST') {
            await proyectos.insertOne(req.body);
            await logs.insertOne({ accion: "AGREGAR", detalle: req.body.titulo, fecha: new Date() });
            return res.status(200).json({ success: true });
        }

        // --- ELIMINAR ---
        if (accion === 'eliminar' && method === 'DELETE') {
            const id = query.id;
            await proyectos.deleteOne({ _id: new ObjectId(id) });
            await logs.insertOne({ accion: "BORRAR", detalle: `ID: ${id}`, fecha: new Date() });
            return res.status(200).json({ success: true });
        }

        res.status(404).json({ error: "Acción no encontrada" });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
}
