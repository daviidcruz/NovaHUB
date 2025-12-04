import React, { useState } from 'react';
import { Menu, X, LayoutDashboard, Bookmark, Settings, Moon, Sun, Sparkles } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  currentView: 'dashboard' | 'favorites';
  onViewChange: (view: 'dashboard' | 'favorites') => void;
  isDarkMode: boolean;
  toggleTheme: () => void;
  isAIEnabled: boolean;
  toggleAI: () => void;
}

export const Layout: React.FC<LayoutProps> = ({ 
    children, 
    currentView, 
    onViewChange,
    isDarkMode,
    toggleTheme,
    isAIEnabled,
    toggleAI
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const NavItem = ({ view, icon: Icon, label }: { view: 'dashboard' | 'favorites', icon: any, label: string }) => (
    <button
      onClick={() => {
        onViewChange(view);
        setIsMobileMenuOpen(false);
      }}
      className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
        currentView === view 
          ? 'bg-blue-600 text-white shadow-md' 
          : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-800'
      }`}
    >
      <Icon size={20} />
      <span className="font-medium">{label}</span>
    </button>
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950 flex flex-col md:flex-row transition-colors duration-200">
      {/* Mobile Header */}
      <div className="md:hidden bg-white dark:bg-slate-900 border-b dark:border-slate-800 p-4 flex justify-between items-center sticky top-0 z-20 transition-colors">
        <div className="font-bold text-xl text-blue-800 dark:text-blue-400">NovaHUB</div>
        <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="text-gray-700 dark:text-gray-200"
        >
          {isMobileMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-10 w-64 bg-white dark:bg-slate-900 border-r dark:border-slate-800 transform transition-transform duration-200 ease-in-out
        md:relative md:translate-x-0
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="p-6 border-b dark:border-slate-800 hidden md:block">
          <h1 className="text-2xl font-bold text-blue-800 dark:text-blue-400">NovaHUB</h1>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Gestión de Licitaciones</p>
        </div>

        <nav className="p-4 space-y-2">
          <NavItem view="dashboard" icon={LayoutDashboard} label="Licitaciones" />
          <NavItem view="favorites" icon={Bookmark} label="Mis Favoritos" />
        </nav>

        {/* Settings / Footer Area */}
        <div className="absolute bottom-0 w-full border-t dark:border-slate-800 bg-gray-50 dark:bg-slate-900/50 p-4">
             {/* Popup Menu */}
             {isSettingsOpen && (
                <div className="absolute bottom-full left-0 w-full px-4 mb-2 animate-in fade-in slide-in-from-bottom-2 duration-200">
                    <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl shadow-xl p-2 space-y-1">
                        {/* Theme Toggle */}
                        <button 
                            onClick={toggleTheme}
                            className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors text-sm text-gray-700 dark:text-gray-300"
                        >
                            <div className="flex items-center gap-3">
                                {isDarkMode ? <Moon size={18} /> : <Sun size={18} />}
                                <span>Tema {isDarkMode ? 'Oscuro' : 'Claro'}</span>
                            </div>
                            <div className={`w-8 h-4 rounded-full relative transition-colors ${isDarkMode ? 'bg-blue-600' : 'bg-gray-300'}`}>
                                <div className={`absolute top-0.5 w-3 h-3 rounded-full bg-white transition-transform ${isDarkMode ? 'left-4.5 translate-x-4' : 'left-0.5'}`}></div>
                            </div>
                        </button>

                        {/* AI Toggle */}
                        <button 
                            onClick={toggleAI}
                            className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors text-sm text-gray-700 dark:text-gray-300"
                        >
                            <div className="flex items-center gap-3">
                                <Sparkles size={18} className={isAIEnabled ? 'text-purple-500' : 'text-gray-400'} />
                                <span>Resumen IA</span>
                            </div>
                            <div className={`w-8 h-4 rounded-full relative transition-colors ${isAIEnabled ? 'bg-purple-600' : 'bg-gray-300'}`}>
                                <div className={`absolute top-0.5 w-3 h-3 rounded-full bg-white transition-transform ${isAIEnabled ? 'left-4.5 translate-x-4' : 'left-0.5'}`}></div>
                            </div>
                        </button>
                    </div>
                </div>
             )}

             {/* Settings Toggle Button */}
             <button 
                onClick={() => setIsSettingsOpen(!isSettingsOpen)}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                    isSettingsOpen
                    ? 'bg-gray-200 dark:bg-slate-800 text-gray-900 dark:text-white' 
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-800'
                }`}
             >
                <Settings size={20} />
                <span className="font-medium">Ajustes</span>
             </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto h-screen relative">
        {children}
      </main>
    </div>
  );
};