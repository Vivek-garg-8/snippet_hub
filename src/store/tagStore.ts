import { create } from 'zustand';
import { Tag } from '../types';
import { supabase } from '../lib/supabase';
import { useSnippetStore } from './snippetStore';

interface TagState {
  tags: Tag[];
  loading: boolean;
  fetchTags: () => Promise<void>;
  addTag: (name: string, color: string) => Promise<string | null>;
  updateTag: (id: string, data: Partial<Pick<Tag, 'name' | 'color'>>) => Promise<void>;
  deleteTag: (id: string) => Promise<void>;
  getTagById: (id: string) => Tag | undefined;
  getAllTags: () => Tag[];
  getTagsByIds: (ids: string[]) => Tag[];
  getTagCount: (tagId: string) => number;
  reset: () => void;
}

export const useTagStore = create<TagState>((set, get) => ({
  tags: [],
  loading: false,

  fetchTags: async () => {
    set({ loading: true });
    try {
      const { data, error } = await supabase
        .from('tags')
        .select('*')
        .order('name');

      if (error) throw error;

      set({ tags: data || [] });
    } catch (error) {
      console.error('Error fetching tags:', error);
    } finally {
      set({ loading: false });
    }
  },

  addTag: async (name: string, color: string) => {
    const normalizedName = name.trim();
    const existingTag = get().tags.find(
      t => t.name.toLowerCase() === normalizedName.toLowerCase()
    );

    if (existingTag) {
      return existingTag.id;
    }

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No user found');

      const { data, error } = await supabase
        .from('tags')
        .insert([{
          name: normalizedName,
          color,
          user_id: user.id
        }])
        .select()
        .single();

      if (error) throw error;

      set((state) => ({
        tags: [...state.tags, data],
      }));

      return data.id;
    } catch (error) {
      console.error('Error adding tag:', error);
      return null;
    }
  },

  updateTag: async (id: string, data: Partial<Pick<Tag, 'name' | 'color'>>) => {
    if (data.name) {
      const normalizedName = data.name.trim();
      const existingTag = get().tags.find(
        t => t.id !== id &&
          t.name.toLowerCase() === normalizedName.toLowerCase()
      );

      if (existingTag) return;
      data.name = normalizedName;
    }

    try {
      const { error } = await supabase
        .from('tags')
        .update(data)
        .eq('id', id);

      if (error) throw error;

      set((state) => ({
        tags: state.tags.map((tag) =>
          tag.id === id ? { ...tag, ...data } : tag
        ),
      }));
    } catch (error) {
      console.error('Error updating tag:', error);
    }
  },

  deleteTag: async (id: string) => {
    try {
      const { error } = await supabase
        .from('tags')
        .delete()
        .eq('id', id);

      if (error) throw error;

      set((state) => ({
        tags: state.tags.filter((tag) => tag.id !== id),
      }));
    } catch (error) {
      console.error('Error deleting tag:', error);
    }
  },

  getTagById: (id: string) => {
    return get().tags.find((tag) => tag.id === id);
  },

  getAllTags: () => {
    return [...get().tags].sort((a, b) => a.name.localeCompare(b.name));
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

  reset: () => {
    set({ tags: [], loading: false });
  },
}));