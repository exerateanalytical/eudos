import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Bold, Italic, List, ListOrdered, Link, Code } from "lucide-react";
import { useState } from "react";

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  minHeight?: string;
}

export function RichTextEditor({ 
  value, 
  onChange, 
  placeholder = "Start writing...",
  minHeight = "300px"
}: RichTextEditorProps) {
  const [selectionStart, setSelectionStart] = useState(0);
  const [selectionEnd, setSelectionEnd] = useState(0);

  const handleTextareaSelect = (e: React.SyntheticEvent<HTMLTextAreaElement>) => {
    const target = e.target as HTMLTextAreaElement;
    setSelectionStart(target.selectionStart);
    setSelectionEnd(target.selectionEnd);
  };

  const insertMarkdown = (before: string, after: string = "") => {
    const textarea = document.querySelector('textarea') as HTMLTextAreaElement;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = value.substring(start, end);
    
    const newText = 
      value.substring(0, start) +
      before +
      selectedText +
      after +
      value.substring(end);
    
    onChange(newText);
    
    // Set cursor position after insertion
    setTimeout(() => {
      textarea.focus();
      const newCursorPos = start + before.length + selectedText.length;
      textarea.setSelectionRange(newCursorPos, newCursorPos);
    }, 0);
  };

  const formatButtons = [
    { 
      icon: Bold, 
      label: "Bold", 
      action: () => insertMarkdown("**", "**") 
    },
    { 
      icon: Italic, 
      label: "Italic", 
      action: () => insertMarkdown("*", "*") 
    },
    { 
      icon: Code, 
      label: "Code", 
      action: () => insertMarkdown("`", "`") 
    },
    { 
      icon: List, 
      label: "Bullet List", 
      action: () => insertMarkdown("- ", "") 
    },
    { 
      icon: ListOrdered, 
      label: "Numbered List", 
      action: () => insertMarkdown("1. ", "") 
    },
    { 
      icon: Link, 
      label: "Link", 
      action: () => insertMarkdown("[", "](url)") 
    },
  ];

  return (
    <div className="border rounded-lg overflow-hidden">
      {/* Toolbar */}
      <div className="bg-accent/30 border-b p-2 flex gap-1 flex-wrap">
        {formatButtons.map((button) => (
          <Button
            key={button.label}
            variant="ghost"
            size="sm"
            type="button"
            onClick={button.action}
            className="h-8 w-8 p-0"
            title={button.label}
          >
            <button.icon className="h-4 w-4" />
          </Button>
        ))}
      </div>

      {/* Editor Area */}
      <Textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onSelect={handleTextareaSelect}
        placeholder={placeholder}
        className="border-0 resize-none focus-visible:ring-0 focus-visible:ring-offset-0 rounded-none font-mono text-sm"
        style={{ minHeight }}
        rows={15}
      />

      {/* Helper Text */}
      <div className="bg-accent/20 border-t p-2 text-xs text-muted-foreground">
        <span className="font-medium">Markdown supported:</span> **bold**, *italic*, `code`, - lists, [links](url)
      </div>
    </div>
  );
}
