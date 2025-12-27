# MedFact Web Application Design Document

## Overview

MedFact is a modern, responsive web application built with React, Tailwind CSS, and Framer Motion that provides medical symptom analysis through an interactive question-and-answer interface. The application features a distinctive liquid glassmorphism design with animated backgrounds and offers both anonymous symptom checking and authenticated personalized health tracking.

The system architecture follows a component-based approach with clear separation between presentation, business logic, and data management layers. The application prioritizes user experience through smooth animations, responsive design, and intuitive navigation while maintaining medical information accuracy and appropriate disclaimers.

## Architecture

### Frontend Architecture
- **Framework**: React 18+ with functional components and hooks
- **Styling**: Tailwind CSS for utility-first styling with custom glassmorphism classes
- **Animation**: Framer Motion for page transitions and component animations
- **Icons**: Lucide-React for consistent iconography
- **Routing**: React Router for client-side navigation
- **State Management**: React Context API for global state, useState/useReducer for local state

### Component Hierarchy
```
App
├── Layout
│   ├── Header (Navigation, Logo, Auth buttons)
│   └── Footer
├── Pages
│   ├── HomePage (with SymptomChecker)
│   ├── Dashboard (protected)
│   ├── ContactPage
│   └── SettingsPage (protected)
├── Components
│   ├── SymptomChecker (multi-step wizard)
│   ├── GlassCard
│   ├── BackgroundEffects (Threads/Galaxy)
│   ├── AuthModal
│   └── ProtectedRoute
└── Contexts
    ├── AuthContext
    └── HealthDataContext
```

### Background Effects Implementation
- **Threads Effect**: Uses @react-bits/Threads-JS-CSS library component `<Threads />` on home page
- **Galaxy Effect**: Uses @react-bits/Galaxy-JS-CSS library component `<Galaxy />` on authenticated pages
- Both effects optimized for mobile performance with reduced particle counts on smaller screens

## Components and Interfaces

### Core Components

#### SymptomChecker Component
```typescript
interface SymptomCheckerProps {
  initialSymptom: string;
  onComplete: (results: AnalysisResults) => void;
}

interface Question {
  id: string;
  text: string;
  options: QuestionOption[];
  category: 'severity' | 'duration' | 'location' | 'associated';
}

interface QuestionOption {
  value: string;
  label: string;
  nextQuestionId?: string;
}

interface AnalysisResults {
  possibleConditions: Condition[];
  symptoms: string[];
  preventiveMeasures: string[];
  severity: 'low' | 'medium' | 'high';
  recommendedActions: string[];
}
```

#### GlassCard Component
```typescript
interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'elevated' | 'subtle';
  blur?: 'sm' | 'md' | 'lg';
}
```

#### BackgroundEffect Components
```typescript
// Using external libraries
import { Threads } from '@react-bits/Threads-JS-CSS';
import { Galaxy } from '@react-bits/Galaxy-JS-CSS';

interface ThreadsEffectProps {
  density?: number;
  speed?: number;
  color?: string;
}

interface GalaxyEffectProps {
  particleCount?: number;
  interactive?: boolean;
  mouseInfluence?: number;
}
```

### Authentication Interfaces
```typescript
interface User {
  id: string;
  email: string;
  name: string;
  createdAt: Date;
  preferences: UserPreferences;
}

interface UserPreferences {
  theme: 'light' | 'dark' | 'auto';
  notifications: boolean;
  dataRetention: number; // days
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (userData: SignupData) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}
```

## Data Models

### Health Data Models
```typescript
interface HealthReport {
  id: string;
  userId: string;
  timestamp: Date;
  initialSymptom: string;
  questions: QuestionResponse[];
  results: AnalysisResults;
  followUpDate?: Date;
}

interface QuestionResponse {
  questionId: string;
  questionText: string;
  selectedOption: string;
  timestamp: Date;
}

interface Condition {
  id: string;
  name: string;
  description: string;
  commonSymptoms: string[];
  severity: 'low' | 'medium' | 'high';
  category: string;
  prevalence: number;
}

interface DietPlan {
  id: string;
  userId: string;
  conditionIds: string[];
  recommendations: DietRecommendation[];
  restrictions: string[];
  createdAt: Date;
  updatedAt: Date;
}

interface DietRecommendation {
  category: 'foods_to_include' | 'foods_to_avoid' | 'supplements' | 'lifestyle';
  items: string[];
  reasoning: string;
}
```

### Question Flow Data
```typescript
interface QuestionFlow {
  startQuestionId: string;
  questions: Map<string, Question>;
  conditions: Condition[];
  symptomKeywords: Map<string, string[]>; // keyword -> condition IDs
}

// Mock Dataset Structure
interface VerifiedDataset {
  symptomMappings: {
    [symptom: string]: {
      initialQuestionId: string;
      relatedConditions: string[];
    };
  };
  questionFlow: QuestionFlow;
}

// Diet Database Structure  
interface DietDatabase {
  [conditionName: string]: {
    eat: string[];
    avoid: string[];
    supplements?: string[];
    lifestyle?: string[];
  };
}
```

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system-essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Property Reflection

After reviewing all testable properties from the prework analysis, several can be consolidated to eliminate redundancy:

- Properties about specific visual effects (Threads/Galaxy) appearing on specific pages can be combined into one comprehensive visual effect property
- Properties about glassmorphism styling can be consolidated into a single comprehensive styling property
- Properties about navigation and UI elements can be grouped by functionality

### Core Properties

**Property 1: Symptom checker initiation preserves context**
*For any* valid symptom input, initiating the symptom checker should start the question flow without page navigation and preserve the user's input context
**Validates: Requirements 1.2, 1.3**

**Property 2: Question flow progression**
*For any* valid question-answer combination, selecting an answer should always lead to either the next appropriate question or the results display
**Validates: Requirements 2.2, 2.3**

**Property 3: Results completeness**
*For any* completed symptom analysis, the results should always include possible conditions, symptoms, preventive measures, and the medical disclaimer
**Validates: Requirements 2.4, 2.5**

**Property 4: Authentication flow preservation**
*For any* successful authentication, the user should be redirected to the dashboard with their session data and previous analysis results preserved
**Validates: Requirements 3.4**

**Property 5: Health data persistence**
*For any* authenticated user, their health reports should always include timestamps and be retrievable with complete session data
**Validates: Requirements 4.4**

**Property 6: Diet plan generation**
*For any* user with detected health issues, accessing diet plans should provide recommendations based on their specific conditions
**Validates: Requirements 4.5**

**Property 7: Responsive layout adaptation**
*For any* screen size change, the application should adapt its layout while maintaining glassmorphism effects and ensuring readable text contrast
**Validates: Requirements 5.1, 5.2, 5.3**

**Property 8: Touch target accessibility**
*For any* interactive element on mobile devices, touch targets should meet minimum size requirements for accessibility
**Validates: Requirements 5.5**

**Property 9: Form validation and feedback**
*For any* form submission (contact or settings), the system should validate input and provide appropriate feedback messages
**Validates: Requirements 6.3, 6.4, 7.3**

**Property 10: Settings propagation**
*For any* user setting modification, changes should be reflected across all application components immediately
**Validates: Requirements 7.4**

**Property 11: Glassmorphism consistency**
*For any* glass card or glassmorphism element, the styling should include backdrop-blur, semi-transparent backgrounds, subtle borders, and rounded corners
**Validates: Requirements 8.1, 8.2**

**Property 12: Text contrast accessibility**
*For any* text displayed over glass elements, the contrast ratio should meet accessibility standards for readability
**Validates: Requirements 8.3**

**Property 13: Interactive feedback consistency**
*For any* interactive element, hover and focus states should provide visual feedback while maintaining the glass aesthetic
**Validates: Requirements 8.4**

**Property 15: Library integration**
*For any* page requiring background effects, the correct library component (Threads or Galaxy) should be imported and rendered
**Validates: Requirements 9.1, 9.2**

**Property 16: Dataset utilization**
*For any* symptom input, the system should use the verified dataset to determine appropriate questions and conditions
**Validates: Requirements 9.3**

**Property 17: Medical disclaimer visibility**
*For any* results display, the medical disclaimer should be rendered in red or yellow text for high visibility
**Validates: Requirements 9.4**

**Property 18: Diet database consistency**
*For any* condition with diet recommendations, the system should use the structured diet database format
**Validates: Requirements 9.5**
## 
Error Handling

### Client-Side Error Handling
- **Network Errors**: Graceful degradation with retry mechanisms and offline indicators
- **Validation Errors**: Real-time form validation with clear, accessible error messages
- **Authentication Errors**: Secure error messages that don't reveal system information
- **Component Errors**: React Error Boundaries to prevent application crashes
- **Background Effect Errors**: Fallback to static backgrounds if Canvas/WebGL fails

### Error Recovery Strategies
```typescript
interface ErrorBoundaryState {
  hasError: boolean;
  errorMessage: string;
  errorId: string;
}

interface ValidationError {
  field: string;
  message: string;
  code: string;
}

interface NetworkError {
  status: number;
  message: string;
  retryable: boolean;
}
```

### Medical Disclaimer Implementation
- **Placement**: Prominently displayed on all result pages and saved reports
- **Content**: "This information is for educational purposes only and is not intended as medical advice. Always consult with a healthcare professional for medical concerns."
- **Styling**: Red or yellow text color for high visibility, high contrast, non-dismissible, clearly visible within glass card design
- **Legal Compliance**: Meets standard medical application disclaimer requirements

### Mock Data Implementation
```typescript
// Example Verified Dataset Structure
const VERIFIED_DATASET: VerifiedDataset = {
  symptomMappings: {
    "headache": {
      initialQuestionId: "headache_type",
      relatedConditions: ["migraine", "tension_headache", "cluster_headache"]
    },
    "fever": {
      initialQuestionId: "fever_severity", 
      relatedConditions: ["flu", "cold", "infection"]
    }
  },
  questionFlow: {
    startQuestionId: "initial",
    questions: new Map([
      ["headache_type", {
        id: "headache_type",
        text: "What type of headache are you experiencing?",
        options: [
          { value: "throbbing", label: "Throbbing/Pulsing", nextQuestionId: "headache_location" },
          { value: "pressure", label: "Pressure/Tight", nextQuestionId: "headache_duration" }
        ],
        category: "severity"
      }]
    ]),
    conditions: [],
    symptomKeywords: new Map()
  }
};

// Example Diet Database Structure
const DIET_DATABASE: DietDatabase = {
  "Migraine": {
    eat: ["Magnesium-rich foods", "Water", "Salmon", "Leafy greens"],
    avoid: ["Aged cheeses", "Red wine", "Chocolate", "Processed meats"],
    supplements: ["Magnesium", "Riboflavin"],
    lifestyle: ["Regular sleep schedule", "Stress management"]
  },
  "Flu": {
    eat: ["Chicken soup", "Ginger tea", "Citrus fruits", "Honey"],
    avoid: ["Alcohol", "Caffeine", "Processed sugar", "Dairy (if congested)"],
    supplements: ["Vitamin C", "Zinc"],
    lifestyle: ["Rest", "Hydration", "Humidifier use"]
  }
};
```

## Testing Strategy

### Dual Testing Approach

The application will use both unit testing and property-based testing to ensure comprehensive coverage:

**Unit Testing**:
- Component rendering and interaction testing using React Testing Library
- Form validation and submission testing
- Authentication flow testing with mocked services
- Background effect initialization and cleanup testing
- Responsive design breakpoint testing

**Property-Based Testing**:
- Uses **fast-check** library for JavaScript/TypeScript property-based testing
- Each property-based test configured to run minimum 100 iterations
- Tests universal properties across all valid inputs and user interactions
- Validates correctness properties defined in this design document

### Testing Framework Configuration
- **Unit Tests**: Jest + React Testing Library + Testing Library User Event
- **Property Tests**: fast-check for generating test data and validating properties
- **E2E Tests**: Playwright for critical user journeys
- **Visual Tests**: Chromatic for glassmorphism design consistency
- **Accessibility Tests**: axe-core integration for WCAG compliance

### Test Data Generation
```typescript
// Property test generators
const symptomGenerator = fc.string({ minLength: 3, maxLength: 100 });
const questionResponseGenerator = fc.record({
  questionId: fc.uuid(),
  selectedOption: fc.string(),
  timestamp: fc.date()
});
const userDataGenerator = fc.record({
  email: fc.emailAddress(),
  name: fc.string({ minLength: 2, maxLength: 50 }),
  preferences: fc.record({
    theme: fc.constantFrom('light', 'dark', 'auto'),
    notifications: fc.boolean()
  })
});
```

### Performance Testing
- **Background Effects**: Frame rate monitoring to ensure 60fps on target devices
- **Component Rendering**: React DevTools Profiler for render optimization
- **Bundle Size**: Webpack Bundle Analyzer for code splitting optimization
- **Mobile Performance**: Lighthouse CI for mobile performance metrics

### Accessibility Testing
- **Screen Reader**: NVDA/JAWS compatibility testing
- **Keyboard Navigation**: Tab order and focus management testing
- **Color Contrast**: Automated contrast ratio validation for glass elements
- **Touch Targets**: Minimum 44px touch target validation on mobile devices

## Implementation Notes

### Glassmorphism Implementation
```css
.glass-card {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}

.glass-card-dark {
  background: rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.1);
}
```

### Background Effects Performance
- **Threads Effect**: Use `requestAnimationFrame` with delta time calculations
- **Galaxy Effect**: Implement particle pooling to reduce garbage collection
- **Mobile Optimization**: Reduce particle count by 50% on screens < 768px
- **Battery Optimization**: Pause animations when page is not visible

### State Management Strategy
- **Global State**: Authentication, user preferences, theme
- **Local State**: Form inputs, UI interactions, temporary data
- **Persistent State**: Health reports in localStorage with encryption
- **Cache Strategy**: React Query for server state management and caching

### Security Considerations
- **Data Encryption**: Encrypt sensitive health data in localStorage
- **Input Sanitization**: Sanitize all user inputs to prevent XSS
- **Authentication**: JWT tokens with secure httpOnly cookies
- **Medical Data**: Comply with HIPAA-like privacy requirements for health information