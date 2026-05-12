# BoardWall — Real-Time Collaborative Whiteboard

## Vision
A digital workshop wall where small teams post ideas as sticky notes, drag them around, and cluster them into labeled groups. Think IDEO workshop wall, not corporate tool.

## Design
- Canvas: warm off-white craft paper feel
- `--primary: 14 54% 51%` (terracotta/burnt sienna — marker energy)
- `--background: 40 56% 96%` (warm cream like craft paper)
- `--foreground: 240 27% 14%` (deep warm charcoal)
- `--accent: 35 92% 56%` (amber — warm highlight)
- `--muted: 30 10% 88%` (warm grey)
- `--card: 40 40% 98%` (slightly lighter than background)
- `--destructive: 0 72% 51%` (red for delete actions)
- Headings: Archivo Black (thick marker energy)
- Body: Nunito (rounded, friendly)
- Style: Workshop wall — tactile shadows, slight tilts, craft paper warmth
- Sticky note colors: yellow (#FEF3C7), blue (#DBEAFE), pink (#FCE7F3), green (#D1FAE5)

## Features
- Create boards with shareable URLs
- Add colored sticky notes (yellow, blue, pink, green)
- Drag-and-drop notes on infinite canvas
- Real-time collaboration via Supabase Realtime
- Group notes with labeled containers
- Export board as PNG