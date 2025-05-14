import json
import joblib
from sklearn.ensemble import RandomForestClassifier
from sklearn.feature_extraction import DictVectorizer

# Charger le dataset
with open("C:/Users/Islem/Desktop/firas/TuniBalance/dataset.json") as f:
    data = json.load(f)

X = []
y_debit = []
y_credit = []

for item in data:
    transaction = item["transaction"]
    features = {
        "montant": transaction["montant"],
        "mode_paiement": transaction["mode_paiement"],
        "statut": transaction["statut"],
        "compte": transaction["compte"],
        "type_CResultat": transaction["type_CResultat"]
    }
    X.append(features)
    y_debit.append(item["journal_comptable"][0]["compte"])
    y_credit.append(item["journal_comptable"][1]["compte"])

vec = DictVectorizer(sparse=False)
X_vec = vec.fit_transform(X)

debit_model = RandomForestClassifier()
credit_model = RandomForestClassifier()
debit_model.fit(X_vec, y_debit)
credit_model.fit(X_vec, y_credit)

joblib.dump(debit_model, "debit_model.pkl")
joblib.dump(credit_model, "credit_model.pkl")
joblib.dump(vec, "vectorizer.pkl")

print("✅ Modèles entraînés et sauvegardés")
