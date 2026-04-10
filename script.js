const API = '/peticiones?accion=';

async function cargarProyectos() {
    try {
        const res = await fetch(`${API}listar`);
        const proyectos = await res.json();
        return proyectos;
    } catch (error) {
        console.error("Error al cargar:", error);
        return [];
    }
}

async function agregarProyecto() {
    const titulo = document.getElementById('titulo').value;
    const fecha = document.getElementById('fecha').value;
    const foto = document.getElementById('foto').files[0];

    if (!titulo || !fecha || !foto) return alert("Faltan datos");

    const reader = new FileReader();
    reader.onload = async (e) => {
        const nuevo = {
            titulo,
            fecha,
            img: e.target.result,
            repo: document.getElementById('repo').value || '#',
            live: document.getElementById('live').value || '#',
            desc: document.getElementById('desc').value || ''
        };

        const res = await fetch(`${API}guardar`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(nuevo)
        });

        if (res.ok) {
            alert("Proyecto guardado directamente en la raíz y MongoDB");
            location.reload();
        }
    };
    reader.readAsDataURL(foto);
}

async function eliminarProyecto(id) {
    if (confirm('¿Eliminar proyecto?')) {
        await fetch(`${API}eliminar&id=${id}`, { method: 'DELETE' });
        location.reload();
    }
}
