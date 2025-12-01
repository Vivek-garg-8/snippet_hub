import React from 'react';
import { FileText, Plus } from 'lucide-react';
import { useState } from 'react';
import SnippetFormModal from '../snippets/SnippetFormModal';

interface EmptyStateProps {
  message?: string;
}

const EmptyState: React.FC<EmptyStateProps> = ({ 
  message = "No snippets yet"
}) => {
  const [showForm, setShowForm] = useState(false);
  
  return (
    <div className="flex flex-col items-center justify-center h-64 py-12">
      <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-full mb-4">
        <FileText size={48} className="text-blue-500" />
      </div>
      <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">
        {message}
      </h3>
      <p className="text-gray-500 dark:text-gray-400 text-center max-w-md mb-6">
        Create your first snippet to start organizing your code, text, and more.
      </p>
      <button
        onClick={() => setShowForm(true)}
        className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-150"
      >
        <Plus size={20} className="mr-2" />
        Create your first snippet
      </button>
      
      {showForm && <SnippetFormModal onClose={() => setShowForm(false)} />}
    </div>
  );
};

export default EmptyState;