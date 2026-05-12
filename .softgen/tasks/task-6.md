---
title: Export as PNG & Board Sharing
status: todo
priority: medium
type: feature
tags: [export, sharing]
created_by: agent
created_at: 2026-05-12
position: 6
---

## Notes
Export the visible canvas as a PNG. Share board via URL — anyone with the link can view and collaborate.

## Checklist
- [ ] Add export-as-PNG button to BoardHeader
- [ ] Use html2canvas or canvas API to capture the board area
- [ ] Create ShareDialog component with copyable board URL
- [ ] Handle board slug routing for shared access

## Acceptance
- User can export the board as a PNG file
- User can copy a shareable URL from the board
- Anyone with the URL can view and interact with the board