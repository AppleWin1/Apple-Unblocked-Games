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
const settingsView = document.getElementById('settings-view');
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
const settingsBtn = document.getElementById('settings-btn');
const appLogo = document.getElementById('app-logo');

const gameIframe = document.getElementById('game-iframe');
const playerGameTitle = document.getElementById('player-game-title');
const playerGameCategory = document.getElementById('player-game-category');
const playerGameDescription = document.getElementById('player-game-description');
const recommendationsContainer = document.getElementById('recommendations-container');
const fullscreenBtn = document.getElementById('fullscreen-btn');

async function init() {
    try {
        const response = await fetch('./data/games.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        allGames = await response.json();
        
        setupTabs();
        setupSettingsTabs();
        renderGallery();
        setupEventListeners();
        
        // Initialize Lucide icons
        lucide.createIcons();
    } catch (error) {
        console.error('Failed to load games:', error);
    }
}

function setupTabs() {
    const tabAll = document.getElementById('tab-all');
    const tabEpstein = document.getElementById('tab-epstein');
    const tabObby = document.getElementById('tab-obby');
    const tabEscapeRoad = document.getElementById('tab-escape-road');
    const tabSports = document.getElementById('tab-sports');
    const tabBros = document.getElementById('tab-bros');
    const tabWater = document.getElementById('tab-water');
    const tabDrive = document.getElementById('tab-drive');
    const tabShooter = document.getElementById('tab-shooter');
    const tabs = [tabAll, tabEpstein, tabObby, tabEscapeRoad, tabSports, tabBros, tabWater, tabDrive, tabShooter];

    tabs.forEach(tab => {
        tab.onclick = () => {
            // Update active state
            tabs.forEach(t => {
                t.classList.remove('border-red-400', 'text-white');
                t.classList.add('border-transparent', 'text-gray-500');
            });
            tab.classList.remove('border-transparent', 'text-gray-500');
            tab.classList.add('border-red-400', 'text-white');

            // Set filter
            if (tab.id === 'tab-all') currentCategory = 'All';
            else if (tab.id === 'tab-epstein') currentCategory = 'Epstein';
            else if (tab.id === 'tab-obby') currentCategory = 'Obby';
            else if (tab.id === 'tab-escape-road') currentCategory = 'Escape Road';
            else if (tab.id === 'tab-sports') currentCategory = 'Sports';
            else if (tab.id === 'tab-bros') currentCategory = 'Bros';
            else if (tab.id === 'tab-water') currentCategory = 'Water';
            else if (tab.id === 'tab-drive') currentCategory = 'Drive';
            else if (tab.id === 'tab-shooter') currentCategory = 'Shooter';
            renderGallery();
        };
    });
}

function renderGallery() {
    const filtered = allGames.filter(game => {
        const matchesSearch = game.title.toLowerCase().includes(currentSearch.toLowerCase()) ||
                            game.description.toLowerCase().includes(currentSearch.toLowerCase());
        
        if (currentCategory === 'Epstein') {
            const matchesEpstein = game.id.includes('epstein') || 
                                   game.id.includes('fnae') || 
                                   game.title.toLowerCase().includes('epstein');
            return matchesSearch && matchesEpstein;
        }

        if (currentCategory === 'Obby') {
            const matchesObby = game.id === 'slope' || 
                                game.id === 'geometry-dash' || 
                                game.id === 'stickman-hook' || 
                                game.title.toLowerCase().includes('slope') || 
                                game.title.toLowerCase().includes('geometry dash') ||
                                game.title.toLowerCase().includes('stickman hook');
            return matchesSearch && matchesObby;
        }

        if (currentCategory === 'Escape Road') {
            const matchesEscapeRoad = game.id.includes('escape-road') || 
                                      game.title.toLowerCase().includes('escape road');
            return matchesSearch && matchesEscapeRoad;
        }

        if (currentCategory === 'Sports') {
            return matchesSearch && game.category === 'Sports';
        }

        if (currentCategory === 'Bros') {
            const matchesBros = game.category === 'Bros' ||
                               game.id.includes('bros') || 
                               game.title.toLowerCase().includes('bros');
            return matchesSearch && matchesBros;
        }

        if (currentCategory === 'Water') {
            const matchesWater = game.category === 'Water' ||
                                game.id.includes('water') || 
                                game.title.toLowerCase().includes('water');
            return matchesSearch && matchesWater;
        }

        if (currentCategory === 'Drive') {
            const matchesDrive = game.category === 'Drive' ||
                                game.id.includes('drive-mad') || 
                                (game.title.toLowerCase().includes('drive') && !game.title.toLowerCase().includes('escape road'));
            return matchesSearch && matchesDrive;
        }

        if (currentCategory === 'Shooter') {
            const matchesShooter = game.category === 'Shooter' ||
                                  game.id.includes('shooter') || 
                                  game.title.toLowerCase().includes('shooter') ||
                                  game.title.toLowerCase().includes('gun') ||
                                  game.title.toLowerCase().includes('strike');
            return matchesSearch && matchesShooter;
        }

        return matchesSearch;
    });

    // Update Grid Title and Count
    gridTitle.textContent = currentCategory === 'All' ? 'Latest Discoveries' : `${currentCategory} Collection`;
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
    // Set requested sandbox attributes for compatibility and security
    gameIframe.setAttribute('sandbox', 'allow-forms allow-modals allow-same-origin allow-scripts allow-pointer-lock allow-orientation-lock allow-presentation allow-downloads');
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
    settingsView.classList.add('hidden-view');
    backBtn.classList.add('hidden-view');
    gameIframe.src = ''; // Stop game when leaving
}

function showSettings() {
    galleryView.classList.add('hidden-view');
    playerView.classList.add('hidden-view');
    settingsView.classList.remove('hidden-view');
    backBtn.classList.remove('hidden-view');
    gameIframe.src = '';
}

function setupSettingsTabs() {
    const tabLooks = document.getElementById('settings-tab-looks');
    const tabCopyright = document.getElementById('settings-tab-copyright');
    const tabCloak = document.getElementById('settings-tab-cloak');
    const settingsTabs = [tabLooks, tabCopyright, tabCloak];
    const settingsContent = document.getElementById('settings-content');

    const copyrightBinary = `01010011 01101100 01101111 01110000 01100101 00101101 00100000 01110011 01101100 01101111 01110000 01100101 01110010 01110101 01101110 00110010 00101110 01101001 01101111 <br><br> 01000111 01100101 01101111 01101101 01100101 01110100 01110010 01111001 00100000 01000100 01100001 01110011 01101000 00101101 00100000 01100111 01100101 01101111 01101101 01100101 01110100 01110010 01111001 01101100 01101001 01110100 01100101 01110000 01100011 00101110 01101001 01101111 <br><br> 01010011 01110100 01101001 01100011 01101011 01101101 01100001 01101110 00100000 01001000 01101111 01101111 01101011 00101101 00100000 01100111 01100101 01101111 01101101 01100101 01110100 01110010 01111001 01101100 01101001 01110100 01100101 01110000 01100011 00101110 01101001 01101111 <br><br> 01000101 01110011 01100011 01100001 01110000 01100101 00100000 01010010 01101111 01100001 01100100 00101101 00100000 01100111 01100101 01101111 01101101 01100101 01110100 01110010 01111001 01101100 01101001 01110100 01100101 01110000 01100011 00101110 01101001 01101111 <br><br> 01000101 01110011 01100011 01100001 01110000 01100101 00100000 01010010 01101111 01100001 01100100 00100000 00110010 00101101 00100000 01100111 01100101 01101111 01101101 01100101 01110100 01110010 01111001 01101100 01101001 01110100 01100101 01110000 01100011 00101110 01101001 01101111 <br><br> 01000101 01110011 01100011 01100001 01110000 01100101 00100000 01010010 01101111 01100001 01100100 00100000 00110011 00101101 00100000 01100111 01100101 01101111 01101101 01100101 01110100 01110010 01111001 01101100 01101001 01110100 01100101 01110000 01100011 00101110 01101001 01101111 <br><br> 01000101 01110011 01100011 01100001 01110000 01100101 00100000 01010010 01101111 01100001 01100100 00100000 01000011 01101001 01110100 01111001 00100000 00110010 00101101 00100000 01100111 01100101 01101111 01101101 01100101 01110100 01110010 01111001 01101100 01101001 01110100 01100101 01110000 01100011 00101110 01101001 01101111 <br><br> 01010010 01100101 01110100 01110010 01101111 00100000 01000010 01101111 01110111 01101100 00101101 00100000 01100111 01100101 01101111 01101101 01100101 01110100 01110010 01111001 01101100 01101001 01110100 01100101 01110000 01100011 00101110 01101001 01101111 <br><br> 01000010 01100001 01110011 01100101 01100010 01100001 01101100 01101100 00100000 01000010 01110010 01101111 01110011 00101101 00100000 01100111 01100101 01101111 01101101 01100101 01110100 01110010 01111001 01101100 01101001 01110100 01100101 01110000 01100011 00101110 01101001 01101111 <br><br> 01000110 01101111 01101111 01110100 01100010 01100001 01101100 01101100 00100000 01000010 01110010 01101111 01110011 00101101 00100000 01100111 01100101 01101111 01101101 01100101 01110100 01110010 01111001 01101100 01101001 01110100 01100101 01110000 01100011 00101110 01101001 01101111 <br><br> 01010011 01101111 01100011 01100011 01100101 01110010 00100000 01000010 01110010 01101111 01110011 00101101 00100000 01100111 01100101 01101111 01101101 01100101 01110100 01110010 01111001 01101100 01101001 01110100 01100101 01110000 01100011 00101110 01101001 01101111 <br><br> 01000010 01100001 01110011 01101011 01100101 01110100 01000010 01110010 01101111 01110011 00101101 00100000 01100011 01110010 01100001 01111010 01111001 01100111 01100001 01101101 01100101 01110011 00101110 01100011 01101111 01101101 <br><br> 01010111 01110010 01100101 01110011 01110100 01101100 01100101 00100000 01000010 01110010 01101111 01110011 00101101 00100000 01100011 01110010 01100001 01111010 01111001 01100111 01100001 01101101 01100101 01110011 00101110 01100011 01101111 01101101 <br><br> 01010011 01110100 01100001 01100010 01100110 01101001 01110011 01101000 00101101 00100000 01100011 01110010 01100001 01111010 01111001 01100111 01100001 01101101 01100101 01110011 00101110 01100011 01101111 01101101 <br><br> 01010011 01110100 01100001 01100010 01100110 01101001 01110011 01101000 00100000 00110010 00101101 00100000 01100011 01110010 01100001 01111010 01111001 01100111 01100001 01101101 01100101 01110011 00101110 01100011 01101111 01101101 <br><br> 01010100 01101001 01101110 01111001 00100000 01000110 01101001 01110011 01101001 01101110 01100111 00101101 00100000 01100011 01110010 01100001 01111010 01111001 01100111 01100001 01101101 01100101 01110011 00101110 01100011 01101111 01101101 <br><br> 01000110 01101001 01110110 01100101 00100000 01001110 01101001 01100111 01101000 01110100 01110011 00100000 01000001 01110100 00100000 01000101 01110000 01110011 01110100 01100101 01101001 01101110 00100111 01110011 00101101 00100000 01100111 01100101 01101111 01101101 01100101 01110100 01110010 01111001 01101100 01101001 01110100 01100101 01110000 01100011 00101110 01101001 01101111 <br><br> 01000101 01110000 01110011 01110100 01100101 01101001 01101110 00100000 01000011 01101100 01101001 01100011 01101011 01100101 01110010 00101101 00100000 01100111 01100101 01101111 01101101 01100101 01110100 01110010 01111001 01101100 01101001 01110100 01100101 01110000 01100011 00101110 01101001 01101111 <br><br> 01000100 01110010 01101001 01110110 01100101 00100000 01001101 01100001 01100100 00101101 00100000 01010000 01101111 01101011 01101001 00101110 01100011 01101111 01101101 <br><br> 01010100 01100001 01111000 01101001 00100000 01010000 01101111 01101100 01101001 01100011 01100101 00100000 01000011 01101000 01100001 01110011 01100101 00101101 00100000 01010000 01101111 01101011 01101001 00101110 01100011 01101111 01101101`;

    settingsTabs.forEach(tab => {
        tab.onclick = () => {
            // Update active state
            settingsTabs.forEach(t => {
                t.classList.remove('text-white');
                t.classList.add('text-gray-500');
            });
            tab.classList.remove('text-gray-500');
            tab.classList.add('text-white');

            if (tab.id === 'settings-tab-copyright') {
                settingsContent.innerHTML = `
                    <div class="p-8 w-full max-w-4xl text-left bg-black/20 rounded-2xl border border-white/5 animate-in slide-in-from-bottom-2 duration-300">
                        <h4 class="text-[10px] font-bold uppercase tracking-[0.3em] text-red-500 mb-6 flex items-center gap-2">
                            <span class="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></span>
                            System Authentication Registry
                        </h4>
                        <div class="font-mono text-[10px] leading-relaxed text-gray-500 break-words whitespace-pre-wrap">
                            ${copyrightBinary}
                        </div>
                    </div>
                `;
            } else {
                // Clear content for others
                settingsContent.innerHTML = `
                    <div class="flex flex-col items-center gap-4 text-center">
                        <div class="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center border border-white/10">
                            <i data-lucide="settings" class="w-8 h-8 text-gray-700"></i>
                        </div>
                        <div>
                            <h4 class="text-lg font-bold uppercase tracking-widest text-gray-400">${tab.textContent.trim()}</h4>
                            <p class="text-sm text-gray-600 font-mono mt-2 uppercase tracking-wider">Interface pending configuration</p>
                        </div>
                    </div>
                `;
            }
            lucide.createIcons();
        };
    });
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
    settingsBtn.onclick = showSettings;
    
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
