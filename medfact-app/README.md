# MedFact Web Application

A modern, responsive web-based medical assistant application that provides users with symptom analysis, disease information, and health guidance through an interactive question-and-answer interface.

## Features

- **Glassmorphism Design**: Modern liquid glass aesthetic with backdrop blur effects
- **Interactive Background Effects**: Animated threads and galaxy effects
- **Symptom Checker**: Step-by-step guided symptom analysis
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **TypeScript**: Full type safety throughout the application
- **Authentication**: User accounts for personalized health tracking

## Tech Stack

- **React 19** with TypeScript
- **Tailwind CSS** for styling with custom glassmorphism utilities
- **Framer Motion** for animations
- **Lucide React** for consistent iconography
- **React Router** for navigation
- **Canvas API** for background effects

## Project Structure

```
src/
├── components/
│   ├── ui/                    # Reusable UI components (GlassCard, etc.)
│   ├── layout/                # Layout components (Header, Footer, etc.)
│   └── background-effects/    # Animated background components
├── pages/                     # Page components
├── contexts/                  # React Context providers
├── data/                      # Mock datasets and data structures
├── utils/                     # Utility functions
└── types/                     # TypeScript type definitions
```

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository
2. Navigate to the project directory:
   ```bash
   cd medfact-app
   ```
3. Install dependencies:
   ```bash
   npm install
   ```

### Development

Start the development server:
```bash
npm start
```

The application will open at [http://localhost:3000](http://localhost:3000).

### Building

Create a production build:
```bash
npm run build
```

### Testing

Run the test suite:
```bash
npm test
```

## Custom Glassmorphism Classes

The project includes custom Tailwind CSS utilities for glassmorphism effects:

- `.glass-card` - Default glass card with backdrop blur
- `.glass-card-dark` - Dark variant for dark backgrounds
- `.glass-card-elevated` - Enhanced shadow and blur
- `.glass-card-subtle` - Subtle glass effect

## Background Effects

The application features two custom background effect components:

- **ThreadsEffect**: Animated flowing lines (used on home page)
- **GalaxyEffect**: Interactive star/particle field (used on authenticated pages)

These are currently mock implementations that can be replaced with the actual @react-bits libraries when available.

## Requirements Addressed

This setup addresses the following requirements:
- **8.5**: Lucide-React icons consistently throughout the interface
- **9.1**: Threads effect background animation
- **9.2**: Galaxy effect background animation

## Next Steps

1. Implement core data structures and mock datasets
2. Create the symptom checker wizard component
3. Build authentication system
4. Add responsive design optimizations
5. Implement property-based testing

## License

This project is part of the MedFact application specification.