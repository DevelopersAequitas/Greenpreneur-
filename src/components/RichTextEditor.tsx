import React, { useRef, useEffect } from 'react';
import { Bold, Italic, Underline, List, ListOrdered, Image, AlignLeft, AlignCenter, AlignRight } from 'lucide-react';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export default function RichTextEditor({ value, onChange, placeholder }: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);

  // Sync state to editor div content, but only when it differs (to avoid losing cursor selection)
  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== value) {
      editorRef.current.innerHTML = value || '';
    }
  }, [value]);

  const handleInput = () => {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };

  const executeCommand = (command: string, value: string = '') => {
    document.execCommand(command, false, value);
    handleInput();
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const formData = new FormData();
      formData.append('image', file);

      try {
        const token = localStorage.getItem('adminToken');
        const isProduction = window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1';
        const apiPrefix = isProduction ? '' : `http://${window.location.hostname}:5000`;

        const res = await fetch(`${apiPrefix}/api/blogs/upload-inline`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`
          },
          body: formData
        });
        const result = await res.json();
        if (result.success) {
          executeCommand('insertImage', `${apiPrefix}${result.url}`);
        } else {
          alert('Failed to upload image: ' + result.message);
        }
      } catch (err) {
        console.error(err);
        alert('Image upload failed.');
      }
    }
  };

  return (
    <div className="border border-gray-300 rounded-lg overflow-hidden flex flex-col bg-white">
      {/* Toolbar */}
      <div className="flex flex-wrap gap-1 p-2 bg-gray-50 border-b border-gray-200">
        <button
          type="button"
          onClick={() => executeCommand('bold')}
          className="p-2 text-gray-700 hover:bg-gray-200 rounded transition-colors cursor-pointer"
          title="Bold"
        >
          <Bold size={16} />
        </button>
        <button
          type="button"
          onClick={() => executeCommand('italic')}
          className="p-2 text-gray-700 hover:bg-gray-200 rounded transition-colors cursor-pointer"
          title="Italic"
        >
          <Italic size={16} />
        </button>
        <button
          type="button"
          onClick={() => executeCommand('underline')}
          className="p-2 text-gray-700 hover:bg-gray-200 rounded transition-colors cursor-pointer"
          title="Underline"
        >
          <Underline size={16} />
        </button>
        <div className="w-px h-6 bg-gray-300 mx-1 self-center"></div>
        <button
          type="button"
          onClick={() => executeCommand('formatBlock', '<h2>')}
          className="p-2 text-gray-750 hover:bg-gray-200 rounded font-bold text-xs transition-colors cursor-pointer"
          title="Heading H2"
        >
          H2
        </button>
        <button
          type="button"
          onClick={() => executeCommand('formatBlock', '<h3>')}
          className="p-2 text-gray-750 hover:bg-gray-200 rounded font-bold text-xs transition-colors cursor-pointer"
          title="Heading H3"
        >
          H3
        </button>
        <button
          type="button"
          onClick={() => executeCommand('formatBlock', '<p>')}
          className="p-2 text-gray-750 hover:bg-gray-200 rounded text-xs font-semibold transition-colors cursor-pointer"
          title="Paragraph"
        >
          Normal
        </button>
        <div className="w-px h-6 bg-gray-300 mx-1 self-center"></div>
        <button
          type="button"
          onClick={() => executeCommand('insertUnorderedList')}
          className="p-2 text-gray-700 hover:bg-gray-200 rounded transition-colors cursor-pointer"
          title="Bullet List"
        >
          <List size={16} />
        </button>
        <button
          type="button"
          onClick={() => executeCommand('insertOrderedList')}
          className="p-2 text-gray-700 hover:bg-gray-200 rounded transition-colors cursor-pointer"
          title="Numbered List"
        >
          <ListOrdered size={16} />
        </button>
        <div className="w-px h-6 bg-gray-300 mx-1 self-center"></div>
        <button
          type="button"
          onClick={() => executeCommand('justifyLeft')}
          className="p-2 text-gray-700 hover:bg-gray-200 rounded transition-colors cursor-pointer"
          title="Align Left"
        >
          <AlignLeft size={16} />
        </button>
        <button
          type="button"
          onClick={() => executeCommand('justifyCenter')}
          className="p-2 text-gray-700 hover:bg-gray-200 rounded transition-colors cursor-pointer"
          title="Align Center"
        >
          <AlignCenter size={16} />
        </button>
        <button
          type="button"
          onClick={() => executeCommand('justifyRight')}
          className="p-2 text-gray-700 hover:bg-gray-200 rounded transition-colors cursor-pointer"
          title="Align Right"
        >
          <AlignRight size={16} />
        </button>
        <div className="w-px h-6 bg-gray-300 mx-1 self-center"></div>
        <label
          className="p-2 text-gray-700 hover:bg-gray-200 rounded transition-colors cursor-pointer flex items-center justify-center"
          title="Insert Image"
        >
          <Image size={16} />
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
          />
        </label>
      </div>

      {/* Editor editable div */}
      <div
        ref={editorRef}
        contentEditable
        onInput={handleInput}
        className="p-4 min-h-[300px] outline-none prose max-w-none text-gray-850 text-sm overflow-y-auto"
        {...({ placeholder } as any)}
        style={{ minHeight: '300px' }}
      ></div>
    </div>
  );
}
