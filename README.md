# Website Template - React TypeScript

A modern, responsive website template built with React, TypeScript, Vite, and Tailwind CSS.

## Features

- ⚡️ **Fast Development** - Powered by Vite for lightning-fast HMR
- 🎨 **Modern UI** - Beautiful, responsive design with Tailwind CSS
- 📱 **Mobile First** - Fully responsive across all devices
- 🛠️ **TypeScript** - Type-safe development experience
- 🧭 **React Router** - Client-side routing included
- 🎯 **Component-Based** - Reusable, modular components
- ✨ **Production Ready** - Optimized build configuration

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Open your browser and navigate to `http://localhost:5173`

### Build for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

### Preview Production Build

```bash
npm run preview
```

## Project Structure

```
├── src/
│   ├── components/     # Reusable components
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   ├── Hero.tsx
│   │   └── FeatureCard.tsx
│   ├── pages/         # Page components
│   │   ├── Home.tsx
│   │   ├── About.tsx
│   │   └── Contact.tsx
│   ├── App.tsx        # Main app component
│   ├── main.tsx       # Entry point
│   └── index.css      # Global styles
├── public/            # Static assets
├── index.html         # HTML template
└── package.json       # Dependencies
```

## Customization

### Colors

Edit the `tailwind.config.js` file to customize the color scheme. The primary color is defined in the `colors.primary` object.

### Components

All components are in the `src/components/` directory. Feel free to modify or create new components as needed.

### Pages

Pages are in the `src/pages/` directory. Add new routes in `App.tsx` and create corresponding page components.

## Technologies Used

- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool
- **Tailwind CSS** - Utility-first CSS framework
- **React Router** - Client-side routing

## License

MIT

