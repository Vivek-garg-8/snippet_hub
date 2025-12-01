export type SnippetType = 'text' | 'code' | 'markdown' | 'link';

export interface Tag {
  id: string;
  name: string;
  color: string;
}

export interface Category {
  id: string;
  name: string;
  parentId: string | null;
  children: Category[];
}

export interface Snippet {
  id: string;
  title: string;
  content: string;
  type: SnippetType;
  categoryId: string | null;
  tags: string[];
  createdAt: number;
  updatedAt: number;
  isPinned: boolean;
  language?: string;
}

export interface AppState {
  darkMode: boolean;
  sidebarOpen: boolean;
  viewMode: 'grid' | 'list';
}

export interface SnippetFormData {
  title: string;
  content: string;
  type: SnippetType;
  categoryId: string | null;
  tags: string[];
  language?: string;
}