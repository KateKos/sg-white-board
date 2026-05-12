import React, { useRef, useCallback, useState } from "react";
import { X } from "lucide-react";
import type { Group } from "@/services/boardService";
import { updateGroup, deleteGroup } from "@/services/boardService";

interface GroupContainerProps {
  group: Group;
  onDragEnd: (id: string, x: number, y: number) => void;
  onUpdate: (id: string, updates: Partial<Group>) => void;
  onDelete: (id: string) => void;
}

export function GroupContainer({ group, onDragEnd, onUpdate, onDelete }: GroupContainerProps) {
  const [isEditingLabel, setIsEditingLabel] = useState(false);
  const [labelText, setLabelText] = useState(group.label);
  const dragRef = useRef<{ startX: number; startY: number; groupX: number; groupY: number } | null>(null);
  const ref = useRef<HTMLDivElement>(null);

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if (isEditingLabel) return;
      if ((e.target as HTMLElement).closest(".group-label-edit")) return;
      e.preventDefault();

      dragRef.current = {
        startX: e.clientX,
        startY: e.clientY,
        groupX: group.x,
        groupY: group.y,
      };

      const handleMouseMove = (moveEvent: MouseEvent) => {
        if (!dragRef.current) return;
        const dx = moveEvent.clientX - dragRef.current.startX;
        const dy = moveEvent.clientY - dragRef.current.startY;
        const newX = dragRef.current.groupX + dx;
        const newY = dragRef.current.groupY + dy;
        if (ref.current) {
          ref.current.style.left = `${newX}px`;
          ref.current.style.top = `${newY}px`;
        }
      };

      const handleMouseUp = (upEvent: MouseEvent) => {
        if (!dragRef.current) return;
        const dx = upEvent.clientX - dragRef.current.startX;
        const dy = upEvent.clientY - dragRef.current.startY;
        const newX = dragRef.current.groupX + dx;
        const newY = dragRef.current.groupY + dy;
        dragRef.current = null;
        onDragEnd(group.id, newX, newY);
        updateGroup(group.id, { x: newX, y: newY }).catch(console.error);
      };

      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp, { once: true });
    },
    [isEditingLabel, group.id, group.x, group.y, onDragEnd]
  );

  const handleLabelDoubleClick = useCallback(() => {
    setIsEditingLabel(true);
    setLabelText(group.label);
  }, [group.label]);

  const handleLabelBlur = useCallback(() => {
    setIsEditingLabel(false);
    if (labelText !== group.label) {
      onUpdate(group.id, { label: labelText });
      updateGroup(group.id, { label: labelText }).catch(console.error);
    }
  }, [labelText, group.label, group.id, onUpdate]);

  const handleDelete = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      onDelete(group.id);
      deleteGroup(group.id).catch(console.error);
    },
    [group.id, onDelete]
  );

  return (
    <div
      ref={ref}
      className="absolute border-2 border-dashed border-foreground/20 rounded-xl bg-foreground/[0.03] z-0"
      style={{
        left: group.x,
        top: group.y,
        width: group.width,
        height: group.height,
      }}
      onMouseDown={handleMouseDown}
    >
      <div className="group-label-edit absolute -top-7 left-3 flex items-center gap-2">
        {isEditingLabel ? (
          <input
            value={labelText}
            onChange={(e) => setLabelText(e.target.value)}
            onBlur={handleLabelBlur}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleLabelBlur();
              if (e.key === "Escape") {
                setLabelText(group.label);
                setIsEditingLabel(false);
              }
            }}
            autoFocus
            className="bg-white/90 border border-foreground/20 rounded px-2 py-0.5 text-sm font-display text-foreground outline-none focus:ring-1 focus:ring-primary"
            placeholder="Group label..."
          />
        ) : (
          <span
            onDoubleClick={handleLabelDoubleClick}
            className="text-sm font-display text-foreground/60 cursor-pointer hover:text-foreground/80 transition-colors select-none"
          >
            {group.label || "Unnamed group"}
          </span>
        )}
        <button
          onClick={handleDelete}
          className="w-5 h-5 flex items-center justify-center rounded-full opacity-0 group-hover:opacity-100 hover:bg-destructive/10 transition-opacity text-destructive"
          aria-label="Delete group"
        >
          <X size={12} />
        </button>
      </div>
    </div>
  );
}