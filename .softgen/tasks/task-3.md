---
title: Board Canvas & Sticky Notes
status: todo
priority: high
type: feature
tags: [frontend, canvas, drag-drop]
created_by: agent
created_at: 2026-05-12
position: 3
---

## Notes
Core whiteboard experience: infinite canvas with draggable sticky notes. Users add notes via toolbar, choose color, type idea. Notes are draggable with pointer events. Each note has a soft shadow and slight rotation for tactile feel.

## Checklist
- [ ] Create board page at /board/[id] with pannable canvas
- [ ] Create StickyNote component with drag support (pointer events)
- [ ] Create Toolbar component (add note, color picker, add group)
- [ ] Create BoardHeader with board name and share button
- [ ] Implement add-note flow: click toolbar → enter text → note appears on canvas
- [ ] Implement drag-and-drop for notes with position persistence
- [ ] Add soft shadows and slight tilt to notes for tactile feel
- [ ] Create landing page at / with "Create Board" CTA

## Acceptance
- User can create a board from the landing page
- User can add colored sticky notes to the canvas
- User can drag notes to reposition them
- Notes have tactile shadows and slight rotation