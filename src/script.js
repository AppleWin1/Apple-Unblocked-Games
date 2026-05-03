/**
 * Neon Arcade: Unblocked Games
 * Vanilla JS Implementation
 */

let allGames = [];
let currentCategory = 'All';
let currentSearch = '';

// DOM Elements
const galleryView = document.getElementById('gallery-view');
const playerView = document.getElementById('player-view');
const gamesGrid = document.getElementById('games-grid');
const categoriesContainer = document.getElementById('categories-container');
const heroSection = document.getElementById('hero-section');
const gridTitle = document.getElementById('grid-title');
const gamesCount = document.getElementById('games-count');
const noResults = document.getElementById('no-results');

const searchInput = document.getElementById('search-input');
const mobileSearchInput = document.getElementById('mobile-search-input');

const backBtn = document.getElementById('back-to-gallery-btn');
const playerBackBtn = document.getElementById('player-back-btn');
const appLogo = document.getElementById('app-logo');

const gameIframe = document.getElementById('game-iframe');
const playerGameTitle = document.getElementById('player-game-title');
const playerGameCategory = document.getElementById('player-game-category');
const playerGameDescription = document.getElementById('player-game-description');
const recommendationsContainer = document.getElementById('recommendations-container');
const fullscreenBtn = document.getElementById('fullscreen-btn');

async function init() {
    try {
        const response = await fetch('/src/data/games.json');
        allGames = await response.json();
        
        renderGallery();
        setupEventListeners();
        
        // Initialize Lucide icons
        lucide.createIcons();
    } catch (error) {
        console.error('Failed to load games:', error);
    }
}

function renderGallery() {
    const filtered = allGames.filter(game => {
        const matchesSearch = game.title.toLowerCase().includes(currentSearch.toLowerCase()) ||
                            game.description.toLowerCase().includes(currentSearch.toLowerCase());
        return matchesSearch;
    });

    // Update Grid Title and Count
    gridTitle.textContent = 'Latest Discoveries';
    gamesCount.textContent = `${filtered.length} Games`;

    // Hero Section visibility
    if (currentSearch === '' && currentCategory === 'All' && allGames.length > 0) {
        heroSection.classList.remove('hidden-view');
        const hero = allGames[0];
        document.getElementById('hero-image').src = hero.thumbnail;
        document.getElementById('hero-title').textContent = hero.title;
        document.getElementById('hero-description').textContent = hero.description;
        heroSection.onclick = () => playGame(hero);
    } else {
        heroSection.classList.add('hidden-view');
    }

    // Grid Rendering
    gamesGrid.innerHTML = '';
    if (filtered.length === 0) {
        noResults.classList.remove('hidden-view');
    } else {
        noResults.classList.add('hidden-view');
        filtered.forEach((game, index) => {
            const card = document.createElement('div');
            card.className = "group flex flex-col bg-[#1a0505] rounded-2xl border border-gray-800 overflow-hidden hover:border-red-400/50 hover:bg-[#1a0505]/80 transition-all cursor-pointer animate-in fade-in zoom-in-95 duration-300";
            card.style.animationDelay = `${index * 50}ms`;
            
            card.innerHTML = `
                <div class="relative aspect-video overflow-hidden">
                    <img src="${game.thumbnail}" alt="${game.title}" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500">
                    <div class="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-colors"></div>
                    <div class="absolute top-2 right-2 px-2 py-1 bg-[#0f0101]/80 backdrop-blur-sm rounded text-[10px] font-mono border border-gray-700">
                        ${game.category}
                    </div>
                    <div class="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <div class="w-12 h-12 rounded-full bg-red-400 flex items-center justify-center text-black shadow-[0_0_15px_rgba(248,113,113,0.4)] scale-75 group-hover:scale-100 transition-transform">
                            <i data-lucide="maximize-2" class="w-6 h-6"></i>
                        </div>
                    </div>
                </div>
                <div class="p-4 space-y-2">
                    <h4 class="text-lg group-hover:text-red-400 transition-colors font-bold">${game.title}</h4>
                    <p class="text-xs text-gray-400 line-clamp-2 leading-relaxed">${game.description}</p>
                </div>
            `;
            
            card.onclick = () => playGame(game);
            gamesGrid.appendChild(card);
        });
    }
    
    lucide.createIcons();
}

function playGame(game) {
    galleryView.classList.add('hidden-view');
    playerView.classList.remove('hidden-view');
    backBtn.classList.remove('hidden-view');
    
    gameIframe.src = game.url;
    playerGameTitle.textContent = game.title;
    playerGameCategory.textContent = game.category;
    if (playerGameDescription) playerGameDescription.textContent = game.description;
    
    // Recommendations
    if (recommendationsContainer) {
        const recs = allGames.filter(g => g.id !== game.id).slice(0, 3);
        recommendationsContainer.innerHTML = '';
        recs.forEach(rec => {
            const div = document.createElement('div');
            div.className = "flex gap-3 group cursor-pointer";
            div.innerHTML = `
                <img src="${rec.thumbnail}" class="w-20 h-14 object-cover rounded-lg border border-gray-800 group-hover:border-fuchsia-500 transition-all">
                <div class="min-w-0">
                    <p class="text-sm font-medium truncate group-hover:text-fuchsia-500 transition-colors">${rec.title}</p>
                    <p class="text-[10px] text-gray-500 uppercase">${rec.category}</p>
                </div>
            `;
            div.onclick = () => playGame(rec);
            recommendationsContainer.appendChild(div);
        });
    }
    
    window.scrollTo({ top: 0, behavior: 'smooth' });
    lucide.createIcons();
}

function showGallery() {
    galleryView.classList.remove('hidden-view');
    playerView.classList.add('hidden-view');
    backBtn.classList.add('hidden-view');
    gameIframe.src = ''; // Stop game when leaving
}

function setupEventListeners() {
    searchInput.oninput = (e) => {
        currentSearch = e.target.value;
        renderGallery();
    };
    
    mobileSearchInput.oninput = (e) => {
        currentSearch = e.target.value;
        renderGallery();
    };
    
    backBtn.onclick = showGallery;
    playerBackBtn.onclick = showGallery;
    appLogo.onclick = showGallery;
    
    document.getElementById('reset-filters').onclick = () => {
        currentSearch = '';
        currentCategory = 'All';
        searchInput.value = '';
        mobileSearchInput.value = '';
        renderGallery();
    };
    
    fullscreenBtn.onclick = () => {
        if (gameIframe.requestFullscreen) {
            gameIframe.requestFullscreen();
        } else if (gameIframe.webkitRequestFullscreen) {
            gameIframe.webkitRequestFullscreen();
        } else if (gameIframe.msRequestFullscreen) {
            gameIframe.msRequestFullscreen();
        }
    };
}

// Start the app
init();
