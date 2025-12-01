import React, { useEffect, useRef } from 'react';
import { EditorView, basicSetup } from 'codemirror';
import { javascript } from '@codemirror/lang-javascript';
import { markdown } from '@codemirror/lang-markdown';
import { LanguageSupport } from '@codemirror/language';

interface CodeEditorProps {
  value: string;
  onChange: (value: string) => void;
  language?: string;
}

const CodeEditor: React.FC<CodeEditorProps> = ({ 
  value, 
  onChange,
  language = 'javascript'
}) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const viewRef = useRef<EditorView | null>(null);
  
  useEffect(() => {
    if (editorRef.current && !viewRef.current) {
      const getLanguageExtension = (): LanguageSupport => {
        switch (language) {
          case 'javascript':
          case 'typescript':
            return javascript();
          case 'markdown':
            return markdown();
          default:
            return javascript();
        }
      };
      
      const updateListener = EditorView.updateListener.of((update) => {
        if (update.docChanged) {
          onChange(update.state.doc.toString());
        }
      });
      
      const view = new EditorView({
        doc: value,
        extensions: [
          basicSetup,
          getLanguageExtension(),
          updateListener,
          EditorView.theme({
            "&": {
              height: "100%",
              fontSize: "14px"
            },
            "&.cm-editor.cm-focused": {
              outline: "none"
            },
            ".cm-scroller": {
              fontFamily: "monospace"
            }
          }),
        ],
        parent: editorRef.current,
      });
      
      viewRef.current = view;
      
      return () => {
        view.destroy();
        viewRef.current = null;
      };
    }
  }, []);
  
  // Update editor content when value prop changes
  useEffect(() => {
    const view = viewRef.current;
    
    if (view && value !== view.state.doc.toString()) {
      view.dispatch({
        changes: {
          from: 0,
          to: view.state.doc.length,
          insert: value
        }
      });
    }
  }, [value]);
  
  return <div ref={editorRef} className="h-full" />;
};

export default CodeEditor;