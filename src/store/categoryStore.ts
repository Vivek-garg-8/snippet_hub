import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Category } from '../types';
import { generateId } from '../utils/helpers';

interface CategoryState {
  categories: Category[];
  addCategory: (name: string, parentId: string | null) => string;
  updateCategory: (id: string, name: string) => void;
  deleteCategory: (id: string) => void;
  moveCategory: (id: string, newParentId: string | null) => void;
  getCategoryById: (id: string | null) => Category | undefined;
  getRootCategories: () => Category[];
  getAllCategories: () => Category[];
  getCategoryPath: (id: string | null) => Category[];
  buildCategoryTree: (categories: Category[]) => Category[];
}

export const useCategoryStore = create<CategoryState>()(
  persist(
    (set, get) => ({
      categories: [],
      
      addCategory: (name: string, parentId: string | null) => {
        const normalizedName = name.trim();
        const existingCategory = get().categories.find(
          c => c.name.toLowerCase() === normalizedName.toLowerCase() && 
              c.parentId === parentId
        );
        
        if (existingCategory) {
          return existingCategory.id;
        }
        
        const newCategory: Category = {
          id: generateId(),
          name: normalizedName,
          parentId,
          children: [],
        };
        
        set((state) => ({
          categories: [...state.categories, newCategory],
        }));
        
        return newCategory.id;
      },
      
      updateCategory: (id: string, name: string) => {
        const normalizedName = name.trim();
        const category = get().getCategoryById(id);
        if (!category) return;
        
        const existingCategory = get().categories.find(
          c => c.id !== id && 
              c.name.toLowerCase() === normalizedName.toLowerCase() && 
              c.parentId === category.parentId
        );
        
        if (existingCategory) return;
        
        set((state) => ({
          categories: state.categories.map((category) =>
            category.id === id ? { ...category, name: normalizedName } : category
          ),
        }));
      },
      
      deleteCategory: (id: string) => {
        const getDescendants = (categoryId: string): string[] => {
          const children = get().categories.filter(c => c.parentId === categoryId);
          return [
            categoryId,
            ...children.flatMap(child => getDescendants(child.id))
          ];
        };
        
        const idsToDelete = getDescendants(id);
        
        set((state) => ({
          categories: state.categories.filter(c => !idsToDelete.includes(c.id))
        }));
      },
      
      moveCategory: (id: string, newParentId: string | null) => {
        if (id === newParentId) return;
        
        const getDescendants = (categoryId: string): string[] => {
          const children = get().categories.filter(c => c.parentId === categoryId);
          return [
            categoryId,
            ...children.flatMap(child => getDescendants(child.id))
          ];
        };
        
        if (newParentId && getDescendants(id).includes(newParentId)) return;
        
        set((state) => ({
          categories: state.categories.map((category) =>
            category.id === id ? { ...category, parentId: newParentId } : category
          ),
        }));
      },
      
      getCategoryById: (id: string | null) => {
        if (!id) return undefined;
        return get().categories.find((category) => category.id === id);
      },
      
      getRootCategories: () => {
        // Get unique root categories
        const rootCategories = get().categories
          .filter(category => !category.parentId)
          .reduce((unique, category) => {
            const exists = unique.some(c => 
              c.name.toLowerCase() === category.name.toLowerCase()
            );
            return exists ? unique : [...unique, category];
          }, [] as Category[])
          .sort((a, b) => a.name.localeCompare(b.name));
        
        return get().buildCategoryTree(rootCategories);
      },
      
      getAllCategories: () => {
        // Get all unique categories
        return get().categories
          .reduce((unique, category) => {
            const exists = unique.some(c => 
              c.name.toLowerCase() === category.name.toLowerCase() &&
              c.parentId === category.parentId
            );
            return exists ? unique : [...unique, category];
          }, [] as Category[])
          .sort((a, b) => a.name.localeCompare(b.name));
      },
      
      getCategoryPath: (id: string | null) => {
        const path: Category[] = [];
        let currentId = id;
        
        while (currentId) {
          const category = get().getCategoryById(currentId);
          if (!category) break;
          
          path.unshift(category);
          currentId = category.parentId;
        }
        
        return path;
      },
      
      buildCategoryTree: (categories: Category[]) => {
        const buildTree = (cats: Category[]): Category[] => {
          return cats.map(category => {
            // Get unique children for this category
            const children = get().categories
              .filter(c => c.parentId === category.id)
              .reduce((unique, child) => {
                const exists = unique.some(c => 
                  c.name.toLowerCase() === child.name.toLowerCase()
                );
                return exists ? unique : [...unique, child];
              }, [] as Category[])
              .sort((a, b) => a.name.localeCompare(b.name));
            
            return {
              ...category,
              children: buildTree(children)
            };
          });
        };
        
        return buildTree(categories);
      }
    }),
    {
      name: 'category-storage',
    }
  )
);