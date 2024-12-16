import { filtrarProductos } from "../script/productos.js";

document.addEventListener("DOMContentLoaded", function () {
  const navbar = document.createElement("nav");
  navbar.className = `
        w-full bg-gradient-to-r from-indigo-600 to-blue-500 text-white shadow-lg 
        sticky top-0 z-20 container mx-auto my-4 md:my-8 font-serif
    `;

  const container = document.createElement("div");
  container.className = "container mx-auto px-4 py-2";

  const menuToggle = document.createElement("button");
  menuToggle.className = "md:hidden text-white text-2xl w-full text-left pb-2";
  menuToggle.textContent = "☰ Categorías";

  const menuContent = document.createElement("div");
  menuContent.className =
    "hidden md:flex md:flex-row md:justify-center md:space-x-4";

  const categoriasMap = {
    Todos: "Todos",
    Microprocesador: "Microprocesador",
    Monitores: "Monitores",
    Notebook: "Notebook",
    "Placas de video": "PlacaVideo",
  };

  Object.keys(categoriasMap).forEach((categoria) => {
    const link = document.createElement("a");
    link.href = "#";
    link.textContent = categoria;
    link.className = `
            block md:inline-block text-white text-lg transition-all duration-300 ease-in-out 
            hover:text-gray-200 hover:bg-gray-700 hover:shadow-lg hover:scale-105 active:scale-95
            focus:outline-none focus:ring-4 focus:ring-blue-500 py-1 px-4 rounded
        `;

    link.addEventListener("click", (e) => {
      e.preventDefault();
      const categoriaDB = categoriasMap[categoria];
      console.log(`Seleccionando categoría: ${categoriaDB}`);
      filtrarProductos(categoriaDB);
    });

    menuContent.appendChild(link);
  });

  menuToggle.addEventListener("click", () => {
    menuContent.classList.toggle("hidden");
  });

  container.appendChild(menuToggle);
  container.appendChild(menuContent);
  navbar.appendChild(container);
  document.getElementById("productNav").appendChild(navbar);
});