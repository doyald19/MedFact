import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Home, 
  LayoutDashboard, 
  Settings, 
  Mail, 
  LogOut, 
  Clock, 
  FileText, 
  Utensils, 
  ArrowRight,
  Calendar,
  AlertCircle,
  CheckCircle,
  User
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { GlassCard, GalaxyEffect, BackgroundEffectErrorBoundary } from '../components';
import { HealthReport, DietPlan, AnalysisResults } from '../types';
import { getDietPlanForConditions } from '../data/dietDatabase';

const Dashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [healthReports, setHealthReports] = useState<HealthReport[]>([]);
  const [dietPlans, setDietPlans] = useState<any[]>([]);

  useEffect(() => {
    // Load user's health reports from localStorage
    if (user) {
      const savedReports = localStorage.getItem(`health_reports_${user.id}`);
      if (savedReports) {
        try {
          const reports = JSON.parse(savedReports).map((report: any) => ({
            ...report,
            timestamp: new Date(report.timestamp),
            followUpDate: report.followUpDate ? new Date(report.followUpDate) : undefined
          }));
          setHealthReports(reports);
          
          // Generate diet plans based on conditions from reports
          generateDietPlans(reports);
        } catch (error) {
          console.error('Error loading health reports:', error);
        }
      }
    }
  }, [user]);

  const generateDietPlans = (reports: HealthReport[]) => {
    const allConditions = new Set<string>();
    
    // Collect all conditions from reports
    reports.forEach(report => {
      report.results.possibleConditions.forEach(condition => {
        allConditions.add(condition.name);
      });
    });

    const conditionNames = Array.from(allConditions);
    if (conditionNames.length > 0) {
      const combinedDietPlan = getDietPlanForConditions(conditionNames);
      
      const dietPlanData = {
        id: `diet_${Date.now()}`,
        userId: user?.id || '',
        conditionIds: conditionNames,
        recommendations: [
          {
            category: 'foods_to_include' as const,
            items: combinedDietPlan.eat,
            reasoning: 'These foods support healing and provide essential nutrients for your conditions.'
          },
          {
            category: 'foods_to_avoid' as const,
            items: combinedDietPlan.avoid,
            reasoning: 'These foods may worsen symptoms or interfere with recovery.'
          },
          {
            category: 'supplements' as const,
            items: combinedDietPlan.supplements,
            reasoning: 'These supplements may help support your recovery and overall health.'
          },
          {
            category: 'lifestyle' as const,
            items: combinedDietPlan.lifestyle,
            reasoning: 'These lifestyle changes can significantly improve your symptoms and overall well-being.'
          }
        ],
        restrictions: [],
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      setDietPlans([dietPlanData]);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'text-red-400';
      case 'medium': return 'text-yellow-400';
      case 'low': return 'text-green-400';
      default: return 'text-gray-400';
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'high': return <AlertCircle className="w-4 h-4" />;
      case 'medium': return <Clock className="w-4 h-4" />;
      case 'low': return <CheckCircle className="w-4 h-4" />;
      default: return <FileText className="w-4 h-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 relative overflow-hidden safe-area-inset">
      {/* Skip to main content link for accessibility */}
      <a href="#dashboard-main" className="skip-link sr-only focus:not-sr-only">
        Skip to main content
      </a>
      
      {/* Galaxy Background Effect */}
      <BackgroundEffectErrorBoundary>
        <GalaxyEffect particleCount={120} interactive={true} mouseInfluence={60} />
      </BackgroundEffectErrorBoundary>
      
      {/* Header Navigation */}
      <header className="relative z-10 p-4 sm:p-6">
        <GlassCard className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0 p-4 sm:p-6" aria-label="Dashboard header">
          <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-8 w-full sm:w-auto">
            <Link to="/" className="flex items-center space-x-2" aria-label="MedFact home">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-400 to-purple-400 rounded-lg flex items-center justify-center" aria-hidden="true">
                <span className="text-white font-bold text-sm">M</span>
              </div>
              <span className="text-white font-semibold text-lg sm:text-xl">MedFact</span>
            </Link>
            
            <nav className="hidden md:flex items-center space-x-4 lg:space-x-6" role="navigation" aria-label="Main navigation">
              <Link 
                to="/" 
                className="flex items-center space-x-2 text-white/70 hover:text-white transition-colors min-h-[44px] px-2 focus:outline-none focus:ring-2 focus:ring-white/50 rounded-lg"
              >
                <Home className="w-4 h-4" aria-hidden="true" />
                <span>Home</span>
              </Link>
              <Link 
                to="/dashboard" 
                className="flex items-center space-x-2 text-white font-medium min-h-[44px] px-2 focus:outline-none focus:ring-2 focus:ring-white/50 rounded-lg"
                aria-current="page"
              >
                <LayoutDashboard className="w-4 h-4" aria-hidden="true" />
                <span>Dashboard</span>
              </Link>
              <Link 
                to="/settings" 
                className="flex items-center space-x-2 text-white/70 hover:text-white transition-colors min-h-[44px] px-2 focus:outline-none focus:ring-2 focus:ring-white/50 rounded-lg"
              >
                <Settings className="w-4 h-4" aria-hidden="true" />
                <span>Settings</span>
              </Link>
              <Link 
                to="/contact" 
                className="flex items-center space-x-2 text-white/70 hover:text-white transition-colors min-h-[44px] px-2 focus:outline-none focus:ring-2 focus:ring-white/50 rounded-lg"
              >
                <Mail className="w-4 h-4" aria-hidden="true" />
                <span>Contact</span>
              </Link>
            </nav>
          </div>
          
          <div className="flex items-center space-x-3 sm:space-x-4 w-full sm:w-auto justify-between sm:justify-end">
            {/* Mobile Navigation */}
            <nav className="flex md:hidden items-center space-x-2" role="navigation" aria-label="Mobile navigation">
              <Link 
                to="/" 
                className="flex items-center justify-center text-white/70 hover:text-white transition-colors min-h-[44px] min-w-[44px] focus:outline-none focus:ring-2 focus:ring-white/50 rounded-lg"
                aria-label="Home"
              >
                <Home className="w-5 h-5" aria-hidden="true" />
              </Link>
              <Link 
                to="/settings" 
                className="flex items-center justify-center text-white/70 hover:text-white transition-colors min-h-[44px] min-w-[44px] focus:outline-none focus:ring-2 focus:ring-white/50 rounded-lg"
                aria-label="Settings"
              >
                <Settings className="w-5 h-5" aria-hidden="true" />
              </Link>
              <Link 
                to="/contact" 
                className="flex items-center justify-center text-white/70 hover:text-white transition-colors min-h-[44px] min-w-[44px] focus:outline-none focus:ring-2 focus:ring-white/50 rounded-lg"
                aria-label="Contact"
              >
                <Mail className="w-5 h-5" aria-hidden="true" />
              </Link>
            </nav>
            
            <div className="flex items-center space-x-2 text-white">
              <User className="w-4 h-4" aria-hidden="true" />
              <span className="hidden sm:inline">{user?.name}</span>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 text-white/70 hover:text-white transition-colors min-h-[44px] px-3 focus:outline-none focus:ring-2 focus:ring-white/50 rounded-lg"
              aria-label="Log out of your account"
            >
              <LogOut className="w-4 h-4" aria-hidden="true" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </GlassCard>
      </header>

      {/* Main Dashboard Content */}
      <main id="dashboard-main" className="relative z-10 px-4 sm:px-6 pb-8 sm:pb-12">
        <div className="max-w-7xl mx-auto space-y-6 sm:space-y-8">
          {/* Welcome Section */}
          <GlassCard className="text-center py-6 sm:py-8 px-4 sm:px-6" aria-label="Welcome section">
            <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">
              Welcome back, {user?.name}!
            </h1>
            <p className="text-white/70 text-sm sm:text-base">
              Track your health journey and access personalized recommendations
            </p>
          </GlassCard>

          {/* Dashboard Sections Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
            {/* Health Reports Section */}
            <section className="lg:col-span-2" aria-labelledby="health-reports-heading">
              <GlassCard className="h-full p-4 sm:p-6">
                <div className="flex items-center justify-between mb-4 sm:mb-6">
                  <h2 id="health-reports-heading" className="text-lg sm:text-xl font-semibold text-white flex items-center">
                    <FileText className="w-5 h-5 mr-2" aria-hidden="true" />
                    My Health Reports
                  </h2>
                  <span className="text-white/60 text-sm" aria-live="polite">
                    {healthReports.length} report{healthReports.length !== 1 ? 's' : ''}
                  </span>
                </div>
                
                <div className="space-y-4 max-h-80 sm:max-h-96 overflow-y-auto" role="list" aria-label="Health reports list">
                  {healthReports.length === 0 ? (
                    <div className="text-center py-6 sm:py-8 text-white/60">
                      <FileText className="w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-4 opacity-50" aria-hidden="true" />
                      <p>No health reports yet</p>
                      <p className="text-sm mt-2">
                        Complete a symptom analysis to see your reports here
                      </p>
                      <Link 
                        to="/" 
                        className="inline-flex items-center mt-4 px-4 py-2 min-h-[44px] bg-blue-500/20 text-blue-300 rounded-lg hover:bg-blue-500/30 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                      >
                        Start Analysis
                        <ArrowRight className="w-4 h-4 ml-2" aria-hidden="true" />
                      </Link>
                    </div>
                  ) : (
                    healthReports.map((report) => (
                      <article key={report.id} className="bg-white/5 rounded-lg p-3 sm:p-4 border border-white/10" role="listitem">
                        <div className="flex flex-col sm:flex-row sm:items-start justify-between mb-3 gap-2">
                          <div>
                            <h3 className="font-medium text-white capitalize text-sm sm:text-base">
                              {report.initialSymptom}
                            </h3>
                            <p className="text-white/60 text-xs sm:text-sm flex items-center mt-1">
                              <Calendar className="w-3 h-3 mr-1" aria-hidden="true" />
                              <time dateTime={report.timestamp.toISOString()}>{formatDate(report.timestamp)}</time>
                            </p>
                          </div>
                          <div className={`flex items-center space-x-1 ${getSeverityColor(report.results.severity)}`}>
                            {getSeverityIcon(report.results.severity)}
                            <span className="text-xs sm:text-sm capitalize">{report.results.severity}</span>
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <div>
                            <p className="text-white/80 text-xs sm:text-sm font-medium">Possible Conditions:</p>
                            <p className="text-white/60 text-xs sm:text-sm">
                              {report.results.possibleConditions.map(c => c.name).join(', ')}
                            </p>
                          </div>
                          
                          {report.results.recommendedActions.length > 0 && (
                            <div>
                              <p className="text-white/80 text-xs sm:text-sm font-medium">Recommendations:</p>
                              <p className="text-white/60 text-xs sm:text-sm">
                                {report.results.recommendedActions[0]}
                                {report.results.recommendedActions.length > 1 && '...'}
                              </p>
                            </div>
                          )}
                        </div>
                      </article>
                    ))
                  )}
                </div>
              </GlassCard>
            </section>

            {/* Diet Plans Section */}
            <section aria-labelledby="diet-plans-heading">
              <GlassCard className="h-full p-4 sm:p-6">
                <div className="flex items-center justify-between mb-4 sm:mb-6">
                  <h2 id="diet-plans-heading" className="text-lg sm:text-xl font-semibold text-white flex items-center">
                    <Utensils className="w-5 h-5 mr-2" aria-hidden="true" />
                    Diet Plans
                  </h2>
                </div>
                
                <div className="space-y-4">
                  {dietPlans.length === 0 ? (
                    <div className="text-center py-6 sm:py-8 text-white/60">
                      <Utensils className="w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-4 opacity-50" aria-hidden="true" />
                      <p>No diet plans available</p>
                      <p className="text-sm mt-2">
                        Complete health assessments to get personalized diet recommendations
                      </p>
                    </div>
                  ) : (
                    dietPlans.map((plan) => (
                      <div key={plan.id} className="space-y-4">
                        <div className="bg-white/5 rounded-lg p-3 sm:p-4 border border-white/10">
                          <h3 className="font-medium text-white mb-2 text-sm sm:text-base">Based on Your Conditions</h3>
                          <p className="text-white/60 text-xs sm:text-sm mb-3">
                            {plan.conditionIds.join(', ')}
                          </p>
                          
                          {plan.recommendations.map((rec: any, index: number) => (
                            <div key={index} className="mb-4 last:mb-0">
                              <h4 className="text-white/80 text-xs sm:text-sm font-medium mb-2 capitalize">
                                {rec.category.replace('_', ' ')}
                              </h4>
                              <ul className="text-white/60 text-xs sm:text-sm space-y-1" role="list">
                                {rec.items.slice(0, 3).map((item: string, itemIndex: number) => (
                                  <li key={itemIndex} className="flex items-start">
                                    <span className="w-1 h-1 bg-white/40 rounded-full mt-2 mr-2 flex-shrink-0" aria-hidden="true"></span>
                                    {item}
                                  </li>
                                ))}
                                {rec.items.length > 3 && (
                                  <li className="text-white/40 text-xs">
                                    +{rec.items.length - 3} more items
                                  </li>
                                )}
                              </ul>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </GlassCard>
            </section>
          </div>

          {/* Next Steps Section */}
          <section aria-labelledby="next-steps-heading">
            <GlassCard className="p-4 sm:p-6">
              <div className="flex items-center justify-between mb-4 sm:mb-6">
                <h2 id="next-steps-heading" className="text-lg sm:text-xl font-semibold text-white flex items-center">
                  <ArrowRight className="w-5 h-5 mr-2" aria-hidden="true" />
                  Next Steps
                </h2>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                <article className="bg-white/5 rounded-lg p-3 sm:p-4 border border-white/10">
                  <h3 className="font-medium text-white mb-2 text-sm sm:text-base">Regular Check-ups</h3>
                  <p className="text-white/60 text-xs sm:text-sm mb-3">
                    Schedule regular health assessments to monitor your progress and catch any changes early.
                  </p>
                  <button className="text-blue-300 text-xs sm:text-sm hover:text-blue-200 transition-colors min-h-[44px] flex items-center focus:outline-none focus:ring-2 focus:ring-blue-500/50 rounded">
                    Schedule Assessment →
                  </button>
                </article>
                
                <article className="bg-white/5 rounded-lg p-3 sm:p-4 border border-white/10">
                  <h3 className="font-medium text-white mb-2 text-sm sm:text-base">Specialist Consultation</h3>
                  <p className="text-white/60 text-xs sm:text-sm mb-3">
                    Consider consulting with healthcare specialists based on your symptom analysis results.
                  </p>
                  <button className="text-blue-300 text-xs sm:text-sm hover:text-blue-200 transition-colors min-h-[44px] flex items-center focus:outline-none focus:ring-2 focus:ring-blue-500/50 rounded">
                    Find Specialists →
                  </button>
                </article>
                
                <article className="bg-white/5 rounded-lg p-3 sm:p-4 border border-white/10 sm:col-span-2 lg:col-span-1">
                  <h3 className="font-medium text-white mb-2 text-sm sm:text-base">Lifestyle Tracking</h3>
                  <p className="text-white/60 text-xs sm:text-sm mb-3">
                    Track your symptoms, diet, and lifestyle changes to identify patterns and improvements.
                  </p>
                  <button className="text-blue-300 text-xs sm:text-sm hover:text-blue-200 transition-colors min-h-[44px] flex items-center focus:outline-none focus:ring-2 focus:ring-blue-500/50 rounded">
                    Start Tracking →
                  </button>
                </article>
              </div>
            </GlassCard>
          </section>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;