/**
 * Tercera preentrega
 */

// Objetos
class Producto {
    constructor(nombre, precio, cantidad) {
        this.nombre = nombre;
        this.precio = precio;
        this.cantidad = cantidad;
        this.iva = 21;

        this.element = this.crearTr();
    }

    obtenerSubtotal() {
        return this.precio * this.cantidad;
    }

    obtenerIva() {
        return this.obtenerSubtotal() * (this.iva / 100);
    }

    crearTr() {
        // Creamos tr
        const tr = document.createElement("tr");

        // Creamos tds
        const tdNombre = document.createElement("td");
        const tdPrecio = document.createElement("td");
        const tdCantidad = document.createElement("td");
        const tdAcciones = document.createElement("td");

        tdNombre.innerText = `${this.nombre}`;

        const spanPrecio = document.createElement("span");
        spanPrecio.innerText = `$${this.precio}`;
        spanPrecio.addEventListener("click", () => {
            clickSpanPrecioProducto(tdPrecio, spanPrecio, this);
        });

        const spanCantidad = document.createElement("span");
        spanCantidad.innerText = `${this.cantidad}`;
        spanCantidad.addEventListener("click", () => {
            clickSpanCantidadProducto(tdCantidad, spanCantidad, this);
        });

        tdPrecio.append(spanPrecio);
        tdCantidad.append(spanCantidad);

        // TD boton acciones
        const botonEliminar = document.createElement("button");
        botonEliminar.innerText = "Eliminar";

        botonEliminar.addEventListener("click", () => {
            eliminarProducto(this);
        });

        // Agregar boton al td
        tdAcciones.append(botonEliminar);

        // Agregar tds al tr
        tr.append(tdNombre, tdPrecio, tdCantidad, tdAcciones);

        return tr;
    }
}

// Funciones
function buscarProducto() {
    const value = inputBuscarProducto.value;

    // Filtrar los productos
    productosFiltrados = productos.filter( (item) => {
        return item.nombre.toLowerCase().includes(value.toLowerCase());
    });

    // Renderizar tabla
    renderizarTablaProductos();
}

function guardarEnLS() {
    const productosJSON = JSON.stringify(productos);

    localStorage.setItem("productos", productosJSON);
}

function transformarProductosLocalStorage(productosJSON) {
    if(productosJSON === null) {
        return null;
    }

    const productos = [];

    for(const productoLiteral of productosJSON) {
        productos.push(
            new Producto(
                productoLiteral.nombre,
                productoLiteral.precio,
                productoLiteral.cantidad,
            )
        )
    }

    return productos;
}

function obtenerDeLS() {
    return transformarProductosLocalStorage(
        JSON.parse(
            localStorage.getItem("productos")
        )
    ) || [
        new Producto("Funda", 12000, 1),
        new Producto("Auricular", 81000, 2),
        new Producto("Protector", 15000, 4),
        new Producto("Cable USB-C", 12500, 1),        
    ];
}


function obtenerSubtotal() {
    return productosFiltrados.reduce( (acc, item) => {
        return acc + item.obtenerSubtotal();
    }, 0);
}

function obtenerTotal() {
    return productos.reduce( (acc, item) => {
        return acc + item.obtenerSubtotal() + item.obtenerIva();
    }, 0);
}

function obtenerIva() {
    return productosFiltrados.reduce( (acc, item) => {
        return acc + item.obtenerIva();
    }, 0);
}

function nombreProductoExiste(nombre) {
    return productos.some( (item) => {
        return item.nombre.toLowerCase() === nombre.toLowerCase();
    });
}

function crearProducto(e) {
    e.preventDefault();

    // Leer los inputs
    const inputNombreProducto = document.getElementById("nombreProducto");
    const inputPrecioProducto = document.getElementById("precioProducto");
    const inputCantidadProducto = document.getElementById("cantidadProducto");

    // Guardar los datos del producto
    const nombreProducto = inputNombreProducto.value;
    const precioProducto = parseFloat(inputPrecioProducto.value);
    const cantidad = parseInt(inputCantidadProducto.value);

    // Limpiar inputs
    inputNombreProducto.value = "";
    inputCantidadProducto.value = "";
    inputPrecioProducto.value = "";

    // Evitar duplicados
    if(nombreProductoExiste(nombreProducto)) {
        alert("PRODUCTO YA EXISTE");
        return;
    }

    // Nuevo producto
    const producto = new Producto(
        nombreProducto,
        precioProducto,
        cantidad,
    );

    // Agregar el producto al array
    productos.push(producto);

    // Guardamos en local storage
    guardarEnLS();

    alert("PRODUCTO AGREGADO");

    renderizarTablaProductos();
}

function renderizarTotal() {
    spanTotal.innerText = obtenerTotal();
    spanSubtotal.innerText = obtenerSubtotal();
    spanIva.innerText = obtenerIva();
}

function clickSpanPrecioProducto(tdPrecio, spanPrecio, producto) {
    // Crear input
    const inputPrecio = document.createElement("input");
    inputPrecio.type = "text";
    inputPrecio.value = producto.precio;

    inputPrecio.addEventListener("change", () => {
        // Cambiamos precio de producto
        producto.precio = parseFloat(inputPrecio.value);

        // Guardamos en local storage
        guardarEnLS();

        // Volver a renderizar la tabla de productos
        renderizarTablaProductos();
    });

    // Agregar input al td
    tdPrecio.append(inputPrecio);

    // Ocultar span
    spanPrecio.className = "ocultar-elemento";
}

function clickSpanCantidadProducto(tdPrecio, spanPrecio, producto) {
    // Crear input
    const inputCantidad = document.createElement("input");
    inputCantidad.type = "text";
    inputCantidad.value = producto.cantidad;

    inputCantidad.addEventListener("change", () => {
        // Cambiamos cantidad de producto
        producto.cantidad = parseInt(inputCantidad.value);

        // Guardamos en local storage
        guardarEnLS();

        // Volver a renderizar la tabla de productos
        renderizarTablaProductos();
    });

    // Agregar input al td
    tdPrecio.append(inputCantidad);

    // Ocultar span
    spanPrecio.className = "ocultar-elemento";
}

function eliminarProducto(producto) {
    // Forma 1
    // productos = productos.filter( (el) => {
    //     return el.nombre !== producto.nombre;
    // });

    // Forma 2
    const indiceElemento = productos.findIndex( (item) => {
        return item.nombre === producto.nombre;
    });

    productos.splice(indiceElemento, 1);

    // Guardar en el LS
    guardarEnLS();

    // Renderizar tabla
    renderizarTablaProductos();
}

function renderizarTablaProductos() {
    tbodyProductos.innerHTML = "";

    for(const producto of productosFiltrados) {
        // Obtener tr
        const tr = producto.element;

        tbodyProductos.append(tr);
    }

    // Renderizamos el total
    renderizarTotal();
}

// Inicio del programa
const formAgregarProducto = document.getElementById("formAgregarProducto");
const tbodyProductos = document.getElementById("tbodyProductos");
const spanTotal = document.getElementById("total");
const spanSubtotal = document.getElementById("subtotal");
const spanIva = document.getElementById("iva");
const inputBuscarProducto = document.getElementById("buscarProducto");

let productos = obtenerDeLS();
let productosFiltrados = [...productos];

renderizarTablaProductos();

// Eventos
formAgregarProducto.addEventListener("submit", crearProducto);
inputBuscarProducto.addEventListener("input", buscarProducto);