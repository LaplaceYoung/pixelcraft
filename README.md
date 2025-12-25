# PixelCraft

PixelCraft is a modern, web-based tool designed to convert images into pixel art patterns specifically optimized for bead branding systems (such as Perler, Artkal, and Hama). It allows hobbyists and artists to upload images, adjust parameters, and generate precise bead guides for their physical creations.

![PixelCraft Interface Preview](public/preview.png)

## Features

- **Smart Image Conversion**: Automatically downscales and creates pixel patterns from any uploaded image.
- **Accurate Color Matching**: Uses LAB color space algorithms to find the closest matching bead color for every pixel.
- **Multi-Brand Support**: Built-in palettes for major bead brands:
  - Perler
  - Artkal
  - Hama
- **Customizable Palettes**:
  - Filter by brand.
  - Toggle specific colors on/off based on your inventory.
- **Interactive Editor**:
  - Adjust target width (resolution).
  - Toggle Grid lines for easier counting.
  - Toggle Color Numbers for precise bead placement.
- **Responsive Design**: Works on desktop and mobile devices.
- **Multilingual Support**: Interface available in English and Chinese.

## Tech Stack

- **Core**: [React](https://react.dev/) (via [Vite](https://vitejs.dev/))
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) + `clsx` / `tailwind-merge`
- **State Management**: [Zustand](https://github.com/pmndrs/zustand)
- **Icons**: [Lucide React](https://lucide.dev/)

## Getting Started

### Prerequisites

Ensure you have the following installed on your machine:

- [Node.js](https://nodejs.org/) (Version 18 or higher recommended)
- npm or yarn

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/yourusername/pixelcraft.git
   cd pixelcraft
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

### Running Locally

Start the development server:

```bash
npm run dev
```

Open your browser and navigate to `http://localhost:5173` (or the URL shown in your terminal).

## Project Structure

```bash
pixelcraft/
├── src/
│   ├── components/       # UI Components (Canvas, Panels, Modals)
│   ├── utils/            # Helper functions (Color matching, Image processing)
│   ├── ui/               # Reusable atomic UI elements
│   ├── store.ts          # Global state management (Zustand)
│   ├── types.ts          # TypeScript definitions
│   ├── constants.ts      # Bead color data and configuration
│   └── App.tsx           # Main application entry
├── public/               # Static assets
└── package.json          # Project dependencies and scripts
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
