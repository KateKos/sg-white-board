import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import { getBoardBySlug, type Board } from "@/services/boardService";
import { BoardCanvas } from "@/components/whiteboard/BoardCanvas";

export default function BoardPage() {
  const router = useRouter();
  const { slug } = router.query;
  const [board, setBoard] = useState<Board | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!slug || typeof slug !== "string") return;

    let mounted = true;

    getBoardBySlug(slug)
      .then((data) => {
        if (!mounted) return;
        if (!data) {
          setError("Board not found. It may have been deleted or the link is incorrect.");
        } else {
          setBoard(data);
        }
      })
      .catch((err) => {
        if (mounted) setError("Failed to load board. Please try again.");
        console.error(err);
      });

    return () => { mounted = false; };
  }, [slug]);

  if (error) {
    return (
      <div className="h-screen flex items-center justify-center bg-background">
        <div className="text-center max-w-md px-6">
          <h1 className="text-2xl font-display text-foreground mb-3">Board Not Found</h1>
          <p className="text-muted-foreground mb-6">{error}</p>
          <button
            onClick={() => router.push("/")}
            className="bg-primary text-primary-foreground px-6 py-2.5 rounded-md font-semibold hover:bg-primary/90 transition-colors"
          >
            Create a New Board
          </button>
        </div>
      </div>
    );
  }

  if (!board) {
    return (
      <div className="h-screen flex items-center justify-center bg-background">
        <div className="w-8 h-8 border-3 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>{board.name} — BoardWall</title>
        <meta name="description" content={`Collaborative whiteboard: ${board.name}`} />
      </Head>
      <BoardCanvas
        boardId={board.id}
        boardName={board.name}
        boardSlug={board.slug}
        onBoardNameChange={(name) => setBoard((prev) => (prev ? { ...prev, name } : prev))}
      />
    </>
  );
}