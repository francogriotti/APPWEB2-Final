import { realizarCompra } from "./compra.js";
const CARRITO_KEY = "carrito_compras";

export function inicializarCarrito() {
    actualizarVistaCarrito();
    actualizarVisibilidadCarrito();
    document
        .getElementById("comprarBtn")
        .addEventListener("click", realizarCompra);
}

export function actualizarVisibilidadCarrito() {
    const carrito = obtenerCarrito();
    const carritoContainer = document.getElementById("carritoContainer");
    const productosGridContainer = document.getElementById(
        "productosGridContainer"
    );

    if (!carritoContainer || !productosGridContainer) {
        console.error(
            "No se encontraron los contenedores 'carritoContainer' o 'productosGridContainer'"
        );
        return;
    }

    if (carrito.length > 0) {
        carritoContainer.classList.remove("hidden");
        productosGridContainer.classList.remove("md:col-span-4");
        productosGridContainer.classList.add("md:col-span-3");
    } else {
        carritoContainer.classList.add("hidden");
        productosGridContainer.classList.remove("md:col-span-3");
        productosGridContainer.classList.add("md:col-span-4");
    }
}

export function agregarAlCarrito(idProducto) {
    let carrito = obtenerCarrito();
    const productoEnCarrito = carrito.find(
        (item) => item.id_producto === idProducto
    );

    if (productoEnCarrito) {
        productoEnCarrito.cant++;
    } else {
        carrito.push({ id_producto: idProducto, cant: 1 });
    }

    guardarCarrito(carrito);
    actualizarVistaCarrito();
    actualizarVisibilidadCarrito();
}

export function obtenerCarrito() {
    const carritoGuardado = localStorage.getItem(CARRITO_KEY);
    return carritoGuardado ? JSON.parse(carritoGuardado) : [];
}

function guardarCarrito(carrito) {
    localStorage.setItem(CARRITO_KEY, JSON.stringify(carrito));
}

async function actualizarVistaCarrito() {
    const carrito = obtenerCarrito();
    const carritoElement = document.getElementById("carrito");

    if (!carritoElement) {
        console.error("No se encontró el contenedor 'carrito'");
        return;
    }

    carritoElement.innerHTML = "";
    let total = 0;

    for (const item of carrito) {
        const producto = await obtenerDetallesProducto(item.id_producto);

        if (producto) {
            const subtotal = producto.precio * item.cant;
            total += subtotal;

            const itemElement = document.createElement("div");
            itemElement.className =
                "flex items-center justify-between mb-2 border-b border-gray-700 pb-2";

                itemElement.innerHTML = `
                <div class="flex items-center space-x-4">
                    <img src="/${producto.imagen}" alt="${producto.nombre}" class="w-12 h-12 object-cover rounded">
                    <div>
                        <p class="text-white font-semibold">${producto.nombre}</p>
                        <div class="flex items-center space-x-4 mt-1 justify-between w-full">
                            <div class="flex items-center space-x-2">
                                <button class="disminuirCantidad text-white bg-gray-700 px-2 rounded hover:bg-gray-500" data-id="${item.id_producto}">-</button>
                                <span class="text-lg font-bold text-white">${item.cant}</span>
                                <button class="aumentarCantidad text-white bg-gray-700 px-2 rounded hover:bg-gray-500" data-id="${item.id_producto}">+</button>
                            </div>
                            <div class="text-white font-bold">$${subtotal.toFixed(2)}</div>
                        </div>
                    </div>
                </div>
                <button class="eliminarDelCarrito text-red-500 hover:text-red-700" data-id="${item.id_producto}">
                    <i class="fas fa-trash"></i>
                </button>
            `;          
            
            carritoElement.appendChild(itemElement);
        }
    }

    document.getElementById("totalCarrito").textContent = `$${total.toFixed(2)}`;

    agregarEventListenersCarrito();
    actualizarVisibilidadCarrito();
}

async function obtenerDetallesProducto(idProducto) {
    try {
        const response = await fetch(
            `/productos/buscarProductoPorId/${idProducto}`
        );
        if (!response.ok) {
            console.error(`Producto con ID ${idProducto} no encontrado`);
            return null;
        }
        return await response.json();
    } catch (error) {
        console.error("Error al obtener detalles del producto:", error);
        return null;
    }
}

function agregarEventListenersCarrito() {
    document.querySelectorAll(".eliminarDelCarrito").forEach((button) => {
        button.addEventListener("click", (e) => {
            const idProducto = parseInt(e.target.closest("button").dataset.id);
            eliminarDelCarrito(idProducto);
        });
    });

    document.querySelectorAll(".aumentarCantidad").forEach((button) => {
        button.addEventListener("click", (e) => {
            const idProducto = parseInt(e.target.dataset.id);
            modificarCantidad(idProducto, 1);
        });
    });

    document.querySelectorAll(".disminuirCantidad").forEach((button) => {
        button.addEventListener("click", (e) => {
            const idProducto = parseInt(e.target.dataset.id);
            modificarCantidad(idProducto, -1);
        });
    });
}

function modificarCantidad(idProducto, cambio) {
    let carrito = obtenerCarrito();
    const productoEnCarrito = carrito.find(
        (item) => item.id_producto === idProducto
    );

    if (productoEnCarrito) {
        productoEnCarrito.cant += cambio;
        if (productoEnCarrito.cant <= 0) {
            carrito = carrito.filter((item) => item.id_producto !== idProducto);
        }
        guardarCarrito(carrito);
        actualizarVistaCarrito();
    }
}

export function eliminarDelCarrito(idProducto) {
    let carrito = obtenerCarrito();
    carrito = carrito.filter((item) => item.id_producto !== idProducto);
    guardarCarrito(carrito);
    actualizarVistaCarrito();
    actualizarVisibilidadCarrito();
}

export function vaciarCarrito() {
    localStorage.removeItem(CARRITO_KEY);
    actualizarVistaCarrito();
    actualizarVisibilidadCarrito();
}