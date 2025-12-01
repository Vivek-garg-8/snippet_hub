import React, { useState } from 'react';
import { Edit, Trash } from 'lucide-react';
import { Tag } from '../../types';
import { useTagStore } from '../../store/tagStore';
import { useSnippetStore } from '../../store/snippetStore';
import TagForm from './TagForm';

interface TagListProps {
  tags: Tag[];
  selectedId: string | null;
  onSelect: (id: string | null) => void;
}

const TagList: React.FC<TagListProps> = ({ tags, selectedId, onSelect }) => {
  const { deleteTag, getTagCount } = useTagStore();
  const [editingTag, setEditingTag] = useState<string | null>(null);
  
  const handleSelect = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    onSelect(selectedId === id ? null : id);
  };
  
  const handleEdit = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingTag(id);
  };
  
  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('Are you sure you want to delete this tag?')) {
      deleteTag(id);
      if (selectedId === id) {
        onSelect(null);
      }
    }
  };
  
  // Sort tags alphabetically
  const sortedTags = [...tags].sort((a, b) => a.name.localeCompare(b.name));
  
  return (
    <div className="space-y-1 ml-4">
      {sortedTags.map((tag) => {
        const snippetCount = getTagCount(tag.id);
        const isSelected = tag.id === selectedId;
        
        return (
          <div 
            key={tag.id}
            onClick={(e) => handleSelect(tag.id, e)}
            className={`flex items-center group py-1 px-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded cursor-pointer ${
              isSelected ? 'bg-blue-50 dark:bg-blue-900/20' : ''
            }`}
          >
            <div 
              className="w-3 h-3 rounded-full mr-2" 
              style={{ backgroundColor: tag.color }}
            />
            <span className="text-sm truncate flex-1">
              {tag.name}
              <span className="ml-2 text-xs text-gray-500">
                ({snippetCount})
              </span>
            </span>
            
            <button
              onClick={(e) => handleEdit(tag.id, e)}
              className="opacity-0 group-hover:opacity-100 p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              <Edit size={14} />
            </button>
            
            <button
              onClick={(e) => handleDelete(tag.id, e)}
              className="opacity-0 group-hover:opacity-100 p-1 text-gray-500 hover:text-red-500 dark:text-gray-400 dark:hover:text-red-400"
            >
              <Trash size={14} />
            </button>
            
            {editingTag === tag.id && (
              <TagForm
                tag={tag}
                onClose={() => setEditingTag(null)}
              />
            )}
          </div>
        );
      })}
    </div>
  );
};

export default TagList;