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
                // Fetch snippets if user is logged in
                const { useSnippetStore } = await import('./snippetStore');
                useSnippetStore.getState().fetchSnippets();
            }

            // Listen for changes
            supabase.auth.onAuthStateChange(async (_event, session) => {
                set({ session, user: session?.user ?? null, loading: false });
                if (session?.user) {
                    const { useSnippetStore } = await import('./snippetStore');
                    useSnippetStore.getState().fetchSnippets();
                }
            });
        } catch (error) {
            console.error('Auth initialization error:', error);
            set({ loading: false });
        }
    },
}));
