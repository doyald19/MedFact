import React from 'react';
import { AnalysisResults } from '../types';
import GlassCard from './ui/GlassCard';
import { AlertTriangle, Info, Heart, Shield } from 'lucide-react';

interface SymptomResultsProps {
  results: AnalysisResults;
  initialSymptom: string;
  onAuthPrompt?: () => void;
}

const SymptomResults: React.FC<SymptomResultsProps> = ({ 
  results, 
  initialSymptom,
  onAuthPrompt 
}) => {
  const getSeverityColor = (severity: 'low' | 'medium' | 'high') => {
    switch (severity) {
      case 'high':
        return 'text-red-400';
      case 'medium':
        return 'text-yellow-400';
      default:
        return 'text-green-400';
    }
  };

  const getSeverityIcon = (severity: 'low' | 'medium' | 'high') => {
    switch (severity) {
      case 'high':
        return <AlertTriangle className="w-5 h-5 text-red-400" aria-hidden="true" />;
      case 'medium':
        return <AlertTriangle className="w-5 h-5 text-yellow-400" aria-hidden="true" />;
      default:
        return <Info className="w-5 h-5 text-green-400" aria-hidden="true" />;
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6 max-w-4xl mx-auto px-2 sm:px-0">
      {/* Medical Disclaimer - Prominent and Required */}
      <GlassCard className="p-4 sm:p-6 border-2 border-red-500/50 bg-red-500/10" role="alert" aria-label="Medical disclaimer">
        <div className="flex items-start space-x-3">
          <AlertTriangle className="w-5 h-5 sm:w-6 sm:h-6 text-red-400 flex-shrink-0 mt-1" aria-hidden="true" />
          <div>
            <h3 className="text-base sm:text-lg font-semibold text-red-400 mb-2">Important Medical Disclaimer</h3>
            <p className="text-red-300 leading-relaxed text-sm sm:text-base">
              This information is for educational purposes only and is not intended as medical advice, 
              diagnosis, or treatment. Always consult with a qualified healthcare professional for 
              medical concerns. If you are experiencing a medical emergency, call emergency services immediately.
            </p>
          </div>
        </div>
      </GlassCard>

      {/* Analysis Summary */}
      <GlassCard className="p-4 sm:p-6" aria-label="Analysis summary">
        <div className="flex items-center space-x-3 mb-4">
          {getSeverityIcon(results.severity)}
          <h2 className="text-xl sm:text-2xl font-bold">Analysis Results</h2>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4 sm:mb-6">
          <div>
            <p className="text-xs sm:text-sm opacity-75 mb-1">Initial Symptom</p>
            <p className="font-semibold capitalize text-sm sm:text-base">{initialSymptom}</p>
          </div>
          <div>
            <p className="text-xs sm:text-sm opacity-75 mb-1">Severity Assessment</p>
            <p className={`font-semibold capitalize text-sm sm:text-base ${getSeverityColor(results.severity)}`}>
              {results.severity}
            </p>
          </div>
        </div>
      </GlassCard>

      {/* Possible Conditions */}
      <GlassCard className="p-4 sm:p-6" aria-labelledby="conditions-heading">
        <div className="flex items-center space-x-3 mb-4">
          <Heart className="w-5 h-5 text-blue-400" aria-hidden="true" />
          <h3 id="conditions-heading" className="text-lg sm:text-xl font-semibold">Possible Conditions</h3>
        </div>
        
        {results.possibleConditions.length > 0 ? (
          <div className="space-y-4" role="list" aria-label="List of possible conditions">
            {results.possibleConditions.map((condition, index) => (
              <article key={condition.id} className="border border-white/20 rounded-lg p-3 sm:p-4" role="listitem">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between mb-2 gap-2">
                  <h4 className="font-semibold text-base sm:text-lg">{condition.name}</h4>
                  <span className={`text-xs sm:text-sm px-2 py-1 rounded-full ${getSeverityColor(condition.severity)} bg-current/20 self-start`}>
                    {condition.severity} severity
                  </span>
                </div>
                <p className="text-xs sm:text-sm opacity-75 mb-3">{condition.description}</p>
                
                <div>
                  <p className="text-xs sm:text-sm font-medium mb-2">Common symptoms:</p>
                  <div className="flex flex-wrap gap-1 sm:gap-2">
                    {condition.commonSymptoms.map((symptom, idx) => (
                      <span 
                        key={idx}
                        className="text-xs px-2 py-1 bg-white/10 rounded-full"
                      >
                        {symptom}
                      </span>
                    ))}
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <p className="text-center opacity-75 py-4 text-sm sm:text-base">
            No specific conditions identified. Consider consulting a healthcare provider for further evaluation.
          </p>
        )}
      </GlassCard>

      {/* Symptoms Identified */}
      <GlassCard className="p-4 sm:p-6" aria-labelledby="symptoms-heading">
        <div className="flex items-center space-x-3 mb-4">
          <Info className="w-5 h-5 text-green-400" aria-hidden="true" />
          <h3 id="symptoms-heading" className="text-lg sm:text-xl font-semibold">Symptoms Identified</h3>
        </div>
        
        <div className="flex flex-wrap gap-2" role="list" aria-label="List of identified symptoms">
          {results.symptoms.map((symptom, index) => (
            <span 
              key={index}
              className="px-2 sm:px-3 py-1 sm:py-2 bg-green-500/20 text-green-300 rounded-lg text-xs sm:text-sm"
              role="listitem"
            >
              {symptom}
            </span>
          ))}
        </div>
      </GlassCard>

      {/* Preventive Measures */}
      <GlassCard className="p-4 sm:p-6" aria-labelledby="preventive-heading">
        <div className="flex items-center space-x-3 mb-4">
          <Shield className="w-5 h-5 text-purple-400" aria-hidden="true" />
          <h3 id="preventive-heading" className="text-lg sm:text-xl font-semibold">Preventive Measures</h3>
        </div>
        
        <ul className="space-y-2" role="list">
          {results.preventiveMeasures.map((measure, index) => (
            <li key={index} className="flex items-start space-x-2">
              <span className="w-2 h-2 bg-purple-400 rounded-full mt-2 flex-shrink-0" aria-hidden="true"></span>
              <span className="text-xs sm:text-sm">{measure}</span>
            </li>
          ))}
        </ul>
      </GlassCard>

      {/* Recommended Actions */}
      <GlassCard className="p-4 sm:p-6" aria-labelledby="actions-heading">
        <div className="flex items-center space-x-3 mb-4">
          <AlertTriangle className="w-5 h-5 text-orange-400" aria-hidden="true" />
          <h3 id="actions-heading" className="text-lg sm:text-xl font-semibold">Recommended Actions</h3>
        </div>
        
        <ol className="space-y-3" role="list">
          {results.recommendedActions.map((action, index) => (
            <li key={index} className="flex items-start space-x-3">
              <span className="w-5 h-5 sm:w-6 sm:h-6 bg-orange-500/20 text-orange-400 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5" aria-hidden="true">
                {index + 1}
              </span>
              <span className="text-xs sm:text-sm">{action}</span>
            </li>
          ))}
        </ol>
      </GlassCard>

      {/* Call to Action for Authentication */}
      {onAuthPrompt && (
        <GlassCard className="p-4 sm:p-6 text-center border-2 border-blue-500/50 bg-blue-500/10" aria-label="Sign up prompt">
          <div className="space-y-3 sm:space-y-4">
            <h3 className="text-lg sm:text-xl font-semibold text-blue-300">
              Get Personalized Health Insights
            </h3>
            <p className="text-blue-200 opacity-90 text-sm sm:text-base">
              Log in to view your personalized Diet Plan, save this analysis to your Health Reports, 
              and get detailed cure recommendations based on your health profile.
            </p>
            <button
              onClick={onAuthPrompt}
              className="px-4 sm:px-6 py-3 min-h-[44px] bg-blue-500 text-white font-semibold rounded-lg glass-button-primary text-sm sm:text-base"
            >
              Log in to view your personalized Diet Plan and Cure Details
            </button>
          </div>
        </GlassCard>
      )}

      {/* Additional Medical Disclaimer at Bottom */}
      <div className="text-center py-3 sm:py-4" role="alert">
        <p className="text-yellow-400 text-xs sm:text-sm font-medium">
          ⚠️ This analysis is for informational purposes only - Always consult healthcare professionals for medical advice
        </p>
      </div>
    </div>
  );
};

export default SymptomResults;