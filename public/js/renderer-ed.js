const params = new URLSearchParams(window.location.search);
const id = params.get('id');
const cat = params.get('cat');
const formEditar = document.getElementById('form-edit');

async function cargarDatos() {
    // Necesitas un nuevo canal en Main: 'obtener-producto-por-id'
    const p = await window.authAPI.obtenerProductoPorId(id, cat);
    
    document.getElementById('title').value = p.titulo;
    document.getElementById('price').value = p.precio;
    document.getElementById('desc').value = p.descripcion;
    // La imagen es más compleja, podrías mostrar una vista previa
}

formEditar.onsubmit = async (e) => {
    e.preventDefault();
    const nuevosDatos = {
        id,
        cat,
        titulo: document.getElementById('title').value,
        precio: document.getElementById('price').value,
        descripcion: document.getElementById('desc').value
    };
    
    const res = await window.authAPI.actualizarProducto(nuevosDatos);
    if(res.success) {
        alert("¡Producto actualizado!");
        window.location.href = `categoria.html?cat=${cat}`;
    }
};

cargarDatos();