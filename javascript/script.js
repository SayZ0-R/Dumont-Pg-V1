(function () {
    var btn = document.getElementById('saibaMais');
    var target = document.getElementById('sobre');
    if (btn && target) {
        btn.addEventListener('click', function (e) {
            e.preventDefault();
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
    }
})();

function initMobileCarousel() {
    const wrapper = document.querySelector('.cards-wrapper');
    const track = document.querySelector('.cards-container');
    const cards = document.querySelectorAll('.card');
    const dots = document.querySelectorAll('.dot');

    if (!wrapper || !track || cards.length === 0) {
        console.warn('Elementos do carrossel não encontrados');
        return;
    }

    track.removeEventListener('mousedown', null);
    track.removeEventListener('touchstart', null);
    document.removeEventListener('mousemove', null);
    document.removeEventListener('touchmove', null);
    document.removeEventListener('mouseup', null);
    document.removeEventListener('touchend', null);

    const isMobileMode = window.innerWidth <= 758;

    if (!isMobileMode) {
        track.style.flexWrap = 'wrap';
        track.style.justifyContent = 'center';
        track.style.transform = 'none';
        track.style.width = '100%';
        track.style.overflowX = 'visible';
        track.style.cursor = 'default';
        wrapper.style.overflow = 'visible';

        dots.forEach(dot => {
            dot.style.display = 'none';
            dot.classList.remove('active');
        });

        track.style.overflowX = 'visible';
        track.scrollLeft = 0;

        return;
    }

    track.style.flexWrap = 'nowrap';
    track.style.justifyContent = 'flex-start';
    track.style.overflowX = 'auto';
    track.style.scrollSnapType = 'x mandatory';
    track.style.cursor = 'grab';
    wrapper.style.overflow = 'hidden';

    cards.forEach(card => {
        card.style.flexShrink = '0';
        card.style.scrollSnapAlign = 'center';
    });

    dots.forEach(dot => {
        dot.style.display = 'inline-block';
    });

    let isDragging = false;
    let startX;
    let scrollLeft;
    let currentIndex = 0;
    const cardStyle = window.getComputedStyle(cards[0]);
    const cardWidth = cards[0].offsetWidth +
        parseInt(cardStyle.marginLeft) +
        parseInt(cardStyle.marginRight);

    function updateDots() {
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === currentIndex);
        });
    }

    function goToCard(index) {
        currentIndex = Math.max(0, Math.min(index, cards.length - 1));
        track.scrollTo({
            left: currentIndex * cardWidth,
            behavior: 'smooth'
        });
        updateDots();
    }

    function updateCurrentIndex() {
        currentIndex = Math.round(track.scrollLeft / cardWidth);
        currentIndex = Math.max(0, Math.min(currentIndex, cards.length - 1));
        updateDots();
    }

    track.addEventListener('mousedown', startDrag);
    track.addEventListener('touchstart', startDragTouch, { passive: false });

    function startDrag(e) {
        isDragging = true;
        startX = e.pageX - track.offsetLeft;
        scrollLeft = track.scrollLeft;
        track.style.cursor = 'grabbing';
        track.style.scrollSnapType = 'none';
        e.preventDefault();
    }

    function startDragTouch(e) {
        isDragging = true;
        startX = e.touches[0].pageX - track.getBoundingClientRect().left;
        scrollLeft = track.scrollLeft;
        track.style.scrollSnapType = 'none';
        e.preventDefault();
    }

    function drag(e) {
        if (!isDragging) return;
        e.preventDefault();

        const x = e.pageX || (e.touches && e.touches[0].pageX);
        if (!x) return;

        const trackLeft = track.getBoundingClientRect().left + window.scrollX;
        const walk = (x - trackLeft - startX) * 1.5;
        track.scrollLeft = scrollLeft - walk;
    }

    document.addEventListener('mousemove', drag);
    document.addEventListener('touchmove', drag, { passive: false });

    function endDrag() {
        if (!isDragging) return;
        isDragging = false;
        track.style.cursor = 'grab';
        track.style.scrollSnapType = 'x mandatory';

        setTimeout(updateCurrentIndex, 100);
    }

    document.addEventListener('mouseup', endDrag);
    document.addEventListener('touchend', endDrag);

    track.addEventListener('scroll', () => {
        if (!isDragging) {
            updateCurrentIndex();
        }
    });

    dots.forEach((dot) => {
        dot.addEventListener('click', function () {
            const index = parseInt(this.getAttribute('data-index'));
            if (!isNaN(index)) {
                goToCard(index);
            }
        });
    });

    document.addEventListener('keydown', (e) => {
        if (!isMobileMode) return;

        if (e.key === 'ArrowLeft') {
            goToCard(currentIndex - 1);
        } else if (e.key === 'ArrowRight') {
            goToCard(currentIndex + 1);
        }
    });

    updateDots();
    currentIndex = 0;
    track.scrollTo({
        left: currentIndex * cardWidth,
        behavior: 'auto'
    });

    setTimeout(() => {
        track.style.transition = 'none';
    }, 1000);
}

let resizeTimeout;
function handleResize() {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
        initMobileCarousel();
    }, 250);
}

window.addEventListener('load', () => {
    setTimeout(initMobileCarousel, 100);
});

document.addEventListener('DOMContentLoaded', () => {
    initMobileCarousel();
});

window.addEventListener('resize', handleResize);

if (document.readyState === 'complete' || document.readyState === 'interactive') {
    setTimeout(initMobileCarousel, 100);
}

function initContadores() {
    const contadores = document.querySelectorAll('.Titulo-numeros, .titulo-numeros2');
    const elementosNumeros = document.querySelectorAll('[data-target]');

    if (elementosNumeros.length === 0) return;

    const config = {
        duration: 2000,
        delay: 300,
        ease: 'easeOut'
    };

    function formatarNumero(num) {
        return num.toLocaleString('pt-BR');
    }

   function animarContador(elemento) {
    const target = parseInt(elemento.getAttribute('data-target'));
    const duracao = config.duration;
    const inicio = 0;
    const incremento = target / (duracao / 16);

    let current = inicio;
    const startTime = Date.now();

    function update() {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duracao, 1);

        const easeProgress = 1 - Math.pow(1 - progress, 3);

        current = Math.floor(target * easeProgress);

        // ADICIONE "De " ANTES DO NÚMERO
        elemento.textContent = '+' + formatarNumero(current);

        if (progress < 1) {
            requestAnimationFrame(update);
        } else {
            // TAMBÉM AQUI NO FINAL
            elemento.textContent = '+' + formatarNumero(target);
        }
    }

    setTimeout(() => {
        requestAnimationFrame(update);
    }, config.delay);
}

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const elemento = entry.target;

                if (!elemento.classList.contains('animado')) {
                    elemento.classList.add('animado');
                    animarContador(elemento);
                }

                observer.unobserve(elemento);
            }
        });
    }, {
        threshold: 0.3,
        rootMargin: '0px 0px -50px 0px'
    });

    elementosNumeros.forEach(elemento => {
        observer.observe(elemento);
    });

    elementosNumeros.forEach(elemento => {
        const rect = elemento.getBoundingClientRect();
        const isVisible = (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );

        if (isVisible && !elemento.classList.contains('animado')) {
            elemento.classList.add('animado');
            animarContador(elemento);
        }
    });
}

document.addEventListener('DOMContentLoaded', initContadores);

let timeoutContador;
window.addEventListener('scroll', () => {
    clearTimeout(timeoutContador);
    timeoutContador = setTimeout(initContadores, 100);
});

document.addEventListener('DOMContentLoaded', function() {
    const botao = document.getElementById('meuBotao');
    
    if (botao) {
        botao.addEventListener('click', function() {
            // ALTERE APENAS ESTE LINK
            window.open('https://w.app/mgsbvd');
        });
    }
});