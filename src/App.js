/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Gamepad2, 
  Search, 
  Filter, 
  Maximize2, 
  Minimize2, 
  ArrowLeft,
  X,
  Layers,
  Gamepad
} from 'lucide-react';
import gamesData from './data/games.json';

export default function App() {
  const [view, setView] = useState('gallery');
  const [selectedGame, setSelectedGame] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const games = gamesData;

  const categories = useMemo(() => {
    const cats = new Set(games.map(g => g.category));
    return ['All', ...Array.from(cats)];
  }, [games]);

  const filteredGames = useMemo(() => {
    return games.filter(game => {
      const matchesSearch = game.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          game.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'All' || game.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [games, searchQuery, selectedCategory]);

  const handlePlayGame = (game) => {
    setSelectedGame(game);
    setView('player');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackToGallery = () => {
    setView('gallery');
  };

  return (
    <div className="min-h-screen flex flex-col bg-arcade-bg text-gray-100 overflow-x-hidden">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-arcade-bg/80 backdrop-blur-md border-b border-arcade-card p-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div 
            className="flex items-center gap-3 cursor-pointer group"
            onClick={() => setView('gallery')}
            id="app-logo"
          >
            <div className="p-2 bg-neon-blue/10 rounded-lg group-hover:bg-neon-pink/10 transition-colors">
              <Gamepad2 className="w-8 h-8 text-neon-blue group-hover:text-neon-pink transition-colors" />
            </div>
            <h1 className="text-2xl font-display tracking-tight bg-gradient-to-r from-neon-blue to-neon-pink bg-clip-text text-transparent">
              NEON ARCADE
            </h1>
          </div>

          {view === 'gallery' && (
            <div className="hidden md:flex items-center bg-arcade-card border border-gray-800 rounded-full px-4 py-2 w-full max-w-md ml-8">
              <Search className="w-5 h-5 text-gray-500 mr-2" />
              <input 
                type="text" 
                placeholder="Search unblocked games..." 
                className="bg-transparent border-none outline-none text-sm w-full placeholder:text-gray-600"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                id="game-search"
              />
            </div>
          )}

          <div className="flex items-center gap-4">
            {view === 'player' && (
              <button 
                onClick={handleBackToGallery}
                className="flex items-center gap-2 px-4 py-2 rounded-full border border-gray-700 hover:border-neon-blue hover:text-neon-blue transition-all"
                id="back-button"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Gallery</span>
              </button>
            )}
            <div className="w-10 h-10 rounded-full bg-arcade-card border border-gray-800 flex items-center justify-center">
              <span className="text-xs font-mono">V.1</span>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 w-full max-w-7xl mx-auto p-4 md:p-8">
        <AnimatePresence mode="wait">
          {view === 'gallery' ? (
            <motion.div
              key="gallery"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
              id="gallery-view"
            >
              {/* Mobile Search */}
              <div className="md:hidden">
                <div className="flex items-center bg-arcade-card border border-gray-800 rounded-xl px-4 py-3">
                  <Search className="w-5 h-5 text-gray-500 mr-2" />
                  <input 
                    type="text" 
                    placeholder="Search games..." 
                    className="bg-transparent border-none outline-none text-sm w-full"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>

              {/* Categories */}
              <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
                <Layers className="w-4 h-4 text-gray-500 mr-2" />
                {categories.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`whitespace-nowrap px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                      selectedCategory === cat 
                        ? 'bg-neon-blue text-arcade-bg neon-glow-blue' 
                        : 'bg-arcade-card hover:border-gray-600 border border-transparent'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Hero (Optional / Featured) */}
              {searchQuery === '' && selectedCategory === 'All' && games.length > 0 && (
                <div 
                  className="relative h-[300px] md:h-[400px] rounded-3xl overflow-hidden group cursor-pointer border border-gray-800"
                  onClick={() => handlePlayGame(games[0])}
                  id="featured-game"
                >
                  <img 
                    src={games[0].thumbnail} 
                    alt={games[0].title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-arcade-bg via-arcade-bg/40 to-transparent" />
                  <div className="absolute bottom-0 left-0 p-8 space-y-2">
                    <span className="px-3 py-1 bg-neon-pink text-white text-[10px] font-bold uppercase rounded-full tracking-wider">Featured Release</span>
                    <h2 className="text-4xl md:text-6xl font-display">{games[0].title}</h2>
                    <p className="text-gray-300 max-w-xl line-clamp-2">{games[0].description}</p>
                    <button className="mt-4 flex items-center gap-2 bg-white text-black px-6 py-3 rounded-xl font-bold hover:bg-neon-blue transition-colors group">
                      <Gamepad className="w-5 h-5" />
                      Play Now
                    </button>
                  </div>
                </div>
              )}

              {/* Game Grid */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-display flex items-center gap-2">
                    <Gamepad className="w-5 h-5 text-neon-pink" />
                    {selectedCategory === 'All' ? 'Latest Discoveries' : `${selectedCategory} Collection`}
                  </h3>
                  <span className="text-sm text-gray-500 font-mono">{filteredGames.length} Games</span>
                </div>

                <div className="arcade-grid">
                  {filteredGames.map((game, index) => (
                    <motion.div
                      key={game.id}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.05 }}
                      className="group flex flex-col bg-arcade-card rounded-2xl border border-gray-800 overflow-hidden hover:border-neon-blue/50 hover:bg-arcade-card/80 transition-all cursor-pointer"
                      onClick={() => handlePlayGame(game)}
                    >
                      <div className="relative aspect-video overflow-hidden">
                        <img 
                          src={game.thumbnail} 
                          alt={game.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-colors" />
                        <div className="absolute top-2 right-2 px-2 py-1 bg-arcade-bg/80 backdrop-blur-sm rounded text-[10px] font-mono border border-gray-700">
                          {game.category}
                        </div>
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <div className="w-12 h-12 rounded-full bg-neon-blue flex items-center justify-center text-arcade-bg neon-glow-blue scale-75 group-hover:scale-100 transition-transform">
                            <Maximize2 className="w-6 h-6" />
                          </div>
                        </div>
                      </div>
                      <div className="p-4 space-y-2">
                        <h4 className="text-lg group-hover:text-neon-blue transition-colors">{game.title}</h4>
                        <p className="text-xs text-gray-400 line-clamp-2 leading-relaxed">
                          {game.description}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {filteredGames.length === 0 && (
                  <div className="py-20 text-center space-y-4">
                    <div className="w-20 h-20 bg-arcade-card rounded-full flex items-center justify-center mx-auto border border-dashed border-gray-700">
                      <Search className="w-8 h-8 text-gray-600" />
                    </div>
                    <div>
                      <p className="text-gray-400">No games found matching your search.</p>
                      <button 
                        onClick={() => {setSearchQuery(''); setSelectedCategory('All');}}
                        className="text-neon-blue hover:underline text-sm font-medium mt-2"
                      >
                        Reset filters
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="player"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              className="w-full flex flex-col gap-6"
              id="player-view"
            >
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <button 
                      onClick={handleBackToGallery}
                      className="p-2 hover:bg-arcade-card rounded-lg transition-colors border border-gray-800"
                    >
                      <ArrowLeft className="w-5 h-5" />
                    </button>
                    <h2 className="text-3xl md:text-4xl font-display">{selectedGame?.title}</h2>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-gray-400 font-mono uppercase tracking-widest pl-12">
                    <span className="text-neon-blue">{selectedGame?.category}</span>
                    <span>•</span>
                    <span>HD PLAYBACK</span>
                    <span>•</span>
                    <span className="inline-flex items-center gap-1.5"><div className="w-1.5 h-1.5 bg-neon-green rounded-full animate-pulse" /> LIVE</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                   <button className="flex items-center gap-2 px-4 py-2 bg-arcade-card border border-gray-800 rounded-xl hover:border-gray-600 transition-all text-sm">
                    <X className="w-4 h-4" />
                    <span>Report Issues</span>
                   </button>
                </div>
              </div>

              {/* Game Frame */}
              <div className="relative w-full aspect-video md:h-[70vh] md:aspect-auto bg-black rounded-3xl overflow-hidden border border-gray-800 shadow-2xl neon-border-blue">
                {selectedGame && (
                  <iframe 
                    src={selectedGame.url}
                    title={selectedGame.title}
                    className="w-full h-full border-none"
                    allow="autoplay; fullscreen; pointer-lock"
                  />
                )}
                {/* Frame Overlay (Optional) */}
                <div className="absolute top-4 right-4 flex gap-2">
                   <button 
                    onClick={() => {
                        const frame = document.querySelector('iframe');
                        if (frame?.requestFullscreen) frame.requestFullscreen();
                    }}
                    className="p-3 bg-black/60 backdrop-blur-md rounded-full hover:bg-neon-blue hover:text-arcade-bg transition-all"
                   >
                    <Maximize2 className="w-5 h-5" />
                   </button>
                </div>
              </div>

              {/* Description & Controls */}
              <div className="grid md:grid-template-columns md:grid-cols-[1fr_300px] gap-8">
                <div className="space-y-6">
                  <div className="p-6 bg-arcade-card rounded-3xl border border-gray-800 space-y-4">
                    <h3 className="text-xl font-display underline decoration-neon-pink decoration-2 underline-offset-8">About the Game</h3>
                    <p className="text-gray-300 leading-relaxed">
                      {selectedGame?.description}
                    </p>
                    <div className="flex flex-wrap gap-2 pt-4">
                       {['unblocked', 'webgl', 'arcade', 'instaplay'].map(tag => (
                         <span key={tag} className="px-3 py-1 bg-gray-800/50 rounded-lg text-[10px] font-mono text-gray-400 uppercase">#{tag}</span>
                       ))}
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                   <div className="p-6 bg-arcade-card rounded-3xl border border-gray-800 space-y-4">
                      <h4 className="font-display">Recommended</h4>
                      <div className="space-y-4">
                        {games.filter(g => g.id !== selectedGame?.id).slice(0, 3).map(rec => (
                          <div 
                            key={rec.id}
                            className="flex gap-3 group cursor-pointer"
                            onClick={() => handlePlayGame(rec)}
                          >
                            <img src={rec.thumbnail} className="w-20 h-14 object-cover rounded-lg border border-gray-800 group-hover:border-neon-pink transition-all" />
                            <div className="min-w-0">
                               <p className="text-sm font-medium truncate group-hover:text-neon-pink transition-colors">{rec.title}</p>
                               <p className="text-[10px] text-gray-500 uppercase">{rec.category}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                   </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="mt-20 border-t border-arcade-card py-12 px-4">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
           <div className="col-span-1 md:col-span-2 space-y-4">
              <div className="flex items-center gap-2">
                <Gamepad2 className="w-6 h-6 text-neon-blue" />
                <span className="text-xl font-display tracking-tight text-white">NEON ARCADE</span>
              </div>
              <p className="text-sm text-gray-500 max-w-sm">
                The ultimate destination for unblocked entertainment. High-performance gaming, zero trackers, 100% free forever.
              </p>
           </div>
           <div className="space-y-4">
              <h5 className="font-display text-sm tracking-widest uppercase text-gray-400">Navigation</h5>
              <ul className="space-y-2 text-sm text-gray-500">
                <li><a href="#" className="hover:text-neon-blue transition-colors">Browse Games</a></li>
                <li><a href="#" className="hover:text-neon-blue transition-colors">Categories</a></li>
                <li><a href="#" className="hover:text-neon-blue transition-colors">Report Bug</a></li>
              </ul>
           </div>
           <div className="space-y-4">
              <h5 className="font-display text-sm tracking-widest uppercase text-gray-400">System Status</h5>
              <div className="flex items-center gap-2 text-xs font-mono text-neon-green">
                 <div className="w-2 h-2 bg-neon-green rounded-full animate-pulse" />
                 SERVER ONLINE [US-GATEWAY]
              </div>
              <p className="text-[10px] text-gray-600 font-mono">ENCRYPTED CONNECTION SECURE</p>
           </div>
        </div>
        <div className="max-w-7xl mx-auto mt-12 pt-8 border-t border-gray-900 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-[10px] text-gray-600 font-mono uppercase tracking-widest">© 2026 NEON ARCADE CORE • NO RIGHTS RESERVED</p>
          <div className="flex items-center gap-6">
             <button className="text-[10px] text-gray-600 font-mono hover:text-white transition-colors">PRIVACY_POLICY</button>
             <button className="text-[10px] text-gray-600 font-mono hover:text-white transition-colors">TERMS_OF_ENGAGEMENT</button>
          </div>
        </div>
      </footer>
    </div>
  );
}
