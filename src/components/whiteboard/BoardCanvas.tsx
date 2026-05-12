import React, { useState, useEffect, useCallback, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import {
  getBoardNotes,
  getBoardGroups,
  addNote,
  addGroup,
  updateNote,
  updateGroup as updateGroupService,
  type StickyNote as StickyNoteType,
  type Group,
  type StickyNoteColor,
} from "@/services/boardService";
import { StickyNote } from "./StickyNote";
import { GroupContainer } from "./GroupContainer";
import { Toolbar } from "./Toolbar";
import { toPng } from "html-to-image";

interface BoardCanvasProps {
  boardId: string;
  boardName: string;
  boardSlug: string;
  onBoardNameChange: (name: string) => void;
}

export function BoardCanvas({
  boardId,
  boardName,
  boardSlug,
  onBoardNameChange,
}: BoardCanvasProps) {
  const [notes, setNotes] = useState<StickyNoteType[]>([]);
  const [groups, setGroups] = useState<Group[]>([]);
  const [draggingNoteId, setDraggingNoteId] = useState<string | null>(null);
  const [collaboratorCount, setCollaboratorCount] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const canvasRef = useRef<HTMLDivElement>(null);
  const [canvasOffset, setCanvasOffset] = useState({ x: 0, y: 0 });
  const isPanning = useRef(false);
  const panStart = useRef({ x: 0, y: 0, offsetX: 0, offsetY: 0 });

  useEffect(() => {
    let mounted = true;

    async function loadData() {
      try {
        const [loadedNotes, loadedGroups] = await Promise.all([
          getBoardNotes(boardId),
          getBoardGroups(boardId),
        ]);
        if (mounted) {
          setNotes(loadedNotes);
          setGroups(loadedGroups);
          setIsLoading(false);
        }
      } catch (err) {
        console.error("Failed to load board data:", err);
        if (mounted) setIsLoading(false);
      }
    }

    loadData();
    return () => { mounted = false; };
  }, [boardId]);

  useEffect(() => {
    const notesChannel = supabase
      .channel(`board-notes-${boardId}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "sticky_notes", filter: `board_id=eq.${boardId}` },
        (payload) => {
          if (payload.eventType === "INSERT") {
            setNotes((prev) => {
              if (prev.some((n) => n.id === payload.new.id)) return prev;
              return [...prev, payload.new as StickyNoteType];
            });
          } else if (payload.eventType === "UPDATE") {
            setNotes((prev) =>
              prev.map((n) => (n.id === payload.new.id ? (payload.new as StickyNoteType) : n))
            );
          } else if (payload.eventType === "DELETE") {
            setNotes((prev) => prev.filter((n) => n.id !== payload.old.id));
          }
        }
      )
      .subscribe();

    const groupsChannel = supabase
      .channel(`board-groups-${boardId}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "groups", filter: `board_id=eq.${boardId}` },
        (payload) => {
          if (payload.eventType === "INSERT") {
            setGroups((prev) => {
              if (prev.some((g) => g.id === payload.new.id)) return prev;
              return [...prev, payload.new as Group];
            });
          } else if (payload.eventType === "UPDATE") {
            setGroups((prev) =>
              prev.map((g) => (g.id === payload.new.id ? (payload.new as Group) : g))
            );
          } else if (payload.eventType === "DELETE") {
            setGroups((prev) => prev.filter((g) => g.id !== payload.old.id));
          }
        }
      )
      .subscribe();

    const presenceChannel = supabase.channel(`board-presence-${boardId}`, {
      config: { presence: { key: `user-${Math.random().toString(36).slice(2, 8)}` } },
    });

    presenceChannel.on("presence", { event: "sync" }, () => {
      const state = presenceChannel.presenceState();
      setCollaboratorCount(Object.keys(state).length);
    });

    presenceChannel.subscribe(async (status) => {
      if (status === "SUBSCRIBED") {
        await presenceChannel.track({ online_at: new Date().toISOString() });
      }
    });

    return () => {
      supabase.removeChannel(notesChannel);
      supabase.removeChannel(groupsChannel);
      supabase.removeChannel(presenceChannel);
    };
  }, [boardId]);

  const handleAddNote = useCallback(
    async (color: StickyNoteColor) => {
      const x = -canvasOffset.x + Math.random() * 400 + 100;
      const y = -canvasOffset.y + 80 + Math.random() * 200 + 100;
      try {
        const newNote = await addNote(boardId, color, Math.round(x), Math.round(y));
        setNotes((prev) => [...prev, newNote]);
      } catch (err) {
        console.error("Failed to add note:", err);
      }
    },
    [boardId, canvasOffset.x, canvasOffset.y]
  );

  const handleAddGroup = useCallback(async () => {
    const x = -canvasOffset.x + Math.random() * 300 + 100;
    const y = -canvasOffset.y + 120 + Math.random() * 200;
    const label = "New Group";
    try {
      const newGroup = await addGroup(boardId, label, Math.round(x), Math.round(y));
      setGroups((prev) => [...prev, newGroup]);
    } catch (err) {
      console.error("Failed to add group:", err);
    }
  }, [boardId, canvasOffset.x, canvasOffset.y]);

  const handleNoteDragEnd = useCallback((id: string, x: number, y: number) => {
    setNotes((prev) => prev.map((n) => (n.id === id ? { ...n, x, y } : n)));
  }, []);

  const handleNoteUpdate = useCallback((id: string, updates: Partial<StickyNoteType>) => {
    setNotes((prev) => prev.map((n) => (n.id === id ? { ...n, ...updates } : n)));
  }, []);

  const handleNoteDelete = useCallback((id: string) => {
    setNotes((prev) => prev.filter((n) => n.id !== id));
  }, []);

  const handleGroupDragEnd = useCallback((id: string, x: number, y: number) => {
    setGroups((prev) => prev.map((g) => (g.id === id ? { ...g, x, y } : g)));
  }, []);

  const handleGroupUpdate = useCallback((id: string, updates: Partial<Group>) => {
    setGroups((prev) => prev.map((g) => (g.id === id ? { ...g, ...updates } : g)));
  }, []);

  const handleGroupDelete = useCallback((id: string) => {
    setGroups((prev) => prev.filter((g) => g.id !== id));
  }, []);

  const handleExport = useCallback(async () => {
    if (!canvasRef.current) return;
    try {
      const dataUrl = await toPng(canvasRef.current, {
        backgroundColor: "#FAF7F2",
        pixelRatio: 2,
      });
      const link = document.createElement("a");
      link.download = `${boardName.replace(/\s+/g, "-").toLowerCase()}-board.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error("Export failed:", err);
    }
  }, [boardName]);

  const handleBoardNameChange = useCallback(
    async (name: string) => {
      onBoardNameChange(name);
      const { error } = await supabase.from("boards").update({ name }).eq("id", boardId);
      if (error) console.error("Failed to update board name:", error);
    },
    [boardId, onBoardNameChange]
  );

  const handleCanvasMouseDown = useCallback((e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest("[data-note]") || (e.target as HTMLElement).closest("[data-group]")) return;
    if (e.button === 1 || (e.button === 0 && e.altKey)) {
      e.preventDefault();
      isPanning.current = true;
      panStart.current = { x: e.clientX, y: e.clientY, offsetX: canvasOffset.x, offsetY: canvasOffset.y };
    }
  }, [canvasOffset.x, canvasOffset.y]);

  const handleCanvasMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isPanning.current) return;
    const dx = e.clientX - panStart.current.x;
    const dy = e.clientY - panStart.current.y;
    setCanvasOffset({ x: panStart.current.offsetX + dx, y: panStart.current.offsetY + dy });
  }, []);

  const handleCanvasMouseUp = useCallback(() => {
    isPanning.current = false;
  }, []);

  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      setCanvasOffset((prev) => ({
        x: prev.x - e.deltaX,
        y: prev.y - e.deltaY,
      }));
    };
    const el = canvasRef.current?.parentElement;
    if (el) {
      el.addEventListener("wheel", handleWheel, { passive: false });
      return () => el.removeEventListener("wheel", handleWheel);
    }
  }, []);

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-3 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-muted-foreground font-body">Loading board...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-background">
      <Toolbar
        boardName={boardName}
        onBoardNameChange={handleBoardNameChange}
        onAddNote={handleAddNote}
        onAddGroup={handleAddGroup}
        onExport={handleExport}
        collaboratorCount={collaboratorCount}
      />
      <div
        className="flex-1 overflow-hidden relative"
        onMouseDown={handleCanvasMouseDown}
        onMouseMove={handleCanvasMouseMove}
        onMouseUp={handleCanvasMouseUp}
        onMouseLeave={handleCanvasMouseUp}
        style={{ cursor: isPanning.current ? "grabbing" : "default" }}
      >
        <div
          ref={canvasRef}
          className="absolute"
          style={{
            transform: `translate(${canvasOffset.x}px, ${canvasOffset.y}px)`,
            width: "10000px",
            height: "10000px",
            backgroundImage: "radial-gradient(circle, rgba(0,0,0,0.05) 1px, transparent 1px)",
            backgroundSize: "24px 24px",
          }}
        >
          {groups.map((group) => (
            <div key={group.id} data-group>
              <GroupContainer
                group={group}
                onDragEnd={handleGroupDragEnd}
                onUpdate={handleGroupUpdate}
                onDelete={handleGroupDelete}
              />
            </div>
          ))}
          {notes.map((note) => (
            <div key={note.id} data-note>
              <StickyNote
                note={note}
                onDragEnd={handleNoteDragEnd}
                onUpdate={handleNoteUpdate}
                onDelete={handleNoteDelete}
                isDragging={draggingNoteId === note.id}
                onDragStart={setDraggingNoteId}
                onDragEndClear={() => setDraggingNoteId(null)}
              />
            </div>
          ))}
        </div>

        <div className="absolute bottom-4 left-4 bg-background/80 backdrop-blur-sm border border-border rounded-lg px-3 py-1.5 text-xs text-muted-foreground">
          Scroll to pan · Alt+drag to move canvas
        </div>

        <div className="absolute bottom-4 right-4 flex gap-2">
          <button
            onClick={() => {
              navigator.clipboard.writeText(`${window.location.origin}/board/${boardSlug}`);
            }}
            className="bg-primary text-primary-foreground px-4 py-2 rounded-md text-sm font-semibold hover:bg-primary/90 transition-colors shadow-lg"
          >
            Copy Share Link
          </button>
        </div>
      </div>
    </div>
  );
}