const themeToggle = document.getElementById('theme-toggle');
const body = document.body;

// Verifica se há preferência salva
const savedTheme = localStorage.getItem('theme');
if (savedTheme === 'light') {
    body.classList.add('light-mode');
    themeToggle.textContent = '☀️';
}

// Alterna o tema ao clicar
themeToggle.addEventListener('click', () => {
    body.classList.toggle('light-mode');
    const isLight = body.classList.contains('light-mode');
    themeToggle.textContent = isLight ? '☀️' : '🌙';
    localStorage.setItem('theme', isLight ? 'light' : 'dark');
});

// Carrega perfis salvos do localStorage
function loadSavedProfiles() {
    const savedProfiles = JSON.parse(localStorage.getItem('customProfiles') || '[]');
    const profilesList = document.querySelector('.profiles-list');
    const addProfileCard = document.querySelector('.action-card');
    
    savedProfiles.forEach(profile => {
        const newProfile = document.createElement('li');
        newProfile.className = 'profile';
        newProfile.innerHTML = `
            <figure>
                <img src="${profile.imagem}" alt="Foto do ${profile.nome}">
                <figcaption>${profile.nome}</figcaption>
            </figure>
        `;
        profilesList.insertBefore(newProfile, addProfileCard);
        
        // Adiciona event listener
        newProfile.style.cursor = 'pointer';
        newProfile.addEventListener('click', () => {
            localStorage.setItem('perfilAtivoNome', profile.nome);
            localStorage.setItem('perfilAtivoImagem', profile.imagem);
            window.location.href = `catalogo/catalogo.html?perfil=${encodeURIComponent(profile.nome)}`;
        });
        newProfile.addEventListener('keydown', e => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                newProfile.click();
            }
        });
    });
}

// Chama ao carregar a página
loadSavedProfiles();

// Navega para o catálogo ao clicar num perfil
const profileCards = document.querySelectorAll('.profile:not(.action-card)');
profileCards.forEach(card => {
    card.style.cursor = 'pointer';
    card.addEventListener('click', () => {
        const nameEl = card.querySelector('figcaption');
        const nomePerfil = nameEl ? nameEl.textContent.trim() : 'perfil';
        const imgEl = card.querySelector('img');
        const imgPerfil = imgEl ? imgEl.src : '/assets/perfil-default.jpg'; // fallback se não encontrar
        // Salva nome e imagem no localStorage para uso no catálogo
        localStorage.setItem('perfilAtivoNome', nomePerfil);
        localStorage.setItem('perfilAtivoImagem', imgPerfil);
        window.location.href = `catalogo/catalogo.html?perfil=${encodeURIComponent(nomePerfil)}`;
    });
    card.addEventListener('keydown', e => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            card.click();
        }
    });
});

// Modal para adicionar perfil
const addProfileCard = document.querySelector('.action-card');
const modal = document.getElementById('add-profile-modal');
const form = document.getElementById('add-profile-form');
const cancelBtn = document.getElementById('cancel-add');

if (addProfileCard) {
    addProfileCard.addEventListener('click', () => {
        modal.classList.add('show');
    });
    addProfileCard.addEventListener('keydown', e => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            modal.classList.add('show');
        }
    });
}

if (cancelBtn) {
    cancelBtn.addEventListener('click', () => {
        modal.classList.remove('show');
        form.reset();
    });
}

if (modal) {
    modal.addEventListener('click', e => {
        if (e.target === modal) {
            modal.classList.remove('show');
            form.reset();
        }
    });
}

// Modal para gerenciar perfis
const manageBtn = document.querySelector('.manage-profiles');
const manageModal = document.getElementById('manage-profiles-modal');
const closeManageBtn = document.getElementById('close-manage');
const profilesManageList = document.getElementById('profiles-list-manage');

if (manageBtn) {
    manageBtn.addEventListener('click', () => {
        populateManageModal();
        manageModal.classList.add('show');
    });
}

if (closeManageBtn) {
    closeManageBtn.addEventListener('click', () => {
        manageModal.classList.remove('show');
    });
}

if (manageModal) {
    manageModal.addEventListener('click', e => {
        if (e.target === manageModal) {
            manageModal.classList.remove('show');
        }
    });
}

function populateManageModal() {
    profilesManageList.innerHTML = '';
    
    // Adiciona perfis fixos
    const fixedProfiles = [
        { nome: 'Júlia', imagem: '/assets/perfil-1.jpg' },
        { nome: 'Rafa', imagem: '/assets/perfil-2.jpg' },
        { nome: 'Lucas', imagem: '/assets/perfil-3.jpg' },
        { nome: 'Marina', imagem: '/assets/perfil-4.jpg' }
    ];
    
    fixedProfiles.forEach(profile => {
        const item = createManageItem(profile, false);
        profilesManageList.appendChild(item);
    });
    
    // Adiciona perfis customizados
    const customProfiles = JSON.parse(localStorage.getItem('customProfiles') || '[]');
    customProfiles.forEach((profile, index) => {
        const item = createManageItem(profile, true, index);
        profilesManageList.appendChild(item);
    });
}

function createManageItem(profile, isCustom, index) {
    const item = document.createElement('div');
    item.className = 'profile-manage-item';
    item.innerHTML = `
        <div class="profile-manage-info">
            <img src="${profile.imagem}" alt="Foto do ${profile.nome}">
            <span>${profile.nome}</span>
        </div>
        <button class="delete-profile-btn" data-custom="${isCustom}" data-index="${index}">Excluir</button>
    `;
    
    const deleteBtn = item.querySelector('.delete-profile-btn');
    deleteBtn.addEventListener('click', () => {
        if (isCustom) {
            // Remove do localStorage
            const customProfiles = JSON.parse(localStorage.getItem('customProfiles') || '[]');
            customProfiles.splice(index, 1);
            localStorage.setItem('customProfiles', JSON.stringify(customProfiles));
            
            // Remove da lista principal
            const profilesList = document.querySelector('.profiles-list');
            const profileCards = profilesList.querySelectorAll('.profile:not(.action-card)');
            const customStartIndex = 4; // Após os 4 fixos
            const profileToRemove = profileCards[customStartIndex + index];
            if (profileToRemove) {
                profilesList.removeChild(profileToRemove);
            }
        } else {
            // Para perfis fixos, talvez não permitir ou mostrar aviso
            alert('Perfis padrão não podem ser excluídos.');
            return;
        }
        
        // Atualiza o modal
        populateManageModal();
    });
    
    return item;
}

if (form) {
    form.addEventListener('submit', e => {
        e.preventDefault();
        const nome = document.getElementById('profile-name').value.trim();
        const imagem = document.getElementById('profile-image').value;
        
        if (nome) {
            // Salva no localStorage
            const savedProfiles = JSON.parse(localStorage.getItem('customProfiles') || '[]');
            savedProfiles.push({ nome, imagem });
            localStorage.setItem('customProfiles', JSON.stringify(savedProfiles));
            
            // Cria novo perfil na lista
            const profilesList = document.querySelector('.profiles-list');
            const addProfileCard = document.querySelector('.action-card');
            const newProfile = document.createElement('li');
            newProfile.className = 'profile';
            newProfile.innerHTML = `
                <figure>
                    <img src="${imagem}" alt="Foto do ${nome}">
                    <figcaption>${nome}</figcaption>
                </figure>
            `;
            // Insere antes do "Adicionar perfil"
            profilesList.insertBefore(newProfile, addProfileCard);
            
            // Adiciona event listener ao novo perfil
            newProfile.style.cursor = 'pointer';
            newProfile.addEventListener('click', () => {
                localStorage.setItem('perfilAtivoNome', nome);
                localStorage.setItem('perfilAtivoImagem', imagem);
                window.location.href = `catalogo/catalogo.html?perfil=${encodeURIComponent(nome)}`;
            });
            newProfile.addEventListener('keydown', e => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    newProfile.click();
                }
            });
            
            // Fecha modal e reseta form
            modal.classList.remove('show');
            form.reset();
        }
    });
}