/* SLIDE */
const imageTracks = document.querySelectorAll(".image-track");

imageTracks.forEach(track => {
    // Inicializa os atributos de dados para controlar interações do usuário
    track.dataset.mouseDownAt = "0";
    track.dataset.prevPercentage = "0";

    // Função para registrar a posição do mouse quando pressionado
    const handleOnDown = (e) => {
        track.dataset.mouseDownAt = e.clientX || e.touches[0].clientX;
    };

    // Função para resetar os dados quando o mouse é liberado
    const handleOnUp = () => {
        track.dataset.mouseDownAt = "0";
        track.dataset.prevPercentage = track.dataset.percentage;
    };

    // Função para mover as imagens com base na posição do mouse
    const handleOnMove = (e) => {
        if (track.dataset.mouseDownAt === "0") return; // Se o mouse não está pressionado, não faz nada

        const clientX = e.clientX || e.touches[0].clientX;
        const mouseDelta = parseFloat(track.dataset.mouseDownAt) - clientX;
        const maxDelta = window.innerWidth / 2;

        // Calcula a nova porcentagem de movimento
        const percentage = (mouseDelta / maxDelta) * -100;
        const nextPercentageUnconstrained = parseFloat(track.dataset.prevPercentage) + percentage;
        const nextPercentage = Math.max(Math.min(nextPercentageUnconstrained, 0), -100); // Limita a porcentagem entre 0 e -100

        track.dataset.percentage = nextPercentage;

        // Aplica a transformação de movimento ao track
        track.animate({
            transform: `translate(${nextPercentage}%, -50%)`
        }, { duration: 1200, fill: "forwards" });

        // Move cada imagem na track de acordo com a nova porcentagem
        for (const image of track.getElementsByClassName("image")) {
            image.animate({
                objectPosition: `${100 + nextPercentage}% center`
            }, { duration: 1200, fill: "forwards" });
        }
    };

    // Função para rolagem suave do mouse
    const handleScroll = (e) => {
        e.preventDefault(); // Previne o comportamento padrão de rolagem
        const scrollDelta = e.deltaY;

        // Ajusta a porcentagem com base na rolagem
        const percentage = (scrollDelta / window.innerHeight) * 2;
        const nextPercentageUnconstrained = parseFloat(track.dataset.prevPercentage) + percentage;
        const nextPercentage = Math.max(Math.min(nextPercentageUnconstrained, 0), -100);

        track.dataset.percentage = nextPercentage;
        track.dataset.prevPercentage = nextPercentage; // Atualiza a porcentagem anterior

        // Aplica a transformação ao track
        track.animate({
            transform: `translate(${nextPercentage}%, -50%)`
        }, { duration: 600, fill: "forwards" });

        // Move as imagens de acordo com a nova porcentagem
        for (const image of track.getElementsByClassName("image")) {
            image.animate({
                objectPosition: `${100 + nextPercentage}% center`
            }, { duration: 600, fill: "forwards" });
        }
    };

    // Eventos de mouse e toque para controle de movimento
    track.onmousedown = (e) => handleOnDown(e);
    track.onmouseup = handleOnUp;
    track.onmousemove = (e) => handleOnMove(e);
    track.ontouchstart = (e) => handleOnDown(e);
    track.ontouchend = handleOnUp;
    track.ontouchmove = (e) => handleOnMove(e);
});

/* DROPDOWN MENU */
document.addEventListener('DOMContentLoaded', () => {
    const dropdown = document.querySelector('.dropdown');
    const links = document.querySelectorAll('.dropdown a');
    const button = document.querySelector('.list');

    // Função para mostrar o dropdown com animação
    function showDropdown() {
        dropdown.style.display = 'block'; // Torna o dropdown visível
        setTimeout(() => {
            dropdown.classList.add('show');
            dropdown.classList.remove('hide');
        }, 10);
    }

    // Função para esconder o dropdown com animação
    function hideDropdown() {
        dropdown.classList.add('hide');
        dropdown.classList.remove('show');
        setTimeout(() => {
            dropdown.style.display = 'none'; // Oculta o dropdown após a animação
        }, 300);
    }

    // Alternar a exibição do dropdown ao clicar no botão
    button.addEventListener('click', () => {
        dropdown.style.display === 'block' ? hideDropdown() : showDropdown();
    });

    // Fecha o dropdown ao clicar em um link e aplica a classe active
    links.forEach(link => {
        link.addEventListener('click', (event) => {
            hideDropdown();
            setActiveLink(event.target.getAttribute('href')); // Marca o link ativo
        });
    });

    // Fecha o dropdown ao clicar fora dele
    document.addEventListener('click', (event) => {
        if (!button.contains(event.target) && !dropdown.contains(event.target)) {
            hideDropdown();
        }
    });

    // Função para aplicar a classe active ao link correspondente
    function setActiveLink(targetId) {
        links.forEach(link => {
            link.classList.toggle('active', link.getAttribute('href') === targetId);
        });
    }

    // Atualiza a classe active ao rolar a página
    window.addEventListener('scroll', () => {
        const scrollPos = window.scrollY || window.pageYOffset;
        links.forEach(link => {
            const section = document.querySelector(link.getAttribute('href'));
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;

            if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                setActiveLink(link.getAttribute('href'));
            }
        });
    });
});

/* SCROLL */
document.addEventListener('scroll', () => {
    const cards = document.querySelectorAll('.card');

    cards.forEach((item, index) => {
        const itemRect = item.getBoundingClientRect();
        const triggerPoint = window.innerHeight * 0.85; // Define o ponto de ativação para visibilidade

        if (itemRect.top < triggerPoint && itemRect.bottom > 0) {
            // Adiciona um atraso baseado no índice da carta
            setTimeout(() => {
                item.classList.add('visible'); // Adiciona a classe de visibilidade
            }, index * 100); // Ajusta o valor de atraso (100ms)
        } else {
            item.classList.remove('visible'); // Remove a classe se não estiver visível
        }
    });
});

/* CAROUSEL */
let currentIndex = 0;
const items = document.querySelectorAll('.carousel-item');
const totalItems = items.length;
const container = document.querySelector('.carousel-container');
let intervalId = null; // Armazena o ID do intervalo
let isActive = true; // Controla se o carrossel está ativo

// Função para mostrar o próximo item no carrossel
function showNext() {
    currentIndex = (currentIndex + 1) % totalItems; // Atualiza o índice do item atual
    const offset = -currentIndex * (100 / totalItems); // Calcula o deslocamento proporcional
    container.style.transform = `translateX(${offset}%)`; // Aplica a transformação
}

// Inicia o carrossel
function startCarousel() {
    if (!isActive) {
        isActive = true;
        intervalId = setInterval(showNext, 2500); // Define o intervalo de mudança
    }
}

// Para o carrossel
function stopCarousel() {
    if (isActive) {
        isActive = false;
        clearInterval(intervalId); // Limpa o intervalo
    }
}

// Inicia o carrossel
startCarousel();

// Adiciona eventos de mouse para pausar e reiniciar o carrossel
const carousel = document.querySelector('.carousel');
carousel.addEventListener('mouseenter', stopCarousel);
carousel.addEventListener('mouseleave', startCarousel);

/* EFEITO MOUSE HOVER */
document.addEventListener('DOMContentLoaded', function () {
    const imageTracks = document.querySelectorAll('.image-track');
    const cardContents = document.querySelectorAll('.cardContent');

    imageTracks.forEach((imageTrack, index) => {
        const cardContent = cardContents[index];

        if (cardContent) {
            // Efeitos ao passar o mouse
            imageTrack.addEventListener('mouseover', function () {
                cardContent.style.backdropFilter = 'blur(20px)'; // Aplica desfoque
                cardContent.style.backgroundColor = 'rgba(72, 72, 72, 0.5)'; // Altera a cor de fundo
            });

            imageTrack.addEventListener('mouseout', function () {
                cardContent.style.backdropFilter = 'none'; // Remove o desfoque
                cardContent.style.backgroundColor = 'transparent'; // Restaura a cor de fundo
            });

            // Efeito ao clicar
            imageTrack.addEventListener('mousedown', function () {
                cardContent.style.backdropFilter = 'blur(20px)';
                cardContent.style.backgroundColor = 'rgba(72, 72, 72, 0.5)';
            });

            imageTrack.addEventListener('mouseup', function () {
                // O efeito de clique pode ser mantido removendo as linhas abaixo
                // cardContent.style.backdropFilter = 'none';
                // cardContent.style.backgroundColor = 'transparent';
            });

            // Efeito ao tocar (para dispositivos móveis)
            imageTrack.addEventListener('touchstart', function () {
                cardContent.style.backdropFilter = 'blur(20px)';
                cardContent.style.backgroundColor = 'rgba(72, 72, 72, 0.5)';
            });

            imageTrack.addEventListener('touchend', function () {
                // O efeito de toque pode ser mantido removendo as linhas abaixo
                // cardContent.style.backdropFilter = 'none';
                // cardContent.style.backgroundColor = 'transparent';
            });
        }
    });
});
