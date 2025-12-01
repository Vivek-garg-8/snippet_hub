import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { X, Code, FileText, Link as LinkIcon, FileDown as FileMarkdown } from 'lucide-react';
import { toast } from 'sonner';
import { useSnippetStore } from '../../store/snippetStore';
import { useCategoryStore } from '../../store/categoryStore';
import { useTagStore } from '../../store/tagStore';
import { SnippetType, SnippetFormData } from '../../types';
import CodeEditor from '../editor/CodeEditor';
import MarkdownPreview from '../editor/MarkdownPreview';

interface SnippetFormModalProps {
  snippetId?: string;
  onClose: () => void;
}

const LANGUAGES = [
  { value: 'javascript', label: 'JavaScript' },
  { value: 'typescript', label: 'TypeScript' },
  { value: 'html', label: 'HTML' },
  { value: 'css', label: 'CSS' },
  { value: 'python', label: 'Python' },
  { value: 'java', label: 'Java' },
  { value: 'csharp', label: 'C#' },
  { value: 'php', label: 'PHP' },
];

const SnippetFormModal: React.FC<SnippetFormModalProps> = ({
  snippetId,
  onClose
}) => {
  const { addSnippet, updateSnippet, getSnippetById } = useSnippetStore();
  const { getAllCategories } = useCategoryStore();
  const { getAllTags, addTag } = useTagStore();

  const snippet = snippetId ? getSnippetById(snippetId) : undefined;
  const isEditing = !!snippet;

  const [formData, setFormData] = useState<SnippetFormData>({
    title: snippet?.title || '',
    content: snippet?.content || '',
    type: snippet?.type || 'text',
    categoryId: snippet?.categoryId || null,
    tags: snippet?.tags || [],
    language: snippet?.language || 'javascript',
  });

  const [showPreview, setShowPreview] = useState(false);
  const [newTag, setNewTag] = useState('');

  const categories = getAllCategories();
  const allTags = getAllTags();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCodeChange = (value: string) => {
    setFormData((prev) => ({ ...prev, content: value }));
  };

  const handleTypeChange = (type: SnippetType) => {
    setFormData((prev) => ({ ...prev, type }));
  };

  const handleTagToggle = (tagId: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.includes(tagId)
        ? prev.tags.filter((id) => id !== tagId)
        : [...prev.tags, tagId],
    }));
  };

  const handleAddTag = () => {
    if (!newTag.trim()) return;

    // Random color from a predefined set
    const colors = ['#EF4444', '#F59E0B', '#10B981', '#3B82F6', '#8B5CF6', '#EC4899'];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];

    const tagId = addTag(newTag, randomColor);
    handleTagToggle(tagId);
    setNewTag('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      toast.error('Please enter a title');
      return;
    }

    if (!formData.content.trim()) {
      toast.error('Please enter content');
      return;
    }

    try {
      if (isEditing && snippetId) {
        updateSnippet(snippetId, formData);
        toast.success('Snippet updated successfully');
      } else {
        addSnippet(formData);
        toast.success('Snippet created successfully');
      }
      onClose();
    } catch (error) {
      toast.error('An error occurred');
      console.error(error);
    }
  };

  return createPortal(
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] flex flex-col">
        <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold">
            {isEditing ? 'Edit Snippet' : 'New Snippet'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4">
            <div className="md:col-span-2">
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                placeholder="Enter snippet title"
              />
            </div>

            <div>
              <label htmlFor="categoryId" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Category
              </label>
              <select
                id="categoryId"
                name="categoryId"
                value={formData.categoryId || ''}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              >
                <option value="">Uncategorized</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="px-4 pb-2">
            <div className="flex space-x-2 mb-2">
              <button
                type="button"
                onClick={() => handleTypeChange('text')}
                className={`flex items-center px-3 py-1 rounded text-sm ${formData.type === 'text'
                  ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                  : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
                  }`}
              >
                <FileText size={16} className="mr-1" /> Text
              </button>
              <button
                type="button"
                onClick={() => handleTypeChange('code')}
                className={`flex items-center px-3 py-1 rounded text-sm ${formData.type === 'code'
                  ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                  : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
                  }`}
              >
                <Code size={16} className="mr-1" /> Code
              </button>
              <button
                type="button"
                onClick={() => handleTypeChange('markdown')}
                className={`flex items-center px-3 py-1 rounded text-sm ${formData.type === 'markdown'
                  ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                  : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
                  }`}
              >
                <FileMarkdown size={16} className="mr-1" /> Markdown
              </button>
              <button
                type="button"
                onClick={() => handleTypeChange('link')}
                className={`flex items-center px-3 py-1 rounded text-sm ${formData.type === 'link'
                  ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                  : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
                  }`}
              >
                <LinkIcon size={16} className="mr-1" /> Link
              </button>
            </div>

            {formData.type === 'code' && (
              <div className="mb-2">
                <select
                  name="language"
                  value={formData.language}
                  onChange={handleChange}
                  className="px-3 py-1 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white text-sm"
                >
                  {LANGUAGES.map((lang) => (
                    <option key={lang.value} value={lang.value}>
                      {lang.label}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {formData.type === 'markdown' && (
              <div className="mb-2 flex justify-end">
                <button
                  type="button"
                  onClick={() => setShowPreview(!showPreview)}
                  className="px-3 py-1 bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200 rounded text-sm"
                >
                  {showPreview ? 'Edit' : 'Preview'}
                </button>
              </div>
            )}
          </div>

          <div className="flex-1 px-4 overflow-hidden">
            {formData.type === 'code' ? (
              <div className="h-64 border border-gray-300 dark:border-gray-700 rounded-md overflow-hidden">
                <CodeEditor
                  value={formData.content}
                  onChange={handleCodeChange}
                  language={formData.language || 'javascript'}
                />
              </div>
            ) : formData.type === 'markdown' && showPreview ? (
              <div className="h-64 border border-gray-300 dark:border-gray-700 rounded-md p-4 overflow-auto bg-white dark:bg-gray-900">
                <MarkdownPreview content={formData.content} />
              </div>
            ) : (
              <textarea
                name="content"
                value={formData.content}
                onChange={handleChange}
                className="w-full h-64 px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white font-mono"
                placeholder="Enter content..."
              />
            )}
          </div>

          <div className="p-4 border-t border-gray-200 dark:border-gray-700">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Tags
            </label>
            <div className="flex flex-wrap gap-2 mb-2">
              {allTags.map((tag) => (
                <button
                  key={tag.id}
                  type="button"
                  onClick={() => handleTagToggle(tag.id)}
                  className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${formData.tags.includes(tag.id)
                    ? 'bg-opacity-100'
                    : 'bg-opacity-30'
                    }`}
                  style={{
                    backgroundColor: formData.tags.includes(tag.id)
                      ? tag.color
                      : `${tag.color}30`,
                    color: formData.tags.includes(tag.id)
                      ? 'white'
                      : tag.color
                  }}
                >
                  {tag.name}
                </button>
              ))}

              {allTags.length === 0 && (
                <span className="text-sm text-gray-500 dark:text-gray-400 italic">
                  No tags yet. Create one below.
                </span>
              )}
            </div>

            <div className="flex">
              <input
                type="text"
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                placeholder="New tag"
                className="flex-1 px-3 py-1 border border-gray-300 dark:border-gray-700 rounded-l-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white text-sm"
              />
              <button
                type="button"
                onClick={handleAddTag}
                className="px-3 py-1 bg-blue-600 text-white rounded-r-md text-sm"
              >
                Add
              </button>
            </div>
          </div>

          <div className="flex justify-end space-x-2 p-4 border-t border-gray-200 dark:border-gray-700">
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
    </div>,
    document.body
  );
};

export default SnippetFormModal;