# MedFact - Health Symptom Checker

A modern, AI-powered health symptom analysis web application built with React, TypeScript, and a beautiful glassmorphism UI design.

## Features

- **Symptom Analysis**: Enter your symptoms and get intelligent health insights
- **Interactive Questionnaire**: Multi-step wizard guides you through relevant follow-up questions
- **Personalized Results**: Get possible conditions, preventive measures, and recommended actions
- **Diet Recommendations**: Condition-specific dietary guidance including foods to eat/avoid
- **Health Dashboard**: Track your symptom history and health reports
- **User Authentication**: Secure login/signup with session persistence
- **Beautiful UI**: Modern glassmorphism design with animated backgrounds

## Tech Stack

- **Frontend**: React 18 with TypeScript
- **Styling**: Tailwind CSS with custom glassmorphism utilities
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Routing**: React Router v6
- **Testing**: Jest with React Testing Library + Property-Based Testing (fast-check)

## Getting Started

### Prerequisites

- Node.js 16+ 
- npm or yarn

### Installation

```bash
cd medfact-app
npm install
```

### Development

```bash
npm start
```

Opens [http://localhost:3000](http://localhost:3000) in your browser.

### Testing

```bash
npm test
```

### Build

```bash
npm run build
```

## Project Structure

```
medfact-app/
├── src/
│   ├── components/       # Reusable UI components
│   │   ├── ui/          # Base UI components (GlassCard, Icon)
│   │   └── background-effects/  # Animated backgrounds
│   ├── pages/           # Page components
│   ├── contexts/        # React Context providers
│   ├── data/            # Mock datasets and databases
│   └── types/           # TypeScript type definitions
├── public/              # Static assets
└── .kiro/specs/         # Feature specifications
```

## Key Components

- **SymptomChecker**: Multi-step symptom analysis wizard
- **GlassCard**: Reusable glassmorphism card component
- **AuthModal**: Authentication modal with login/signup
- **Dashboard**: User health tracking dashboard
- **ThreadsEffect/GalaxyEffect**: Animated background components

## Medical Disclaimer

⚠️ **This application is for informational purposes only and does not constitute medical advice.** Always consult with a qualified healthcare professional for medical concerns. The symptom analysis provided is based on general information and should not be used for self-diagnosis or treatment.

## License

MIT License
