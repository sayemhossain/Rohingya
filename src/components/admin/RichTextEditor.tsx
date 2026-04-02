"use client";

import { useRef, useCallback } from "react";
import {
  HiPhotograph,
} from "react-icons/hi";

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export default function RichTextEditor({ value, onChange, placeholder }: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);

  const exec = useCallback((command: string, val?: string) => {
    document.execCommand(command, false, val);
    // Read updated HTML
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  }, [onChange]);

  const handleBold = () => exec("bold");
  const handleItalic = () => exec("italic");
  const handleUnderline = () => exec("underline");

  const handleHeading = () => {
    exec("formatBlock", "<h3>");
  };

  const handleParagraph = () => {
    exec("formatBlock", "<p>");
  };

  const handleUnorderedList = () => exec("insertUnorderedList");
  const handleOrderedList = () => exec("insertOrderedList");

  const handleLink = () => {
    const url = prompt("Enter URL:");
    if (url) exec("createLink", url);
  };

  const handleImage = () => {
    const url = prompt("Enter image URL:");
    if (url) exec("insertImage", url);
  };

  const handleInput = () => {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };

  const btnClass =
    "p-1.5 rounded text-gray-600 hover:bg-gray-200 hover:text-gray-900 transition-colors";

  return (
    <div className="rounded-lg border border-gray-300 overflow-hidden focus-within:border-brand focus-within:ring-1 focus-within:ring-brand">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-0.5 border-b border-gray-200 bg-gray-50 px-2 py-1.5">
        <button type="button" onClick={handleBold} className={btnClass} title="Bold">
          <span className="text-sm font-bold px-0.5">B</span>
        </button>
        <button type="button" onClick={handleItalic} className={btnClass} title="Italic">
          <span className="text-sm font-serif italic font-bold px-0.5">I</span>
        </button>
        <button type="button" onClick={handleUnderline} className={btnClass} title="Underline">
          <span className="text-sm underline font-bold px-0.5">U</span>
        </button>

        <span className="mx-1 h-5 w-px bg-gray-300" />

        <button type="button" onClick={handleHeading} className={btnClass} title="Heading">
          <span className="text-xs font-bold px-0.5">H3</span>
        </button>
        <button type="button" onClick={handleParagraph} className={btnClass} title="Paragraph">
          <span className="text-xs font-bold px-0.5">P</span>
        </button>

        <span className="mx-1 h-5 w-px bg-gray-300" />

        <button type="button" onClick={handleUnorderedList} className={btnClass} title="Bullet List">
          <span className="text-xs font-bold px-0.5">&#8226; List</span>
        </button>
        <button type="button" onClick={handleOrderedList} className={btnClass} title="Numbered List">
          <span className="text-xs font-bold px-0.5">1. List</span>
        </button>

        <span className="mx-1 h-5 w-px bg-gray-300" />

        <button type="button" onClick={handleLink} className={btnClass} title="Insert Link">
          <span className="text-sm font-bold px-0.5">&#128279;</span>
        </button>
        <button type="button" onClick={handleImage} className={btnClass} title="Insert Image">
          <HiPhotograph className="h-4 w-4" />
        </button>
      </div>

      {/* Editable area */}
      <div
        ref={editorRef}
        contentEditable
        suppressContentEditableWarning
        onInput={handleInput}
        onBlur={handleInput}
        dangerouslySetInnerHTML={{ __html: value }}
        className="min-h-[250px] px-3 py-3 text-sm text-gray-800 leading-relaxed focus:outline-none [&>p]:mb-4 [&>h3]:text-lg [&>h3]:font-bold [&>h3]:mb-2 [&>ul]:list-disc [&>ul]:pl-5 [&>ul]:mb-4 [&>ol]:list-decimal [&>ol]:pl-5 [&>ol]:mb-4 [&_a]:text-brand [&_a]:underline [&_img]:max-w-full [&_img]:rounded-lg [&_img]:my-4"
        data-placeholder={placeholder || "Write your content here..."}
        style={{ minHeight: "250px" }}
      />
    </div>
  );
}
