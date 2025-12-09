
import React, { useState, useEffect, useMemo } from 'react';
import { Layout } from './components/Layout';
import { Dashboard } from './components/Dashboard';
import { FavoritesView } from './components/FavoritesView';
import { Tender } from './types';
import { DEFAULT_KEYWORDS } from './constants';

// Simple state-based router
type View = 'dashboard' | 'favorites';
export type ThemeMode = 'light' | 'dark' | 'system';

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

  // Initialize Theme (Light, Dark, or System)
  const [themeMode, setThemeMode] = useState<ThemeMode>(() => {
    if (typeof window !== 'undefined') {
        const saved = localStorage.getItem('novaHubThemeMode');
        // Validate saved value
        if (saved === 'light' || saved === 'dark' || saved === 'system') {
            return saved;
        }
        // Legacy support: if previously just 'dark' in generic theme key
        const legacy = localStorage.getItem('novaHubTheme');
        if (legacy === 'dark') return 'dark';
        if (legacy === 'light') return 'light';
    }
    return 'system';
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
    const root = document.documentElement;
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    const applyTheme = () => {
        if (themeMode === 'dark') {
            root.classList.add('dark');
        } else if (themeMode === 'light') {
            root.classList.remove('dark');
        } else if (themeMode === 'system') {
            if (mediaQuery.matches) {
                root.classList.add('dark');
            } else {
                root.classList.remove('dark');
            }
        }
    };

    applyTheme();
    localStorage.setItem('novaHubThemeMode', themeMode);

    // Listen for system changes if mode is system
    if (themeMode === 'system') {
        mediaQuery.addEventListener('change', applyTheme);
        return () => mediaQuery.removeEventListener('change', applyTheme);
    }
  }, [themeMode]);

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

  // Determine if actually dark for rendering logic (passing props) if needed, 
  // though CSS classes handle most. We can pass the mode directly.

  return (
    <Layout 
        currentView={currentView} 
        onViewChange={setCurrentView}
        themeMode={themeMode}
        setThemeMode={setThemeMode}
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
