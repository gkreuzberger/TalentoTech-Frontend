// Configuración de productos con stock y descuentos
const productos = {
    atuendo: { 
        nombre: 'Atuendo: Básico', 
        descripcion: '',
        precio: 5, 
        stock: 10,
        descuento: 0.25  // 25% de descuento
    },
    zapatos: { 
        nombre: 'Zapatos: Básicos',
        descripcion: '',
        precio: 3, 
        stock: 15,
        descuento: 0.15  // 15% de descuento
    },
    mascara: { 
        nombre: 'Máscara: Neutral',
        descripcion: '',
        precio: 1.5, 
        stock: 12,
        descuento: 0  // Sin descuento
    },
    lentes: {
        nombre: 'Lentes de Sol',
        descripcion: '',
        precio: 1.25,
        stock: 15,
        descuento: 0.1,
    },
    collar: {
        nombre: 'Collar: Moño',
        descripcion: '',
        precio: 1.15,
        stock: 10,
        descuento: 0,
    },
    peinado: {
        nombre: 'Peinado: Trenza Lateral',
        descripcion: '',
        precio: 2,
        stock: 8,
        descuento: 0.2,
    },
    sombrero: {
        nombre: 'Sombrero',
        descripcion: '',
        precio: 2.5,
        stock: 13,
        descuento: 0.2,
    },
    vincha: {
        nombre: 'Vincha: Cuernitos',
        descripcion: '',
        precio: 1.15,
        stock: 12,
        descuento: 0,
    },
    capa: {
        nombre: 'Capa: Básica',
        descripcion: '',
        precio: 3.5,
        stock: 20,
        descuento: 0.15,
    },
    instrumento: {
        nombre: 'Instrumento: Lira',
        descripcion: '',
        precio: 4,
        stock: 14,
        descuento: 0.35,
    },
    biblioteca: {
        nombre: 'Mueble: Biblioteca',
        descripcion: '',
        precio: 5,
        stock: 11,
        descuento: 0.3,
    },
    taza: {
        nombre: 'Taza de Porcelana',
        descripcion: '',
        precio: 1.5,
        stock: 13,
        descuento: 0,
    }
};

// Lista de claves de producto
const clavesProducto = Object.keys(productos);

// Constante para el IVA
const IVA = 0.21;  // 21% de IVA

// Inicializar el carrito al cargar la página
document.addEventListener('DOMContentLoaded', cargarCarrito);

function agregarAlCarrito(nombre, precio, productoKey) {
    // Obtener el producto específico
    const producto = productos[productoKey];

    // Validar stock
    if (producto.stock <= 0) {
        alert('¡Producto agotado!');
        return;
    }

    // Obtener el carrito actual del localStorage
    let carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    
    // Agregar nuevo producto
    carrito.push({ 
        nombre: producto.nombre, 
        precio: producto.precio,
        productoKey: productoKey
    });
    
    // Reducir stock
    producto.stock--;
    document.getElementById(`stock-${productoKey}`).textContent = producto.stock;
    
    // Guardar en localStorage
    localStorage.setItem('carrito', JSON.stringify(carrito));
    
    // Actualizar vista del carrito
    renderizarCarrito();
}

function renderizarCarrito() {
    const listaCarrito = document.getElementById('lista-carrito');
    const subtotalCarrito = document.getElementById('subtotal-carrito');
    const descuentoCarrito = document.getElementById('descuento-carrito');
    const ivaCarrito = document.getElementById('iva-carrito');
    const totalCarrito = document.getElementById('total-carrito');
    const carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    
    // Limpiar lista anterior
    listaCarrito.innerHTML = '';
    
    // Totales iniciales
    let subtotal = 0;
    let descuentoTotal = 0;
    
    // Renderizar cada producto
    carrito.forEach((producto, index) => {
        const productoInfo = productos[producto.productoKey];
        const li = document.createElement('li');
        
        // Calcular descuento individual
        const descuentoProducto = productoInfo.descuento * producto.precio;
        const precioConDescuento = producto.precio - descuentoProducto;
        
        li.innerHTML = `
            ${producto.nombre} - $${producto.precio} 
            ${productoInfo.descuento > 0 ? 
                `<span class="descuento">(Desc. ${(productoInfo.descuento * 100).toFixed(0)}%: 
                -$${descuentoProducto.toFixed(2)})</span>` 
                : ''}
        `;
        
        // Botón para eliminar producto
        const botonEliminar = document.createElement('button');
        botonEliminar.classList.add('boton');
        botonEliminar.textContent = 'Eliminar';
        botonEliminar.onclick = () => eliminarDelCarrito(index);
        
        li.appendChild(botonEliminar);
        listaCarrito.appendChild(li);
        
        // Sumar al subtotal y descuentos
        subtotal += producto.precio;
        descuentoTotal += descuentoProducto;
    });
    
    // Calcular IVA
    const ivaTotal = (subtotal - descuentoTotal) * IVA;
    const total = subtotal - descuentoTotal + ivaTotal;
    
    // Actualizar totales
    subtotalCarrito.textContent = subtotal.toFixed(2);
    descuentoCarrito.textContent = descuentoTotal.toFixed(2);
    ivaCarrito.textContent = ivaTotal.toFixed(2);
    totalCarrito.textContent = total.toFixed(2);
}

function eliminarDelCarrito(index) {
    let carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    
    // Recuperar el producto para devolver stock
    const producto = productos[carrito[index].productoKey];
    producto.stock++;
    document.getElementById(`stock-${carrito[index].productoKey}`).textContent = producto.stock;
    
    // Eliminar producto por índice
    carrito.splice(index, 1);
    
    // Actualizar localStorage
    localStorage.setItem('carrito', JSON.stringify(carrito));
    
    // Renderizar de nuevo
    renderizarCarrito();
}

function vaciarCarrito() {
    // Restaurar stock de todos los productos
    const carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    carrito.forEach(item => {
        const producto = productos[item.productoKey];
        producto.stock++;
        document.getElementById(`stock-${item.productoKey}`).textContent = producto.stock;
    });
    
    // Limpiar localStorage
    localStorage.removeItem('carrito');
    
    // Renderizar
    renderizarCarrito();
}

function cargarCarrito() {
    // Cargar carrito al iniciar la página
    renderizarCarrito();
}

// Funciones de Checkout
function mostrarCheckout() {
    const carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    
    // Validar que hay productos en el carrito
    if (carrito.length === 0) {
        alert('El carrito está vacío');
        return;
    }
    
    // Mostrar modal de checkout
    const modal = document.getElementById('checkout-modal');
    modal.style.display = 'flex';
    
    // Actualizar totales en el modal
    const subtotal = parseFloat(document.getElementById('subtotal-carrito').textContent);
    const descuento = parseFloat(document.getElementById('descuento-carrito').textContent);
    const iva = parseFloat(document.getElementById('iva-carrito').textContent);
    const total = parseFloat(document.getElementById('total-carrito').textContent);
    
    document.getElementById('modal-subtotal').textContent = subtotal.toFixed(2);
    document.getElementById('modal-descuento').textContent = descuento.toFixed(2);
    document.getElementById('modal-iva').textContent = iva.toFixed(2);
    document.getElementById('modal-total').textContent = total.toFixed(2);
}

function realizarCompra() {
    // Simular compra
    alert('¡Compra realizada con éxito!');

    // Actualizar stock en el catálogo (LocalStorage)
    actualizarStock();
    
    // Vaciar carrito
    localStorage.removeItem('carrito');
    
    // Cerrar modal
    cerrarCheckout();
    
    // Renderizar carrito vacío
    renderizarCarrito();
}

function actualizarStock() {
    // Cargar catálogo desde LocalStorage
    const catalogoActualizado = JSON.parse(localStorage.getItem('catalogo'));
    const clavesProducto = Object.keys(catalogoActualizado);

    // Comprobar el stock de cada producto y actualizar el catálogo si hay 
    // diferencias con el stock de la tienda
    clavesProducto.forEach(item => {
        const clave = item;
        const stockActualizado = parseInt(document.getElementById(`stock-${clave}`).textContent);
        if(stockActualizado !== parseInt(catalogoActualizado[clave]['stock'])) {
            catalogoActualizado[clave]['stock'] = stockActualizado;
        };
        
    });

    // Guardar el catálogo actualizado en LocalStorage
    localStorage.setItem('catalogo', JSON.stringify(catalogoActualizado));
}

function cerrarCheckout() {
    const modal = document.getElementById('checkout-modal');
    modal.style.display = 'none';
}

// Revisar si la lista de productos existe en LocalStorage. Si no existe se 
// copia la lista de productos definida en el script
async function comprobarCatalogo() {
    if(localStorage.getItem('catalogo') == null) {
        localStorage.setItem('catalogo', JSON.stringify(productos));
        await actualizarDescripciones();
    };
    renderizarTienda();
}

// Generar los elementos de la tienda a partir del listado de productos
function renderizarTienda() {
    // Recuperar la lista de productos desde LocalStorage y darle formato
    const contenedorTienda = document.getElementById('productos');
    const catalogo = JSON.parse(localStorage.getItem('catalogo'));
    const listaProductos = Object.values(catalogo); // Lista iterable de productos

    // Generar cada producto a partir de las listas creadas
    listaProductos.forEach((producto, index) => {
        const productoID = clavesProducto[index];
        const productoNombre = producto.nombre;
        const productoDescripcion = producto.descripcion;
        const productoStock = producto.stock;
        const productoPrecio = producto.precio;

        // Crear div para mostrar las tarjetas de producto
        const divProducto = document.createElement('div');
        divProducto.setAttribute('class', 'col');

        // Crear tarjeta de producto con el contenido recuperado del catálogo
        divProducto.innerHTML = `
        <div class="card h-100 text-center p-2 producto">
            <img src="../img/icono-${productoID}.png" alt="${productoNombre}" class="card-img-top">
            <div class="card-body">
                <h3 class="card-title">${productoNombre}</h3>
                <button class="btn btn-primary" type="button" data-bs-toggle="collapse" data-bs-target="#${productoID}-colapsable" aria-expanded="false" aria-controls="collapseExample">
                    Descripción
                </button>
                <div class="collapse" id="${productoID}-colapsable">
                    <div class="card-body" id="${productoID}-descripcion">
                        ${productoDescripcion}
                    </div>
                </div>
                <ul class="list-group list-group-flush">
                    <li class="list-group-item">Precio: $${productoPrecio}</li>
                    <li class="list-group-item">Stock: <span id="stock-${productoID}">${productoStock}</span></li>
                </ul>
                <button class="boton" onclick="agregarAlCarrito('${productoNombre}', ${productoStock}, '${productoID}')">Agregar</button>
            </div>
        </div>
        `;

        // Renderizar producto
        contenedorTienda.appendChild(divProducto);
    });

    finalizarCarga()
}

// Ocultar spinner al completar la carga del contenido de la tienda
function finalizarCarga() {
    const spinner = document.getElementById('spinner-tienda');
    const listaTienda = document.getElementById('productos');
    spinner.classList.add('d-none');
    listaTienda.classList.remove('d-none');
}

// Recuperar texto usando la función Fetch y guardarlo como descripción de 
// productos en el catálogo

async function actualizarDescripciones() {
    let indice = 1;

    for (const item of clavesProducto) {
        const clave = item;
        const json = await this.recuperarContenido(clave, indice);
        const catalogo = JSON.parse(localStorage.getItem('catalogo'));
        const descripcion = json.body.replace(/\r?\n/g, " ");
        catalogo[clave]['descripcion'] = descripcion;
        localStorage.setItem('catalogo', JSON.stringify(catalogo));
        indice++;
    };
}

async function recuperarContenido(productoID, indice) {
    let url = 'https://jsonplaceholder.typicode.com';
    let query = 'posts';
    return await fetch(`${url}/${query}/${indice}`)
    .then(respuesta => respuesta.json())
    .then(json => {
        return json;
    });
}

// Verificador del formulario de contacto
function validarFormulario() {
    let camposFaltantes = [] // Guarda los nombres de los campos incompletos
    for(const [campo, contenido] of Object.entries(obtenerCampos())) {
        if(contenido == '') {
            camposFaltantes.push(campo);
            console.log("Campo incompleto: " + campo);
        }
    };
    if(camposFaltantes.length > 0) {
        // Muestra una alerta con los campos faltantes
        alert('Faltan completar los siguientes campos:\n' + camposFaltantes.map(etiqueta => `· ${etiqueta}`).join('\n'))
    } else {
        console.log("Los campos del formulario están completos.")
    }
}

// Obtener los campos del formulario. La función devuelve un objeto con los 
// nombres y el contenido de cada campo.
function obtenerCampos() {
    let campos = {
        Nombre: '',
        Email: '',
        Mensaje: ''
    };
    campos.Nombre = document.getElementById('nombre').value;
    campos.Email = document.getElementById('email').value;
    campos.Mensaje = document.getElementById('mensaje').value;
    return campos;
}
