import React, { useState, useEffect } from 'react';
import aiPredictionService from '../services/aiPredictionService';

const AIPredictions = ({ emprunts, immobilisations }) => {
  const [loading, setLoading] = useState(true);
  const [empruntPredictions, setEmpruntPredictions] = useState([]);
  const [immobilisationPredictions, setImmobilisationPredictions] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [activeTab, setActiveTab] = useState('emprunts');

  useEffect(() => {
    const initializeAI = async () => {
      try {
        setLoading(true);

        // Initialiser le service d'IA
        await aiPredictionService.initialize();

        // Obtenir les prédictions
        const empruntPreds = aiPredictionService.predictFutureEmprunts(emprunts);
        const immoPreds = aiPredictionService.predictFutureImmobilisations(immobilisations);

        // Obtenir les recommandations
        const recs = aiPredictionService.getRecommendations(empruntPreds, immoPreds);

        setEmpruntPredictions(empruntPreds);
        setImmobilisationPredictions(immoPreds);
        setRecommendations(recs);
      } catch (error) {
        console.error('Erreur lors de l\'initialisation des prédictions IA:', error);
      } finally {
        setLoading(false);
      }
    };

    if (emprunts.length > 0 && immobilisations.length > 0) {
      initializeAI();
    } else {
      setLoading(false);
    }
  }, [emprunts, immobilisations]);

  // Function to get color based on risk level
  const getRiskColor = (niveau) => {
    switch (niveau) {
      case 'Faible':
      case 'Low':
        return 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300';
      case 'Modéré':
      case 'Moderate':
        return 'bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-300';
      case 'Élevé':
      case 'High':
        return 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300';
      default:
        return 'bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-300';
    }
  };

  // Function to get color based on recommendation type
  const getRecommendationColor = (type) => {
    switch (type) {
      case 'warning': return 'bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800';
      case 'info': return 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800';
      default: return 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700';
    }
  };

  // Function to get icon based on recommendation type
  const getRecommendationIcon = (type) => {
    switch (type) {
      case 'warning':
        return (
          <div className="rounded-full bg-amber-100 dark:bg-amber-900/30 p-2 text-amber-600 dark:text-amber-400">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
        );
      case 'info':
        return (
          <div className="rounded-full bg-blue-100 dark:bg-blue-900/30 p-2 text-blue-600 dark:text-blue-400">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        );
      default:
        return (
          <div className="rounded-full bg-slate-100 dark:bg-slate-700 p-2 text-slate-600 dark:text-slate-400">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
        );
    }
  };

  if (loading) {
    return (
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-md p-6 border border-slate-200 dark:border-slate-700">
        <div className="flex items-center justify-center h-40">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          <span className="ml-3 text-slate-600 dark:text-slate-300">Initializing AI model...</span>
        </div>
      </div>
    );
  }

  if (emprunts.length === 0 || immobilisations.length === 0) {
    return (
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-md p-6 border border-slate-200 dark:border-slate-700">
        <div className="flex items-center justify-center h-40 text-slate-500 dark:text-slate-400">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className="text-lg">Add loans and assets to get AI predictions</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-950 rounded-xl shadow-md overflow-hidden border border-slate-800">
      {/* Header */}
      <div className="p-6 border-b border-slate-800">
        <h2 className="text-xl font-bold text-white flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
          AI Predictions and Recommendations
        </h2>
        <p className="text-slate-400 mt-1">
          Predictive analysis based on your financial data and economic trends
        </p>
      </div>

      {/* Navigation */}
      <div className="bg-slate-900 p-1 border-b border-slate-800 flex">
        <button
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            activeTab === 'emprunts'
              ? 'bg-blue-600 text-white'
              : 'text-slate-300 hover:bg-slate-800'
          }`}
          onClick={() => setActiveTab('emprunts')}
        >
          Loan Predictions
        </button>
        <button
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            activeTab === 'immobilisations'
              ? 'bg-green-600 text-white'
              : 'text-slate-300 hover:bg-slate-800'
          }`}
          onClick={() => setActiveTab('immobilisations')}
        >
          Asset Predictions
        </button>
        <button
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            activeTab === 'recommandations'
              ? 'bg-amber-600 text-white'
              : 'text-slate-300 hover:bg-slate-800'
          }`}
          onClick={() => setActiveTab('recommandations')}
        >
          Recommendations
        </button>
      </div>

      {/* Content */}
      <div className="p-6">
        {activeTab === 'emprunts' && (
          <div>
            <div className="mb-4 bg-slate-900 p-4 rounded-lg border border-slate-800">
              <h3 className="text-lg font-semibold text-white mb-2">Loan Forecasts</h3>
              <p className="text-slate-400 text-sm">
                Based on your current data and historical trends
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              {empruntPredictions.map((prediction) => (
                <div key={prediction.annee} className="bg-slate-900 rounded-lg border border-slate-800 overflow-hidden">
                  <div className="bg-slate-800 px-4 py-3 border-b border-slate-700">
                    <h4 className="font-bold text-white">{prediction.annee}</h4>
                  </div>
                  <div className="p-4">
                    <div className="mb-4">
                      <p className="text-slate-400 text-sm mb-1">Predicted Total Amount</p>
                      <p className="text-xl font-bold text-white">{prediction.montant_total_predit.toLocaleString()} DT</p>
                      <div className="flex items-center mt-1">
                        <span className={`text-xs px-2 py-0.5 rounded-full ${
                          prediction.croissance_estimee > 0
                            ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300'
                            : 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300'
                        }`}>
                          {prediction.croissance_estimee > 0 ? '+' : ''}{prediction.croissance_estimee}%
                        </span>
                        <span className="text-xs text-slate-500 dark:text-slate-400 ml-2">vs previous year</span>
                      </div>
                    </div>

                    <div className="mb-4">
                      <p className="text-slate-400 text-sm mb-1">Predicted Average Rate</p>
                      <p className="text-lg font-bold text-white">{prediction.taux_moyen_predit}%</p>
                    </div>

                    <div className="mb-4">
                      <p className="text-slate-400 text-sm mb-1">Risk Level</p>
                      <div className="flex items-center">
                        <span className={`text-xs px-2 py-1 rounded-full ${getRiskColor(prediction.niveau_risque.niveau)}`}>
                          {prediction.niveau_risque.niveau === 'Faible' ? 'Low' :
                           prediction.niveau_risque.niveau === 'Modéré' ? 'Moderate' :
                           prediction.niveau_risque.niveau === 'Élevé' ? 'High' :
                           prediction.niveau_risque.niveau} ({prediction.niveau_risque.score}/100)
                        </span>
                      </div>
                    </div>

                    <div>
                      <p className="text-slate-400 text-sm mb-1">Influencing Factors</p>
                      <div className="grid grid-cols-3 gap-2 text-center">
                        <div className="bg-slate-800 rounded p-2">
                          <p className="text-xs text-slate-400">Inflation</p>
                          <p className="text-sm font-medium text-white">{prediction.facteurs_influence.inflation}%</p>
                        </div>
                        <div className="bg-slate-800 rounded p-2">
                          <p className="text-xs text-slate-400">GDP</p>
                          <p className="text-sm font-medium text-white">{prediction.facteurs_influence.croissance_pib}%</p>
                        </div>
                        <div className="bg-slate-800 rounded p-2">
                          <p className="text-xs text-slate-400">Key Rate</p>
                          <p className="text-sm font-medium text-white">{prediction.facteurs_influence.taux_directeur}%</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'immobilisations' && (
          <div>
            <div className="mb-4 bg-slate-900 p-4 rounded-lg border border-slate-800">
              <h3 className="text-lg font-semibold text-white mb-2">Asset Forecasts</h3>
              <p className="text-slate-400 text-sm">
                Estimation of the evolution of your fixed assets
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              {immobilisationPredictions.map((prediction) => (
                <div key={prediction.annee} className="bg-slate-900 rounded-lg border border-slate-800 overflow-hidden">
                  <div className="bg-slate-800 px-4 py-3 border-b border-slate-700">
                    <h4 className="font-bold text-white">{prediction.annee}</h4>
                  </div>
                  <div className="p-4">
                    <div className="mb-4">
                      <p className="text-slate-400 text-sm mb-1">Predicted Acquisition Value</p>
                      <p className="text-xl font-bold text-white">{prediction.valeur_acquisition_totale_predite.toLocaleString()} DT</p>
                    </div>

                    <div className="mb-4">
                      <p className="text-slate-400 text-sm mb-1">Predicted Annual Depreciation</p>
                      <p className="text-lg font-bold text-white">{prediction.amortissement_annuel_predit.toLocaleString()} DT</p>
                      <p className="text-xs text-slate-400 mt-1">
                        Depreciation Rate: {prediction.depreciation_estimee}%
                      </p>
                    </div>

                    <div>
                      <p className="text-slate-400 text-sm mb-1">Trend</p>
                      <div className="flex items-center">
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          prediction.tendance.includes('hausse')
                            ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300'
                            : prediction.tendance === 'stable'
                              ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300'
                              : 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300'
                        }`}>
                          {prediction.tendance.includes('hausse_significative') ? 'Significant Increase' :
                           prediction.tendance.includes('hausse_moderee') ? 'Moderate Increase' :
                           prediction.tendance.includes('hausse_legere') ? 'Slight Increase' :
                           prediction.tendance === 'stable' ? 'Stable' :
                           prediction.tendance.includes('baisse') ? 'Decrease' :
                           prediction.tendance.charAt(0).toUpperCase() + prediction.tendance.slice(1).replace('_', ' ')}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'recommandations' && (
          <div>
            <div className="mb-4 bg-slate-900 p-4 rounded-lg border border-slate-800">
              <h3 className="text-lg font-semibold text-white mb-2">Financial Recommendations</h3>
              <p className="text-slate-400 text-sm">
                Suggestions based on predictive analysis of your data
              </p>
            </div>

            {recommendations.length > 0 ? (
              <div className="space-y-4">
                {recommendations.map((rec, index) => (
                  <div
                    key={index}
                    className={`p-4 rounded-lg border ${getRecommendationColor(rec.type)} flex items-start`}
                  >
                    {getRecommendationIcon(rec.type)}
                    <div className="ml-3">
                      <h4 className="font-medium text-white capitalize">
                        {rec.categorie === 'emprunts' ? 'Loans' :
                         rec.categorie === 'immobilisations' ? 'Assets' : 'General'}
                      </h4>
                      <p className="text-slate-300 mt-1">{rec.message}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex items-center justify-center h-40 text-slate-500">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-lg">No specific recommendations at this time</span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AIPredictions;
