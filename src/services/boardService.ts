import { supabase } from "@/integrations/supabase/client";

export interface Board {
  id: string;
  name: string;
  slug: string;
  created_at: string;
}

export interface StickyNote {
  id: string;
  board_id: string;
  group_id: string | null;
  content: string;
  color: "yellow" | "blue" | "pink" | "green";
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  created_at: string;
  updated_at: string;
}

export interface Group {
  id: string;
  board_id: string;
  label: string;
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;
  created_at: string;
}

export type StickyNoteColor = "yellow" | "blue" | "pink" | "green";

export async function createBoard(name: string): Promise<Board> {
  const { data, error } = await supabase
    .from("boards")
    .insert({ name })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function getBoardBySlug(slug: string): Promise<Board | null> {
  const { data, error } = await supabase
    .from("boards")
    .select()
    .eq("slug", slug)
    .maybeSingle();

  if (error) throw error;
  return data;
}

export async function getBoardNotes(boardId: string): Promise<StickyNote[]> {
  const { data, error } = await supabase
    .from("sticky_notes")
    .select()
    .eq("board_id", boardId)
    .order("created_at", { ascending: true });

  if (error) throw error;
  return (data ?? []) as StickyNote[];
}

export async function getBoardGroups(boardId: string): Promise<Group[]> {
  const { data, error } = await supabase
    .from("groups")
    .select()
    .eq("board_id", boardId)
    .order("created_at", { ascending: true });

  if (error) throw error;
  return data ?? [];
}

export async function addNote(
  boardId: string,
  color: StickyNoteColor,
  x: number,
  y: number
): Promise<StickyNote> {
  const rotation = (Math.random() - 0.5) * 6;
  const { data, error } = await supabase
    .from("sticky_notes")
    .insert({
      board_id: boardId,
      color,
      x,
      y,
      rotation,
    })
    .select()
    .single();

  if (error) throw error;
  return data as StickyNote;
}

export async function updateNote(
  id: string,
  updates: Partial<Pick<StickyNote, "content" | "x" | "y" | "color" | "group_id" | "rotation">>
): Promise<void> {
  const { error } = await supabase
    .from("sticky_notes")
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq("id", id);

  if (error) throw error;
}

export async function deleteNote(id: string): Promise<void> {
  const { error } = await supabase
    .from("sticky_notes")
    .delete()
    .eq("id", id);

  if (error) throw error;
}

export async function addGroup(
  boardId: string,
  label: string,
  x: number,
  y: number
): Promise<Group> {
  const { data, error } = await supabase
    .from("groups")
    .insert({
      board_id: boardId,
      label,
      x,
      y,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateGroup(
  id: string,
  updates: Partial<Pick<Group, "label" | "x" | "y" | "width" | "height" | "color">>
): Promise<void> {
  const { error } = await supabase
    .from("groups")
    .update(updates)
    .eq("id", id);

  if (error) throw error;
}

export async function deleteGroup(id: string): Promise<void> {
  const { error } = await supabase
    .from("groups")
    .delete()
    .eq("id", id);

  if (error) throw error;
}