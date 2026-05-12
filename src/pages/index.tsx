import React, { useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import Head from "next/head";
import { createBoard, getBoardBySlug } from "@/services/boardService";

export default function HomePage() {
  const router = useRouter();
  const [boardName, setBoardName] = useState("");
  const [joinSlug, setJoinSlug] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [isJoining, setIsJoining] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!boardName.trim()) return;
    setIsCreating(true);
    setError(null);
    try {
      const board = await createBoard(boardName.trim());
      router.push(`/board/${board.slug}`);
    } catch (err) {
      console.error(err);
      setError("Failed to create board. Please try again.");
      setIsCreating(false);
    }
  };

  const handleJoin = async (e: React.FormEvent) => {
    e.preventDefault();
    const slug = joinSlug.trim();
    if (!slug) return;
    setIsJoining(true);
    setError(null);
    try {
      const board = await getBoardBySlug(slug);
      if (board) {
        router.push(`/board/${board.slug}`);
      } else {
        setError("Board not found. Check the link and try again.");
        setIsJoining(false);
      }
    } catch (err) {
      console.error(err);
      setError("Failed to find board. Please try again.");
      setIsJoining(false);
    }
  };

  return (
    <>
      <Head>
        <title>BoardWall — Real-Time Collaborative Whiteboard</title>
        <meta name="description" content="Post ideas as sticky notes, drag them around, and cluster them with your team in real-time." />
      </Head>

      <div className="min-h-screen bg-background flex flex-col">
        <header className="border-b border-border">
          <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-primary rounded-md flex items-center justify-center">
                <span className="text-primary-foreground font-display text-sm font-bold">B</span>
              </div>
              <h1 className="text-xl font-display text-foreground">BoardWall</h1>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              Real-time collaboration
            </div>
          </div>
        </header>

        <main className="flex-1 flex items-center justify-center px-6">
          <div className="max-w-2xl w-full">
            <div className="text-center mb-12">
              <div className="flex justify-center gap-2 mb-6">
                <div className="w-12 h-12 rounded-sm bg-note-yellow shadow-md rotate-[-3deg]" />
                <div className="w-12 h-12 rounded-sm bg-note-blue shadow-md rotate-[2deg] translate-y-1" />
                <div className="w-12 h-12 rounded-sm bg-note-pink shadow-md rotate-[-1deg]" />
                <div className="w-12 h-12 rounded-sm bg-note-green shadow-md rotate-[3deg] translate-y-0.5" />
              </div>
              <h2 className="text-4xl md:text-5xl font-display text-foreground mb-4 leading-tight">
                Your team&rsquo;s ideas,<br />one wall.
              </h2>
              <p className="text-lg text-muted-foreground max-w-md mx-auto">
                Post ideas as sticky notes, drag them around, and cluster them with your team in real-time.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
                <h3 className="text-lg font-display text-foreground mb-1">Start a Board</h3>
                <p className="text-sm text-muted-foreground mb-4">Create a fresh workspace for your team</p>
                <form onSubmit={handleCreate} className="space-y-3">
                  <input
                    type="text"
                    value={boardName}
                    onChange={(e) => setBoardName(e.target.value)}
                    placeholder="Board name..."
                    className="w-full px-4 py-2.5 bg-background border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 font-body"
                  />
                  <button
                    type="submit"
                    disabled={isCreating || !boardName.trim()}
                    className="w-full bg-primary text-primary-foreground px-4 py-2.5 rounded-lg font-semibold hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isCreating ? "Creating..." : "Create Board"}
                  </button>
                </form>
              </div>

              <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
                <h3 className="text-lg font-display text-foreground mb-1">Join a Board</h3>
                <p className="text-sm text-muted-foreground mb-4">Enter a board code or paste a shared link</p>
                <form onSubmit={handleJoin} className="space-y-3">
                  <input
                    type="text"
                    value={joinSlug}
                    onChange={(e) => setJoinSlug(e.target.value)}
                    placeholder="Board code (e.g. k9x2m4)..."
                    className="w-full px-4 py-2.5 bg-background border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 font-body"
                  />
                  <button
                    type="submit"
                    disabled={isJoining || !joinSlug.trim()}
                    className="w-full bg-accent text-accent-foreground px-4 py-2.5 rounded-lg font-semibold hover:bg-accent/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isJoining ? "Joining..." : "Join Board"}
                  </button>
                </form>
              </div>
            </div>

            {error && (
              <div className="mt-4 text-center text-sm text-destructive">{error}</div>
            )}

            <div className="mt-10 text-center text-xs text-muted-foreground space-y-1">
              <p>No sign-up required · Share a link and start collaborating</p>
            </div>
          </div>
        </main>

        <footer className="border-t border-border py-6">
          <div className="max-w-5xl mx-auto px-6 text-center text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} BoardWall · Built for teams who think visually
          </div>
        </footer>
      </div>
    </>
  );
}