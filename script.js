const API_BASE = '/api/?accion=';

async function validarAcceso() {
    const p = document.getElementById('clave').value;
    const hash = CryptoJS.SHA256(p).toString();
    
    const res = await fetch(`${API_BASE}login&h=${hash}`);
    if (res.ok) {
        localStorage.setItem('admin_auth', 'true');
        window.location.href = 'admin.html';
    } else {
        alert("Contraseña incorrecta");
    }
}

async function agregarProyecto() {
    const fotoFile = document.getElementById('foto').files[0];
    if(!fotoFile) return alert("Selecciona una foto");

    const reader = new FileReader();
    reader.onload = async (e) => {
        const datos = {
            titulo: document.getElementById('titulo').value,
            fecha: document.getElementById('fecha').value,
            img: e.target.result,
            repo: document.getElementById('repo').value,
            live: document.getElementById('live').value,
            desc: document.getElementById('desc').value
        };

        const res = await fetch(`${API_BASE}guardar`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(datos)
        });

        if(res.ok) {
            alert("Proyecto guardado");
            location.reload();
        } else {
            alert("Error al guardar en el servidor");
        }
    };
    reader.readAsDataURL(fotoFile);
}
