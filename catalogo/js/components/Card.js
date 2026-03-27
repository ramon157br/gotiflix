import { getYouTubeId, getRandomMatchScore, getRandomDuration, getRandomAgeBadge } from '../utils.js';

// Card.js: monta cada cartão de filme/série com hover, mini vídeo e dados aleatórios.
// item = { img, youtube, progress, ... }
export function createCard(item) {
    const card = document.createElement('div'); // cria elemento de cartão
    card.className = 'movie-card'; // adiciona classe para estilos
    if (item.progress) {
        card.classList.add('has-progress'); // adiciona classe para barra de progresso
    }

    const img = document.createElement('img'); // imagem de capa do filme
    img.src = item.img; // URL da imagem
    img.alt = `Movie cover`; // texto alternativo

    const iframe = document.createElement('iframe'); // iframe para preview de vídeo
    iframe.frameBorder = "0"; // remove borda padrão
    iframe.allow = "autoplay; encrypted-media"; // permite autoplay

    const videoId = getYouTubeId(item.youtube); // extrai id do YouTube da URL

    card.appendChild(iframe); // monta iframe dentro do cartão
    card.appendChild(img); // monta imagem no cartão

    const ageBadge = getRandomAgeBadge(); // cor e texto de faixa etária

    const details = document.createElement('div'); // card de detalhes interativos
    details.className = 'card-details';
    details.innerHTML = `
        <div class="details-buttons">
            <div class="left-buttons">
                <button class="btn-icon btn-play-icon"><i class="fas fa-play" style="margin-left:2px;"></i></button>
                ${item.progress ? '<button class="btn-icon"><i class="fas fa-check"></i></button>' : '<button class="btn-icon"><i class="fas fa-plus"></i></button>'} <!-- botão condicional de continuar/adicionar -->
                <button class="btn-icon"><i class="fas fa-thumbs-up"></i></button>
            </div>
            <div class="right-buttons">
                <button class="btn-icon"><i class="fas fa-chevron-down"></i></button>
            </div>
        </div>
        <div class="details-info">
            <span class="match-score">${getRandomMatchScore()}% relevante</span> <!-- nota de correspondência aleatória -->
            <span class="age-badge ${ageBadge.class}">${ageBadge.text}</span> <!-- badge de idade aleatória -->
            <span class="duration">${getRandomDuration(item.progress)}</span> <!-- duração aleatória -->
            <span class="resolution">HD</span>
        </div>
        <div class="details-tags">
            <span>Empolgante</span>
            <span>Animação</span>
            <span>Ficção</span>
        </div>
    `;
    card.appendChild(details); // adicionar detalhes ao cartão


    if (item.progress) { // se existe progresso, desenhar barra
        const pbContainer = document.createElement('div');
        pbContainer.className = 'progress-bar-container';
        const pbValue = document.createElement('div');
        pbValue.className = 'progress-value';
        pbValue.style.width = `${item.progress}%`; // define largura pelo progresso
        pbContainer.appendChild(pbValue);
        card.appendChild(pbContainer); // adiciona barra de progresso ao cartão
    }

    let playTimeout; // tempo para iniciar reprodução do preview
    card.addEventListener('mouseenter', () => { // hover: inicia mini video
        const rect = card.getBoundingClientRect(); // posição do cartão
        const windowWidth = window.innerWidth; // largura da viewport
        
        if (rect.left < 100) {
            card.classList.add('origin-left'); // ajusta origem para animação
        } else if (rect.right > windowWidth - 100) {
            card.classList.add('origin-right');
        }

        playTimeout = setTimeout(() => {
            iframe.src = `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&controls=0&modestbranding=1&loop=1&playlist=${videoId}`; // carrega vídeo
            iframe.classList.add('playing'); // aplica estilo de play
            img.classList.add('playing-video'); // esconde imagem de capa
        }, 600); // delay antes do autoplay
    });

    card.addEventListener('mouseleave', () => { // mouse sai: parar preview
        clearTimeout(playTimeout); // cancela autoplay pendente
        iframe.classList.remove('playing');
        img.classList.remove('playing-video');
        iframe.src = ""; // limpa src do iframe para parar vídeo
        card.classList.remove('origin-left');
        card.classList.remove('origin-right');
    });

    return card; // retorna o elemento de cartão completo
}
