import React, { useState, useRef, useCallback } from "react";
import { X } from "lucide-react";
import type { StickyNote as StickyNoteType, StickyNoteColor } from "@/services/boardService";
import { updateNote, deleteNote } from "@/services/boardService";

const COLOR_MAP: Record<StickyNoteColor, string> = {
  yellow: "bg-sticky-yellow",
  blue: "bg-sticky-blue",
  pink: "bg-sticky-pink",
  green: "bg-sticky-green",
};

const COLOR_BORDER: Record<StickyNoteColor, string> = {
  yellow: "border-yellow-200",
  blue: "border-blue-200",
  pink: "border-pink-200",
  green: "border-green-200",
};

interface StickyNoteProps {
  note: StickyNoteType;
  onDragEnd: (id: string, x: number, y: number) => void;
  onUpdate: (id: string, updates: Partial<StickyNoteType>) => void;
  onDelete: (id: string) => void;
  isDragging: boolean;
  onDragStart: (id: string) => void;
  onDragEndClear: () => void;
}

export function StickyNote({
  note,
  onDragEnd,
  onUpdate,
  onDelete,
  isDragging,
  onDragStart,
  onDragEndClear,
}: StickyNoteProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(note.content);
  const dragRef = useRef<{ startX: number; startY: number; noteX: number; noteY: number } | null>(null);
  const noteRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if (isEditing) return;
      e.preventDefault();
      onDragStart(note.id);
      dragRef.current = {
        startX: e.clientX,
        startY: e.clientY,
        noteX: note.x,
        noteY: note.y,
      };

      const handleMouseMove = (moveEvent: MouseEvent) => {
        if (!dragRef.current) return;
        const dx = moveEvent.clientX - dragRef.current.startX;
        const dy = moveEvent.clientY - dragRef.current.startY;
        const newX = dragRef.current.noteX + dx;
        const newY = dragRef.current.noteY + dy;

        if (noteRef.current) {
          noteRef.current.style.left = `${newX}px`;
          noteRef.current.style.top = `${newY}px`;
        }
      };

      const handleMouseUp = (upEvent: MouseEvent) => {
        if (!dragRef.current) return;
        const dx = upEvent.clientX - dragRef.current.startX;
        const dy = upEvent.clientY - dragRef.current.startY;
        const newX = dragRef.current.noteX + dx;
        const newY = dragRef.current.noteY + dy;

        dragRef.current = null;
        onDragEndClear();
        onDragEnd(note.id, newX, newY);

        updateNote(note.id, { x: newX, y: newY }).catch(console.error);
      };

      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp, { once: true });
    },
    [isEditing, note.id, note.x, note.y, onDragStart, onDragEndClear, onDragEnd]
  );

  const handleDoubleClick = useCallback(() => {
    setIsEditing(true);
    setEditContent(note.content);
  }, [note.content]);

  const handleBlur = useCallback(() => {
    setIsEditing(false);
    if (editContent !== note.content) {
      onUpdate(note.id, { content: editContent });
      updateNote(note.id, { content: editContent }).catch(console.error);
    }
  }, [editContent, note.content, note.id, onUpdate]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        handleBlur();
      }
      if (e.key === "Escape") {
        setEditContent(note.content);
        setIsEditing(false);
      }
    },
    [handleBlur, note.content]
  );

  const handleDelete = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      onDelete(note.id);
      deleteNote(note.id).catch(console.error);
    },
    [note.id, onDelete]
  );

  return (
    <div
      ref={noteRef}
      className={`absolute select-none ${COLOR_MAP[note.color]} ${COLOR_BORDER[note.color]} border rounded-sm shadow-md hover:shadow-lg transition-shadow cursor-grab active:cursor-grabbing ${isDragging ? "z-50 opacity-90" : "z-10"}`}
      style={{
        left: note.x,
        top: note.y,
        width: note.width,
        minHeight: note.height,
        transform: `rotate(${note.rotation}deg)`,
        fontFamily: "'Nunito', system-ui, sans-serif",
      }}
      onMouseDown={handleMouseDown}
      onDoubleClick={handleDoubleClick}
    >
      <div className="flex justify-between items-start p-1">
        <div className="w-3 h-3 rounded-full opacity-40" style={{ backgroundColor: "rgba(0,0,0,0.15)" }} />
        <button
          onClick={handleDelete}
          className="w-5 h-5 flex items-center justify-center rounded-full opacity-0 hover:opacity-100 hover:bg-black/10 transition-opacity text-gray-600"
          aria-label="Delete note"
        >
          <X size={12} />
        </button>
      </div>
      {isEditing ? (
        <textarea
          value={editContent}
          onChange={(e) => setEditContent(e.target.value)}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          autoFocus
          className="w-full h-24 bg-transparent border-none outline-none resize-none text-sm text-gray-800 px-3 pb-3 font-medium"
          placeholder="Type your idea..."
        />
      ) : (
        <div className="px-3 pb-3 text-sm text-gray-800 whitespace-pre-wrap break-words font-medium min-h-[60px]">
          {note.content || (
            <span className="italic text-gray-400 opacity-60">Double-click to edit</span>
          )}
        </div>
      )}
    </div>
  );
}