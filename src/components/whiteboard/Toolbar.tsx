import React from "react";
import { Plus, Download, Users, Tag } from "lucide-react";
import type { StickyNoteColor } from "@/services/boardService";

const COLOR_OPTIONS: { color: StickyNoteColor; label: string; bg: string }[] = [
  { color: "yellow", label: "Yellow", bg: "bg-sticky-yellow" },
  { color: "blue", label: "Blue", bg: "bg-sticky-blue" },
  { color: "pink", label: "Pink", bg: "bg-sticky-pink" },
  { color: "green", label: "Green", bg: "bg-sticky-green" },
];

interface ToolbarProps {
  boardName: string;
  onBoardNameChange: (name: string) => void;
  onAddNote: (color: StickyNoteColor) => void;
  onAddGroup: () => void;
  onExport: () => void;
  collaboratorCount: number;
}

export function Toolbar({
  boardName,
  onBoardNameChange,
  onAddNote,
  onAddGroup,
  onExport,
  collaboratorCount,
}: ToolbarProps) {
  const [isEditingName, setIsEditingName] = React.useState(false);
  const [nameDraft, setNameDraft] = React.useState(boardName);

  return (
    <div className="fixed top-0 left-0 right-0 z-[100] bg-background/80 backdrop-blur-md border-b border-border">
      <div className="flex items-center justify-between px-4 h-14">
        <div className="flex items-center gap-4">
          {isEditingName ? (
            <input
              value={nameDraft}
              onChange={(e) => setNameDraft(e.target.value)}
              onBlur={() => {
                setIsEditingName(false);
                if (nameDraft.trim()) onBoardNameChange(nameDraft.trim());
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  setIsEditingName(false);
                  if (nameDraft.trim()) onBoardNameChange(nameDraft.trim());
                }
              }}
              autoFocus
              className="text-lg font-display bg-transparent border-b-2 border-primary outline-none px-1"
            />
          ) : (
            <h1
              onClick={() => {
                setNameDraft(boardName);
                setIsEditingName(true);
              }}
              className="text-lg font-display cursor-pointer hover:text-primary transition-colors"
            >
              {boardName}
            </h1>
          )}
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 mr-2">
            {COLOR_OPTIONS.map((opt) => (
              <button
                key={opt.color}
                onClick={() => onAddNote(opt.color)}
                className={`w-8 h-8 ${opt.bg} border border-black/10 rounded-sm shadow-sm hover:shadow-md transition-all hover:scale-110 active:scale-95`}
                title={`Add ${opt.label} note`}
                aria-label={`Add ${opt.label} note`}
              />
            ))}
          </div>

          <button
            onClick={onAddGroup}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-secondary text-secondary-foreground rounded-md text-sm font-semibold hover:bg-secondary/80 transition-colors"
            title="Add group"
          >
            <Tag size={14} />
            <span className="hidden sm:inline">Group</span>
          </button>

          <button
            onClick={onExport}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-primary text-primary-foreground rounded-md text-sm font-semibold hover:bg-primary/90 transition-colors"
            title="Export as PNG"
          >
            <Download size={14} />
            <span className="hidden sm:inline">Export</span>
          </button>

          <div className="flex items-center gap-1 text-muted-foreground text-sm ml-2">
            <Users size={14} />
            <span>{collaboratorCount}</span>
          </div>
        </div>
      </div>
    </div>
  );
}