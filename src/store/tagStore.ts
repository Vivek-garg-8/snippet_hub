import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Tag } from '../types';
import { generateId } from '../utils/helpers';
import { useSnippetStore } from './snippetStore';

interface TagState {
  tags: Tag[];
  addTag: (name: string, color: string) => string;
  updateTag: (id: string, data: Partial<Pick<Tag, 'name' | 'color'>>) => void;
  deleteTag: (id: string) => void;
  getTagById: (id: string) => Tag | undefined;
  getAllTags: () => Tag[];
  getTagsByIds: (ids: string[]) => Tag[];
  getTagCount: (tagId: string) => number;
}

export const useTagStore = create<TagState>()(
  persist(
    (set, get) => ({
      tags: [],
      
      addTag: (name: string, color: string) => {
        const normalizedName = name.trim();
        const existingTag = get().tags.find(
          t => t.name.toLowerCase() === normalizedName.toLowerCase()
        );
        
        if (existingTag) {
          return existingTag.id;
        }
        
        const newTag: Tag = {
          id: generateId(),
          name: normalizedName,
          color,
        };
        
        set((state) => ({
          tags: [...state.tags, newTag],
        }));
        
        return newTag.id;
      },
      
      updateTag: (id: string, data: Partial<Pick<Tag, 'name' | 'color'>>) => {
        if (data.name) {
          const normalizedName = data.name.trim();
          const existingTag = get().tags.find(
            t => t.id !== id && 
                t.name.toLowerCase() === normalizedName.toLowerCase()
          );
          
          if (existingTag) return;
          data.name = normalizedName;
        }
        
        set((state) => ({
          tags: state.tags.map((tag) =>
            tag.id === id ? { ...tag, ...data } : tag
          ),
        }));
      },
      
      deleteTag: (id: string) => {
        set((state) => ({
          tags: state.tags.filter((tag) => tag.id !== id),
        }));
      },
      
      getTagById: (id: string) => {
        return get().tags.find((tag) => tag.id === id);
      },
      
      getAllTags: () => {
        return [...get().tags]
          .reduce((acc, curr) => {
            const exists = acc.some(t => 
              t.name.toLowerCase() === curr.name.toLowerCase()
            );
            return exists ? acc : [...acc, curr];
          }, [] as Tag[])
          .sort((a, b) => a.name.localeCompare(b.name));
      },
      
      getTagsByIds: (ids: string[]) => {
        const uniqueIds = [...new Set(ids)];
        return uniqueIds
          .map(id => get().tags.find(tag => tag.id === id))
          .filter((tag): tag is Tag => tag !== undefined);
      },
      
      getTagCount: (tagId: string) => {
        const { snippets } = useSnippetStore.getState();
        return snippets.filter(snippet => 
          snippet.tags.includes(tagId)
        ).length;
      },
    }),
    {
      name: 'tag-storage',
    }
  )
);