import { VerifiedDataset, Question, Condition, QuestionFlow } from '../types';

// Sample conditions data
const CONDITIONS: Condition[] = [
  {
    id: 'migraine',
    name: 'Migraine',
    description: 'A neurological condition characterized by intense, throbbing headaches often accompanied by nausea and sensitivity to light.',
    commonSymptoms: ['severe headache', 'nausea', 'light sensitivity', 'sound sensitivity', 'visual disturbances'],
    severity: 'medium',
    category: 'neurological',
    prevalence: 0.12
  },
  {
    id: 'tension_headache',
    name: 'Tension Headache',
    description: 'The most common type of headache, often described as a tight band around the head.',
    commonSymptoms: ['mild to moderate headache', 'pressure sensation', 'muscle tension', 'stress'],
    severity: 'low',
    category: 'neurological',
    prevalence: 0.78
  },
  {
    id: 'cluster_headache',
    name: 'Cluster Headache',
    description: 'Severe headaches that occur in cyclical patterns or clusters, often around one eye.',
    commonSymptoms: ['severe one-sided headache', 'eye pain', 'nasal congestion', 'restlessness'],
    severity: 'high',
    category: 'neurological',
    prevalence: 0.001
  },
  {
    id: 'flu',
    name: 'Influenza',
    description: 'A viral respiratory infection causing fever, body aches, and fatigue.',
    commonSymptoms: ['fever', 'body aches', 'fatigue', 'cough', 'sore throat', 'runny nose'],
    severity: 'medium',
    category: 'respiratory',
    prevalence: 0.05
  },
  {
    id: 'common_cold',
    name: 'Common Cold',
    description: 'A mild viral infection of the upper respiratory tract.',
    commonSymptoms: ['runny nose', 'sneezing', 'mild cough', 'sore throat', 'low-grade fever'],
    severity: 'low',
    category: 'respiratory',
    prevalence: 0.15
  },
  {
    id: 'bacterial_infection',
    name: 'Bacterial Infection',
    description: 'An infection caused by bacteria that may require antibiotic treatment.',
    commonSymptoms: ['high fever', 'chills', 'localized pain', 'swelling', 'pus formation'],
    severity: 'medium',
    category: 'infectious',
    prevalence: 0.08
  },
  {
    id: 'gastroenteritis',
    name: 'Gastroenteritis',
    description: 'Inflammation of the stomach and intestines, often called stomach flu.',
    commonSymptoms: ['nausea', 'vomiting', 'diarrhea', 'abdominal pain', 'fever'],
    severity: 'medium',
    category: 'gastrointestinal',
    prevalence: 0.10
  },
  {
    id: 'food_poisoning',
    name: 'Food Poisoning',
    description: 'Illness caused by consuming contaminated food or beverages.',
    commonSymptoms: ['sudden nausea', 'vomiting', 'diarrhea', 'abdominal cramps', 'fever'],
    severity: 'medium',
    category: 'gastrointestinal',
    prevalence: 0.06
  }
];

// Question definitions with branching logic
const QUESTIONS_MAP = new Map<string, Question>([
  // Headache flow
  ['headache_type', {
    id: 'headache_type',
    text: 'What type of headache are you experiencing?',
    options: [
      { value: 'throbbing', label: 'Throbbing/Pulsing pain', nextQuestionId: 'headache_location' },
      { value: 'pressure', label: 'Pressure/Tight sensation', nextQuestionId: 'headache_duration' },
      { value: 'sharp', label: 'Sharp/Stabbing pain', nextQuestionId: 'headache_location' },
      { value: 'dull', label: 'Dull/Constant ache', nextQuestionId: 'headache_duration' }
    ],
    category: 'severity'
  }],
  
  ['headache_location', {
    id: 'headache_location',
    text: 'Where is the headache located?',
    options: [
      { value: 'one_side', label: 'One side of head', nextQuestionId: 'headache_associated' },
      { value: 'both_sides', label: 'Both sides of head', nextQuestionId: 'headache_duration' },
      { value: 'forehead', label: 'Forehead area', nextQuestionId: 'headache_duration' },
      { value: 'back_head', label: 'Back of head/neck', nextQuestionId: 'headache_duration' },
      { value: 'around_eye', label: 'Around one eye', nextQuestionId: 'headache_associated' }
    ],
    category: 'location'
  }],
  
  ['headache_duration', {
    id: 'headache_duration',
    text: 'How long have you had this headache?',
    options: [
      { value: 'less_hour', label: 'Less than 1 hour', nextQuestionId: 'headache_associated' },
      { value: 'few_hours', label: 'A few hours', nextQuestionId: 'headache_associated' },
      { value: 'all_day', label: 'All day', nextQuestionId: 'headache_triggers' },
      { value: 'several_days', label: 'Several days', nextQuestionId: 'headache_triggers' }
    ],
    category: 'duration'
  }],
  
  ['headache_associated', {
    id: 'headache_associated',
    text: 'Are you experiencing any of these symptoms along with your headache?',
    options: [
      { value: 'nausea', label: 'Nausea or vomiting', nextQuestionId: 'headache_triggers' },
      { value: 'light_sensitivity', label: 'Sensitivity to light', nextQuestionId: 'headache_triggers' },
      { value: 'sound_sensitivity', label: 'Sensitivity to sound', nextQuestionId: 'headache_triggers' },
      { value: 'visual_changes', label: 'Visual changes (aura, blurred vision)', nextQuestionId: 'headache_triggers' },
      { value: 'none', label: 'None of these' }
    ],
    category: 'associated'
  }],
  
  ['headache_triggers', {
    id: 'headache_triggers',
    text: 'What might have triggered your headache?',
    options: [
      { value: 'stress', label: 'Stress or tension' },
      { value: 'lack_sleep', label: 'Lack of sleep' },
      { value: 'certain_foods', label: 'Certain foods or drinks' },
      { value: 'weather', label: 'Weather changes' },
      { value: 'unknown', label: 'Not sure' }
    ],
    category: 'associated'
  }],

  // Fever flow
  ['fever_severity', {
    id: 'fever_severity',
    text: 'How high is your fever?',
    options: [
      { value: 'low_grade', label: 'Low-grade (99-100.4°F)', nextQuestionId: 'fever_duration' },
      { value: 'moderate', label: 'Moderate (100.5-102°F)', nextQuestionId: 'fever_associated' },
      { value: 'high', label: 'High (102.1-104°F)', nextQuestionId: 'fever_associated' },
      { value: 'very_high', label: 'Very high (above 104°F)', nextQuestionId: 'fever_associated' }
    ],
    category: 'severity'
  }],
  
  ['fever_duration', {
    id: 'fever_duration',
    text: 'How long have you had the fever?',
    options: [
      { value: 'few_hours', label: 'A few hours', nextQuestionId: 'fever_associated' },
      { value: 'one_day', label: '1 day', nextQuestionId: 'fever_associated' },
      { value: 'few_days', label: '2-3 days', nextQuestionId: 'fever_other_symptoms' },
      { value: 'week_plus', label: 'More than a week', nextQuestionId: 'fever_other_symptoms' }
    ],
    category: 'duration'
  }],
  
  ['fever_associated', {
    id: 'fever_associated',
    text: 'What other symptoms are you experiencing with the fever?',
    options: [
      { value: 'body_aches', label: 'Body aches and pains', nextQuestionId: 'fever_other_symptoms' },
      { value: 'chills', label: 'Chills or shivering', nextQuestionId: 'fever_other_symptoms' },
      { value: 'headache', label: 'Headache', nextQuestionId: 'fever_other_symptoms' },
      { value: 'fatigue', label: 'Extreme fatigue', nextQuestionId: 'fever_other_symptoms' }
    ],
    category: 'associated'
  }],
  
  ['fever_other_symptoms', {
    id: 'fever_other_symptoms',
    text: 'Are you experiencing any respiratory or digestive symptoms?',
    options: [
      { value: 'cough_sore_throat', label: 'Cough or sore throat' },
      { value: 'runny_nose', label: 'Runny or stuffy nose' },
      { value: 'nausea_vomiting', label: 'Nausea or vomiting' },
      { value: 'none_respiratory', label: 'None of these' }
    ],
    category: 'associated'
  }],

  // Nausea flow
  ['nausea_severity', {
    id: 'nausea_severity',
    text: 'How severe is your nausea?',
    options: [
      { value: 'mild', label: 'Mild - feeling queasy', nextQuestionId: 'nausea_duration' },
      { value: 'moderate', label: 'Moderate - strong urge to vomit', nextQuestionId: 'nausea_vomiting' },
      { value: 'severe', label: 'Severe - actively vomiting', nextQuestionId: 'nausea_vomiting' }
    ],
    category: 'severity'
  }],
  
  ['nausea_duration', {
    id: 'nausea_duration',
    text: 'How long have you been feeling nauseous?',
    options: [
      { value: 'few_hours', label: 'A few hours', nextQuestionId: 'nausea_triggers' },
      { value: 'one_day', label: 'Since yesterday', nextQuestionId: 'nausea_associated' },
      { value: 'few_days', label: 'Several days', nextQuestionId: 'nausea_associated' }
    ],
    category: 'duration'
  }],
  
  ['nausea_vomiting', {
    id: 'nausea_vomiting',
    text: 'Have you been vomiting?',
    options: [
      { value: 'yes_frequent', label: 'Yes, frequently', nextQuestionId: 'nausea_associated' },
      { value: 'yes_occasional', label: 'Yes, occasionally', nextQuestionId: 'nausea_triggers' },
      { value: 'no_just_nausea', label: 'No, just nauseous', nextQuestionId: 'nausea_triggers' }
    ],
    category: 'severity'
  }],
  
  ['nausea_triggers', {
    id: 'nausea_triggers',
    text: 'What might have caused your nausea?',
    options: [
      { value: 'food_eaten', label: 'Something I ate or drank' },
      { value: 'motion', label: 'Motion or travel' },
      { value: 'medication', label: 'Medication or supplements' },
      { value: 'unknown', label: 'Not sure' }
    ],
    category: 'associated'
  }],
  
  ['nausea_associated', {
    id: 'nausea_associated',
    text: 'Are you experiencing any other symptoms?',
    options: [
      { value: 'diarrhea', label: 'Diarrhea' },
      { value: 'abdominal_pain', label: 'Abdominal pain or cramps' },
      { value: 'fever', label: 'Fever or chills' },
      { value: 'none_other', label: 'None of these' }
    ],
    category: 'associated'
  }]
]);

// Symptom keyword mappings
const SYMPTOM_KEYWORDS = new Map<string, string[]>([
  ['headache', ['migraine', 'tension_headache', 'cluster_headache']],
  ['head pain', ['migraine', 'tension_headache', 'cluster_headache']],
  ['migraine', ['migraine']],
  ['fever', ['flu', 'common_cold', 'bacterial_infection']],
  ['temperature', ['flu', 'common_cold', 'bacterial_infection']],
  ['hot', ['flu', 'bacterial_infection']],
  ['nausea', ['gastroenteritis', 'food_poisoning', 'migraine']],
  ['vomiting', ['gastroenteritis', 'food_poisoning']],
  ['stomach pain', ['gastroenteritis', 'food_poisoning']],
  ['diarrhea', ['gastroenteritis', 'food_poisoning']],
  ['cough', ['flu', 'common_cold']],
  ['sore throat', ['flu', 'common_cold']],
  ['runny nose', ['common_cold', 'flu']],
  ['body aches', ['flu']],
  ['fatigue', ['flu', 'bacterial_infection']],
  ['chills', ['flu', 'bacterial_infection']]
]);

// Question flow structure
const QUESTION_FLOW: QuestionFlow = {
  startQuestionId: 'initial',
  questions: QUESTIONS_MAP,
  conditions: CONDITIONS,
  symptomKeywords: SYMPTOM_KEYWORDS
};

// Main verified dataset
export const VERIFIED_DATASET: VerifiedDataset = {
  symptomMappings: {
    'headache': {
      initialQuestionId: 'headache_type',
      relatedConditions: ['migraine', 'tension_headache', 'cluster_headache']
    },
    'head pain': {
      initialQuestionId: 'headache_type',
      relatedConditions: ['migraine', 'tension_headache', 'cluster_headache']
    },
    'migraine': {
      initialQuestionId: 'headache_type',
      relatedConditions: ['migraine']
    },
    'fever': {
      initialQuestionId: 'fever_severity',
      relatedConditions: ['flu', 'common_cold', 'bacterial_infection']
    },
    'temperature': {
      initialQuestionId: 'fever_severity',
      relatedConditions: ['flu', 'common_cold', 'bacterial_infection']
    },
    'hot': {
      initialQuestionId: 'fever_severity',
      relatedConditions: ['flu', 'bacterial_infection']
    },
    'nausea': {
      initialQuestionId: 'nausea_severity',
      relatedConditions: ['gastroenteritis', 'food_poisoning', 'migraine']
    },
    'vomiting': {
      initialQuestionId: 'nausea_severity',
      relatedConditions: ['gastroenteritis', 'food_poisoning']
    },
    'stomach pain': {
      initialQuestionId: 'nausea_severity',
      relatedConditions: ['gastroenteritis', 'food_poisoning']
    },
    'diarrhea': {
      initialQuestionId: 'nausea_severity',
      relatedConditions: ['gastroenteritis', 'food_poisoning']
    },
    'cough': {
      initialQuestionId: 'fever_severity',
      relatedConditions: ['flu', 'common_cold']
    },
    'sore throat': {
      initialQuestionId: 'fever_severity',
      relatedConditions: ['flu', 'common_cold']
    },
    'runny nose': {
      initialQuestionId: 'fever_severity',
      relatedConditions: ['common_cold', 'flu']
    },
    'body aches': {
      initialQuestionId: 'fever_severity',
      relatedConditions: ['flu']
    },
    'fatigue': {
      initialQuestionId: 'fever_severity',
      relatedConditions: ['flu', 'bacterial_infection']
    },
    'chills': {
      initialQuestionId: 'fever_severity',
      relatedConditions: ['flu', 'bacterial_infection']
    }
  },
  questionFlow: QUESTION_FLOW
};

// Helper functions for dataset usage
export const getInitialQuestionForSymptom = (symptom: string): string | null => {
  const normalizedSymptom = symptom.toLowerCase().trim();
  const mapping = VERIFIED_DATASET.symptomMappings[normalizedSymptom];
  return mapping ? mapping.initialQuestionId : null;
};

export const getRelatedConditionsForSymptom = (symptom: string): string[] => {
  const normalizedSymptom = symptom.toLowerCase().trim();
  const mapping = VERIFIED_DATASET.symptomMappings[normalizedSymptom];
  return mapping ? mapping.relatedConditions : [];
};

export const getQuestionById = (questionId: string): Question | null => {
  return QUESTION_FLOW.questions.get(questionId) || null;
};

export const getConditionById = (conditionId: string): Condition | null => {
  return CONDITIONS.find(condition => condition.id === conditionId) || null;
};

export const searchSymptomKeywords = (input: string): string[] => {
  const normalizedInput = input.toLowerCase();
  const matchedConditions = new Set<string>();
  
  for (const [keyword, conditionIds] of SYMPTOM_KEYWORDS.entries()) {
    if (normalizedInput.includes(keyword)) {
      conditionIds.forEach(id => matchedConditions.add(id));
    }
  }
  
  return Array.from(matchedConditions);
};