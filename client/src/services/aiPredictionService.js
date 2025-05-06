import * as tf from '@tensorflow/tfjs';
import { SimpleLinearRegression } from 'ml-regression';
import { mean, standardDeviation } from 'simple-statistics';
import datasetJson from '../data/dataset.json';

// Classe pour gérer les prédictions financières
class AIPredictionService {
  constructor() {
    this.dataset = datasetJson;
    this.models = {};
    this.initialized = false;
  }

  // Initialiser les modèles
  async initialize() {
    if (this.initialized) return;

    try {
      // Créer et entraîner les modèles
      await this.trainEmpruntModel();
      await this.trainImmobilisationModel();

      this.initialized = true;
      console.log('Modèles IA initialisés avec succès');
    } catch (error) {
      console.error('Erreur lors de l\'initialisation des modèles IA:', error);
    }
  }

  // Entraîner le modèle pour les emprunts
  async trainEmpruntModel() {
    const data = this.dataset.emprunts_historiques;

    // Préparer les données d'entraînement
    const xsMontant = data.map(d => d.annee);
    const ysMontant = data.map(d => d.montant_total);
    const xsTaux = data.map(d => d.annee);
    const ysTaux = data.map(d => d.taux_moyen);

    // Créer des modèles de régression linéaire simple
    this.models.empruntMontant = new SimpleLinearRegression(xsMontant, ysMontant);
    this.models.empruntTaux = new SimpleLinearRegression(xsTaux, ysTaux);

    // Créer un modèle TensorFlow pour les prédictions plus complexes
    const model = tf.sequential();
    model.add(tf.layers.dense({
      units: 10,
      inputShape: [3], // année, taux d'inflation, croissance PIB
      activation: 'relu'
    }));
    model.add(tf.layers.dense({
      units: 1,
      activation: 'linear'
    }));

    model.compile({
      optimizer: tf.train.adam(0.01),
      loss: 'meanSquaredError'
    });

    // Préparer les données pour TensorFlow
    const economicData = this.dataset.indicateurs_economiques;
    const xs = tf.tensor2d(
      data.map((d, i) => [
        d.annee,
        economicData[i].inflation,
        economicData[i].croissance_pib
      ])
    );
    const ys = tf.tensor2d(data.map(d => [d.montant_total]));

    // Entraîner le modèle
    await model.fit(xs, ys, {
      epochs: 100,
      callbacks: {
        onEpochEnd: (epoch, logs) => {
          if (epoch % 20 === 0) {
            console.log(`Epoch ${epoch}: loss = ${logs.loss}`);
          }
        }
      }
    });

    this.models.empruntTensorFlow = model;
  }

  // Entraîner le modèle pour les immobilisations
  async trainImmobilisationModel() {
    const data = this.dataset.immobilisations_historiques;

    // Préparer les données d'entraînement
    const xsValeur = data.map(d => d.annee);
    const ysValeur = data.map(d => d.valeur_acquisition_totale);
    const xsAmort = data.map(d => d.annee);
    const ysAmort = data.map(d => d.amortissement_annuel);

    // Créer des modèles de régression linéaire simple
    this.models.immobilisationValeur = new SimpleLinearRegression(xsValeur, ysValeur);
    this.models.immobilisationAmort = new SimpleLinearRegression(xsAmort, ysAmort);
  }

  // Prédire les montants futurs des emprunts
  predictFutureEmprunts(currentData, years = 3) {
    if (!this.initialized) {
      console.warn('Les modèles IA ne sont pas initialisés');
      return null;
    }

    const currentYear = new Date().getFullYear();
    const predictions = [];

    // Calculer quelques statistiques sur les données actuelles
    const currentMontants = currentData.map(e => Number(e.montant) || 0);
    const avgMontant = mean(currentMontants) || 0;
    const stdMontant = standardDeviation(currentMontants) || 0;
    const totalMontant = currentMontants.reduce((sum, val) => sum + val, 0);

    // Obtenir les dernières données économiques
    const lastEconomicData = this.dataset.indicateurs_economiques[
      this.dataset.indicateurs_economiques.length - 1
    ];

    // Prédictions pour les années futures
    for (let i = 1; i <= years; i++) {
      const year = currentYear + i;

      // Prédiction simple basée sur la régression linéaire
      const predictedMontant = this.models.empruntMontant.predict(year);
      const predictedTaux = this.models.empruntTaux.predict(year);

      // Ajuster en fonction des données actuelles
      const adjustmentFactor = totalMontant /
        (this.dataset.emprunts_historiques[this.dataset.emprunts_historiques.length - 1].montant_total || 1);

      // Obtenir les prédictions économiques pour cette année
      const economicPrediction = this.dataset.predictions[year.toString()] ||
        this.dataset.predictions[Object.keys(this.dataset.predictions)[Object.keys(this.dataset.predictions).length - 1]];

      // Prédiction finale ajustée
      const finalPrediction = {
        annee: year,
        montant_total_predit: Math.round(predictedMontant * adjustmentFactor),
        taux_moyen_predit: Number(predictedTaux.toFixed(2)),
        croissance_estimee: Number(((predictedMontant /
          this.models.empruntMontant.predict(year - 1) - 1) * 100).toFixed(1)),
        facteurs_influence: {
          inflation: economicPrediction?.inflation_estimee || lastEconomicData.inflation,
          croissance_pib: economicPrediction?.croissance_pib_estimee || lastEconomicData.croissance_pib,
          taux_directeur: economicPrediction?.taux_directeur_estime || lastEconomicData.taux_directeur
        },
        niveau_risque: this.calculateRiskLevel(
          predictedMontant,
          predictedTaux,
          economicPrediction?.inflation_estimee || lastEconomicData.inflation
        )
      };

      predictions.push(finalPrediction);
    }

    return predictions;
  }

  // Prédire les valeurs futures des immobilisations
  predictFutureImmobilisations(currentData, years = 3) {
    if (!this.initialized) {
      console.warn('Les modèles IA ne sont pas initialisés');
      return null;
    }

    const currentYear = new Date().getFullYear();
    const predictions = [];

    // Calculer quelques statistiques sur les données actuelles
    const currentValeurs = currentData.map(i => Number(i.valeur_acquisition) || 0);
    const avgValeur = mean(currentValeurs) || 0;
    const totalValeur = currentValeurs.reduce((sum, val) => sum + val, 0);

    // Ajustement basé sur les données actuelles vs historiques
    const adjustmentFactor = totalValeur /
      (this.dataset.immobilisations_historiques[this.dataset.immobilisations_historiques.length - 1].valeur_acquisition_totale || 1);

    // Prédictions pour les années futures
    for (let i = 1; i <= years; i++) {
      const year = currentYear + i;

      // Prédiction simple basée sur la régression linéaire
      const predictedValeur = this.models.immobilisationValeur.predict(year);
      const predictedAmort = this.models.immobilisationAmort.predict(year);

      // Obtenir les prédictions économiques pour cette année
      const economicPrediction = this.dataset.predictions[year.toString()] ||
        this.dataset.predictions[Object.keys(this.dataset.predictions)[Object.keys(this.dataset.predictions).length - 1]];

      // Prédiction finale ajustée
      const finalPrediction = {
        annee: year,
        valeur_acquisition_totale_predite: Math.round(predictedValeur * adjustmentFactor),
        amortissement_annuel_predit: Math.round(predictedAmort * adjustmentFactor),
        tendance: economicPrediction?.tendance_immobilisations || 'stable',
        depreciation_estimee: Number((predictedAmort / predictedValeur * 100).toFixed(1))
      };

      predictions.push(finalPrediction);
    }

    return predictions;
  }

  // Calculate risk level
  calculateRiskLevel(montant, taux, inflation) {
    // Simple risk level calculation based on interest rate relative to inflation
    const riskFactor = (taux / inflation) * (montant / 200000);

    if (riskFactor < 0.8) return { niveau: 'Low', score: Math.round(riskFactor * 100) };
    if (riskFactor < 1.2) return { niveau: 'Moderate', score: Math.round(riskFactor * 100) };
    return { niveau: 'High', score: Math.round(riskFactor * 100) };
  }

  // Obtenir des recommandations basées sur les prédictions
  getRecommendations(empruntPredictions, immobilisationPredictions) {
    const recommendations = [];

    if (!empruntPredictions || !empruntPredictions[0] || !immobilisationPredictions || !immobilisationPredictions[0]) {
      // Default recommendations if predictions are empty
      recommendations.push({
        type: 'info',
        categorie: 'general',
        message: 'Add more financial data to get more accurate recommendations.'
      });

      recommendations.push({
        type: 'info',
        categorie: 'emprunts',
        message: 'Monitor market interest rates to optimize your future loans.'
      });

      recommendations.push({
        type: 'info',
        categorie: 'immobilisations',
        message: 'Plan the renewal of your assets to maintain their operational efficiency.'
      });

      return recommendations;
    }

    // Analyze loan predictions
    const latestEmpruntPrediction = empruntPredictions[0];
    if (latestEmpruntPrediction.niveau_risque.niveau === 'Élevé') {
      recommendations.push({
        type: 'warning',
        categorie: 'emprunts',
        message: 'The risk level for future loans is high. Consider reducing new loans or renegotiating existing rates.'
      });
    } else if (latestEmpruntPrediction.taux_moyen_predit > 5) {
      recommendations.push({
        type: 'info',
        categorie: 'emprunts',
        message: `Predicted interest rates are relatively high (${latestEmpruntPrediction.taux_moyen_predit}%). Consider postponing new loans if possible.`
      });
    } else {
      // Default recommendation for loans
      recommendations.push({
        type: 'info',
        categorie: 'emprunts',
        message: `Loan conditions appear favorable with a predicted average rate of ${latestEmpruntPrediction.taux_moyen_predit}%. This might be a good time to invest.`
      });
    }

    // Analyze asset predictions
    const latestImmoPrediction = immobilisationPredictions[0];
    if (latestImmoPrediction.depreciation_estimee > 15) {
      recommendations.push({
        type: 'warning',
        categorie: 'immobilisations',
        message: `The predicted depreciation rate is high (${latestImmoPrediction.depreciation_estimee}%). Evaluate the lifespan of your assets.`
      });
    } else {
      // Default recommendation for assets
      recommendations.push({
        type: 'info',
        categorie: 'immobilisations',
        message: `The predicted depreciation rate (${latestImmoPrediction.depreciation_estimee}%) is within an acceptable range. Continue your current depreciation strategy.`
      });
    }

    // General recommendations
    if (latestEmpruntPrediction.facteurs_influence.inflation > 7) {
      recommendations.push({
        type: 'warning',
        categorie: 'general',
        message: `Predicted inflation is high (${latestEmpruntPrediction.facteurs_influence.inflation}%). Consider strategies to protect your assets against inflation.`
      });
    } else {
      recommendations.push({
        type: 'info',
        categorie: 'general',
        message: `Predicted inflation (${latestEmpruntPrediction.facteurs_influence.inflation}%) remains under control. Nevertheless, monitor its evolution to adjust your financial strategy.`
      });
    }

    // Recommendation on economic growth
    if (latestEmpruntPrediction.facteurs_influence.croissance_pib < 1) {
      recommendations.push({
        type: 'warning',
        categorie: 'general',
        message: `Predicted economic growth is low (${latestEmpruntPrediction.facteurs_influence.croissance_pib}%). Prepare for a possible slowdown period.`
      });
    } else {
      recommendations.push({
        type: 'info',
        categorie: 'general',
        message: `Predicted economic growth (${latestEmpruntPrediction.facteurs_influence.croissance_pib}%) is favorable. Consider investments to take advantage of this momentum.`
      });
    }

    return recommendations;
  }
}

// Exporter une instance unique du service
const aiPredictionService = new AIPredictionService();
export default aiPredictionService;
