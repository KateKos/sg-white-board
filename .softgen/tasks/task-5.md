---
title: Group Labels & Grouping
status: todo
priority: high
type: feature
tags: [frontend, groups]
created_by: agent
created_at: 2026-05-12
position: 5
---

## Notes
Users can create labeled groups (e.g., "Easy Wins", "Long-Term") that visually cluster notes. Groups are colored containers that notes can be dragged into. Click a group label to edit it.

## Checklist
- [ ] Create GroupContainer component with label and color
- [ ] Implement "Add Group" flow from toolbar
- [ ] Allow editing group label inline
- [ ] Snap notes into group when dragged over group boundary
- [ ] Render groups as dashed-border containers with label header
- [ ] Persist group changes to Supabase

## Acceptance
- User can create a labeled group on the canvas
- User can edit the group label
- Notes dragged into a group are visually contained
- Group state persists across page refreshes