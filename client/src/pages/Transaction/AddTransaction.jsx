import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createTransaction } from "../../redux/slices/transactionSlice"; // Action redux pour créer une transaction
import { v4 as uuidv4 } from "uuid";

export default function TransactionForm() {
  const dispatch = useDispatch();

  // Récupérer les informations de l'utilisateur actuellement connecté via Redux
  const { user } = useSelector((state) => state.auth); // Supposons que l'ID utilisateur soit dans `user.id`

  const [date, setDate] = useState("");
  const [type, setType] = useState("Dépense");
  const [montant, setMontant] = useState("");
  const [devise, setDevise] = useState("TND");
  const [description, setDescription] = useState("");
  const [categorie, setCategorie] = useState("");
  const [modePaiement, setModePaiement] = useState("Espèces");
  const [statut, setStatut] = useState("En attente");
  const [compteDebite, setCompteDebite] = useState("");
  const [compteCredite, setCompteCredite] = useState("");
  const [justificatifUrl, setJustificatifUrl] = useState("");
  const [tauxTva, setTauxTva] = useState("");

  // Gérer le formulaire
  const handleSubmit = (e) => {
    e.preventDefault();
     // Vérification du token
  const token = localStorage.getItem("accessToken");
  console.log('Token trouvé:', token); // Ajout de log pour vérifier le token

  if (!token) {
    alert("L'utilisateur n'est pas connecté. Impossible de créer la transaction.");
    return;
  }

  console.log('Utilisateur connecté:', user); // Ajout de log pour vérifier l'utilisateur

  if (!user || !user.id) {
    alert("L'utilisateur n'est pas connecté. Impossible de créer la transaction.");
    return;
  }
    const newTransaction = {
      transaction_id: uuidv4(), // ID généré automatiquement
      date: new Date(date),
      type,
      montant,
      devise,
      description,
      categorie,
      mode_paiement: modePaiement,
      statut,
      compte_debite_id: compteDebite,
      compte_credite_id: compteCredite,
      justificatif_url: justificatifUrl,
      cree_par_user_id: user.id, // Récupération automatique de l'ID utilisateur connecté
      taux_tva: tauxTva || null,
    };

    // Dispatche l'action redux pour créer la transaction
    dispatch(createTransaction(newTransaction));

    // Réinitialiser le formulaire après soumission
    setDate("");
    setType("Dépense");
    setMontant("");
    setDevise("TND");
    setDescription("");
    setCategorie("");
    setModePaiement("Espèces");
    setStatut("En attente");
    setCompteDebite("");
    setCompteCredite("");
    setJustificatifUrl("");
    setTauxTva("");
  };

  return (
    <div className="container">
      <h2>Ajouter une Transaction</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Date</label>
          <input
            type="date"
            className="form-control"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Type</label>
          <select
            className="form-control"
            value={type}
            onChange={(e) => setType(e.target.value)}
            required
          >
            <option value="Dépense">Dépense</option>
            <option value="Recette">Recette</option>
            <option value="Transfert">Transfert</option>
          </select>
        </div>

        <div className="mb-3">
          <label className="form-label">Montant</label>
          <input
            type="number"
            className="form-control"
            value={montant}
            onChange={(e) => setMontant(e.target.value)}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Devise</label>
          <select
            className="form-control"
            value={devise}
            onChange={(e) => setDevise(e.target.value)}
            required
          >
            <option value="TND">TND</option>
            <option value="EUR">EUR</option>
            <option value="USD">USD</option>
          </select>
        </div>

        <div className="mb-3">
          <label className="form-label">Description</label>
          <input
            type="text"
            className="form-control"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Catégorie</label>
          <input
            type="text"
            className="form-control"
            value={categorie}
            onChange={(e) => setCategorie(e.target.value)}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Mode de Paiement</label>
          <select
            className="form-control"
            value={modePaiement}
            onChange={(e) => setModePaiement(e.target.value)}
            required
          >
            <option value="Espèces">Espèces</option>
            <option value="Virement">Virement</option>
            <option value="Chèque">Chèque</option>
            <option value="Carte bancaire">Carte bancaire</option>
          </select>
        </div>

        <div className="mb-3">
          <label className="form-label">Statut</label>
          <select
            className="form-control"
            value={statut}
            onChange={(e) => setStatut(e.target.value)}
            required
          >
            <option value="En attente">En attente</option>
            <option value="Validée">Validée</option>
            <option value="Refusée">Refusée</option>
          </select>
        </div>

        <div className="mb-3">
          <label className="form-label">Compte Débité</label>
          <input
            type="text"
            className="form-control"
            value={compteDebite}
            onChange={(e) => setCompteDebite(e.target.value)}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Compte Crédité</label>
          <input
            type="text"
            className="form-control"
            value={compteCredite}
            onChange={(e) => setCompteCredite(e.target.value)}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Justificatif URL</label>
          <input
            type="text"
            className="form-control"
            value={justificatifUrl}
            onChange={(e) => setJustificatifUrl(e.target.value)}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Taux TVA (Optionnel)</label>
          <input
            type="number"
            className="form-control"
            value={tauxTva}
            onChange={(e) => setTauxTva(e.target.value)}
          />
        </div>

        <button type="submit" className="btn btn-primary">
          Ajouter la Transaction
        </button>
      </form>
    </div>
  );
}
