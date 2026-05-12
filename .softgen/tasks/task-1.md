---
title: Database Schema & RLS
status: in_progress
priority: urgent
type: feature
tags: [supabase, backend]
created_by: agent
created_at: 2026-05-12
position: 1
---

## Notes
Core tables: boards, sticky_notes, groups. Boards are shareable via slug. Notes belong to boards and optionally to groups. Real-time subscriptions on notes and groups. RLS: boards are public-read (anyone with URL can view), authenticated users can create/write.

## Checklist
- [ ] Create boards table (id, name, slug, created_by, created_at)
- [ ] Create sticky_notes table (id, board_id, content, color, position_x, position_y, created_by, created_at, updated_at)
- [ ] Create groups table (id, board_id, label, color, position_x, position_y, width, height, created_by, created_at, updated_at)
- [ ] Add RLS policies: public read for boards/notes/groups via slug, authenticated write
- [ ] Enable Realtime on sticky_notes and groups tables
- [ ] Generate Supabase types

## Acceptance
- Tables exist with correct columns and relationships
- RLS allows reading board data via slug without login
- Authenticated users can create/modify their own content