// /**
//  * Tercera preentrega
//  */

let productos = JSON.parse(localStorage.getItem('productos')) || [];
let subtotal = 0;

document.addEventListener('DOMContentLoaded', () => {
    actualizarTabla();
    calcularTotales();
});

function agregarProducto() {
    const nombre = document.getElementById('nombreProducto').value;
    const precio = parseFloat(document.getElementById('precioProducto').value);
    
    if (nombre && !isNaN(precio)) {
        productos.push({ nombre, precio, cantidad: 1, subtotal: precio });
        actualizarStorage();
        actualizarTabla();
        calcularTotales();
    } else {
        alert("Ingrese un nombre y un precio válidos.");
    }
}

function actualizarTabla() {
    const cuerpoTabla = document.getElementById('cuerpoTabla');
    cuerpoTabla.innerHTML = '';
    
    productos.forEach((producto, index) => {
        const fila = document.createElement('tr');
        
        fila.innerHTML = `
            <td>${producto.nombre}</td>
            <td><input type="number" value="${producto.precio}" step="0.01" onchange="modificarPrecio(${index}, this.value)"></td>
            <td><input type="text" value=${producto.cantidad} onchange="modificarCantidad(${index}, this.value)"></td>
            <td>${producto.subtotal.toFixed(2)}</td>
            <td><button onclick="eliminarProducto(${index})">Eliminar</button></td>
        `;
        
        cuerpoTabla.appendChild(fila);
    });
}

function modificarPrecio(index, nuevoPrecio) {
    nuevoPrecio = parseFloat(nuevoPrecio);
    
    if (!isNaN(nuevoPrecio)) {
        productos[index].precio = nuevoPrecio;
        productos[index].subtotal = productos[index].cantidad * nuevoPrecio;
        actualizarStorage();
        actualizarTabla();
        calcularTotales();
    } else {
        alert("Ingrese un precio válido.");
    }
}

function modificarCantidad(index, nuevoCantidad) {
    nuevoCantidad = parseFloat(nuevoCantidad);
    
    if (!isNaN(nuevoCantidad)) {
        productos[index].cantidad = nuevoCantidad;
        productos[index].subtotal = productos[index].precio * nuevoCantidad;
        actualizarStorage();
        actualizarTabla();
        calcularTotales();
    } else {
        alert("Ingrese una cantidad válida.");
    }
}

function eliminarProducto(index) {
    productos.splice(index, 1);
    actualizarStorage();
    actualizarTabla();
    calcularTotales();
}

function calcularTotales() {
    subtotal = productos.reduce((acc, producto) => acc + producto.subtotal, 0);
    document.getElementById('subtotal').textContent = subtotal.toFixed(2);
    document.getElementById('total').textContent = subtotal.toFixed(2);
}

function actualizarStorage() {
    localStorage.setItem('productos', JSON.stringify(productos));
}

function finalizarFactura() {
    alert("Factura finalizada. Total: $" + subtotal.toFixed(2));
    
    productos = [];
    actualizarStorage();
    actualizarTabla();
    calcularTotales();
}