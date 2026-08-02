document.addEventListener('DOMContentLoaded', function() {
    // Bloquea clic derecho y arrastre en imagenes para dificultar la descarga directa.
    const protectedImages = document.querySelectorAll('img');
    protectedImages.forEach((image) => {
        image.setAttribute('draggable', 'false');
        image.addEventListener('contextmenu', (event) => event.preventDefault());
        image.addEventListener('dragstart', (event) => event.preventDefault());
    });

    // ========== GALERÍA EN LIGHTBOX ==========
    const galleryImages = Array.from(document.querySelectorAll('.gallery-trigger'));
    const galleryLightbox = document.getElementById('galleryLightbox');
    const galleryLightboxImage = document.getElementById('galleryLightboxImage');
    const galleryPrevButton = document.querySelector('[data-gallery-prev]');
    const galleryNextButton = document.querySelector('[data-gallery-next]');
    const galleryCloseButtons = document.querySelectorAll('[data-gallery-close]');
    let currentGalleryIndex = 0;

    function showGalleryImage(index) {
        if (!galleryImages.length) {
            return;
        }

        currentGalleryIndex = (index + galleryImages.length) % galleryImages.length;
        const currentImage = galleryImages[currentGalleryIndex];
        galleryLightboxImage.src = currentImage.src;
        galleryLightboxImage.alt = currentImage.alt || 'Foto ampliada de la galería';
    }

    function openGallery(index) {
        if (!galleryLightbox || !galleryLightboxImage || !galleryImages.length) {
            return;
        }

        showGalleryImage(index);
        galleryLightbox.classList.add('is-open');
        galleryLightbox.setAttribute('aria-hidden', 'false');
        galleryLightbox.style.opacity = '1';
        galleryLightbox.style.visibility = 'visible';
        galleryLightbox.style.pointerEvents = 'auto';
        document.body.classList.add('gallery-open');
    }

    function closeGallery() {
        if (!galleryLightbox) {
            return;
        }

        galleryLightbox.classList.remove('is-open');
        galleryLightbox.setAttribute('aria-hidden', 'true');
        galleryLightbox.style.opacity = '';
        galleryLightbox.style.visibility = '';
        galleryLightbox.style.pointerEvents = '';
        document.body.classList.remove('gallery-open');
    }

    function nextGalleryImage() {
        showGalleryImage(currentGalleryIndex + 1);
    }

    function previousGalleryImage() {
        showGalleryImage(currentGalleryIndex - 1);
    }

    galleryImages.forEach((image, index) => {
        image.addEventListener('click', () => openGallery(index));
        image.addEventListener('keydown', (event) => {
            if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                openGallery(index);
            }
        });
    });

    if (galleryPrevButton) {
        galleryPrevButton.addEventListener('click', previousGalleryImage);
    }

    if (galleryNextButton) {
        galleryNextButton.addEventListener('click', nextGalleryImage);
    }

    galleryCloseButtons.forEach((button) => {
        button.addEventListener('click', closeGallery);
    });

    if (galleryLightbox) {
        galleryLightbox.addEventListener('click', (event) => {
            if (event.target === galleryLightbox) {
                closeGallery();
            }
        });
    }

    document.addEventListener('keydown', (event) => {
        if (!galleryLightbox || !galleryLightbox.classList.contains('is-open')) {
            return;
        }

        if (event.key === 'Escape') {
            closeGallery();
        } else if (event.key === 'ArrowLeft') {
            previousGalleryImage();
        } else if (event.key === 'ArrowRight') {
            nextGalleryImage();
        }
    });

    // ========== COUNTDOWN ==========
    // Evento inicia a las 21:00 (9:00 PM)
    const target = new Date('2026-09-12T21:00:00').getTime();

    function updateCountdown() {
        const now = new Date().getTime();
        const diff = target - now;
        if (diff <= 0) {
            document.getElementById('days').textContent = '00';
            document.getElementById('hours').textContent = '00';
            document.getElementById('minutes').textContent = '00';
            document.getElementById('seconds').textContent = '00';
            return;
        }
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);

        document.getElementById('days').textContent = String(days).padStart(2, '0');
        document.getElementById('hours').textContent = String(hours).padStart(2, '0');
        document.getElementById('minutes').textContent = String(minutes).padStart(2, '0');
        document.getElementById('seconds').textContent = String(seconds).padStart(2, '0');
    }

    updateCountdown();
    setInterval(updateCountdown, 1000);

    // ========== REPRODUCTOR DE MÚSICA ==========
    const audio = document.getElementById('miMusica');
    const playBtn = document.getElementById('playPauseBtn');

    if (playBtn && audio) {
        playBtn.addEventListener('click', function() {
            if (audio.paused) {
                audio.play();
                playBtn.innerHTML = '<i class="fas fa-pause"></i> Pausar';
            } else {
                audio.pause();
                playBtn.innerHTML = '<i class="fas fa-play"></i> Escuchar canción';
            }
        });

        // Opcional: cuando la canción termina, cambiar el texto del botón (aunque tenga loop)
        audio.addEventListener('ended', function() {
            if (!audio.loop) {
                playBtn.innerHTML = '<i class="fas fa-play"></i> Escuchar canción';
            }
        });
    }

    // ========== FORMULARIO CON SWEETALERT2 ==========
    const form = document.getElementById('confirmForm');
    const acompanantesDiv = document.getElementById('acompanantesDiv');
    const radiosAsistir = document.querySelectorAll('input[name="asistir"]');

    // Mostrar/ocultar acompañantes según selección de asistencia
    radiosAsistir.forEach(radio => {
        radio.addEventListener('change', function() {
            if (this.value === '1') {
                acompanantesDiv.style.display = 'block';
            } else {
                acompanantesDiv.style.display = 'none';
            }
        });
    });

    // Envío del formulario
    form.addEventListener('submit', function(e) {
        e.preventDefault();

        const nombre = this.querySelector('input[name="nombre"]').value.trim();
        const asistir = this.querySelector('input[name="asistir"]:checked');
        const cantidad = this.querySelector('input[name="cantidad"]:checked');

        // Validaciones
        if (!nombre) {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Por favor, ingresa tu nombre completo.',
                confirmButtonColor: '#cfb050'
            });
            return;
        }
        if (!asistir) {
            Swal.fire({
                icon: 'error',
                title: 'Falta información',
                text: 'Por favor, indica si asistirás o no.',
                confirmButtonColor: '#cfb050'
            });
            return;
        }

        if (asistir.value === '1' && !cantidad) {
            Swal.fire({
                icon: 'error',
                title: 'Faltan acompañantes',
                text: 'Por favor, indica cuántas personas te acompañarán.',
                confirmButtonColor: '#cfb050'
            });
            return;
        }

        // Mensaje personalizado
        let mensaje = `¡Gracias ${nombre}! `;
        if (asistir.value === '1') {
            mensaje += `Te esperamos con ${cantidad.value} acompañante(s). ¡Será un placer tenerte!`;
        } else {
            mensaje += 'Lamentamos que no puedas venir, ¡te extrañaremos!';
        }

        // SweetAlert de éxito
        Swal.fire({
            icon: 'success',
            title: '¡Confirmación enviada!',
            text: mensaje,
            confirmButtonColor: '#cfb050',
            confirmButtonText: '¡Perfecto!'
        });

        // Resetear formulario
        this.reset();
        acompanantesDiv.style.display = 'none';
    });

    // ========== INICIALIZAR AOS (Animaciones) ==========
    AOS.init({
        duration: 1000,
        once: true,
        offset: 100
    });

});