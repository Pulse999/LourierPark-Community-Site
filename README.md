# LourierPark — Community Website

A React + TypeScript + Vite foundation for the LourierPark community website.

## Requirements
- Node.js 20.19+ or 22.12+
- npm

## Run locally
```bash
npm install
npm run dev
```
Open the local URL printed by Vite (normally http://localhost:5173).

## Production build
```bash
npm run build
npm run preview
```

## Project structure
```text
src/
  components/   Shared navigation, footer and page sections
  data/         Editable demonstration content
  pages/        Route-level pages
  styles/       Global design system and responsive styles
  App.tsx       Application routes
  main.tsx      Application entry point
```

## Important content note
Photography currently comes from generic stock-image URLs and is illustrative only. It must not be represented as actual LourierPark photography. The map preview is deliberately a design placeholder: no boundary, street pins or geographic claims are shown until verified data is available.

## Next development steps
1. Review the visual foundation together.
2. Refine the homepage and navigation.
3. Build the directory, facility and community pages.
4. Add verified map data and public submission workflows.
5. Add a secure administrator area and database.

No public accounts or visitor login are part of the product.
