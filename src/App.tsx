import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/layout/Layout';
import SnippetList from './components/snippets/SnippetList';
import { Auth } from './pages/Auth';
import { useAuthStore } from './store/authStore';
import { useCategoryStore } from './store/categoryStore';
import { useTagStore } from './store/tagStore';
import { useAppStore } from './store/appStore';
import { Loader2 } from 'lucide-react';
import { Toaster } from 'sonner';

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { session, loading } = useAuthStore();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  if (!session) {
    return <Navigate to="/auth" />;
  }

  return <>{children}</>;
}

function App() {
  const { initialize } = useAuthStore();
  const { categories, addCategory } = useCategoryStore();
  const { tags, addTag } = useTagStore();
  const { setSelectedCategory } = useAppStore();

  useEffect(() => {
    initialize();
  }, [initialize]);

  // Add some initial data if empty and not initialized before
  useEffect(() => {
    const hasInitialized = localStorage.getItem('app_initialized');

    if (!hasInitialized) {
      if (categories.length === 0) {
        const codeId = addCategory('Code', null);
        const notesId = addCategory('Notes', null);

        addCategory('JavaScript', codeId);
        addCategory('React', codeId);
        addCategory('CSS', codeId);

        addCategory('Project Ideas', notesId);
        addCategory('Learning Resources', notesId);
      }

      if (tags.length === 0) {
        addTag('important', '#EF4444'); // red
        addTag('reference', '#F59E0B'); // amber
        addTag('tutorial', '#10B981'); // emerald
        addTag('bug', '#EC4899');      // pink
        addTag('idea', '#8B5CF6');     // violet
      }

      localStorage.setItem('app_initialized', 'true');
    }
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/auth" element={<Auth />} />
        <Route
          path="/"
          element={
            <PrivateRoute>
              <Layout onCategorySelect={setSelectedCategory}>
                <SnippetList />
              </Layout>
            </PrivateRoute>
          }
        />
      </Routes>
      <Toaster position="top-right" richColors />
    </BrowserRouter>
  );
}

export default App;
