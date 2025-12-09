
import React, { useState } from 'react';
import { Menu, X, LayoutDashboard, Bookmark, Settings, Moon, Sun, Sparkles, Tag, Plus, RotateCcw } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  currentView: 'dashboard' | 'favorites';
  onViewChange: (view: 'dashboard' | 'favorites') => void;
  isDarkMode: boolean;
  toggleTheme: () => void;
  isAIEnabled: boolean;
  toggleAI: () => void;
  keywords: string[];
  onAddKeyword: (keyword: string) => void;
  onRemoveKeyword: (keyword: string) => void;
  onResetKeywords: () => void;
}

export const Layout: React.FC<LayoutProps> = ({ 
    children, 
    currentView, 
    onViewChange,
    isDarkMode,
    toggleTheme,
    isAIEnabled,
    toggleAI,
    keywords,
    onAddKeyword,
    onRemoveKeyword,
    onResetKeywords
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isKeywordsModalOpen, setIsKeywordsModalOpen] = useState(false);
  const [newKeyword, setNewKeyword] = useState('');

  const handleAddKeyword = () => {
      if (newKeyword.trim()) {
          onAddKeyword(newKeyword);
          setNewKeyword('');
      }
  };

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
                        
                        {/* Keywords Manager Button */}
                         <button 
                            onClick={() => {
                                setIsKeywordsModalOpen(true);
                                setIsSettingsOpen(false);
                            }}
                            className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors text-sm text-gray-700 dark:text-gray-300"
                        >
                            <div className="flex items-center gap-3">
                                <Tag size={18} />
                                <span>Palabras Clave</span>
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

      {/* Keywords Management Modal */}
      {isKeywordsModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-xl shadow-2xl border border-gray-200 dark:border-slate-800 overflow-hidden">
                <div className="flex justify-between items-center p-4 border-b dark:border-slate-800">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                        <Tag size={20} />
                        Gestión de Palabras Clave
                    </h3>
                    <button onClick={() => setIsKeywordsModalOpen(false)} className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
                        <X size={20} />
                    </button>
                </div>
                
                <div className="p-4 bg-gray-50 dark:bg-slate-950/50">
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                        Estas palabras clave se utilizan para filtrar y etiquetar automáticamente las licitaciones relevantes para NovaGob.
                    </p>
                    
                    {/* Add Input */}
                    <div className="flex gap-2 mb-4">
                        <input 
                            type="text" 
                            value={newKeyword}
                            onChange={(e) => setNewKeyword(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleAddKeyword()}
                            placeholder="Añadir nueva palabra clave..."
                            className="flex-1 bg-white dark:bg-slate-900 border border-gray-300 dark:border-slate-700 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none text-gray-900 dark:text-white"
                        />
                        <button 
                            onClick={handleAddKeyword}
                            disabled={!newKeyword.trim()}
                            className="bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <Plus size={20} />
                        </button>
                    </div>

                    {/* Keywords List */}
                    <div className="flex flex-wrap gap-2 max-h-60 overflow-y-auto p-2 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-lg">
                        {keywords.length === 0 ? (
                            <span className="text-sm text-gray-400 italic p-2">No hay palabras clave configuradas.</span>
                        ) : (
                            keywords.map(k => (
                                <span key={k} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 text-sm">
                                    {k}
                                    <button 
                                        onClick={() => onRemoveKeyword(k)}
                                        className="hover:text-blue-900 dark:hover:text-blue-100 ml-1"
                                    >
                                        <X size={14} />
                                    </button>
                                </span>
                            ))
                        )}
                    </div>
                </div>

                <div className="p-4 border-t dark:border-slate-800 bg-white dark:bg-slate-900 flex justify-between">
                    <button 
                        onClick={onResetKeywords}
                        className="text-xs text-gray-500 hover:text-red-500 flex items-center gap-1 transition-colors"
                        title="Restaurar valores por defecto"
                    >
                        <RotateCcw size={14} /> Restaurar por defecto
                    </button>
                    <button 
                        onClick={() => setIsKeywordsModalOpen(false)}
                        className="px-4 py-2 bg-gray-200 dark:bg-slate-800 text-gray-800 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-slate-700 text-sm font-medium"
                    >
                        Listo
                    </button>
                </div>
            </div>
        </div>
      )}
    </div>
  );
};
