import { agregarAlCarrito } from './carrito.js';

let cargarProductos;
let filtrarProductos;

(function () {
    let todosLosProductos = [];
    let cargaInicialEjecutada = false;

    function esPaginaProductos() {
        return window.location.pathname.includes('productos.html');
    }

    cargarProductos = async function (categoria = null, esFiltro = false) {
        if (!esPaginaProductos()) return;

        const contenedor = document.getElementById('productosGrid');
        if (!contenedor) {
            console.error("No se encontró el contenedor 'productosGrid'");
            return;
        }

        if (!esFiltro && cargaInicialEjecutada) {
            console.log("La carga inicial de productos ya se ejecutó, evitando llamada duplicada.");
            return;
        }

        if (!esFiltro) cargaInicialEjecutada = true; 

        contenedor.innerHTML = '<div class="spinner">Cargando...</div>';

        try {
            let url;

            if (categoria) {
                console.log(`Cargando productos de la categoría: ${categoria}`);
                const categoriaNormalizada = encodeURIComponent(categoria.trim());
                url = `/productos/buscarProductoPorCategoria/${categoriaNormalizada}`;
            } else {
                console.log("Cargando todos los productos...");
                url = "/productos/all";
            }

            console.log("URL solicitada:", url);

            const response = await fetch(url);
            if (!response.ok) throw new Error('Error al cargar los productos');

            const productos = await response.json();
            console.log("Productos obtenidos:", productos);

            if (productos.length === 0) {
                mostrarError("No se encontraron productos para esta categoría.");
            } else {
                mostrarProductos(productos);
            }
        } catch (error) {
            console.error('Error al cargar productos:', error);
            mostrarError('No se pudieron cargar los productos. Por favor, intente más tarde.');
        }
    };

    filtrarProductos = function (categoria) {
        console.log(`Filtrando productos por categoría: ${categoria}`);
        cargarProductos(categoria === 'Todos' ? null : categoria, true);
    };

    function mostrarProductos(productos) {
        const contenedor = document.getElementById('productosGrid');
        if (!contenedor) return;

        contenedor.innerHTML = '';

        productos.forEach(producto => {
            const tarjeta = crearTarjetaProducto(producto);
            contenedor.appendChild(tarjeta);
        });
    }

    function crearTarjetaProducto(producto) {
        const tarjeta = document.createElement('div');
        tarjeta.className = `
            bg-black bg-opacity-70 rounded-lg shadow-md p-4 flex flex-col h-full
            transition-all duration-300 ease-in-out transform hover:scale-105 hover:shadow-xl
        `;
        tarjeta.innerHTML = `
            <div class="relative pt-[100%] mb-4 overflow-hidden rounded">
                <img 
                    src="/${producto.imagen}" 
                    alt="${producto.nombre}" 
                    class="absolute top-0 left-0 w-full h-full object-cover rounded"
                >
            </div>
            <h3 class="text-lg font-semibold text-white text-center">${producto.nombre}</h3>
            <p class="text-white mb-2 flex-grow text-center">${producto.desc}</p>
            <p class="text-accent2 font-bold text-center">$${producto.precio.toFixed(2)}</p>
            <button class="btn-agregar-carrito bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold py-2 px-4 rounded mt-4
                    hover:scale-105 active:scale-95 transition duration-300 ease-in-out shadow-lg hover:shadow-xl"
                data-id="${producto.id_producto}">
                Agregar al carrito
            </button>
        `;

        tarjeta.querySelector('.btn-agregar-carrito').addEventListener('click', (e) => {
            const idProducto = parseInt(e.target.dataset.id);
            agregarAlCarrito(idProducto);
        });

        return tarjeta;
    }

    function mostrarError(mensaje) {
        const contenedor = document.getElementById('productosGrid');
        if (contenedor) contenedor.innerHTML = `<p class="text-red-500">${mensaje}</p>`;
    }

    document.addEventListener('DOMContentLoaded', function () {
        if (!esPaginaProductos()) return;

        const urlParams = new URLSearchParams(window.location.search);
        const categoria = urlParams.get('categoria');

        console.log(`Cargando página con categoría desde la URL: ${categoria}`);
        cargarProductos(categoria);

        const scrollTopBtn = document.getElementById('scrollTopBtn');

        window.addEventListener('scroll', () => {
            if (window.scrollY > 300) {
                scrollTopBtn.classList.remove('opacity-0');
                scrollTopBtn.classList.add('opacity-100');
            } else {
                scrollTopBtn.classList.remove('opacity-100');
                scrollTopBtn.classList.add('opacity-0');
            }
        });

        scrollTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    });
})();

export { cargarProductos, filtrarProductos };
