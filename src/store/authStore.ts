import { create } from 'zustand';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';

interface AuthState {
    user: User | null;
    session: Session | null;
    loading: boolean;
    setUser: (user: User | null) => void;
    setSession: (session: Session | null) => void;
    initialize: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
    user: null,
    session: null,
    loading: true,
    setUser: (user) => set({ user }),
    setSession: (session) => set({ session }),
    initialize: async () => {
        try {
            // Get initial session
            const { data: { session } } = await supabase.auth.getSession();
            set({ session, user: session?.user ?? null, loading: false });

            if (session?.user) {
                // Fetch snippets and tags if user is logged in
                const { useSnippetStore } = await import('./snippetStore');
                const { useTagStore } = await import('./tagStore');

                // Fetch data in parallel
                await Promise.all([
                    useSnippetStore.getState().fetchSnippets(),
                    useTagStore.getState().fetchTags()
                ]);
            } else {
                // Clear data on logout
                try {
                    const { useSnippetStore } = await import('./snippetStore');
                    const { useTagStore } = await import('./tagStore');

                    useSnippetStore.getState().reset?.(); // Assuming snippetStore might have reset
                    useTagStore.getState().reset();
                } catch (error) {
                    console.error('Error resetting stores:', error);
                }
            }

            // Listen for changes
            supabase.auth.onAuthStateChange(async (_event, session) => {
                set({ session, user: session?.user ?? null, loading: false });

                if (session?.user) {
                    const { useSnippetStore } = await import('./snippetStore');
                    const { useTagStore } = await import('./tagStore');

                    await Promise.all([
                        useSnippetStore.getState().fetchSnippets(),
                        useTagStore.getState().fetchTags()
                    ]);
                } else {
                    try {
                        const { useSnippetStore } = await import('./snippetStore');
                        const { useTagStore } = await import('./tagStore');

                        useSnippetStore.getState().reset?.();
                        useTagStore.getState().reset();
                    } catch (error) {
                        console.error('Error resetting stores:', error);
                    }
                }
            });
        } catch (error) {
            console.error('Auth initialization error:', error);
            set({ loading: false });
        }
    },
}));
