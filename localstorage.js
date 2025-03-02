// Variables globales
const d = document;
let nombrePro = d.querySelector("#nombrePro");
let precioPro = d.querySelector("#precioPro");
let descripcionPro = d.querySelector("#descripcionPro");
let imagenPro = d.querySelector("#imagenPro");
let btnGuardar = d.querySelector(".btnGuardar");
let btnActualizar = d.querySelector(".btn-actualizar");
let tabla = d.querySelector(".table tbody");

// Evento para guardar un nuevo producto
btnGuardar.addEventListener("click", () => {
    let datos = validarDatos();
    if (datos) {
        guardarDatos(datos);
        borrarTabla();
        mostrarDatos();
    }
});

// Evento para mostrar los productos al cargar la página
d.addEventListener("DOMContentLoaded", () => {
    agregarBotonPDF(); // Agrega el botón de exportar a PDF
    mostrarDatos();
});

// Función para validar los datos ingresados
function validarDatos() {
    if (nombrePro.value && precioPro.value && descripcionPro.value && imagenPro.value) {
        let producto = {
            nombre: nombrePro.value,
            precio: precioPro.value,
            descripcion: descripcionPro.value,
            imagen: imagenPro.value
        };
        limpiarFormulario();
        return producto;
    } else {
        alert("Todos los datos son obligatorios.");
        return null;
    }
}

// Función para limpiar el formulario
function limpiarFormulario() {
    nombrePro.value = "";
    precioPro.value = "";
    descripcionPro.value = "";
    imagenPro.value = "";
}

// Función para guardar datos en localStorage
function guardarDatos(pro) {
    let productos = JSON.parse(localStorage.getItem("productos")) || [];
    productos.push(pro);
    localStorage.setItem("productos", JSON.stringify(productos));
    alert("Producto guardado correctamente.");
}

// Función para mostrar los productos en la tabla
function mostrarDatos() {
    let productos = JSON.parse(localStorage.getItem("productos")) || [];
    borrarTabla();
    productos.forEach((prod, i) => {
        let fila = d.createElement("tr");
        fila.innerHTML = `
            <td>${i + 1}</td>
            <td>${prod.nombre}</td>
            <td>${prod.precio}</td>
            <td>${prod.descripcion}</td>
            <td><img src="${prod.imagen}" width="50"></td>
            <td>
                <button onclick="actualizarPedido(${i})" class="btn btn-warning">🗒️</button>
                <button onclick="eliminarPedido(${i})" class="btn btn-danger">✖️</button>
            </td>
        `;
        tabla.appendChild(fila);
    });
}

// Función para borrar la tabla antes de actualizar los datos
function borrarTabla() {
    tabla.innerHTML = "";
}

// Función para eliminar un pedido
function eliminarPedido(pos) {
    let productos = JSON.parse(localStorage.getItem("productos")) || [];
    if (pos >= 0 && pos < productos.length) {
        let confirmar = confirm(`¿Deseas eliminar el producto "${productos[pos].nombre}"?`);
        if (confirmar) {
            productos.splice(pos, 1);
            localStorage.setItem("productos", JSON.stringify(productos));
            borrarTabla();
            mostrarDatos();
            alert("Producto eliminado con éxito.");
        }
    }
}

// Función para actualizar un pedido
function actualizarPedido(pos) {
    let productos = JSON.parse(localStorage.getItem("productos")) || [];
    if (productos[pos]) {
        nombrePro.value = productos[pos].nombre;
        precioPro.value = productos[pos].precio;
        descripcionPro.value = productos[pos].descripcion;
        imagenPro.value = productos[pos].imagen;

        btnGuardar.classList.add("d-none");
        btnActualizar.classList.remove("d-none");

        btnActualizar.onclick = () => {
            productos[pos].nombre = nombrePro.value;
            productos[pos].precio = precioPro.value;
            productos[pos].descripcion = descripcionPro.value;
            productos[pos].imagen = imagenPro.value;

            localStorage.setItem("productos", JSON.stringify(productos));
            alert("Producto actualizado con éxito.");

            limpiarFormulario();
            btnGuardar.classList.remove("d-none");
            btnActualizar.classList.add("d-none");

            borrarTabla();
            mostrarDatos();
        };
    }
}

// Función para agregar el botón de exportar PDF
function agregarBotonPDF() {
    let btnExportar = document.createElement("button");
    btnExportar.textContent = "Exportar a PDF";
    btnExportar.classList.add("btn", "btn-danger", "my-3");
    btnExportar.addEventListener("click", exportarPDF);
    d.querySelector(".container").appendChild(btnExportar);
}

// Función para exportar la lista de productos a PDF
function exportarPDF() {
    let productos = JSON.parse(localStorage.getItem("productos")) || [];
    if (productos.length === 0) {
        alert("No hay productos para exportar.");
        return;
    }

    let { jsPDF } = window.jspdf;
    let doc = new jsPDF();

    doc.setFontSize(18);
    doc.text("Listado de Productos", 10, 10);

    let filaY = 20;
    productos.forEach((prod, i) => {
        doc.setFontSize(12);
        doc.text(`${i + 1}. ${prod.nombre} - $${prod.precio}`, 10, filaY);
        doc.text(`Descripción: ${prod.descripcion}`, 10, filaY + 5);
        filaY += 15;
    });

    doc.save("listado_productos.pdf");
}


