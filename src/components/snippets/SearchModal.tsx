import React, { useState, useEffect } from 'react';
import { X, Search, Calendar, Tag, Folder } from 'lucide-react';
import { useSnippetStore } from '../../store/snippetStore';
import { useTagStore } from '../../store/tagStore';
import { useCategoryStore } from '../../store/categoryStore';
import { formatDate } from '../../utils/helpers';
import { Snippet } from '../../types';

interface SearchModalProps {
  onClose: () => void;
}

const SearchModal: React.FC<SearchModalProps> = ({ onClose }) => {
  const { snippets, getSnippetsBySearch } = useSnippetStore();
  const { getAllTags } = useTagStore();
  const { getAllCategories } = useCategoryStore();
  
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Snippet[]>([]);
  const [selectedTagIds, setSelectedTagIds] = useState<string[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  
  const allTags = getAllTags();
  const allCategories = getAllCategories();
  
  // Filter results based on search criteria
  useEffect(() => {
    let filtered = query ? getSnippetsBySearch(query) : snippets;
    
    if (selectedTagIds.length > 0) {
      filtered = filtered.filter(snippet => 
        selectedTagIds.some(tagId => snippet.tags.includes(tagId))
      );
    }
    
    if (selectedCategoryId) {
      filtered = filtered.filter(snippet => 
        snippet.categoryId === selectedCategoryId
      );
    }
    
    setResults(filtered);
  }, [query, snippets, selectedTagIds, selectedCategoryId, getSnippetsBySearch]);
  
  const toggleTagFilter = (tagId: string) => {
    setSelectedTagIds(prev => 
      prev.includes(tagId) 
        ? prev.filter(id => id !== tagId)
        : [...prev, tagId]
    );
  };
  
  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
    }
  };
  
  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-start justify-center pt-16 px-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[80vh] flex flex-col">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center">
          <Search size={20} className="text-gray-400 mr-2" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search snippets..."
            className="flex-1 bg-transparent border-none outline-none text-gray-900 dark:text-white"
            autoFocus
          />
          <button 
            onClick={onClose} 
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <X size={20} />
          </button>
        </div>
        
        <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex flex-wrap gap-2">
          <div className="flex items-center mr-4">
            <Tag size={16} className="text-gray-500 mr-1" />
            <span className="text-sm text-gray-700 dark:text-gray-300">Tags:</span>
          </div>
          
          {allTags.map(tag => (
            <button
              key={tag.id}
              onClick={() => toggleTagFilter(tag.id)}
              className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                selectedTagIds.includes(tag.id)
                  ? 'bg-opacity-100'
                  : 'bg-opacity-30'
              }`}
              style={{ 
                backgroundColor: selectedTagIds.includes(tag.id) 
                  ? tag.color 
                  : `${tag.color}30`,
                color: selectedTagIds.includes(tag.id) 
                  ? 'white' 
                  : tag.color
              }}
            >
              {tag.name}
            </button>
          ))}
          
          {allTags.length === 0 && (
            <span className="text-sm text-gray-500 dark:text-gray-400 italic">
              No tags yet
            </span>
          )}
        </div>
        
        <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center">
          <Folder size={16} className="text-gray-500 mr-1" />
          <span className="text-sm text-gray-700 dark:text-gray-300 mr-2">Category:</span>
          
          <select
            value={selectedCategoryId || ''}
            onChange={(e) => setSelectedCategoryId(e.target.value || null)}
            className="bg-gray-100 dark:bg-gray-700 border-none rounded px-2 py-1 text-sm text-gray-900 dark:text-white"
          >
            <option value="">All Categories</option>
            {allCategories.map(category => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
        
        <div className="flex-1 overflow-y-auto">
          {results.length > 0 ? (
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              {results.map(snippet => (
                <div 
                  key={snippet.id}
                  className="p-4 hover:bg-gray-50 dark:hover:bg-gray-750 cursor-pointer"
                >
                  <div className="flex justify-between items-start mb-1">
                    <h3 className="font-medium text-gray-900 dark:text-white">
                      {snippet.title}
                    </h3>
                    <div className="text-xs text-gray-500 dark:text-gray-400 flex items-center">
                      <Calendar size={12} className="mr-1" />
                      {formatDate(snippet.updatedAt)}
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2 mb-2">
                    {snippet.content.substring(0, 100)}
                    {snippet.content.length > 100 && '...'}
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {allTags
                      .filter(tag => snippet.tags.includes(tag.id))
                      .map(tag => (
                        <span
                          key={tag.id}
                          className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium"
                          style={{ 
                            backgroundColor: `${tag.color}30`, 
                            color: tag.color 
                          }}
                        >
                          {tag.name}
                        </span>
                      ))
                    }
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full py-8 text-gray-500 dark:text-gray-400">
              <Search size={48} className="mb-2 opacity-20" />
              <p>No results found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchModal;