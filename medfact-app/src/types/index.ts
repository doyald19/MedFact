// User and Authentication Types
export interface User {
  id: string;
  email: string;
  name: string;
  createdAt: Date;
  preferences: UserPreferences;
}

export interface UserPreferences {
  theme: 'light' | 'dark' | 'auto';
  notifications: boolean;
  dataRetention: number; // days
}

export interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (userData: SignupData) => Promise<void>;
  logout: () => void;
  updateUser: (updates: Partial<User>) => void;
  isLoading: boolean;
}

export interface SignupData {
  email: string;
  password: string;
  name: string;
}

// Health Data Types
export interface Question {
  id: string;
  text: string;
  options: QuestionOption[];
  category: 'severity' | 'duration' | 'location' | 'associated';
}

export interface QuestionOption {
  value: string;
  label: string;
  nextQuestionId?: string;
}

export interface QuestionResponse {
  questionId: string;
  questionText: string;
  selectedOption: string;
  timestamp: Date;
}

export interface Condition {
  id: string;
  name: string;
  description: string;
  commonSymptoms: string[];
  severity: 'low' | 'medium' | 'high';
  category: string;
  prevalence: number;
}

export interface AnalysisResults {
  possibleConditions: Condition[];
  symptoms: string[];
  preventiveMeasures: string[];
  severity: 'low' | 'medium' | 'high';
  recommendedActions: string[];
}

export interface HealthReport {
  id: string;
  userId: string;
  timestamp: Date;
  initialSymptom: string;
  questions: QuestionResponse[];
  results: AnalysisResults;
  followUpDate?: Date;
}

// Diet and Nutrition Types
export interface DietRecommendation {
  category: 'foods_to_include' | 'foods_to_avoid' | 'supplements' | 'lifestyle';
  items: string[];
  reasoning: string;
}

export interface DietPlan {
  id: string;
  userId: string;
  conditionIds: string[];
  recommendations: DietRecommendation[];
  restrictions: string[];
  createdAt: Date;
  updatedAt: Date;
}

// Question Flow Types
export interface QuestionFlow {
  startQuestionId: string;
  questions: Map<string, Question>;
  conditions: Condition[];
  symptomKeywords: Map<string, string[]>; // keyword -> condition IDs
}

export interface VerifiedDataset {
  symptomMappings: {
    [symptom: string]: {
      initialQuestionId: string;
      relatedConditions: string[];
    };
  };
  questionFlow: QuestionFlow;
}

export interface DietDatabase {
  [conditionName: string]: {
    eat: string[];
    avoid: string[];
    supplements?: string[];
    lifestyle?: string[];
  };
}