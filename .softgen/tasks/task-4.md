---
title: Real-Time Collaboration
status: todo
priority: high
type: feature
tags: [supabase, realtime]
created_by: agent
created_at: 2026-05-12
position: 4
---

## Notes
Use Supabase Realtime to broadcast note and group changes. When a collaborator moves a note, adds one, or creates a group, all connected users see it instantly.

## Checklist
- [ ] Subscribe to sticky_notes changes on board page mount
- [ ] Subscribe to groups changes on board page mount
- [ ] Handle INSERT/UPDATE/DELETE events for notes and groups
- [ ] Show collaborator cursors or presence indicators (optional)
- [ ] Debounce position updates during drag to avoid flicker

## Acceptance
- Two browser tabs see each other's changes in real-time
- Moving a note in one tab updates it in the other within 1 second
- Adding/deleting notes syncs across tabs