import { DietDatabase } from '../types';

// Comprehensive diet database with condition-to-food mappings
export const DIET_DATABASE: DietDatabase = {
  'Migraine': {
    eat: [
      'Magnesium-rich foods (spinach, almonds, avocado)',
      'Riboflavin sources (eggs, dairy, leafy greens)',
      'Omega-3 fatty acids (salmon, walnuts, flaxseeds)',
      'Complex carbohydrates (quinoa, brown rice, oats)',
      'Fresh fruits (bananas, berries, cherries)',
      'Plenty of water (8-10 glasses daily)',
      'Ginger tea for nausea relief',
      'Coenzyme Q10 sources (organ meats, fatty fish)'
    ],
    avoid: [
      'Aged cheeses (cheddar, blue cheese, parmesan)',
      'Processed meats (hot dogs, bacon, deli meats)',
      'Red wine and other alcoholic beverages',
      'Dark chocolate and cocoa products',
      'MSG-containing foods',
      'Artificial sweeteners (aspartame)',
      'Caffeine (limit to small amounts)',
      'Tyramine-rich foods (fermented foods, soy sauce)'
    ],
    supplements: [
      'Magnesium (400-600mg daily)',
      'Riboflavin/Vitamin B2 (400mg daily)',
      'Coenzyme Q10 (100-300mg daily)',
      'Feverfew extract',
      'Butterbur root extract'
    ],
    lifestyle: [
      'Maintain regular sleep schedule (7-9 hours)',
      'Practice stress management techniques',
      'Stay hydrated throughout the day',
      'Exercise regularly but avoid overexertion',
      'Keep a headache diary to identify triggers',
      'Limit screen time and blue light exposure'
    ]
  },

  'Tension Headache': {
    eat: [
      'Magnesium-rich foods (dark leafy greens, nuts)',
      'Anti-inflammatory foods (turmeric, ginger)',
      'Whole grains for steady blood sugar',
      'Lean proteins (chicken, fish, legumes)',
      'Fresh fruits and vegetables',
      'Herbal teas (chamomile, peppermint)',
      'Adequate water intake'
    ],
    avoid: [
      'Excessive caffeine',
      'Alcohol',
      'Processed and sugary foods',
      'Skipping meals',
      'Dehydrating beverages',
      'High-sodium foods'
    ],
    supplements: [
      'Magnesium (200-400mg daily)',
      'Vitamin B complex',
      'Omega-3 fatty acids'
    ],
    lifestyle: [
      'Regular sleep pattern',
      'Stress reduction techniques (meditation, yoga)',
      'Regular physical activity',
      'Proper posture and ergonomics',
      'Take regular breaks from work',
      'Neck and shoulder stretches'
    ]
  },

  'Cluster Headache': {
    eat: [
      'Anti-inflammatory foods (fatty fish, berries)',
      'Magnesium-rich foods',
      'Regular, balanced meals',
      'Plenty of water',
      'Melatonin-supporting foods (tart cherries)'
    ],
    avoid: [
      'Alcohol (especially during cluster periods)',
      'Nitrates (processed meats, some vegetables)',
      'Strong smells and perfumes',
      'Irregular meal timing',
      'Excessive caffeine'
    ],
    supplements: [
      'Melatonin (9-10mg at bedtime)',
      'Vitamin D3',
      'Magnesium',
      'Oxygen therapy (medical supervision required)'
    ],
    lifestyle: [
      'Strict sleep schedule',
      'Avoid daytime napping',
      'Oxygen therapy during attacks',
      'Avoid known triggers',
      'Regular exercise between cluster periods'
    ]
  },

  'Influenza': {
    eat: [
      'Chicken soup with vegetables',
      'Bone broth for electrolytes',
      'Citrus fruits (oranges, lemons, grapefruits)',
      'Ginger tea for nausea',
      'Honey for sore throat',
      'Garlic and onions for immune support',
      'Leafy greens (when appetite returns)',
      'Bananas for potassium',
      'Toast and crackers (easy to digest)',
      'Plenty of fluids (water, herbal teas, broths)'
    ],
    avoid: [
      'Alcohol',
      'Caffeine in excess',
      'Dairy products (if causing congestion)',
      'Processed and sugary foods',
      'Heavy, greasy meals',
      'Spicy foods (if causing discomfort)'
    ],
    supplements: [
      'Vitamin C (1000-2000mg daily)',
      'Zinc (8-11mg daily)',
      'Vitamin D3',
      'Elderberry extract',
      'Probiotics for gut health'
    ],
    lifestyle: [
      'Complete bed rest',
      'Stay hydrated (8-10 glasses of fluid daily)',
      'Use humidifier for breathing comfort',
      'Isolate to prevent spread',
      'Get plenty of sleep',
      'Gradual return to activities'
    ]
  },

  'Common Cold': {
    eat: [
      'Warm liquids (herbal teas, warm water with lemon)',
      'Chicken soup',
      'Citrus fruits for vitamin C',
      'Ginger for anti-inflammatory effects',
      'Honey for cough relief',
      'Garlic for immune support',
      'Spicy foods to clear congestion',
      'Zinc-rich foods (pumpkin seeds, chickpeas)'
    ],
    avoid: [
      'Excessive dairy (may increase mucus)',
      'Alcohol',
      'Processed foods',
      'Excessive sugar',
      'Dehydrating beverages'
    ],
    supplements: [
      'Vitamin C (500-1000mg daily)',
      'Zinc lozenges',
      'Echinacea',
      'Vitamin D3'
    ],
    lifestyle: [
      'Get extra rest and sleep',
      'Stay well-hydrated',
      'Use saline nasal rinses',
      'Humidify the air',
      'Wash hands frequently',
      'Avoid smoking and secondhand smoke'
    ]
  },

  'Bacterial Infection': {
    eat: [
      'Probiotic-rich foods (yogurt, kefir, sauerkraut)',
      'Prebiotic foods (garlic, onions, bananas)',
      'Anti-inflammatory foods (turmeric, ginger)',
      'Lean proteins for healing',
      'Vitamin C rich foods',
      'Plenty of fluids',
      'Bone broth for nutrients'
    ],
    avoid: [
      'Alcohol (interferes with antibiotics)',
      'Processed and sugary foods',
      'Excessive caffeine',
      'Raw or undercooked foods',
      'Foods high in refined sugar'
    ],
    supplements: [
      'Probiotics (during and after antibiotic treatment)',
      'Vitamin C',
      'Zinc for immune support',
      'Vitamin D3'
    ],
    lifestyle: [
      'Complete prescribed antibiotic course',
      'Get adequate rest',
      'Stay hydrated',
      'Follow medical advice strictly',
      'Monitor symptoms closely',
      'Maintain good hygiene'
    ]
  },

  'Gastroenteritis': {
    eat: [
      'Clear fluids (water, clear broths, electrolyte solutions)',
      'BRAT diet (bananas, rice, applesauce, toast)',
      'Plain crackers',
      'Boiled potatoes (no skin)',
      'Chamomile tea',
      'Ginger tea for nausea',
      'Gradually reintroduce bland foods'
    ],
    avoid: [
      'Dairy products',
      'Fatty and greasy foods',
      'Spicy foods',
      'High-fiber foods initially',
      'Alcohol',
      'Caffeine',
      'Artificial sweeteners',
      'Raw fruits and vegetables initially'
    ],
    supplements: [
      'Electrolyte replacement solutions',
      'Probiotics (after acute phase)',
      'Zinc for recovery'
    ],
    lifestyle: [
      'Rest and avoid strenuous activity',
      'Frequent small sips of fluids',
      'Gradual return to normal diet',
      'Good hand hygiene',
      'Avoid preparing food for others',
      'Monitor for dehydration signs'
    ]
  },

  'Food Poisoning': {
    eat: [
      'Clear liquids (water, clear broths)',
      'Electrolyte solutions',
      'Ice chips or popsicles',
      'BRAT diet when tolerated',
      'Ginger for nausea relief',
      'Gradually add bland foods'
    ],
    avoid: [
      'Dairy products',
      'Fatty, greasy, or spicy foods',
      'Alcohol and caffeine',
      'High-fiber foods initially',
      'Artificial sweeteners',
      'Any suspected contaminated foods'
    ],
    supplements: [
      'Oral rehydration salts',
      'Probiotics (after recovery begins)',
      'Activated charcoal (consult healthcare provider first)'
    ],
    lifestyle: [
      'Rest and stay hydrated',
      'Monitor for severe symptoms',
      'Seek medical attention if symptoms worsen',
      'Avoid solid foods until vomiting stops',
      'Practice food safety to prevent recurrence',
      'Report severe cases to health authorities'
    ]
  }
};

// Helper functions for diet database usage
export const getDietPlanForCondition = (conditionName: string) => {
  return DIET_DATABASE[conditionName] || null;
};

export const getDietPlanForConditions = (conditionNames: string[]) => {
  const combinedPlan = {
    eat: new Set<string>(),
    avoid: new Set<string>(),
    supplements: new Set<string>(),
    lifestyle: new Set<string>()
  };

  conditionNames.forEach(conditionName => {
    const plan = DIET_DATABASE[conditionName];
    if (plan) {
      plan.eat.forEach(item => combinedPlan.eat.add(item));
      plan.avoid.forEach(item => combinedPlan.avoid.add(item));
      if (plan.supplements) {
        plan.supplements.forEach(item => combinedPlan.supplements.add(item));
      }
      if (plan.lifestyle) {
        plan.lifestyle.forEach(item => combinedPlan.lifestyle.add(item));
      }
    }
  });

  return {
    eat: Array.from(combinedPlan.eat),
    avoid: Array.from(combinedPlan.avoid),
    supplements: Array.from(combinedPlan.supplements),
    lifestyle: Array.from(combinedPlan.lifestyle)
  };
};

export const getAllConditionsWithDietPlans = (): string[] => {
  return Object.keys(DIET_DATABASE);
};

export const searchDietRecommendations = (searchTerm: string) => {
  const results: { condition: string; matches: string[] }[] = [];
  const normalizedSearch = searchTerm.toLowerCase();

  Object.entries(DIET_DATABASE).forEach(([condition, plan]) => {
    const matches: string[] = [];
    
    // Search in foods to eat
    plan.eat.forEach(food => {
      if (food.toLowerCase().includes(normalizedSearch)) {
        matches.push(`Eat: ${food}`);
      }
    });
    
    // Search in foods to avoid
    plan.avoid.forEach(food => {
      if (food.toLowerCase().includes(normalizedSearch)) {
        matches.push(`Avoid: ${food}`);
      }
    });
    
    // Search in supplements
    if (plan.supplements) {
      plan.supplements.forEach(supplement => {
        if (supplement.toLowerCase().includes(normalizedSearch)) {
          matches.push(`Supplement: ${supplement}`);
        }
      });
    }
    
    if (matches.length > 0) {
      results.push({ condition, matches });
    }
  });

  return results;
};