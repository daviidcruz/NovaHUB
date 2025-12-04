import React, { useState, useEffect, useMemo } from 'react';
import { Layout } from './components/Layout';
import { Dashboard } from './components/Dashboard';
import { FavoritesView } from './components/FavoritesView';
import { Tender } from './types';
import './src/index.css';


// Simple state-based router
type View = 'dashboard' | 'favorites';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>('dashboard');
  
  // Initialize from localStorage - migrating to store FULL objects instead of just IDs
  const [favorites, setFavorites] = useState<Tender[]>(() => {
    try {
      if (typeof window !== 'undefined') {
        const saved = localStorage.getItem('novaHubFavorites');
        if (saved) {
            const parsed = JSON.parse(saved);
            // Validation: Check if it's the old format (array of strings) or new (array of objects)
            if (Array.isArray(parsed) && parsed.length > 0 && typeof parsed[0] === 'string') {
                return []; 
            }
            return parsed;
        }
      }
      return [];
    } catch (e) {
      return [];
    }
  });

  // Derived Set for fast O(1) lookups in Dashboard
  const favoriteIds = useMemo(() => new Set(favorites.map(t => t.id)), [favorites]);

  // Initialize Theme
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
        const saved = localStorage.getItem('novaHubTheme');
        if (saved) return saved === 'dark';
        return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  // Initialize AI Enabled State (Default OFF)
  const [isAIEnabled, setIsAIEnabled] = useState(() => {
    if (typeof window !== 'undefined') {
        const saved = localStorage.getItem('novaHubAIEnabled');
        return saved === 'true';
    }
    return false;
  });

  // Apply Theme Effect
  useEffect(() => {
    if (isDarkMode) {
        document.documentElement.classList.add('dark');
        localStorage.setItem('novaHubTheme', 'dark');
    } else {
        document.documentElement.classList.remove('dark');
        localStorage.setItem('novaHubTheme', 'light');
    }
  }, [isDarkMode]);

  // Persist AI Setting
  useEffect(() => {
    localStorage.setItem('novaHubAIEnabled', String(isAIEnabled));
  }, [isAIEnabled]);

  const toggleTheme = () => setIsDarkMode(prev => !prev);
  const toggleAI = () => setIsAIEnabled(prev => !prev);

  // Persist to local storage whenever favorites change
  useEffect(() => {
    localStorage.setItem('novaHubFavorites', JSON.stringify(favorites));
  }, [favorites]);

  const toggleFavorite = (tender: Tender) => {
    setFavorites(prev => {
      const exists = prev.some(t => t.id === tender.id);
      if (exists) {
        return prev.filter(t => t.id !== tender.id);
      } else {
        return [...prev, tender];
      }
    });
  };

  return (
    <Layout 
        currentView={currentView} 
        onViewChange={setCurrentView}
        isDarkMode={isDarkMode}
        toggleTheme={toggleTheme}
        isAIEnabled={isAIEnabled}
        toggleAI={toggleAI}
    >
      {currentView === 'dashboard' && (
        <Dashboard 
          favorites={favoriteIds} 
          toggleFavorite={toggleFavorite} 
          isAIEnabled={isAIEnabled}
        />
      )}
      {currentView === 'favorites' && (
        <FavoritesView 
          favorites={favorites} 
          toggleFavorite={toggleFavorite} 
          isAIEnabled={isAIEnabled}
        />
      )}
    </Layout>
  );
};

export default App;