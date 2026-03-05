//constantes front y de sesion
const contenedor = document.getElementById('contenedor-productos');
const titulo = document.getElementById('titulo-categoria');
const logoutForm = document.getElementById('logout-form');
const menu = document.getElementById('menu');
//para el buscador
const searchInput = document.getElementById('input-search');
let productosLocales = [];

menu.addEventListener('click', () => {
  menu.classList.toggle("rota");
});

logoutForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  window.authAPI.logout();
  window.location.href="../../index.html";
});

// 1. Obtener la categoría de la URL
const params = new URLSearchParams(window.location.search);
const categoria = params.get('cat');
let cat='';
switch (categoria) {
    case 'electricidad':
        cat='Electricidad';
        break;
    case 'refrigeracion':
        cat='Refrigeracion';
        break;
    case 'aberturas':
        cat='Aberturas';
        break;
    case 'revestimientos':
        cat='Revestimientos';
        break;
    case 'cyp':
        cat='Cortinas y portones';
        break;
    case 'amoblamientos':
        cat='Amoblamientos';
        break;
    case 'construccion':
        cat='Construccion';
        break;
}
titulo.innerText = cat;

// 2. Pedir productos al Main
async function cargarProductos() {
    // Necesitarás crear este canal en tu preload y main
    const productos = productosLocales = await window.authAPI.obtenerProductos(categoria);
    if (productos.length==0) {
        contenedor.innerHTML = '<p class="text-center">No se encontraron productos.</p>';
        return;
    };
    productos.forEach(p => {
        const d = new Date(p.fecha);
        const opciones = { month: 'short', day: 'numeric', year: 'numeric' };
        const fechaFinal = d.toLocaleDateString('es-AR', opciones);
        contenedor.innerHTML += `
                <div class="col">
                    <div class="card h-100" style="max-width: 320px;" id="producto-${p.id}">
                        <img src="${p.imagen}" class="card-img-top img-p" alt="producto">
                        <div class="card-body p-0">
                            <h5 class="card-title fs-3 text-center">${p.titulo}</h5>
                            <p class="card-text fs-5 desc-p">${p.descripcion}</p>
                            <p class="card-text fs-5 text-center">Precio: $${p.precio}</p>
                            <div class="div-btn">
                                <button class="btn btn-outline-danger btn-eliminar" data-id="${p.id}" data-titulo="${p.titulo}">Borrar</button>
                                <button class="btn btn-outline-primary ms-2 btn-editar" data-id="${p.id}" data-cat="${categoria}">Editar</button>
                            </div>
                        </div>
                        <div class="card-footer">
                            <small class="text-body-secondary">Fecha de creacion: ${fechaFinal}</small>
                        </div>
                    </div>
                </div>
        `;
    });
    activarBotonesEliminar();
    activarBotonesEditar();
}
function activarBotonesEliminar() {
    // Obtenemos todos los botones con la clase .btn-eliminar
    const botones = document.querySelectorAll('.btn-eliminar');
    
    botones.forEach(boton => {
        boton.onclick = async (e) => {
            // USAMOS e.currentTarget para asegurar que siempre lea el BOTÓN
            const id = e.currentTarget.getAttribute('data-id');
            const tituloProd = e.currentTarget.getAttribute('data-titulo');
            
            // Si el título aparece como null, es porque faltaba el atributo en el HTML
            const nombreMostrar = tituloProd || "este producto";
            console.log("ID a borrar:", id)
            if (confirm(`¿Estás seguro de que quieres eliminar "${nombreMostrar}"?`)) {
                try {
                    const response = await window.authAPI.eliminarProducto(id, categoria);
                    
                    if (response.success) {
                        alert("Producto eliminado.");
                        const card = document.getElementById(`producto-${id}`);
                        if (card) card.remove();
                    } else {
                        alert("Error: " + response.message);
                    }
                } catch (error) {
                    console.error("Error al borrar:", error);
                }
            }
        };
    });
};

function activarBotonesEditar() {
    const botones = document.querySelectorAll('.btn-editar');
    botones.forEach(btn => {
        btn.onclick = (e) => {
            const id = e.currentTarget.getAttribute('data-id');
            const cat = e.currentTarget.getAttribute('data-cat');
            // Redirigimos a la página de edición pasando ID y Categoría
            window.location.href = `edit-p.html?id=${id}&cat=${cat}`;
        };
    });
};

cargarProductos();

//busqueda

function mostrarProductos(lista) {
    contenedor.innerHTML = "";
    
    if (lista.length === 0) {
        contenedor.innerHTML = '<p class="text-center">No se encontraron productos.</p>';
        return;
    }

    lista.forEach(p => {
        contenedor.innerHTML += `
                <div class="col">
                    <div class="card h-100" style="max-width: 320px;" id="producto-${p.id}">
                        <img src="${p.imagen}" class="card-img-top img-p" alt="producto">
                        <div class="card-body p-0">
                            <h5 class="card-title fs-3 text-center">${p.titulo}</h5>
                            <p class="card-text fs-5 desc-p">${p.descripcion}</p>
                            <p class="card-text fs-5 text-center">Precio: $${p.precio}</p>
                            <div class="div-btn">
                                <button class="btn btn-outline-danger btn-eliminar" data-id="${p.id}" data-titulo="${p.titulo}">Borrar</button>
                                <button class="btn btn-outline-primary ms-2 btn-editar" data-id="${p.id}" data-cat="${categoria}">Editar</button>
                            </div>
                        </div>
                    </div>
                </div>
        `;
    });
    
    // Volvemos a activar eventos tras redibujar
    activarBotonesEliminar();
    activarBotonesEditar();
}

searchInput.addEventListener('input', (e) => {
    const texto = e.target.value.toLowerCase();
    
    // Filtramos el array global
    const productosFiltrados = productosLocales.filter(p => {
        const title = p.titulo.toLowerCase();
        const desc = p.descripcion.toLowerCase();
        return title.includes(texto) || desc.includes(texto);
    });
    // Dibujamos solo los filtrados
    mostrarProductos(productosFiltrados);
});