export function createCarousel(containerId, images) {
  const container = document.getElementById(containerId);
  if (!container) {
    console.error('Container not found:', containerId);
    return;
  }

  const carouselHTML = `
    <div class="carousel-wrapper relative overflow-hidden mx-auto w-full h-auto max-w-[1350px]">
      <div class="carousel-track flex transition-transform duration-500 ease-in-out">
        ${images.map((src, index) => `
          <div class="carousel-item flex-none w-full h-full">
            <img src="${src}" alt="Carousel image ${index + 1}" class="w-full h-full object-fit-cover">
          </div>
        `).join('')}
      </div>
      <button class="carousel-button prev absolute left-2 top-1/2 transform -translate-y-1/2 bg-gray-700 text-white p-3 rounded-full z-10">&#9664;</button>
      <button class="carousel-button next absolute right-2 top-1/2 transform -translate-y-1/2 bg-gray-700 text-white p-3 rounded-full z-10">&#9654;</button>
    </div>
  `;

  container.innerHTML = carouselHTML;

  const track = container.querySelector('.carousel-track');
  const items = container.querySelectorAll('.carousel-item');
  const prevButton = container.querySelector('.prev');
  const nextButton = container.querySelector('.next');

  let currentIndex = 0;
  const totalItems = items.length;

  const updateCarousel = () => {
    const containerWidth = container.offsetWidth;
    const containerHeight = container.offsetHeight;

    const offset = -currentIndex * containerWidth;
    track.style.transform = `translateX(${offset}px)`;

    items.forEach(item => {
      item.style.width = `${containerWidth}px`;
      item.style.height = `${containerHeight}px`;
    });
  };

  const nextSlide = () => {
    currentIndex = (currentIndex + 1) % totalItems;
    updateCarousel();
  };

  const prevSlide = () => {
    currentIndex = (currentIndex - 1 + totalItems) % totalItems;
    updateCarousel();
  };

  prevButton.addEventListener('click', prevSlide);
  nextButton.addEventListener('click', nextSlide);

  const autoPlayInterval = 4000;
  let autoPlay = setInterval(nextSlide, autoPlayInterval);

  container.addEventListener('mouseover', () => clearInterval(autoPlay));
  container.addEventListener('mouseout', () => autoPlay = setInterval(nextSlide, autoPlayInterval));

  updateCarousel();
  window.addEventListener('resize', updateCarousel);
}