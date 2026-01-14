# Cinematic Portfolio

This project uses React, Vite, Framer Motion, and Lenis for a smooth scroll-driven image sequence animation.

## Setup

1. Open this directory in your terminal:
   ```bash
   cd my-portfolio
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

## Structure

- `src/components/ImageSequence.jsx`: Handles the canvas rendering and scroll synchronization.
- `src/components/TextOverlay.jsx`: Manages the text animations.
- `public/sequence/`: Contains the frame-by-frame image sequence.

## Note
The image sequence contains 192 frames. Preloading is implemented, so a loading screen will appear briefly.
