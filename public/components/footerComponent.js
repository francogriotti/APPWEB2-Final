document.addEventListener('DOMContentLoaded', createFooterComponent);

function createFooterComponent() {
    const footer = document.createElement('footer');
    footer.className = 'bg-gradient-to-t from-gray-900 to-black text-white py-8 px-4 text-center shadow-lg';

    const whatsappNumber = '+5493513062847';
    const whatsappMessage = encodeURIComponent('Gracias por comunicarte con TecnoShop! Nuestros horarios de consulta son de lunes a viernes de 9 a 18 hrs. Dejanos tu consulta y te responderemos a la brevedad!.');

    const content = `
        <div class="max-w-2xl mx-auto">
            <!-- Redes sociales -->
            <div class="mb-6 flex justify-center space-x-6">
                <a href="https://www.facebook.com/tu-pagina" target="_blank" class="transition-transform duration-300 hover:scale-125 hover:text-[#3b5998]">
                    <i class="fab fa-facebook text-3xl"></i>
                </a>
                <a href="https://www.instagram.com/tu-pagina" target="_blank" class="transition-transform duration-300 hover:scale-125 hover:text-[#C13584]">
                    <i class="fab fa-instagram text-3xl"></i>
                </a>
                <a href="https://wa.me/${whatsappNumber}?text=${whatsappMessage}" target="_blank" class="transition-transform duration-300 hover:scale-125 hover:text-[#25D366]">
                    <i class="fab fa-whatsapp text-3xl"></i>
                </a>
            </div>
            <!-- Información de contacto -->
            <div class="mb-4">
                <p class="text-gold">Contacto: info@tecnoshop.com</p>
                <p>Teléfono: (351) 524 - 0193</p>
            </div>
            <div>
                <a href="/politicas-de-privacidad" class="underline hover:text-gray-300">Políticas de Privacidad</a>
            </div>
        </div>
    `;

    footer.innerHTML = content;
    document.body.appendChild(footer);
}