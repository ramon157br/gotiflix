// utils.js: funções utilitárias usadas pelo componente de cartões (Card.js)
// para transformar URLs, gerar valores randômicos de acordo com UX Netflix-like.

export function getYouTubeId(url) { // extrai ID do YouTube de URLs exemplo movie.youtube
    // Extraí o ID do vídeo do YouTube a partir de uma URL longa (v=) ou curta.
    if (!url) return "7RUA0IOfar8"; // fallback para vídeo padrão se URL indisponível
    if (url.includes('v=')) {
        return url.split('v=')[1].split('&')[0]; // evita parâmetros extra
    }
    return url.split('/').pop(); // pega última parte da URL para short URL
}

export function getRandomMatchScore() { // cálculo randômico 80-99
    // Gera valor de 80 a 99 para simular porcentagem de correspondência
    return Math.floor(Math.random() * 20 + 80); // 0-19 + 80
}

export function getRandomDuration(hasProgress) {
    return hasProgress ? '10 temporadas' : '2h ' + Math.floor(Math.random() * 59) + 'm';
}

export function getRandomAgeBadge() {
    return Math.random() > 0.5 ? { text: 'A16', class: 'red-accent' } : { text: '16', class: '' };
}
