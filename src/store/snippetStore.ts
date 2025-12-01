import { create } from 'zustand';
import { Snippet, SnippetFormData } from '../types';
import { supabase } from '../lib/supabase';

interface SnippetState {
  snippets: Snippet[];
  loading: boolean;
  error: string | null;
  fetchSnippets: () => Promise<void>;
  addSnippet: (data: SnippetFormData) => Promise<void>;
  updateSnippet: (id: string, data: Partial<SnippetFormData>) => Promise<void>;
  deleteSnippet: (id: string) => Promise<void>;
  togglePinSnippet: (id: string) => Promise<void>;
  getSnippetById: (id: string) => Snippet | undefined;
  getSnippetsByCategory: (categoryId: string | null) => Snippet[];
  getSnippetsByTag: (tagId: string) => Snippet[];
  getSnippetsBySearch: (query: string) => Snippet[];
  getPinnedSnippets: () => Snippet[];
}

export const useSnippetStore = create<SnippetState>((set, get) => ({
  snippets: [],
  loading: false,
  error: null,

  fetchSnippets: async () => {
    set({ loading: true, error: null });
    try {
      const { data, error } = await supabase
        .from('snippets')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Transform data to match Snippet interface (dates come as strings from JSON)
      const snippets: Snippet[] = (data || []).map(item => ({
        ...item,
        createdAt: new Date(item.created_at).getTime(),
        updatedAt: new Date(item.updated_at).getTime(),
        categoryId: item.category_id,
        isPinned: item.is_pinned
      }));

      set({ snippets, loading: false });
    } catch (error: any) {
      console.error('Error fetching snippets:', error);
      set({ error: error.message, loading: false });
    }
  },

  addSnippet: async (data: SnippetFormData) => {
    set({ loading: true, error: null });
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const newSnippet = {
        user_id: user.id,
        title: data.title,
        content: data.content,
        type: data.type,
        category_id: data.categoryId,
        tags: data.tags,
        language: data.language,
        is_pinned: false
      };

      const { data: insertedData, error } = await supabase
        .from('snippets')
        .insert(newSnippet)
        .select()
        .single();

      if (error) throw error;

      const createdSnippet: Snippet = {
        ...insertedData,
        createdAt: new Date(insertedData.created_at).getTime(),
        updatedAt: new Date(insertedData.updated_at).getTime(),
        categoryId: insertedData.category_id,
        isPinned: insertedData.is_pinned
      };

      set((state) => ({
        snippets: [createdSnippet, ...state.snippets],
        loading: false
      }));
    } catch (error: any) {
      console.error('Error adding snippet:', error);
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  updateSnippet: async (id: string, data: Partial<SnippetFormData>) => {
    set({ loading: true, error: null });
    try {
      const updates: any = {
        updated_at: new Date().toISOString(),
      };

      if (data.title !== undefined) updates.title = data.title;
      if (data.content !== undefined) updates.content = data.content;
      if (data.type !== undefined) updates.type = data.type;
      if (data.categoryId !== undefined) updates.category_id = data.categoryId;
      if (data.tags !== undefined) updates.tags = data.tags;
      if (data.language !== undefined) updates.language = data.language;

      const { data: updatedData, error } = await supabase
        .from('snippets')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      const updatedSnippet: Snippet = {
        ...updatedData,
        createdAt: new Date(updatedData.created_at).getTime(),
        updatedAt: new Date(updatedData.updated_at).getTime(),
        categoryId: updatedData.category_id,
        isPinned: updatedData.is_pinned
      };

      set((state) => ({
        snippets: state.snippets.map((snippet) =>
          snippet.id === id ? updatedSnippet : snippet
        ),
        loading: false
      }));
    } catch (error: any) {
      console.error('Error updating snippet:', error);
      set({ error: error.message, loading: false });
    }
  },

  deleteSnippet: async (id: string) => {
    set({ loading: true, error: null });
    try {
      const { error } = await supabase
        .from('snippets')
        .delete()
        .eq('id', id);

      if (error) throw error;

      set((state) => ({
        snippets: state.snippets.filter((snippet) => snippet.id !== id),
        loading: false
      }));
    } catch (error: any) {
      console.error('Error deleting snippet:', error);
      set({ error: error.message, loading: false });
    }
  },

  togglePinSnippet: async (id: string) => {
    const snippet = get().snippets.find(s => s.id === id);
    if (!snippet) return;

    try {
      const { data: updatedData, error } = await supabase
        .from('snippets')
        .update({ is_pinned: !snippet.isPinned })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      set((state) => ({
        snippets: state.snippets.map((s) =>
          s.id === id ? { ...s, isPinned: updatedData.is_pinned } : s
        ),
      }));
    } catch (error: any) {
      console.error('Error toggling pin:', error);
      set({ error: error.message });
    }
  },

  getSnippetById: (id: string) => {
    return get().snippets.find((snippet) => snippet.id === id);
  },

  getSnippetsByCategory: (categoryId: string | null) => {
    return get().snippets.filter((snippet) => snippet.categoryId === categoryId);
  },

  getSnippetsByTag: (tagId: string) => {
    return get().snippets.filter((snippet) =>
      snippet.tags.includes(tagId)
    );
  },

  getSnippetsBySearch: (query: string) => {
    const lowercaseQuery = query.toLowerCase();
    return get().snippets.filter((snippet) =>
      snippet.title.toLowerCase().includes(lowercaseQuery) ||
      snippet.content.toLowerCase().includes(lowercaseQuery)
    );
  },

  getPinnedSnippets: () => {
    return get().snippets.filter((snippet) => snippet.isPinned);
  },
}));