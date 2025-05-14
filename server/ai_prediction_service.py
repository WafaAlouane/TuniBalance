import json
import numpy as np
import pandas as pd
from sklearn.linear_model import LinearRegression
from sklearn.preprocessing import StandardScaler
import tensorflow as tf
from tensorflow import keras
from datetime import datetime
import os

class AIPredictionService:
    def __init__(self, dataset_path='./data/dataset.json'):
        """
        Initialise le service de prédiction IA
        
        Args:
            dataset_path: Chemin vers le fichier dataset.json
        """
        self.dataset_path = dataset_path
        self.dataset = None
        self.models = {}
        self.initialized = False
        
        # Charger le dataset
        self.load_dataset()
    
    def load_dataset(self):
        """Charge le dataset depuis le fichier JSON"""
        try:
            with open(self.dataset_path, 'r', encoding='utf-8') as file:
                self.dataset = json.load(file)
            print(f"Dataset chargé avec succès depuis {self.dataset_path}")
        except Exception as e:
            print(f"Erreur lors du chargement du dataset: {e}")
            # Créer un dataset par défaut si le fichier n'existe pas
            self.dataset = {
                "emprunts_historiques": [],
                "immobilisations_historiques": [],
                "indicateurs_economiques": [],
                "predictions": {}
            }
    
    def initialize(self):
        """Initialise et entraîne les modèles"""
        if self.initialized:
            return
        
        try:
            # Entraîner les modèles
            self.train_emprunt_model()
            self.train_immobilisation_model()
            
            self.initialized = True
            print("Modèles IA initialisés avec succès")
        except Exception as e:
            print(f"Erreur lors de l'initialisation des modèles IA: {e}")
    
    def train_emprunt_model(self):
        """Entraîne les modèles pour les prédictions d'emprunts"""
        # Vérifier si nous avons assez de données
        if len(self.dataset["emprunts_historiques"]) < 3:
            print("Pas assez de données historiques pour entraîner le modèle d'emprunts")
            return
        
        # Préparer les données
        df_emprunts = pd.DataFrame(self.dataset["emprunts_historiques"])
        df_eco = pd.DataFrame(self.dataset["indicateurs_economiques"])
        
        # Modèle de régression linéaire pour le montant total
        X_montant = df_emprunts[['annee']].values
        y_montant = df_emprunts['montant_total'].values
        
        model_montant = LinearRegression()
        model_montant.fit(X_montant, y_montant)
        self.models['emprunt_montant'] = model_montant
        
        # Modèle de régression linéaire pour le taux moyen
        X_taux = df_emprunts[['annee']].values
        y_taux = df_emprunts['taux_moyen'].values
        
        model_taux = LinearRegression()
        model_taux.fit(X_taux, y_taux)
        self.models['emprunt_taux'] = model_taux
        
        # Modèle TensorFlow plus complexe
        if len(df_emprunts) >= 5 and len(df_eco) >= 5:
            # Fusionner les données économiques avec les emprunts
            merged_data = pd.merge(
                df_emprunts, 
                df_eco, 
                on='annee', 
                how='inner'
            )
            
            if len(merged_data) >= 5:
                # Préparer les features
                X_complex = merged_data[['annee', 'inflation', 'croissance_pib']].values
                y_complex = merged_data['montant_total'].values
                
                # Normaliser les données
                scaler_X = StandardScaler()
                scaler_y = StandardScaler()
                
                X_scaled = scaler_X.fit_transform(X_complex)
                y_scaled = scaler_y.fit_transform(y_complex.reshape(-1, 1)).flatten()
                
                # Créer et entraîner le modèle
                model = keras.Sequential([
                    keras.layers.Dense(10, activation='relu', input_shape=(3,)),
                    keras.layers.Dense(5, activation='relu'),
                    keras.layers.Dense(1)
                ])
                
                model.compile(optimizer='adam', loss='mse')
                
                # Entraîner le modèle
                model.fit(
                    X_scaled, 
                    y_scaled, 
                    epochs=100, 
                    verbose=0
                )
                
                # Sauvegarder le modèle et les scalers
                self.models['emprunt_tf'] = model
                self.models['emprunt_scaler_X'] = scaler_X
                self.models['emprunt_scaler_y'] = scaler_y
    
    def train_immobilisation_model(self):
        """Entraîne les modèles pour les prédictions d'immobilisations"""
        # Vérifier si nous avons assez de données
        if len(self.dataset["immobilisations_historiques"]) < 3:
            print("Pas assez de données historiques pour entraîner le modèle d'immobilisations")
            return
        
        # Préparer les données
        df_immo = pd.DataFrame(self.dataset["immobilisations_historiques"])
        
        # Modèle de régression linéaire pour la valeur d'acquisition
        X_valeur = df_immo[['annee']].values
        y_valeur = df_immo['valeur_acquisition_totale'].values
        
        model_valeur = LinearRegression()
        model_valeur.fit(X_valeur, y_valeur)
        self.models['immo_valeur'] = model_valeur
        
        # Modèle de régression linéaire pour l'amortissement annuel
        X_amort = df_immo[['annee']].values
        y_amort = df_immo['amortissement_annuel'].values
        
        model_amort = LinearRegression()
        model_amort.fit(X_amort, y_amort)
        self.models['immo_amort'] = model_amort
    
    def predict_future_emprunts(self, current_data, years=3):
        """
        Prédit les emprunts futurs
        
        Args:
            current_data: Liste des emprunts actuels
            years: Nombre d'années à prédire
        
        Returns:
            Liste de prédictions
        """
        if not self.initialized:
            self.initialize()
            
        if 'emprunt_montant' not in self.models:
            return []
        
        current_year = datetime.now().year
        predictions = []
        
        # Calculer des statistiques sur les données actuelles
        current_montants = [float(e.get('montant', 0)) for e in current_data]
        avg_montant = np.mean(current_montants) if current_montants else 0
        std_montant = np.std(current_montants) if current_montants else 0
        total_montant = sum(current_montants)
        
        # Obtenir les dernières données économiques
        last_eco_data = self.dataset["indicateurs_economiques"][-1] if self.dataset["indicateurs_economiques"] else {
            "inflation": 5.0,
            "croissance_pib": 1.5,
            "taux_directeur": 6.0
        }
        
        # Facteur d'ajustement basé sur les données actuelles vs historiques
        last_historical_montant = self.dataset["emprunts_historiques"][-1]["montant_total"] if self.dataset["emprunts_historiques"] else 1
        adjustment_factor = total_montant / last_historical_montant if last_historical_montant > 0 else 1
        
        # Prédictions pour les années futures
        for i in range(1, years + 1):
            year = current_year + i
            
            # Prédiction simple avec régression linéaire
            predicted_montant = self.models['emprunt_montant'].predict([[year]])[0]
            predicted_taux = self.models['emprunt_taux'].predict([[year]])[0]
            
            # Prédiction avec le modèle TensorFlow si disponible
            tf_prediction = None
            if 'emprunt_tf' in self.models:
                # Obtenir les prédictions économiques pour cette année
                eco_prediction = self.get_economic_prediction(year)
                
                # Préparer les features
                X_pred = np.array([[
                    year, 
                    eco_prediction.get('inflation_estimee', last_eco_data['inflation']),
                    eco_prediction.get('croissance_pib_estimee', last_eco_data['croissance_pib'])
                ]])
                
                # Normaliser
                X_scaled = self.models['emprunt_scaler_X'].transform(X_pred)
                
                # Prédire
                y_scaled = self.models['emprunt_tf'].predict(X_scaled)[0][0]
                
                # Dénormaliser
                tf_prediction = self.models['emprunt_scaler_y'].inverse_transform([[y_scaled]])[0][0]
            
            # Utiliser la prédiction TensorFlow si disponible, sinon la régression linéaire
            final_montant = tf_prediction if tf_prediction is not None else predicted_montant
            
            # Ajuster en fonction des données actuelles
            final_montant = final_montant * adjustment_factor
            
            # Obtenir les prédictions économiques pour cette année
            eco_prediction = self.get_economic_prediction(year)
            
            # Calculer la croissance estimée
            previous_year_montant = self.models['emprunt_montant'].predict([[year - 1]])[0] * adjustment_factor
            growth = ((final_montant / previous_year_montant) - 1) * 100 if previous_year_montant > 0 else 0
            
            # Calculer le niveau de risque
            risk_level = self.calculate_risk_level(
                final_montant,
                predicted_taux,
                eco_prediction.get('inflation_estimee', last_eco_data['inflation'])
            )
            
            # Créer la prédiction
            prediction = {
                'annee': year,
                'montant_total_predit': round(final_montant),
                'taux_moyen_predit': round(predicted_taux, 2),
                'croissance_estimee': round(growth, 1),
                'facteurs_influence': {
                    'inflation': eco_prediction.get('inflation_estimee', last_eco_data['inflation']),
                    'croissance_pib': eco_prediction.get('croissance_pib_estimee', last_eco_data['croissance_pib']),
                    'taux_directeur': eco_prediction.get('taux_directeur_estime', last_eco_data['taux_directeur'])
                },
                'niveau_risque': risk_level
            }
            
            predictions.append(prediction)
        
        return predictions
    
    def predict_future_immobilisations(self, current_data, years=3):
        """
        Prédit les immobilisations futures
        
        Args:
            current_data: Liste des immobilisations actuelles
            years: Nombre d'années à prédire
        
        Returns:
            Liste de prédictions
        """
        if not self.initialized:
            self.initialize()
            
        if 'immo_valeur' not in self.models:
            return []
        
        current_year = datetime.now().year
        predictions = []
        
        # Calculer des statistiques sur les données actuelles
        current_valeurs = [float(i.get('valeur_acquisition', 0)) for i in current_data]
        avg_valeur = np.mean(current_valeurs) if current_valeurs else 0
        total_valeur = sum(current_valeurs)
        
        # Facteur d'ajustement basé sur les données actuelles vs historiques
        last_historical_valeur = self.dataset["immobilisations_historiques"][-1]["valeur_acquisition_totale"] if self.dataset["immobilisations_historiques"] else 1
        adjustment_factor = total_valeur / last_historical_valeur if last_historical_valeur > 0 else 1
        
        # Prédictions pour les années futures
        for i in range(1, years + 1):
            year = current_year + i
            
            # Prédiction avec régression linéaire
            predicted_valeur = self.models['immo_valeur'].predict([[year]])[0]
            predicted_amort = self.models['immo_amort'].predict([[year]])[0]
            
            # Ajuster en fonction des données actuelles
            final_valeur = predicted_valeur * adjustment_factor
            final_amort = predicted_amort * adjustment_factor
            
            # Obtenir les prédictions économiques pour cette année
            eco_prediction = self.get_economic_prediction(year)
            
            # Calculer le taux de dépréciation
            depreciation_rate = (final_amort / final_valeur) * 100 if final_valeur > 0 else 0
            
            # Créer la prédiction
            prediction = {
                'annee': year,
                'valeur_acquisition_totale_predite': round(final_valeur),
                'amortissement_annuel_predit': round(final_amort),
                'tendance': eco_prediction.get('tendance_immobilisations', 'stable'),
                'depreciation_estimee': round(depreciation_rate, 1)
            }
            
            predictions.append(prediction)
        
        return predictions
    
    def get_economic_prediction(self, year):
        """Obtient les prédictions économiques pour une année donnée"""
        year_str = str(year)
        
        if year_str in self.dataset["predictions"]:
            return self.dataset["predictions"][year_str]
        
        # Si l'année n'est pas dans les prédictions, utiliser la dernière année disponible
        last_year = list(self.dataset["predictions"].keys())[-1] if self.dataset["predictions"] else None
        
        if last_year:
            return self.dataset["predictions"][last_year]
        
        # Valeurs par défaut si aucune prédiction n'est disponible
        return {
            "inflation_estimee": 5.0,
            "croissance_pib_estimee": 1.5,
            "taux_directeur_estime": 6.0,
            "tendance_emprunts": "stable",
            "tendance_immobilisations": "stable",
            "risque_financier": "modere"
        }
    
    def calculate_risk_level(self, montant, taux, inflation):
        """Calcule le niveau de risque"""
        # Calcul simple du niveau de risque basé sur le taux d'intérêt par rapport à l'inflation
        risk_factor = (taux / inflation) * (montant / 200000) if inflation > 0 else 1
        
        if risk_factor < 0.8:
            return {"niveau": "Faible", "score": round(risk_factor * 100)}
        elif risk_factor < 1.2:
            return {"niveau": "Modéré", "score": round(risk_factor * 100)}
        else:
            return {"niveau": "Élevé", "score": round(risk_factor * 100)}
    
    def get_recommendations(self, emprunt_predictions, immobilisation_predictions):
        """Génère des recommandations basées sur les prédictions"""
        recommendations = []
        
        if not emprunt_predictions or not immobilisation_predictions:
            return recommendations
        
        # Analyser les prédictions d'emprunts
        latest_emprunt = emprunt_predictions[0]
        if latest_emprunt['niveau_risque']['niveau'] == 'Élevé':
            recommendations.append({
                'type': 'warning',
                'categorie': 'emprunts',
                'message': 'Le niveau de risque des emprunts futurs est élevé. Envisagez de réduire les nouveaux emprunts ou de renégocier les taux existants.'
            })
        elif latest_emprunt['taux_moyen_predit'] > 5:
            recommendations.append({
                'type': 'info',
                'categorie': 'emprunts',
                'message': f"Les taux d'intérêt prévus sont relativement élevés ({latest_emprunt['taux_moyen_predit']}%). Envisagez de reporter les nouveaux emprunts si possible."
            })
        
        # Analyser les prédictions d'immobilisations
        latest_immo = immobilisation_predictions[0]
        if latest_immo['depreciation_estimee'] > 15:
            recommendations.append({
                'type': 'warning',
                'categorie': 'immobilisations',
                'message': f"Le taux de dépréciation prévu est élevé ({latest_immo['depreciation_estimee']}%). Évaluez la durée de vie de vos immobilisations."
            })
        
        # Recommandations générales
        if latest_emprunt['facteurs_influence']['inflation'] > 7:
            recommendations.append({
                'type': 'info',
                'categorie': 'general',
                'message': f"L'inflation prévue est élevée ({latest_emprunt['facteurs_influence']['inflation']}%). Envisagez des stratégies pour protéger vos actifs contre l'inflation."
            })
        
        return recommendations

# Créer une instance du service
ai_prediction_service = AIPredictionService()
