const API = '/peticion/?accion='; // Nueva ruta blindada

async function agregarProyecto() {
    const foto = document.getElementById('foto').files[0];
    if(!foto) return alert("Selecciona una foto");

    const reader = new FileReader();
    reader.onload = async (e) => {
        const datos = {
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
            body: JSON.stringify(datos)
        });

        if(res.ok) {
            alert("¡Guardado!");
            location.reload();
        } else {
            alert("Error al guardar");
        }
    };
    reader.readAsDataURL(foto);
}
