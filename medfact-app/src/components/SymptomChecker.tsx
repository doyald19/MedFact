import React, { useState, useEffect } from 'react';
import { Question, QuestionResponse, AnalysisResults, Condition } from '../types';
import { 
  getInitialQuestionForSymptom, 
  getQuestionById, 
  getConditionById,
  getRelatedConditionsForSymptom,
  getInitialQuestionFromInput
} from '../data/verifiedDataset';
import GlassCard from './ui/GlassCard';
import SymptomResults from './SymptomResults';

interface SymptomCheckerProps {
  initialSymptom: string;
  onComplete: (results: AnalysisResults) => void;
  onAuthPrompt?: () => void;
}

const SymptomChecker: React.FC<SymptomCheckerProps> = ({ 
  initialSymptom, 
  onComplete,
  onAuthPrompt 
}) => {
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [responses, setResponses] = useState<QuestionResponse[]>([]);
  const [isComplete, setIsComplete] = useState(false);
  const [results, setResults] = useState<AnalysisResults | null>(null);
  const [detectedSymptom, setDetectedSymptom] = useState<string>(initialSymptom);
  const [relatedConditionIds, setRelatedConditionIds] = useState<string[]>([]);

  // Initialize the symptom checker with the first question
  useEffect(() => {
    // First try direct symptom lookup
    let initialQuestionId = getInitialQuestionForSymptom(initialSymptom);
    let symptom = initialSymptom;
    let conditions: string[] = [];
    
    if (!initialQuestionId) {
      // Try natural language extraction
      const extracted = getInitialQuestionFromInput(initialSymptom);
      if (extracted.questionId) {
        initialQuestionId = extracted.questionId;
        symptom = extracted.symptom || initialSymptom;
        conditions = extracted.conditions;
      }
    } else {
      conditions = getRelatedConditionsForSymptom(initialSymptom);
    }
    
    if (initialQuestionId) {
      const question = getQuestionById(initialQuestionId);
      setCurrentQuestion(question);
      setDetectedSymptom(symptom);
      setRelatedConditionIds(conditions);
    }
  }, [initialSymptom]);

  // Handle option selection and question progression
  const handleOptionSelect = (option: { value: string; label: string; nextQuestionId?: string }) => {
    if (!currentQuestion) return;

    // Record the response
    const response: QuestionResponse = {
      questionId: currentQuestion.id,
      questionText: currentQuestion.text,
      selectedOption: option.value,
      timestamp: new Date()
    };

    const newResponses = [...responses, response];
    setResponses(newResponses);

    // Progress to next question or complete the flow
    if (option.nextQuestionId) {
      const nextQuestion = getQuestionById(option.nextQuestionId);
      setCurrentQuestion(nextQuestion);
    } else {
      // No next question - complete the analysis
      completeAnalysis(newResponses);
    }
  };

  // Generate analysis results based on responses
  const completeAnalysis = (allResponses: QuestionResponse[]) => {
    // Use the detected conditions or fall back to symptom lookup
    const conditionIds = relatedConditionIds.length > 0 
      ? relatedConditionIds 
      : getRelatedConditionsForSymptom(detectedSymptom);
    
    const possibleConditions: Condition[] = conditionIds
      .map(id => getConditionById(id))
      .filter((condition): condition is Condition => condition !== null);

    // Analyze responses to determine most likely conditions
    const analysisResults: AnalysisResults = generateResults(allResponses, possibleConditions);
    
    setResults(analysisResults);
    setIsComplete(true);
    onComplete(analysisResults);
  };

  // Generate comprehensive results based on user responses
  const generateResults = (responses: QuestionResponse[], conditions: Condition[]): AnalysisResults => {
    // Determine severity based on responses
    const severityIndicators = responses.filter(r => 
      r.selectedOption.includes('severe') || 
      r.selectedOption.includes('high') ||
      r.selectedOption.includes('very_high')
    );
    
    const severity: 'low' | 'medium' | 'high' = 
      severityIndicators.length > 0 ? 'high' :
      responses.some(r => r.selectedOption.includes('moderate')) ? 'medium' : 'low';

    // Extract symptoms from responses
    const symptoms = [initialSymptom, ...responses.map(r => r.selectedOption)];

    // Generate preventive measures based on conditions
    const preventiveMeasures = generatePreventiveMeasures(conditions, responses);

    // Generate recommended actions based on severity and symptoms
    const recommendedActions = generateRecommendedActions(severity, conditions, responses);

    return {
      possibleConditions: conditions,
      symptoms,
      preventiveMeasures,
      severity,
      recommendedActions
    };
  };

  // Generate preventive measures based on conditions and responses
  const generatePreventiveMeasures = (conditions: Condition[], responses: QuestionResponse[]): string[] => {
    const measures: string[] = [];
    
    conditions.forEach(condition => {
      switch (condition.category) {
        case 'neurological':
          measures.push('Maintain regular sleep schedule', 'Manage stress levels', 'Stay hydrated');
          break;
        case 'respiratory':
          measures.push('Wash hands frequently', 'Avoid close contact with sick individuals', 'Get adequate rest');
          break;
        case 'gastrointestinal':
          measures.push('Practice food safety', 'Stay hydrated', 'Eat bland foods');
          break;
        case 'infectious':
          measures.push('Complete any prescribed medications', 'Rest and recover', 'Monitor symptoms');
          break;
      }
    });

    return [...new Set(measures)]; // Remove duplicates
  };

  // Generate recommended actions based on severity and conditions
  const generateRecommendedActions = (severity: 'low' | 'medium' | 'high', conditions: Condition[], responses: QuestionResponse[]): string[] => {
    const actions: string[] = [];

    if (severity === 'high') {
      actions.push('Seek immediate medical attention', 'Contact your healthcare provider today');
    } else if (severity === 'medium') {
      actions.push('Consider consulting a healthcare provider', 'Monitor symptoms closely');
    } else {
      actions.push('Rest and self-care measures', 'Monitor for worsening symptoms');
    }

    // Add condition-specific actions
    conditions.forEach(condition => {
      if (condition.severity === 'high') {
        actions.push(`Consider evaluation for ${condition.name}`);
      }
    });

    return [...new Set(actions)]; // Remove duplicates
  };

  if (isComplete && results) {
    return (
      <SymptomResults 
        results={results} 
        initialSymptom={detectedSymptom}
        onAuthPrompt={onAuthPrompt}
      />
    );
  }

  if (!currentQuestion) {
    return (
      <GlassCard className="p-4 sm:p-6 max-w-2xl mx-auto" aria-label="Symptom not found">
        <div className="text-center">
          <p className="text-base sm:text-lg">Unable to find questions for: "{initialSymptom}"</p>
          <p className="text-sm mt-2 opacity-75">Try using simpler terms like: headache, fever, nausea, cough, sore throat, etc.</p>
        </div>
      </GlassCard>
    );
  }

  return (
    <GlassCard className="p-4 sm:p-6 max-w-2xl mx-auto" aria-label="Symptom checker questionnaire">
      <div className="space-y-4 sm:space-y-6">
        {/* Progress indicator */}
        <div className="flex items-center justify-between text-xs sm:text-sm opacity-75" aria-live="polite">
          <span>Question {responses.length + 1}</span>
          <span>Symptom: {detectedSymptom}</span>
        </div>

        {/* Current question */}
        <fieldset>
          <legend className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">{currentQuestion.text}</legend>
          
          {/* Answer options */}
          <div className="space-y-2 sm:space-y-3" role="radiogroup" aria-label="Answer options">
            {currentQuestion.options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleOptionSelect(option)}
                className="w-full p-3 sm:p-4 min-h-[44px] text-left rounded-lg border border-white/20 glass-option bg-white/5 focus:outline-none"
                role="radio"
                aria-checked="false"
              >
                <span className="font-medium text-sm sm:text-base">{option.label}</span>
              </button>
            ))}
          </div>
        </fieldset>

        {/* Previous responses summary */}
        {responses.length > 0 && (
          <div className="pt-3 sm:pt-4 border-t border-white/20">
            <p className="text-xs sm:text-sm opacity-75 mb-2">Previous answers:</p>
            <div className="space-y-1">
              {responses.slice(-2).map((response, index) => (
                <p key={index} className="text-xs opacity-60">
                  {response.questionText}: {response.selectedOption}
                </p>
              ))}
            </div>
          </div>
        )}
      </div>
    </GlassCard>
  );
};

export default SymptomChecker;