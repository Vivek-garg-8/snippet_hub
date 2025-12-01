import React from 'react';
import { Edit, Trash, Star, Code, FileText, Link as LinkIcon, FileDown as FileMarkdown } from 'lucide-react';
import { Snippet } from '../../types';
import { useSnippetStore } from '../../store/snippetStore';
import { useTagStore } from '../../store/tagStore';
import { useCategoryStore } from '../../store/categoryStore';
import { formatDate, getSnippetPreview } from '../../utils/helpers';

interface SnippetCardProps {
  snippet: Snippet;
  onEdit: (id: string) => void;
}

const SnippetCard: React.FC<SnippetCardProps> = ({ snippet, onEdit }) => {
  const { deleteSnippet, togglePinSnippet } = useSnippetStore();
  const { getTagsByIds } = useTagStore();
  const { getCategoryById } = useCategoryStore();
  
  const tags = getTagsByIds(snippet.tags);
  const category = getCategoryById(snippet.categoryId);
  
  const getTypeIcon = () => {
    switch (snippet.type) {
      case 'code':
        return <Code size={16} className="text-blue-500" />;
      case 'markdown':
        return <FileMarkdown size={16} className="text-purple-500" />;
      case 'link':
        return <LinkIcon size={16} className="text-green-500" />;
      default:
        return <FileText size={16} className="text-gray-500" />;
    }
  };
  
  const handleDelete = () => {
    if (confirm('Are you sure you want to delete this snippet?')) {
      deleteSnippet(snippet.id);
    }
  };
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow duration-200">
      <div className="p-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center">
            {getTypeIcon()}
            <h3 className="ml-2 font-medium text-gray-900 dark:text-white truncate">
              {snippet.title}
            </h3>
          </div>
          <div className="flex space-x-1">
            <button
              onClick={() => togglePinSnippet(snippet.id)}
              className={`p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 ${
                snippet.isPinned ? 'text-yellow-500' : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'
              }`}
              aria-label={snippet.isPinned ? 'Unpin snippet' : 'Pin snippet'}
            >
              <Star size={16} />
            </button>
            <button
              onClick={() => onEdit(snippet.id)}
              className="p-1 rounded text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:text-gray-300 dark:hover:bg-gray-700"
              aria-label="Edit snippet"
            >
              <Edit size={16} />
            </button>
            <button
              onClick={handleDelete}
              className="p-1 rounded text-gray-400 hover:text-red-500 hover:bg-gray-100 dark:hover:text-red-400 dark:hover:bg-gray-700"
              aria-label="Delete snippet"
            >
              <Trash size={16} />
            </button>
          </div>
        </div>
        
        {category && (
          <div className="text-xs text-gray-500 dark:text-gray-400 mb-2">
            in {category.name}
          </div>
        )}
        
        <div className="h-24 overflow-hidden text-sm text-gray-700 dark:text-gray-300 mb-3">
          <p className="line-clamp-4">{getSnippetPreview(snippet.content)}</p>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex flex-wrap gap-1">
            {tags.map((tag) => (
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
            ))}
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400">
            {formatDate(snippet.updatedAt)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SnippetCard;