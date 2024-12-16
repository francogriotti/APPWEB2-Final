document.addEventListener('DOMContentLoaded', function () {
    const navbar = document.createElement('nav');
    navbar.className = `
    w-full bg-gradient-to-r from-indigo-600 to-blue-500 text-white shadow-lg 
    container mx-auto my-2 font-serif
`;

    const container = document.createElement('div');
    container.className = 'container mx-auto px-4 py-2';

    const link = document.createElement('a');
    link.href = '../pages/productos.html';
    link.className = `
        block text-center text-white text-lg   
        transition-all duration-300 ease-in-out
        hover:text-gray-200 hover:bg-gray-700 hover:shadow-lg
        hover:scale-100 active:scale-90 hover:font-bold
        focus:outline-none focus:ring-4 focus:ring-blue-500 py-1 px-4 rounded
    `;
    link.textContent = 'PRODUCTOS';

    container.appendChild(link);
    navbar.appendChild(container);

    const header = document.querySelector('header');
    header.insertAdjacentElement('afterend', navbar);

    const mainContent = document.querySelector('body > *:not(header):not(nav)');
    if (mainContent) {
        mainContent.style.paddingTop = '40px';
    }
});