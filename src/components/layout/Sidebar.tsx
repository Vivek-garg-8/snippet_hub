import React, { useState } from 'react';
import { ChevronDown, ChevronRight, FolderPlus, Tag, Star, X, LogOut, User } from 'lucide-react';
import { toast } from 'sonner';
import { useAppStore } from '../../store/appStore';
import { useCategoryStore } from '../../store/categoryStore';
import { useTagStore } from '../../store/tagStore';
import { useSnippetStore } from '../../store/snippetStore';
import { useAuthStore } from '../../store/authStore';
import { supabase } from '../../lib/supabase';
import CategoryTree from '../categories/CategoryTree';
import TagList from '../tags/TagList';
import CategoryForm from '../categories/CategoryForm';
import TagForm from '../tags/TagForm';

const Sidebar: React.FC = () => {
  const {
    sidebarOpen,
    selectedCategoryId,
    selectedTagId,
    setSelectedCategory,
    setSelectedTag,
    clearFilters
  } = useAppStore();
  const { getRootCategories } = useCategoryStore();
  const { getAllTags } = useTagStore();
  const { getPinnedSnippets } = useSnippetStore();
  const { user } = useAuthStore();

  const [categoryExpanded, setCategoryExpanded] = useState(true);
  const [tagsExpanded, setTagsExpanded] = useState(true);
  const [pinnedExpanded, setPinnedExpanded] = useState(true);

  const [showCategoryForm, setShowCategoryForm] = useState(false);
  const [showTagForm, setShowTagForm] = useState(false);

  const rootCategories = getRootCategories();
  const allTags = getAllTags();
  const pinnedSnippets = getPinnedSnippets();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast.success('Logged out successfully');
  };

  if (!sidebarOpen) return null;

  return (
    <aside className="fixed top-16 left-0 w-64 h-[calc(100vh-4rem)] bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 z-20 flex flex-col transition-all duration-200 transform md:translate-x-0">
      <div className="flex-1 overflow-y-auto p-4">
        {(selectedCategoryId || selectedTagId) && (
          <button
            onClick={clearFilters}
            className="mb-4 w-full flex items-center justify-center px-3 py-2 bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 rounded-md hover:bg-blue-200 dark:hover:bg-blue-900/30 transition-colors duration-150"
          >
            <X size={16} className="mr-2" />
            Clear filters
          </button>
        )}

        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <button
              onClick={() => setCategoryExpanded(!categoryExpanded)}
              className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
            >
              {categoryExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
              <span>Categories</span>
            </button>
            <button
              onClick={() => setShowCategoryForm(true)}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              aria-label="Add category"
            >
              <FolderPlus size={16} />
            </button>
          </div>

          {categoryExpanded && (
            <div className="ml-2">
              <CategoryTree
                categories={rootCategories}
                selectedId={selectedCategoryId ?? undefined}
                onSelect={setSelectedCategory}
              />
              {rootCategories.length === 0 && (
                <p className="text-sm text-gray-500 dark:text-gray-400 italic ml-6">
                  No categories yet
                </p>
              )}
            </div>
          )}
        </div>

        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <button
              onClick={() => setTagsExpanded(!tagsExpanded)}
              className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
            >
              {tagsExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
              <span>Tags</span>
            </button>
            <button
              onClick={() => setShowTagForm(true)}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              aria-label="Add tag"
            >
              <Tag size={16} />
            </button>
          </div>

          {tagsExpanded && (
            <div className="ml-2">
              <TagList
                tags={allTags}
                selectedId={selectedTagId}
                onSelect={setSelectedTag}
              />
              {allTags.length === 0 && (
                <p className="text-sm text-gray-500 dark:text-gray-400 italic ml-6">
                  No tags yet
                </p>
              )}
            </div>
          )}
        </div>

        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <button
              onClick={() => setPinnedExpanded(!pinnedExpanded)}
              className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
            >
              {pinnedExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
              <span>Pinned</span>
            </button>
            <Star size={16} className="text-yellow-500" />
          </div>

          {pinnedExpanded && (
            <div className="ml-6">
              {pinnedSnippets.map((snippet) => (
                <div
                  key={snippet.id}
                  className="py-1 px-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 rounded cursor-pointer"
                >
                  {snippet.title}
                </div>
              ))}

              {pinnedSnippets.length === 0 && (
                <p className="text-sm text-gray-500 dark:text-gray-400 italic">
                  No pinned snippets
                </p>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
        {user && (
          <div className="flex items-center px-3 py-2 mb-2 text-sm text-gray-700 dark:text-gray-300">
            <User size={18} className="mr-2 text-gray-500" />
            <span className="truncate" title={user.email}>{user.email}</span>
          </div>
        )}
        <button
          onClick={handleLogout}
          className="flex items-center w-full px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20 rounded-md transition-colors"
        >
          <LogOut size={18} className="mr-2" />
          Sign Out
        </button>
      </div>

      {showCategoryForm && (
        <CategoryForm onClose={() => setShowCategoryForm(false)} />
      )}

      {showTagForm && (
        <TagForm onClose={() => setShowTagForm(false)} />
      )}
    </aside>
  );
};

export default Sidebar;