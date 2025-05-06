from flask import Flask, request, jsonify
from flask_cors import CORS
import json
import os
from ai_prediction_service import ai_prediction_service

app = Flask(__name__)
CORS(app)  # Activer CORS pour permettre les requêtes depuis le frontend

# Assurez-vous que le dossier data existe
os.makedirs('./data', exist_ok=True)

# Vérifier si le fichier dataset.json existe, sinon le créer
if not os.path.exists('./data/dataset.json'):
    # Créer le dataset.json avec des données par défaut
    dataset = {
        "emprunts_historiques": [
            {
                "annee": 2018,
                "montant_total": 150000,
                "taux_moyen": 5.2,
                "duree_moyenne": 7,
                "remboursement_annuel": 24500,
                "taux_defaut": 0.5
            },
            {
                "annee": 2019,
                "montant_total": 180000,
                "taux_moyen": 5.0,
                "duree_moyenne": 8,
                "remboursement_annuel": 28000,
                "taux_defaut": 0.8
            },
            {
                "annee": 2020,
                "montant_total": 160000,
                "taux_moyen": 4.8,
                "duree_moyenne": 7,
                "remboursement_annuel": 26500,
                "taux_defaut": 1.2
            },
            {
                "annee": 2021,
                "montant_total": 200000,
                "taux_moyen": 4.5,
                "duree_moyenne": 9,
                "remboursement_annuel": 30000,
                "taux_defaut": 0.9
            },
            {
                "annee": 2022,
                "montant_total": 220000,
                "taux_moyen": 4.2,
                "duree_moyenne": 10,
                "remboursement_annuel": 32000,
                "taux_defaut": 0.7
            },
            {
                "annee": 2023,
                "montant_total": 250000,
                "taux_moyen": 4.0,
                "duree_moyenne": 10,
                "remboursement_annuel": 35000,
                "taux_defaut": 0.6
            }
        ],
        "immobilisations_historiques": [
            {
                "annee": 2018,
                "valeur_acquisition_totale": 300000,
                "duree_amortissement_moyenne": 8,
                "amortissement_annuel": 37500,
                "valeur_residuelle_moyenne": 0.15
            },
            {
                "annee": 2019,
                "valeur_acquisition_totale": 320000,
                "duree_amortissement_moyenne": 8,
                "amortissement_annuel": 40000,
                "valeur_residuelle_moyenne": 0.15
            },
            {
                "annee": 2020,
                "valeur_acquisition_totale": 280000,
                "duree_amortissement_moyenne": 7,
                "amortissement_annuel": 40000,
                "valeur_residuelle_moyenne": 0.12
            },
            {
                "annee": 2021,
                "valeur_acquisition_totale": 350000,
                "duree_amortissement_moyenne": 9,
                "amortissement_annuel": 38900,
                "valeur_residuelle_moyenne": 0.10
            },
            {
                "annee": 2022,
                "valeur_acquisition_totale": 380000,
                "duree_amortissement_moyenne": 10,
                "amortissement_annuel": 38000,
                "valeur_residuelle_moyenne": 0.10
            },
            {
                "annee": 2023,
                "valeur_acquisition_totale": 400000,
                "duree_amortissement_moyenne": 10,
                "amortissement_annuel": 40000,
                "valeur_residuelle_moyenne": 0.08
            }
        ],
        "indicateurs_economiques": [
            {
                "annee": 2018,
                "inflation": 7.3,
                "croissance_pib": 2.5,
                "taux_directeur": 6.75
            },
            {
                "annee": 2019,
                "inflation": 6.7,
                "croissance_pib": 1.0,
                "taux_directeur": 7.75
            },
            {
                "annee": 2020,
                "inflation": 5.6,
                "croissance_pib": -8.8,
                "taux_directeur": 6.25
            },
            {
                "annee": 2021,
                "inflation": 5.7,
                "croissance_pib": 3.1,
                "taux_directeur": 6.25
            },
            {
                "annee": 2022,
                "inflation": 8.3,
                "croissance_pib": 2.4,
                "taux_directeur": 7.0
            },
            {
                "annee": 2023,
                "inflation": 9.3,
                "croissance_pib": 0.4,
                "taux_directeur": 8.0
            }
        ],
        "predictions": {
            "2024": {
                "inflation_estimee": 8.5,
                "croissance_pib_estimee": 1.2,
                "taux_directeur_estime": 7.5,
                "tendance_emprunts": "hausse_moderee",
                "tendance_immobilisations": "stable",
                "risque_financier": "modere"
            },
            "2025": {
                "inflation_estimee": 7.2,
                "croissance_pib_estimee": 1.8,
                "taux_directeur_estime": 7.0,
                "tendance_emprunts": "hausse",
                "tendance_immobilisations": "hausse_legere",
                "risque_financier": "faible_a_modere"
            },
            "2026": {
                "inflation_estimee": 6.0,
                "croissance_pib_estimee": 2.2,
                "taux_directeur_estime": 6.5,
                "tendance_emprunts": "hausse_significative",
                "tendance_immobilisations": "hausse_moderee",
                "risque_financier": "faible"
            }
        }
    }
    
    with open('./data/dataset.json', 'w', encoding='utf-8') as f:
        json.dump(dataset, f, ensure_ascii=False, indent=2)

# Initialiser le service de prédiction
ai_prediction_service.initialize()

@app.route('/api/predictions/emprunts', methods=['POST'])
def predict_emprunts():
    """
    Endpoint pour prédire les emprunts futurs
    
    Requête:
    {
        "emprunts": [...],  # Liste des emprunts actuels
        "years": 3          # Nombre d'années à prédire (optionnel)
    }
    """
    data = request.json
    
    if not data or 'emprunts' not in data:
        return jsonify({"error": "Données d'emprunts manquantes"}), 400
    
    emprunts = data['emprunts']
    years = data.get('years', 3)
    
    try:
        predictions = ai_prediction_service.predict_future_emprunts(emprunts, years)
        return jsonify(predictions)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/predictions/immobilisations', methods=['POST'])
def predict_immobilisations():
    """
    Endpoint pour prédire les immobilisations futures
    
    Requête:
    {
        "immobilisations": [...],  # Liste des immobilisations actuelles
        "years": 3                 # Nombre d'années à prédire (optionnel)
    }
    """
    data = request.json
    
    if not data or 'immobilisations' not in data:
        return jsonify({"error": "Données d'immobilisations manquantes"}), 400
    
    immobilisations = data['immobilisations']
    years = data.get('years', 3)
    
    try:
        predictions = ai_prediction_service.predict_future_immobilisations(immobilisations, years)
        return jsonify(predictions)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/predictions/recommendations', methods=['POST'])
def get_recommendations():
    """
    Endpoint pour obtenir des recommandations
    
    Requête:
    {
        "emprunt_predictions": [...],       # Prédictions d'emprunts
        "immobilisation_predictions": [...]  # Prédictions d'immobilisations
    }
    """
    data = request.json
    
    if not data or 'emprunt_predictions' not in data or 'immobilisation_predictions' not in data:
        return jsonify({"error": "Données de prédictions manquantes"}), 400
    
    emprunt_predictions = data['emprunt_predictions']
    immobilisation_predictions = data['immobilisation_predictions']
    
    try:
        recommendations = ai_prediction_service.get_recommendations(
            emprunt_predictions, 
            immobilisation_predictions
        )
        return jsonify(recommendations)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/predictions/all', methods=['POST'])
def get_all_predictions():
    """
    Endpoint pour obtenir toutes les prédictions et recommandations en une seule requête
    
    Requête:
    {
        "emprunts": [...],         # Liste des emprunts actuels
        "immobilisations": [...],  # Liste des immobilisations actuelles
        "years": 3                 # Nombre d'années à prédire (optionnel)
    }
    """
    data = request.json
    
    if not data or 'emprunts' not in data or 'immobilisations' not in data:
        return jsonify({"error": "Données manquantes"}), 400
    
    emprunts = data['emprunts']
    immobilisations = data['immobilisations']
    years = data.get('years', 3)
    
    try:
        # Obtenir les prédictions
        emprunt_predictions = ai_prediction_service.predict_future_emprunts(emprunts, years)
        immobilisation_predictions = ai_prediction_service.predict_future_immobilisations(immobilisations, years)
        
        # Obtenir les recommandations
        recommendations = ai_prediction_service.get_recommendations(
            emprunt_predictions, 
            immobilisation_predictions
        )
        
        return jsonify({
            "emprunt_predictions": emprunt_predictions,
            "immobilisation_predictions": immobilisation_predictions,
            "recommendations": recommendations
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000)
