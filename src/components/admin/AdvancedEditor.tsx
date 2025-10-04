import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import TextAlign from '@tiptap/extension-text-align';
import { Table } from '@tiptap/extension-table';
import { TableRow } from '@tiptap/extension-table-row';
import { TableCell } from '@tiptap/extension-table-cell';
import { TableHeader } from '@tiptap/extension-table-header';
import { TextStyle } from '@tiptap/extension-text-style';
import { Color } from '@tiptap/extension-color';
import { FontFamily } from '@tiptap/extension-font-family';
import { Highlight } from '@tiptap/extension-highlight';
import { Underline } from '@tiptap/extension-underline';
import { Button } from "@/components/ui/button";
import { 
  Bold, 
  Italic, 
  List, 
  ListOrdered, 
  LinkIcon, 
  Image as ImageIcon,
  Heading1,
  Heading2,
  Heading3,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Undo,
  Redo,
  Code,
  Table as TableIcon,
  Highlighter,
  UnderlineIcon,
  Palette,
  Type
} from "lucide-react";
import { useState } from "react";
import { MediaLibraryDialog } from "./MediaLibraryDialog";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

interface AdvancedEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  minHeight?: string;
}

export function AdvancedEditor({ 
  value, 
  onChange, 
  placeholder = "Start writing...",
  minHeight = "400px"
}: AdvancedEditorProps) {
  const [showMediaLibrary, setShowMediaLibrary] = useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Image.configure({
        HTMLAttributes: {
          class: 'max-w-full h-auto rounded-lg my-4',
        },
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-primary underline cursor-pointer',
        },
      }),
      Placeholder.configure({
        placeholder,
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      Table.configure({
        resizable: true,
        HTMLAttributes: {
          class: 'border-collapse table-auto w-full my-4',
        },
      }),
      TableRow.configure({
        HTMLAttributes: {
          class: 'border border-border',
        },
      }),
      TableHeader.configure({
        HTMLAttributes: {
          class: 'border border-border bg-muted font-bold p-2',
        },
      }),
      TableCell.configure({
        HTMLAttributes: {
          class: 'border border-border p-2',
        },
      }),
      TextStyle,
      Color,
      FontFamily,
      Highlight.configure({
        multicolor: true,
      }),
    ],
    content: value,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  const addLink = () => {
    const url = prompt('Enter URL:');
    if (url && editor) {
      editor.chain().focus().setLink({ href: url }).run();
    }
  };

  const insertImage = (imageUrl: string) => {
    if (editor) {
      editor.chain().focus().setImage({ src: imageUrl }).run();
    }
  };

  const addTable = () => {
    if (editor) {
      editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run();
    }
  };

  if (!editor) {
    return null;
  }

  const textColors = [
    '#000000', '#374151', '#6B7280', '#9CA3AF',
    '#EF4444', '#F59E0B', '#10B981', '#3B82F6',
    '#8B5CF6', '#EC4899', '#14B8A6', '#F97316'
  ];

  const highlightColors = [
    '#FEF3C7', '#FEE2E2', '#DBEAFE', '#D1FAE5',
    '#E0E7FF', '#FCE7F3', '#F3E8FF', '#FED7AA'
  ];

  return (
    <div className="border rounded-lg overflow-hidden bg-background">
      {/* Toolbar */}
      <div className="bg-muted/30 border-b p-2 flex gap-1 flex-wrap sticky top-0 z-10">
        {/* Text Formatting */}
        <div className="flex gap-1 pr-2 border-r">
          <Button
            variant="ghost"
            size="sm"
            type="button"
            onClick={() => editor.chain().focus().toggleBold().run()}
            className={editor.isActive('bold') ? 'bg-accent' : ''}
            title="Bold"
          >
            <Bold className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            type="button"
            onClick={() => editor.chain().focus().toggleItalic().run()}
            className={editor.isActive('italic') ? 'bg-accent' : ''}
            title="Italic"
          >
            <Italic className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            type="button"
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            className={editor.isActive('underline') ? 'bg-accent' : ''}
            title="Underline"
          >
            <UnderlineIcon className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            type="button"
            onClick={() => editor.chain().focus().toggleCode().run()}
            className={editor.isActive('code') ? 'bg-accent' : ''}
            title="Code"
          >
            <Code className="h-4 w-4" />
          </Button>
        </div>

        {/* Colors */}
        <div className="flex gap-1 pr-2 border-r">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="sm" type="button" title="Text Color">
                <Palette className="h-4 w-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-48">
              <div className="grid grid-cols-4 gap-2">
                {textColors.map((color) => (
                  <button
                    key={color}
                    className="w-8 h-8 rounded border-2 border-border hover:scale-110 transition-transform"
                    style={{ backgroundColor: color }}
                    onClick={() => editor.chain().focus().setColor(color).run()}
                    title={color}
                  />
                ))}
              </div>
            </PopoverContent>
          </Popover>

          <Popover>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="sm" type="button" title="Highlight">
                <Highlighter className="h-4 w-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-48">
              <div className="grid grid-cols-4 gap-2">
                {highlightColors.map((color) => (
                  <button
                    key={color}
                    className="w-8 h-8 rounded border-2 border-border hover:scale-110 transition-transform"
                    style={{ backgroundColor: color }}
                    onClick={() => editor.chain().focus().toggleHighlight({ color }).run()}
                    title={color}
                  />
                ))}
              </div>
            </PopoverContent>
          </Popover>
        </div>

        {/* Headings */}
        <div className="flex gap-1 pr-2 border-r">
          <Button
            variant="ghost"
            size="sm"
            type="button"
            onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
            className={editor.isActive('heading', { level: 1 }) ? 'bg-accent' : ''}
            title="Heading 1"
          >
            <Heading1 className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            type="button"
            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
            className={editor.isActive('heading', { level: 2 }) ? 'bg-accent' : ''}
            title="Heading 2"
          >
            <Heading2 className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            type="button"
            onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
            className={editor.isActive('heading', { level: 3 }) ? 'bg-accent' : ''}
            title="Heading 3"
          >
            <Heading3 className="h-4 w-4" />
          </Button>
        </div>

        {/* Lists */}
        <div className="flex gap-1 pr-2 border-r">
          <Button
            variant="ghost"
            size="sm"
            type="button"
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            className={editor.isActive('bulletList') ? 'bg-accent' : ''}
            title="Bullet List"
          >
            <List className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            type="button"
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            className={editor.isActive('orderedList') ? 'bg-accent' : ''}
            title="Numbered List"
          >
            <ListOrdered className="h-4 w-4" />
          </Button>
        </div>

        {/* Alignment */}
        <div className="flex gap-1 pr-2 border-r">
          <Button
            variant="ghost"
            size="sm"
            type="button"
            onClick={() => editor.chain().focus().setTextAlign('left').run()}
            className={editor.isActive({ textAlign: 'left' }) ? 'bg-accent' : ''}
            title="Align Left"
          >
            <AlignLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            type="button"
            onClick={() => editor.chain().focus().setTextAlign('center').run()}
            className={editor.isActive({ textAlign: 'center' }) ? 'bg-accent' : ''}
            title="Align Center"
          >
            <AlignCenter className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            type="button"
            onClick={() => editor.chain().focus().setTextAlign('right').run()}
            className={editor.isActive({ textAlign: 'right' }) ? 'bg-accent' : ''}
            title="Align Right"
          >
            <AlignRight className="h-4 w-4" />
          </Button>
        </div>

        {/* Media & Tables */}
        <div className="flex gap-1 pr-2 border-r">
          <Button
            variant="ghost"
            size="sm"
            type="button"
            onClick={addLink}
            className={editor.isActive('link') ? 'bg-accent' : ''}
            title="Add Link"
          >
            <LinkIcon className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            type="button"
            onClick={() => setShowMediaLibrary(true)}
            title="Insert Image"
          >
            <ImageIcon className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            type="button"
            onClick={addTable}
            title="Insert Table"
          >
            <TableIcon className="h-4 w-4" />
          </Button>
        </div>

        {/* History */}
        <div className="flex gap-1">
          <Button
            variant="ghost"
            size="sm"
            type="button"
            onClick={() => editor.chain().focus().undo().run()}
            disabled={!editor.can().undo()}
            title="Undo"
          >
            <Undo className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            type="button"
            onClick={() => editor.chain().focus().redo().run()}
            disabled={!editor.can().redo()}
            title="Redo"
          >
            <Redo className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Editor Area */}
      <EditorContent 
        editor={editor} 
        className="prose prose-sm max-w-none p-6 focus:outline-none min-h-[400px]"
        style={{ minHeight }}
      />

      {/* Media Library Dialog */}
      <MediaLibraryDialog
        open={showMediaLibrary}
        onOpenChange={setShowMediaLibrary}
        onSelectImage={insertImage}
      />
    </div>
  );
}
