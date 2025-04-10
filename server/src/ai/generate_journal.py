import json
import joblib
import os
from pymongo import MongoClient

# Obtenir le chemin absolu du dossier courant
current_dir = os.path.dirname(os.path.abspath(__file__))

# Charger les modèles
debit_model = joblib.load(os.path.join(current_dir, 'debit_model.pkl'))
credit_model = joblib.load(os.path.join(current_dir, 'credit_model.pkl'))
vectorizer = joblib.load(os.path.join(current_dir, 'vectorizer.pkl'))

# Connexion à MongoDB
client = MongoClient("mongodb://localhost:27017")
db = client['piweb']
collection = db['transactions']

def validate_transaction(transaction):
    required_fields = ["montant", "mode_paiement", "statut", "compte"]
    if "type_CResultat" not in transaction:
        transaction["type_CResultat"] = "default"
    for field in required_fields:
        if field not in transaction or not transaction[field]:
            print(f"Transaction mal formée: {transaction}")
            return False
    return True

# Déduction logique du compte comptable selon le mode de paiement
def infer_account_from_mode(mode_paiement, sens="credit"):
    mode = mode_paiement.lower()

    if mode in ["espèces", "cash"]:
        return "53 - Caisse"
    elif mode in ["carte bancaire", "virement", "chèque"]:
        return "512 - Banque"
    elif sens == "debit":
        return "411 - Clients"
    else:
        return "401 - Fournisseurs"

def generate_journal_entries(transaction):
    if not validate_transaction(transaction):
        return []

    features = {
        'montant': transaction['montant'],
        'mode_paiement': transaction['mode_paiement'],
        'statut': transaction['statut'],
        'compte': transaction['compte'],
        'type_CResultat': transaction.get('type_CResultat', '')
    }
    X = vectorizer.transform([features])

    # Prédiction brute
    debit_pred = debit_model.predict(X)[0]
    credit_pred = credit_model.predict(X)[0]

    # Logique métier : corriger / améliorer les comptes si nécessaire
    mode = transaction.get("mode_paiement", "").lower()
    desc = transaction.get("description", "").lower()

    # Forcer certains types de comptes si possible
    if "vente" in desc:
        debit = "411 - Clients"
        credit = infer_account_from_mode(mode, sens="credit")
    elif "achat" in desc:
        debit = "606 - Achats"
        credit = infer_account_from_mode(mode, sens="credit")
    elif "salaire" in desc:
        debit = "641 - Charges de personnel"
        credit = "421 - Personnel rémunérations dues"
    elif "amortissement" in desc:
        debit = "681 - Dotations aux amortissements"
        credit = "28 - Amortissements"
    else:
        # Utilisation des prédictions si pas de règle explicite
        debit = debit_pred
        credit = credit_pred

    description = transaction.get('description', 'Transaction sans description')

    return [
        {"compte": debit, "debit": transaction["montant"], "credit": 0, "description": description},
        {"compte": credit, "debit": 0, "credit": transaction["montant"], "description": description}
    ]

# Journal comptable global
global_journal = []
total_debit = 0
total_credit = 0

for transaction in collection.find():
    entries = generate_journal_entries(transaction)
    for entry in entries:
        total_debit += entry["debit"]
        total_credit += entry["credit"]
        global_journal.append(entry)

# Ajouter la ligne des totaux
global_journal.append({
    "compte": "Totaux",
    "debit": total_debit,
    "credit": total_credit,
    "description": "Total des débits et crédits"
})

# Affichage du journal unique
print(json.dumps(global_journal, indent=2, ensure_ascii=False))
