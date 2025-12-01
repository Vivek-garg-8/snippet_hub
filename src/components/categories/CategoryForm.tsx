import React, { useState} from 'react';
import { X } from 'lucide-react';
import { Category } from '../../types';
import { useCategoryStore } from '../../store/categoryStore';

interface CategoryFormProps {
  category?: Category;
  parentId?: string | null;
  onClose: () => void;
}

const CategoryForm: React.FC<CategoryFormProps> = ({ 
  category,
  parentId = null,
  onClose 
}) => {
  const { addCategory, updateCategory, getAllCategories } = useCategoryStore();
  const [name, setName] = useState(category ? category.name : '');
  const [selectedParentId, setSelectedParentId] = useState<string | null>(
    category ? category.parentId : parentId
  );
  
  const allCategories = getAllCategories();
  const isEditing = !!category;
  
  // Filter out the current category and its descendants from parent options
  const getValidParentOptions = () => {
    if (!category) return allCategories;
    
    const isDescendant = (parentId: string, childId: string): boolean => {
      if (parentId === childId) return true;
      const children = allCategories.filter(c => c.parentId === childId);
      return children.some(child => isDescendant(parentId, child.id));
    };
    
    return allCategories.filter(c => c.id !== category.id && !isDescendant(category.id, c.id));
  };
  
  const validParentOptions = getValidParentOptions();
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) return;
    
    if (isEditing && category) {
      updateCategory(category.id, name);
    } else {
      addCategory(name, selectedParentId);
    }
    
    onClose();
  };
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg max-w-md w-full p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">
            {isEditing ? 'Edit Category' : 'New Category'}
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
            <X size={20} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Name
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              required
            />
          </div>
          
          <div className="mb-4">
            <label htmlFor="parent" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Parent Category (optional)
            </label>
            <select
              id="parent"
              value={selectedParentId || ''}
              onChange={(e) => setSelectedParentId(e.target.value || null)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
            >
              <option value="">None (Root Category)</option>
              {validParentOptions.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
          
          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 border border-transparent rounded-md text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              {isEditing ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CategoryForm;