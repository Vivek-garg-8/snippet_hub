import React, { useState, useMemo } from 'react';
import { useSnippetStore } from '../../store/snippetStore';
import { useAppStore } from '../../store/appStore';
import SnippetCard from './SnippetCard';
import SnippetFormModal from './SnippetFormModal';
import EmptyState from '../ui/EmptyState';

const SnippetList: React.FC = () => {
  const { snippets } = useSnippetStore();
  const { viewMode, selectedCategoryId, selectedTagId } = useAppStore();
  const [editingSnippetId, setEditingSnippetId] = useState<string | null>(null);
  
  const filteredSnippets = useMemo(() => {
    let filtered = [...snippets];
    
    if (selectedCategoryId) {
      filtered = filtered.filter(snippet => snippet.categoryId === selectedCategoryId);
    }
    
    if (selectedTagId) {
      filtered = filtered.filter(snippet => snippet.tags.includes(selectedTagId));
    }
    
    return filtered.sort((a, b) => b.updatedAt - a.updatedAt);
  }, [snippets, selectedCategoryId, selectedTagId]);
  
  const handleEdit = (id: string) => {
    setEditingSnippetId(id);
  };
  
  const handleCloseEdit = () => {
    setEditingSnippetId(null);
  };
  
  if (filteredSnippets.length === 0) {
    return (
      <EmptyState 
        message={
          selectedCategoryId 
            ? "No snippets in this category" 
            : selectedTagId 
            ? "No snippets with this tag"
            : "No snippets yet"
        } 
      />
    );
  }
  
  return (
    <div>
      <div className={
        viewMode === 'grid'
          ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4'
          : 'space-y-4'
      }>
        {filteredSnippets.map((snippet) => (
          <SnippetCard
            key={snippet.id}
            snippet={snippet}
            onEdit={handleEdit}
          />
        ))}
      </div>
      
      {editingSnippetId && (
        <SnippetFormModal
          snippetId={editingSnippetId}
          onClose={handleCloseEdit}
        />
      )}
    </div>
  );
};

export default SnippetList;