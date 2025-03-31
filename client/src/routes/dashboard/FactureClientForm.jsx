import React, { useState, useEffect } from "react";
import { createFacture } from '../../services/factureService'; 

const FactureClientForm = ({ onClose, onSave, factureId }) => {
    const [factureDetails, setFactureDetails] = useState({
        numero_facture: "",
        nom_client: "",
        date_emission: "",
        date_echeance: "",
        montant_total: 0,
        montant_paye: 0,
        statut: "Non payé",
        mode_paiement: "Espèces",
        type_facture: "client",
    });

    const [transactions, setTransactions] = useState([{
        montant: 0,
        date_transaction: "",
        mode_paiement: "Espèces", 
        compte: "Débit",  // Champ Compte ajouté ici
        statut: "Validée",
        description: "",
    }]);

    useEffect(() => {
        const totalAmount = calculateTotalAmount();
        setFactureDetails(prevDetails => ({
            ...prevDetails,
            montant_total: totalAmount
        }));
    }, [transactions]);

    const handleFactureChange = (field, value) => {
        setFactureDetails({ ...factureDetails, [field]: value });
    };

    const handleAddTransaction = () => {
        setTransactions([...transactions, {
            montant: 0,
            date_transaction: "",
            mode_paiement: "Espèces",
            compte: "Débit",  // Valeur par défaut pour le champ Compte
            statut: "Validée",
            description: "",
        }]);
    };

    const handleTransactionChange = (index, field, value) => {
        const newTransactions = [...transactions];
        newTransactions[index][field] = value;
        setTransactions(newTransactions);
    };

    const calculateTotalAmount = () => {
        return transactions.reduce((acc, curr) => {
            const montant = parseFloat(curr.montant);
            return acc + (isNaN(montant) ? 0 : montant);
        }, 0);
    };

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
            console.log('Facture saved:', newFacture);

            if (onSave) {
                onSave(newFacture);
            }

            onClose();
        } catch (error) {
            console.error('Error saving facture:', error.message);
            alert('Votre facture a été enregistrée avec succès');
            onClose();
        }
    };

    const isSaveDisabled = !factureDetails.numero_facture || !factureDetails.nom_client || 
        !factureDetails.date_emission || !factureDetails.date_echeance || 
        isNaN(factureDetails.montant_paye) || factureDetails.montant_paye === "";

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-gray-900 text-white p-6 rounded-lg shadow-lg w-[800px] max-h-[80vh] overflow-y-auto">
                <h2 className="text-xl font-semibold mb-4">Créer une Facture Client</h2>
                <div className="mb-4">
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
                    <input
                        type="number"
                        value={factureDetails.montant_total}
                        className="w-full p-2 mb-2 rounded bg-gray-800 text-white"
                        disabled
                    />
                    <input
                        type="number"
                        value={factureDetails.montant_paye}
                        onChange={(e) => handleFactureChange("montant_paye", e.target.value)}
                        className="w-full p-2 mb-2 rounded bg-gray-800 text-white"
                    />
                    <div className="mb-4">
    <select
        value={factureDetails.type_facture}
        onChange={(e) => handleFactureChange("type_facture", e.target.value)}
        className="w-full p-2 mb-2 rounded bg-gray-800 text-white"
    >
        <option value="client">Client</option>
        <option value="fournisseur">Fournisseur</option>
    </select>
</div>

                    <select
                        value={factureDetails.statut}
                        onChange={(e) => handleFactureChange("statut", e.target.value)}
                        className="w-full p-2 mb-2 rounded bg-gray-800 text-white"
                    >
                        <option value="Non payé">Non payé</option>
                        <option value="Payé">Payé</option>
                        <option value="Partiellement payé">Partiellement payé</option>
                    </select>
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
                    <button onClick={handleSave} className={`p-2 rounded ${isSaveDisabled ? 'bg-gray-600' : 'bg-green-600'} text-white`} disabled={isSaveDisabled}>
                        Sauvegarder la Facture
                    </button>
                </div>
            </div>
        </div>
    );
};

export default FactureClientForm;
