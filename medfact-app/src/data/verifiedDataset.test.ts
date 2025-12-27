const fc = require('fast-check/lib/cjs/fast-check');
import { 
  VERIFIED_DATASET, 
  getInitialQuestionForSymptom, 
  getRelatedConditionsForSymptom,
  getQuestionById,
  getConditionById,
  searchSymptomKeywords
} from './verifiedDataset';

/**
 * **Feature: medfact-web-app, Property 16: Dataset utilization**
 * **Validates: Requirements 9.3**
 * 
 * For any symptom input, the system should use the verified dataset to determine 
 * appropriate questions and conditions
 */
describe('Property 16: Dataset utilization', () => {
  
  // Property test with 100 iterations as specified in design document
  test('symptom mappings always return valid question IDs and condition IDs', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(...Object.keys(VERIFIED_DATASET.symptomMappings)),
        (symptom: string) => {
          // Get the initial question for this symptom
          const initialQuestionId = getInitialQuestionForSymptom(symptom);
          const relatedConditions = getRelatedConditionsForSymptom(symptom);
          
          // Property: If a symptom has a mapping, it should have a valid question ID
          if (initialQuestionId) {
            const question = getQuestionById(initialQuestionId);
            expect(question).not.toBeNull();
            expect(question?.id).toBe(initialQuestionId);
          }
          
          // Property: All related conditions should exist in the dataset
          relatedConditions.forEach(conditionId => {
            const condition = getConditionById(conditionId);
            expect(condition).not.toBeNull();
            expect(condition?.id).toBe(conditionId);
          });
          
          // Property: Symptom mappings should be consistent
          const mapping = VERIFIED_DATASET.symptomMappings[symptom];
          expect(mapping.initialQuestionId).toBe(initialQuestionId);
          expect(mapping.relatedConditions).toEqual(relatedConditions);
        }
      ),
      { numRuns: 100 }
    );
  });

  test('question flow maintains referential integrity', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(...Array.from(VERIFIED_DATASET.questionFlow.questions.keys())),
        (questionId: string) => {
          const question = getQuestionById(questionId);
          
          // Property: Every question ID in the flow should resolve to a valid question
          expect(question).not.toBeNull();
          expect(question?.id).toBe(questionId);
          
          // Property: All nextQuestionId references should be valid or undefined
          question?.options.forEach(option => {
            if (option.nextQuestionId) {
              const nextQuestion = getQuestionById(option.nextQuestionId);
              expect(nextQuestion).not.toBeNull();
            }
          });
        }
      ),
      { numRuns: 100 }
    );
  });

  test('symptom keyword search returns valid condition IDs', () => {
    fc.assert(
      fc.property(
        fc.string({ minLength: 1, maxLength: 50 }).filter((s: string) => s.trim().length > 0),
        (searchInput: string) => {
          const matchedConditionIds = searchSymptomKeywords(searchInput);
          
          // Property: All returned condition IDs should exist in the dataset
          matchedConditionIds.forEach(conditionId => {
            const condition = getConditionById(conditionId);
            expect(condition).not.toBeNull();
            expect(condition?.id).toBe(conditionId);
          });
        }
      ),
      { numRuns: 100 }
    );
  });

  test('case insensitive symptom lookup works consistently', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(...Object.keys(VERIFIED_DATASET.symptomMappings)),
        fc.constantFrom('lower', 'upper', 'mixed'),
        (symptom: string, caseType: string) => {
          let testSymptom = symptom;
          
          switch (caseType) {
            case 'lower':
              testSymptom = symptom.toLowerCase();
              break;
            case 'upper':
              testSymptom = symptom.toUpperCase();
              break;
            case 'mixed':
              testSymptom = symptom.split('').map((char: string, i: number) => 
                i % 2 === 0 ? char.toLowerCase() : char.toUpperCase()
              ).join('');
              break;
          }
          
          // Property: Case variations should return the same results
          const originalResult = getInitialQuestionForSymptom(symptom);
          const caseVariantResult = getInitialQuestionForSymptom(testSymptom);
          
          expect(caseVariantResult).toBe(originalResult);
          
          const originalConditions = getRelatedConditionsForSymptom(symptom);
          const caseVariantConditions = getRelatedConditionsForSymptom(testSymptom);
          
          expect(caseVariantConditions).toEqual(originalConditions);
        }
      ),
      { numRuns: 100 }
    );
  });

  test('all conditions in the dataset have required properties', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(...VERIFIED_DATASET.questionFlow.conditions),
        (condition: any) => {
          // Property: Every condition should have all required fields
          expect(condition.id).toBeDefined();
          expect(typeof condition.id).toBe('string');
          expect(condition.id.length).toBeGreaterThan(0);
          
          expect(condition.name).toBeDefined();
          expect(typeof condition.name).toBe('string');
          expect(condition.name.length).toBeGreaterThan(0);
          
          expect(condition.description).toBeDefined();
          expect(typeof condition.description).toBe('string');
          expect(condition.description.length).toBeGreaterThan(0);
          
          expect(condition.commonSymptoms).toBeDefined();
          expect(Array.isArray(condition.commonSymptoms)).toBe(true);
          expect(condition.commonSymptoms.length).toBeGreaterThan(0);
          
          expect(['low', 'medium', 'high']).toContain(condition.severity);
          
          expect(condition.category).toBeDefined();
          expect(typeof condition.category).toBe('string');
          expect(condition.category.length).toBeGreaterThan(0);
          
          expect(condition.prevalence).toBeDefined();
          expect(typeof condition.prevalence).toBe('number');
          expect(condition.prevalence).toBeGreaterThanOrEqual(0);
          expect(condition.prevalence).toBeLessThanOrEqual(1);
        }
      ),
      { numRuns: 100 }
    );
  });

  test('all questions in the dataset have required properties', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(...Array.from(VERIFIED_DATASET.questionFlow.questions.values())),
        (question: any) => {
          // Property: Every question should have all required fields
          expect(question.id).toBeDefined();
          expect(typeof question.id).toBe('string');
          expect(question.id.length).toBeGreaterThan(0);
          
          expect(question.text).toBeDefined();
          expect(typeof question.text).toBe('string');
          expect(question.text.length).toBeGreaterThan(0);
          
          expect(question.options).toBeDefined();
          expect(Array.isArray(question.options)).toBe(true);
          expect(question.options.length).toBeGreaterThan(0);
          
          expect(['severity', 'duration', 'location', 'associated']).toContain(question.category);
          
          // Property: All options should have required fields
          question.options.forEach((option: any) => {
            expect(option.value).toBeDefined();
            expect(typeof option.value).toBe('string');
            expect(option.value.length).toBeGreaterThan(0);
            
            expect(option.label).toBeDefined();
            expect(typeof option.label).toBe('string');
            expect(option.label.length).toBeGreaterThan(0);
            
            // nextQuestionId is optional but if present should be a non-empty string
            if (option.nextQuestionId !== undefined) {
              expect(typeof option.nextQuestionId).toBe('string');
              expect(option.nextQuestionId.length).toBeGreaterThan(0);
            }
          });
        }
      ),
      { numRuns: 100 }
    );
  });
});

// Unit tests for specific examples and edge cases
describe('Dataset structure unit tests', () => {
  
  test('known symptom mappings work correctly', () => {
    // Test specific examples
    expect(getInitialQuestionForSymptom('headache')).toBe('headache_type');
    expect(getInitialQuestionForSymptom('fever')).toBe('fever_severity');
    expect(getInitialQuestionForSymptom('nausea')).toBe('nausea_severity');
    
    expect(getRelatedConditionsForSymptom('headache')).toEqual(['migraine', 'tension_headache', 'cluster_headache']);
    expect(getRelatedConditionsForSymptom('fever')).toEqual(['flu', 'common_cold', 'bacterial_infection']);
  });
  
  test('unknown symptoms return null/empty results', () => {
    expect(getInitialQuestionForSymptom('unknown_symptom')).toBeNull();
    expect(getRelatedConditionsForSymptom('unknown_symptom')).toEqual([]);
    expect(getQuestionById('nonexistent_question')).toBeNull();
    expect(getConditionById('nonexistent_condition')).toBeNull();
  });
  
  test('empty and whitespace inputs are handled correctly', () => {
    expect(getInitialQuestionForSymptom('')).toBeNull();
    expect(getInitialQuestionForSymptom('   ')).toBeNull();
    expect(getRelatedConditionsForSymptom('')).toEqual([]);
    expect(getRelatedConditionsForSymptom('   ')).toEqual([]);
  });
  
  test('symptom keyword search finds relevant conditions', () => {
    const headacheResults = searchSymptomKeywords('I have a bad headache');
    expect(headacheResults).toContain('migraine');
    expect(headacheResults).toContain('tension_headache');
    expect(headacheResults).toContain('cluster_headache');
    
    const feverResults = searchSymptomKeywords('running a fever');
    expect(feverResults).toContain('flu');
    expect(feverResults).toContain('common_cold');
    expect(feverResults).toContain('bacterial_infection');
  });
});