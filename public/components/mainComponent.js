import { createCarousel } from './carouselComponent.js';

document.addEventListener('DOMContentLoaded', function () {
    function createMissionVisionBlock() {
        const block = document.createElement('div');
        block.className = 'bg-black bg-opacity-80 p-6 rounded-lg shadow-lg flex items-center justify-center -mb-10';

        const text = document.createElement('p');
        text.className = 'text-white text-lg font-serif italic text-center';
        text.style.lineHeight = '1.8';
        text.innerHTML = `
        <p>Bienvenidos a TecnoShop!</p>
        <p>En nuestro local vivimos y respiramos tecnología. Nos apasiona ofrecer las mejores soluciones en componentes informáticos para que cada equipo tenga el rendimiento que merece. Nuestra misión es proporcionar productos de alta calidad que impulsen la creatividad y maximicen la productividad de los entusiastas, gamers y profesionales.</p>        
        <p>Nos esforzamos por ser más que una simple tienda de hardware: queremos ser el motor que te impulsa a alcanzar tus metas tecnológicas. Creemos en un mundo donde cada usuario puede armar y mejorar su equipo sin límites, con la seguridad de contar siempre con lo mejor en microprocesadores, monitores, notebooks, tarjetas gráficas, etc.</p>        
        <p>Estamos comprometidos con la excelencia, la innovación y el soporte personalizado, para que tu experiencia tecnológica sea siempre de otro nivel.</p>
        `;

        block.appendChild(text);
        return block;
    }

    function createCarouselBlock() {
        const block = document.createElement('div');
        block.className = 'bg-black bg-opacity-80 p-6 rounded-lg shadow-lg flex items-center justify-center -mb-10';

        const carouselContainer = document.createElement('div');
        carouselContainer.id = 'carouselContainer';
        carouselContainer.className = 'w-full h-full flex items-center justify-center';

        block.appendChild(carouselContainer);

        setTimeout(() => {
            const images = [
                '../img/slider/slider1.webp',
                '../img/slider/slider2.webp',
                '../img/slider/slider3.webp',
                '../img/slider/slider4.webp'
            ];
            createCarousel('carouselContainer', images);
        }, 0);

        return block;
    }

    const mainSection = document.createElement('section');
    mainSection.className = 'w-full py-8 px-4 md:px-8 lg:px-16 xl:px-24 mt-1';

    const container = document.createElement('div');
    container.className = 'flex flex-col lg:flex-row gap-8 items-stretch justify-between';

    const missionVisionBlock = createMissionVisionBlock();
    missionVisionBlock.classList.add('w-full', 'lg:w-1/2');

    const carouselBlock = createCarouselBlock();
    carouselBlock.classList.add('w-full', 'lg:w-1/2');

    container.appendChild(missionVisionBlock);
    container.appendChild(carouselBlock);

    mainSection.appendChild(container);

    const navbar = document.querySelector('nav');
    if (navbar) {
        navbar.insertAdjacentElement('afterend', mainSection);
    } else {
        document.body.prepend(mainSection);
    }
});