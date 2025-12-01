import React, { useState } from 'react';
import { Folder, ChevronDown, ChevronRight, Edit, Trash } from 'lucide-react';
import { Category } from '../../types';
import { useCategoryStore } from '../../store/categoryStore';
import CategoryForm from './CategoryForm';

interface CategoryTreeProps {
  categories: Category[];
  level?: number;
  selectedId?: string;
  onSelect?: (id: string) => void;
}

const CategoryTree: React.FC<CategoryTreeProps> = ({ 
  categories, 
  level = 0,
  selectedId,
  onSelect 
}) => {
  const { deleteCategory } = useCategoryStore();
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const [editingCategory, setEditingCategory] = useState<string | null>(null);
  
  const toggleExpand = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setExpanded((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };
  
  const handleSelect = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    onSelect?.(id);
  };
  
  const handleEdit = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingCategory(id);
  };
  
  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      if (confirm('Are you sure you want to delete this category?')) {
        deleteCategory(id);
      }
    } catch (error) {
      console.error('Failed to delete category:', error);
    }
  };
  
  return (
    <div className="space-y-1">
      {categories.map((category) => {
        const hasChildren = category.children && category.children.length > 0;
        const isExpanded = expanded[category.id] || false;
        const isSelected = category.id === selectedId;
        
        return (
          <div key={category.id} className="select-none">
            <div 
              className={`flex items-center p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded cursor-pointer transition-colors duration-150 ${
                isSelected ? 'bg-blue-50 dark:bg-blue-900/20' : ''
              }`}
              style={{ paddingLeft: `${level * 16}px` }}
              onClick={(e) => handleSelect(category.id, e)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  handleSelect(category.id, e as unknown as React.MouseEvent);
                }
              }}
            >
              <button
                onClick={(e) => toggleExpand(category.id, e)}
                className="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-sm transition-colors duration-150"
                aria-label={isExpanded ? 'Collapse category' : 'Expand category'}
              >
                {hasChildren ? (
                  isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />
                ) : (
                  <span className="w-4" />
                )}
              </button>
              
              <Folder size={16} className="mr-2 text-blue-500" />
              <span className="text-sm truncate flex-1">{category.name}</span>
              
              <div className="opacity-0 group-hover:opacity-100 flex">
                <button
                  onClick={(e) => handleEdit(category.id, e)}
                  className="p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 rounded-sm transition-colors duration-150"
                  aria-label="Edit category"
                >
                  <Edit size={14} />
                </button>
                
                <button
                  onClick={(e) => handleDelete(category.id, e)}
                  className="p-1 text-gray-500 hover:text-red-500 dark:text-gray-400 dark:hover:text-red-400 rounded-sm transition-colors duration-150"
                  aria-label="Delete category"
                >
                  <Trash size={14} />
                </button>
              </div>
            </div>
            
            {isExpanded && hasChildren && (
              <CategoryTree
                categories={category.children}
                level={level + 1}
                selectedId={selectedId}
                onSelect={onSelect}
              />
            )}
            
            {editingCategory === category.id && (
              <CategoryForm
                category={category}
                onClose={() => setEditingCategory(null)}
              />
            )}
          </div>
        );
      })}
    </div>
  );
};

export default CategoryTree;