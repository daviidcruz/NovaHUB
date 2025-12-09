
import React, { useState, useEffect, useMemo } from 'react';
import { Layout } from './components/Layout';
import { Dashboard } from './components/Dashboard';
import { FavoritesView } from './components/FavoritesView';
import { Tender } from './types';
import { DEFAULT_KEYWORDS } from './constants';

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

  // Initialize Custom Keywords
  const [customKeywords, setCustomKeywords] = useState<string[]>(() => {
      if (typeof window !== 'undefined') {
          const saved = localStorage.getItem('novaHubKeywords');
          if (saved) return JSON.parse(saved);
      }
      return DEFAULT_KEYWORDS;
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

  // Persist Keywords
  useEffect(() => {
    localStorage.setItem('novaHubKeywords', JSON.stringify(customKeywords));
  }, [customKeywords]);

  const toggleTheme = () => setIsDarkMode(prev => !prev);
  const toggleAI = () => setIsAIEnabled(prev => !prev);

  const addKeyword = (keyword: string) => {
      const trimmed = keyword.trim();
      if (trimmed && !customKeywords.includes(trimmed)) {
          setCustomKeywords(prev => [...prev, trimmed]);
      }
  };

  const removeKeyword = (keyword: string) => {
      setCustomKeywords(prev => prev.filter(k => k !== keyword));
  };

  const resetKeywords = () => {
      setCustomKeywords(DEFAULT_KEYWORDS);
  };

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
        keywords={customKeywords}
        onAddKeyword={addKeyword}
        onRemoveKeyword={removeKeyword}
        onResetKeywords={resetKeywords}
    >
      {currentView === 'dashboard' && (
        <Dashboard 
          favorites={favoriteIds} 
          toggleFavorite={toggleFavorite} 
          isAIEnabled={isAIEnabled}
          keywords={customKeywords}
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
