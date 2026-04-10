const API = '/api?accion=';

async function cargarProyectos() {
    const res = await fetch(`${API}listar`);
    return await res.json();
}

async function agregarProyecto() {
    const foto = document.getElementById('foto').files[0];
    if(!foto) return alert("Sube una imagen");

    const reader = new FileReader();
    reader.onload = async (e) => {
        const nuevo = {
            titulo: document.getElementById('titulo').value,
            fecha: document.getElementById('fecha').value,
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
        
        if(res.ok) {
            alert("✓ Proyecto guardado");
            location.reload();
        }
    };
    reader.readAsDataURL(foto);
}

async function eliminarProyecto(id) {
    if (confirm('¿Eliminar?')) {
        await fetch(`${API}eliminar&id=${id}`, { method: 'DELETE' });
        location.reload();
    }
}
