const { MongoClient, ObjectId } = require('mongodb');

// Configuración de la base de datos desde variables de entorno
const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);

export default async function handler(req, res) {
    // 1. CONFIGURACIÓN DE CABECERAS (Para evitar errores 405 y CORS)
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

    // Manejo de peticiones de seguridad del navegador
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    const { method, query } = req;
    const { accion, h } = query; // 'h' es el hash para el login por URL

    try {
        await client.connect();
        const db = client.db('archivo_creativo');
        const proyectos = db.collection('proyectos');

        // --- ACCIÓN: LOGIN ---
        if (accion === 'login') {
            const hashCorrecto = "c0e1cd8fc8386315b37205f95cd4918b8820715968f4b0c6bd910ce0c78045ba"; // Clave 12345
            if (h === hashCorrecto) {
                return res.status(200).json({ success: true });
            } else {
                return res.status(401).json({ success: false, msg: "Clave no coincide" });
            }
        }

        // --- ACCIÓN: LISTAR ---
        if (accion === 'listar') {
            const data = await proyectos.find({}).sort({ fecha: -1 }).toArray();
            return res.status(200).json(data);
        }

        // --- ACCIÓN: GUARDAR ---
        if (accion === 'guardar' && method === 'POST') {
            // Verificamos si el cuerpo viene como texto o objeto
            let body = req.body;
            if (typeof body === 'string') {
                body = JSON.parse(body);
            }
            
            if (!body.titulo) {
                return res.status(400).json({ error: "Datos incompletos" });
            }

            await proyectos.insertOne({
                titulo: body.titulo,
                fecha: body.fecha,
                img: body.img,
                repo: body.repo,
                live: body.live,
                desc: body.desc,
                creadoEn: new Date()
            });
            return res.status(200).json({ success: true });
        }

        // --- ACCIÓN: ELIMINAR ---
        if (accion === 'eliminar' && method === 'DELETE') {
            const id = query.id;
            if (!id) return res.status(400).json({ error: "Falta ID" });
            
            await proyectos.deleteOne({ _id: new ObjectId(id) });
            return res.status(200).json({ success: true });
        }

        // Si no coincide ninguna acción
        return res.status(404).json({ error: "Acción no encontrada" });

    } catch (e) {
        console.error("Error en el servidor:", e);
        return res.status(500).json({ error: e.message });
    } finally {
        // No cerramos la conexión aquí para que Vercel pueda reutilizarla (Warm Start)
    }
}
