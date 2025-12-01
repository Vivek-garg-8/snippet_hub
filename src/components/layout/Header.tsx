import React, { useState } from 'react';
import { 
  Menu, 
  Search, 
  Sun, 
  Moon, 
  Grid, 
  List, 
  Plus 
} from 'lucide-react';
import { useAppStore } from '../../store/appStore';
import SearchModal from '../snippets/SearchModal';
import SnippetFormModal from '../snippets/SnippetFormModal';

const Header: React.FC = () => {
  const { 
    darkMode, 
    toggleDarkMode, 
    sidebarOpen, 
    toggleSidebar, 
    viewMode, 
    setViewMode 
  } = useAppStore();
  
  const [searchOpen, setSearchOpen] = useState(false);
  const [newSnippetOpen, setNewSnippetOpen] = useState(false);
  
  return (
    <header className="h-16 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between px-4 bg-white dark:bg-gray-800 z-10 transition-colors duration-200">
      <div className="flex items-center">
        <button
          onClick={toggleSidebar}
          className="mr-4 p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-150"
          aria-label="Toggle sidebar"
        >
          <Menu size={20} />
        </button>
        <h1 className="text-xl font-semibold hidden sm:block">Snippet Manager</h1>
      </div>
      
      <div className="flex items-center space-x-2">
        <button
          onClick={() => setSearchOpen(true)}
          className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-150"
          aria-label="Search"
        >
          <Search size={20} />
        </button>
        
        <button
          onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
          className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-150"
          aria-label={`Switch to ${viewMode === 'grid' ? 'list' : 'grid'} view`}
        >
          {viewMode === 'grid' ? <List size={20} /> : <Grid size={20} />}
        </button>
        
        <button
          onClick={toggleDarkMode}
          className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-150"
          aria-label={`Switch to ${darkMode ? 'light' : 'dark'} mode`}
        >
          {darkMode ? <Sun size={20} /> : <Moon size={20} />}
        </button>
        
        <button
          onClick={() => setNewSnippetOpen(true)}
          className="ml-2 px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-150 flex items-center"
          aria-label="Create new snippet"
        >
          <Plus size={18} className="mr-1" />
          <span className="hidden sm:inline">New Snippet</span>
        </button>
      </div>
      
      {searchOpen && <SearchModal onClose={() => setSearchOpen(false)} />}
      {newSnippetOpen && <SnippetFormModal onClose={() => setNewSnippetOpen(false)} />}
    </header>
  );
};

export default Header;