import { format } from 'date-fns';

export function generateId(): string {
  return Math.random().toString(36).substring(2, 15) + 
         Math.random().toString(36).substring(2, 15);
}

export function formatDate(timestamp: number): string {
  return format(new Date(timestamp), 'MMM d, yyyy');
}

export function formatDateTime(timestamp: number): string {
  return format(new Date(timestamp), 'MMM d, yyyy h:mm a');
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
}

export function getLanguageFromType(type: string): string {
  switch (type) {
    case 'javascript':
    case 'js':
      return 'javascript';
    case 'typescript':
    case 'ts':
      return 'typescript';
    case 'html':
      return 'html';
    case 'css':
      return 'css';
    case 'markdown':
    case 'md':
      return 'markdown';
    case 'json':
      return 'json';
    case 'python':
    case 'py':
      return 'python';
    default:
      return type || 'plaintext';
  }
}

export function getSnippetPreview(content: string, maxLength: number = 100): string {
  // Remove markdown and code formatting
  const cleanContent = content
    .replace(/```[\s\S]*?```/g, '[code block]')
    .replace(/`([^`]+)`/g, '$1')
    .replace(/#{1,6} (.+)/g, '$1')
    .replace(/\*\*(.+)\*\*/g, '$1')
    .replace(/\*(.+)\*/g, '$1')
    .replace(/\[(.+)\]\(.+\)/g, '$1')
    .trim();
    
  return truncateText(cleanContent, maxLength);
}