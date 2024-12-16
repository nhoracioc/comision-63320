// /**
//  * Entrega Proyecto Final
//  */

let productos = JSON.parse(localStorage.getItem('productos')) || [];
let subtotal = 0;

// Para levantar articulos desde API
// document.addEventListener('DOMContentLoaded', () => {
//     fetch('https://fakestoreapi.com/products')
//         .then(response => response.json())
//         .then(data => {
//             productos = data.map(item => ({
//                 nombre: item.title,
//                 precio: item.price,
//                 cantidad: 1,  // Asignamos una cantidad por defecto
//                 subtotal: item.price
//             }));
//             actualizarTabla();
//             calcularTotales();
//             actualizarStorage();
//         })
//         .catch(error => console.error('Error al cargar productos:', error));
// });


document.addEventListener('DOMContentLoaded', () => {
    fetch('/json/productos.json')
        .then(response => response.json())
        .then(data => {
            productos = data.map(item => ({
                nombre: item.nombre,
                precio: Number(item.precio),  // Nos aseguramos que el precio sea un número
                cantidad: Number(item.cantidad),  // Nos aseguramos que la cantidad sea un número
                subtotal: item.precio * item.cantidad
            }));
            actualizarTabla();
            calcularTotales();
            actualizarStorage();
        })
        .catch(error => console.error('Error al cargar productos:', error));
});


document.addEventListener('DOMContentLoaded', () => {
    actualizarTabla();
    calcularTotales();
});

function agregarProducto() {
    const nombre = document.getElementById('nombreProducto').value;
    const precio = Number(document.getElementById('precioProducto').value);
    const cantidad = Number(document.getElementById('cantidadProducto').value);
    
    if (nombre && precio > 0 && cantidad > 0) {
        const productoExistente = productos.find(producto => producto.nombre === nombre);
        if (productoExistente) {
            Swal.fire({
                title: `Ya existe el artículo "${nombre}" en la factura.`,
                text: `¿Desea agregar ${cantidad} a los ya facturados?`,
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Sí, agregar',
                cancelButtonText: 'No, cancelar'
            }).then((result) => {
                if (result.isConfirmed) {
                    productoExistente.cantidad += cantidad;
                    productoExistente.subtotal = productoExistente.cantidad * productoExistente.precio;
                    actualizarStorage();
                    actualizarTabla();
                    calcularTotales();
                    Swal.fire({
                        icon: 'success',
                        title: 'Actualizado',
                        text: `Se han agregado ${cantidad} unidades al artículo "${nombre}".`
                    });
                }
            });
        } else {
            const nuevoProducto = { nombre, precio, cantidad, subtotal: precio * cantidad };
            productos.push(nuevoProducto);
            actualizarStorage();
            actualizarTabla();
            calcularTotales();
        }
    } else {
        Swal.fire({
            icon: 'error',
            title: 'Datos Invalidos',
            text: 'Ingrese un nombre, precio y cantidad válidos.'
        });
    }

    // Limpiar los campos de entrada
    document.getElementById('nombreProducto').value = '';
    document.getElementById('precioProducto').value = '';
    document.getElementById('cantidadProducto').value = '';    
}



// function agregarProducto() {
//     const nombre = document.getElementById('nombreProducto').value;
//     const precio = parseFloat(document.getElementById('precioProducto').value);
//     const cantidad = parseInt(document.getElementById('cantidadProducto').value);
    
//     if (nombre && !isNaN(precio) && !isNaN(cantidad)) {
//         // Verificar si el producto ya existe
//         const productoExistente = productos.find(producto => producto.nombre === nombre);
        
//         if (productoExistente) {
//             const confirmar = confirm(`Ya existe el artículo "${nombre}" en la factura. ¿Desea agregar ${cantidad} a los ya facturados?`);
//             if (confirmar) {
//                 productoExistente.cantidad += cantidad;
//                 productoExistente.subtotal = productoExistente.cantidad * productoExistente.precio;
//                 actualizarStorage();
//                 actualizarTabla();
//                 calcularTotales();
//             }
//         } else {
//             productos.push({ nombre, precio, cantidad, subtotal: precio * cantidad });
//             actualizarStorage();
//             actualizarTabla();
//             calcularTotales();
//         }
//     } else {
//         Swal.fire({
//             icon: 'error',
//             title: 'Datos Invalidos',
//             text: 'Ingrese un nombre, precio y cantidad válidos.'
//         });
        
//     }

//     // Limpiar los campos de entrada
//     document.getElementById('nombreProducto').value = '';
//     document.getElementById('precioProducto').value = '';
//     document.getElementById('cantidadProducto').value = '';
// }

function buscarProducto() {
    const terminoBusqueda = document.getElementById('busquedaNombreProducto').value.toLowerCase();
    const productosFiltrados = productos.filter(producto => 
        producto.nombre.toLowerCase().includes(terminoBusqueda)
    );
    actualizarTabla(productosFiltrados);
}

function actualizarTabla(productosMostrar = productos) {
    const cuerpoTabla = document.getElementById('cuerpoTabla');
    cuerpoTabla.innerHTML = '';
    
    productosMostrar.forEach((producto, index) => {
        const fila = document.createElement('tr');
        
        fila.innerHTML = `
            <td>${producto.nombre}</td>
            <td><input type="text" value="${producto.precio}" onchange="modificarPrecio(${index}, this.value)"></td>
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
        Swal.fire({
            icon: 'error',
            title: 'Datos Invalidos',
            text: 'Ingrese un precio válido.'
        });
                
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
        Swal.fire({
            icon: 'error',
            title: 'Datos Invalidos',
            text: 'Ingrese una cantidad válida.'
        });        
    }
}

function eliminarProducto(index) {
    const producto = productos[index];
    Swal.fire({
        title: `Eliminar el artículo "${producto.nombre}"?`,
        text: "Esta acción no se puede deshacer.",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'No, cancelar'
    }).then((result) => {
        if (result.isConfirmed) {
            productos.splice(index, 1);
            actualizarStorage();
            actualizarTabla();
            calcularTotales();
            Swal.fire({
                icon: 'success',
                title: 'Eliminado',
                text: `Se eliminó el artículo "${producto.nombre}".`
            });
        }
    });
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
    Swal.fire({
        icon: 'success',
        title: 'Factura Finalizada',
        text: `Total: $${subtotal.toFixed(2)}`
    });
    
    
    productos = [];
    actualizarStorage();
    actualizarTabla();
    calcularTotales();
}