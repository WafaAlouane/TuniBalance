import React, { useState, useEffect } from "react";
import { createFacture } from '../../services/factureService';

const FactureClientForm = ({ onClose, onSave }) => {
    const [factureDetails, setFactureDetails] = useState({
        numero_facture: "",
        nom_client: "",
        date_emission: "",
        date_echeance: "",
        montant_total: 0, // Montant HT
        montant_tva: 0,
        montant_ttc: 0,
        montant_paye: 0,
        statut: "Non payé",
        mode_paiement: "Espèces",
        type_facture: "client",
        taux_tva: 0.19 // Par défaut 19%
    });

    const [transactions, setTransactions] = useState([{
        montant: 0,
        date_transaction: "",
        mode_paiement: "Espèces", 
        compte: "Débit",
        type_CResultat:"Exploitation",
        statut: "Validée",
        description: "",
        categorie: "Charge", // Par défaut
        sous_categorie: "Achats de marchandises", // Valeur par défaut
       
    }]);
    const categories = ["Charge", "Produit"];

const typesCResultat = ["Exploitation", "Financière", "Exceptionnelle"];
const sousCategoriesCharge = [
    "Achats de marchandises",
    "Variation des stocks de marchandises",
    "Loyer",
    "Publicité",
    "Impôts et taxes",
    "Salaires et charges sociales",
    "Intérêts des emprunts",
    "Amendes",
    "Frais remplacement matériel productif",
    "Impôt sur les bénéfices"
];
const sousCategoriesProduit = [
    "Ventes de marchandises"
];

    // Calcul du montant total HT, TVA et TTC à chaque changement de transactions ou du taux de TVA
    useEffect(() => {
        const totalHT = calculateTotalAmount();

        if (isNaN(totalHT) || totalHT === 0) {
            setFactureDetails(prevDetails => ({
                ...prevDetails,
                montant_total: 0,
                montant_tva: 0,
                montant_ttc: 0
            }));
        } else {
            const tva = parseFloat((totalHT * factureDetails.taux_tva).toFixed(2));  // Assurer la précision décimale
            const ttc = parseFloat((totalHT + tva).toFixed(2));  // Assurer la précision décimale

            setFactureDetails(prevDetails => ({
                ...prevDetails,
                montant_total: totalHT,
                montant_tva: isNaN(tva) ? 0 : tva,  // Si NaN, fallback à 0
                montant_ttc: isNaN(ttc) ? 0 : ttc  // Si NaN, fallback à 0
            }));
        }
    }, [transactions, factureDetails.taux_tva]);

    // Gérer les changements des champs de la facture
    const handleFactureChange = (field, value) => {
        setFactureDetails({ ...factureDetails, [field]: value });
    };

    // Ajouter une nouvelle transaction
    const handleAddTransaction = () => {
        setTransactions([...transactions, {
            montant: 0,
            date_transaction: "",
            mode_paiement: "Espèces",
            compte: "Débit",
            type_CResultat:"Exploitation",
            statut: "Validée",
            description: "",
            categorie: "Charge",
            sous_categorie: "Achats de marchandises",
            type_CResultat: "Exploitation",
        }]);
    };
    const removeTransaction = (index) => {
        const updatedTransactions = transactions.filter((_, i) => i !== index);
        setTransactions(updatedTransactions);
    };

    // Gérer les changements dans les transactions
    const handleTransactionChange = (index, field, value) => {
        const newTransactions = [...transactions];
        newTransactions[index][field] = value;
        setTransactions(newTransactions);
    };

    // Calculer le montant total HT des transactions
    const calculateTotalAmount = () => {
        return transactions.reduce((acc, curr) => acc + (parseFloat(curr.montant) || 0), 0);
    };

    // Sauvegarder la facture avec les nouvelles valeurs
    const handleSave = async () => {
        try {
            const factureData = {
                ...factureDetails,
                transactions: transactions.map(transaction => ({
                    ...transaction,
                    mode_paiement: transaction.mode_paiement || "Espèces", 
                })),
            };

            const newFacture = await createFacture(factureData);
            if (onSave) onSave(newFacture);
            onClose();
        } catch (error) {
            console.error('Error saving facture:', error.message);
            alert('Erreur lors de l\'enregistrement de la facture');
        }
    };

    // Vérifier si le bouton de sauvegarde doit être désactivé
    const isSaveDisabled = !factureDetails.numero_facture || !factureDetails.nom_client || 
        !factureDetails.date_emission || !factureDetails.date_echeance || 
        isNaN(factureDetails.montant_paye) || factureDetails.montant_paye === "";

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-gray-900 text-white p-6 rounded-lg shadow-lg w-[800px] max-h-[80vh] overflow-y-auto">
                <h2 className="text-xl font-semibold mb-4">Créer une Facture</h2>
                <div className="mb-4">

                <select
    value={factureDetails.type_facture}
    onChange={(e) => handleFactureChange("type_facture", e.target.value)}
    className="w-full p-2 mb-2 rounded bg-gray-800 text-white"
>
    <option value="client">Facture Client</option>
    <option value="fournisseur">Facture Fournisseur</option>
</select>

                    <input
                        type="text"
                        placeholder="Numéro de Facture"
                        value={factureDetails.numero_facture}
                        onChange={(e) => handleFactureChange("numero_facture", e.target.value)}
                        className="w-full p-2 mb-2 rounded bg-gray-800 text-white"
                    />
                    <input
                        type="text"
                        placeholder="Nom du Client"
                        value={factureDetails.nom_client}
                        onChange={(e) => handleFactureChange("nom_client", e.target.value)}
                        className="w-full p-2 mb-2 rounded bg-gray-800 text-white"
                    />
                    <input
                        type="date"
                        value={factureDetails.date_emission}
                        onChange={(e) => handleFactureChange("date_emission", e.target.value)}
                        className="w-full p-2 mb-2 rounded bg-gray-800 text-white"
                    />
                    <input
                        type="date"
                        value={factureDetails.date_echeance}
                        onChange={(e) => handleFactureChange("date_echeance", e.target.value)}
                        className="w-full p-2 mb-2 rounded bg-gray-800 text-white"
                    />
                    
                    <select
                        value={factureDetails.taux_tva}
                        onChange={(e) => handleFactureChange("taux_tva", parseFloat(e.target.value))}
                        className="w-full p-2 mb-2 rounded bg-gray-800 text-white"
                    >
                        <option value={0}>0%</option>
                        <option value={0.07}>7%</option>
                        <option value={0.13}>13%</option>
                        <option value={0.19}>19%</option>
                    </select>

                    <input
                        type="number"
                        value={factureDetails.montant_total}
                        className="w-full p-2 mb-2 rounded bg-gray-800 text-white"
                        disabled
                    />
                    <input
                        type="number"
                        value={factureDetails.montant_tva}
                        className="w-full p-2 mb-2 rounded bg-gray-800 text-white"
                        disabled
                    />
                    <input
                        type="number"
                        value={factureDetails.montant_ttc}
                        className="w-full p-2 mb-2 rounded bg-gray-800 text-white"
                        disabled
                    />
                </div>

                <h3 className="text-lg font-semibold mb-2">Ajouter Transactions</h3>
                {transactions.map((transaction, index) => (
                    <div key={index} className="mb-3">
                        <input
                            type="number"
                            placeholder="Montant"
                            value={transaction.montant}
                            onChange={(e) => handleTransactionChange(index, "montant", e.target.value)}
                            className="w-full p-2 mb-2 rounded bg-gray-800 text-white"
                        />
                        <input
                            type="date"
                            value={transaction.date_transaction}
                            onChange={(e) => handleTransactionChange(index, "date_transaction", e.target.value)}
                            className="w-full p-2 mb-2 rounded bg-gray-800 text-white"
                        />
                        <select
                            value={transaction.mode_paiement}
                            onChange={(e) => handleTransactionChange(index, "mode_paiement", e.target.value)}
                            className="w-full p-2 mb-2 rounded bg-gray-800 text-white"
                        >
                            <option value="Espèces">Espèces</option>
                            <option value="Virement">Virement</option>
                            <option value="Chèque">Chèque</option>
                        </select>

                        <select
                            value={transaction.compte}
                            onChange={(e) => handleTransactionChange(index, "compte", e.target.value)}
                            className="w-full p-2 mb-2 rounded bg-gray-800 text-white"
                        >
                            <option value="Débit">Débit</option>
                            <option value="Crédit">Crédit</option>
                        </select>
                        <select
  value={transaction.categorie}
  onChange={(e) => handleTransactionChange(index, "categorie", e.target.value)}
  className="w-full p-2 mb-2 rounded bg-gray-800 text-white"
>
  {categories.map(cat => (
    <option key={cat} value={cat}>{cat}</option>
  ))}
</select>

<select
  value={transaction.sous_categorie}
  onChange={(e) => handleTransactionChange(index, "sous_categorie", e.target.value)}
  className="w-full p-2 mb-2 rounded bg-gray-800 text-white"
>
  {(transaction.categorie === "Charge" ? sousCategoriesCharge : sousCategoriesProduit).map(sub => (
    <option key={sub} value={sub}>{sub}</option>
  ))}
</select>

                        
                        <input
                            type="text"
                            placeholder="Description"
                            value={transaction.description}
                            onChange={(e) => handleTransactionChange(index, "description", e.target.value)}
                            className="w-full p-2 mb-2 rounded bg-gray-800 text-white"
                        />
                    </div>
                ))}

                <button onClick={handleAddTransaction} className="mb-4 p-2 rounded bg-blue-600 text-white">
                    Ajouter une Transaction
                </button>
                <div className="flex justify-end">
                    <button 
                        onClick={handleSave} 
                        className={`p-2 rounded ${isSaveDisabled ? 'bg-gray-600' : 'bg-green-600'} text-white`} 
                        disabled={isSaveDisabled}
                    >
                        Sauvegarder la Facture
                    </button>
                </div>
            </div>
        </div>
    );
};

export default FactureClientForm;
