# API de Prédiction IA pour la Gestion Financière

Cette API Python utilise des modèles d'apprentissage automatique pour fournir des prédictions financières basées sur vos données d'emprunts et d'immobilisations.

## Fonctionnalités

- Prédiction des montants futurs d'emprunts
- Prédiction des valeurs futures d'immobilisations
- Analyse des risques financiers
- Recommandations personnalisées

## Prérequis

- Python 3.8 ou supérieur
- pip (gestionnaire de paquets Python)

## Installation

1. Assurez-vous que Python est installé sur votre système
2. Exécutez le script d'installation:

### Windows
```
start_api.bat
```

### Linux/Mac
```
chmod +x start_api.sh
./start_api.sh
```

## Utilisation

L'API sera disponible à l'adresse `http://localhost:5000/api/predictions`.

### Endpoints disponibles

- `/api/predictions/emprunts` (POST) - Prédictions pour les emprunts
- `/api/predictions/immobilisations` (POST) - Prédictions pour les immobilisations
- `/api/predictions/recommendations` (POST) - Recommandations financières
- `/api/predictions/all` (POST) - Toutes les prédictions et recommandations

### Exemple d'utilisation

```javascript
// Exemple avec Axios
const response = await axios.post('http://localhost:5000/api/predictions/all', {
  emprunts: [...],  // Vos données d'emprunts
  immobilisations: [...],  // Vos données d'immobilisations
  years: 3  // Nombre d'années à prédire
});

const { 
  emprunt_predictions, 
  immobilisation_predictions, 
  recommendations 
} = response.data;
```

## Données

L'API utilise un fichier `dataset.json` dans le dossier `data` pour l'entraînement des modèles. Ce fichier contient:

- Historique des emprunts
- Historique des immobilisations
- Indicateurs économiques
- Prédictions économiques

Vous pouvez modifier ce fichier pour améliorer la précision des prédictions.

## Modèles utilisés

- Régression linéaire (scikit-learn)
- Réseaux de neurones (TensorFlow)

## Personnalisation

Pour personnaliser les modèles ou ajouter de nouvelles fonctionnalités, modifiez les fichiers:

- `ai_prediction_service.py` - Logique des modèles et prédictions
- `ai_prediction_api.py` - Endpoints de l'API
