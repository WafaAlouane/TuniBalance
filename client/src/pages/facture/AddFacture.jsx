import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { createFacture } from '../../services/factureservice'; 
import { useNavigate } from 'react-router-dom';

const Addfacture = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    type: 'vente', // ou 'achat'
    montant: '',
    date: '',
    client_nom: '',
    client_adresse: '',
    client_email: '',
    fournisseur_nom: '',
    fournisseur_adresse: '',
    fournisseur_email: '',
    specifications: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const normalizedData = {
        ...formData,
        montant: parseFloat(formData.montant), // Assurez-vous que le montant est un nombre
        date: new Date(formData.date), // Convertir la date en format Date
      };

      await dispatch(createFacture(normalizedData)); // Dispatch l'action pour créer la facture
      alert('Facture créée avec succès!');
      navigate('/factures'); // Naviguer vers la liste des factures ou une autre page
    } catch (error) {
      setError(error.message); // Afficher l'erreur si une exception se produit
    }
  };

  return (
    <div className="container mt-5">
      <h2>Créer une Facture</h2>
      <form onSubmit={handleSubmit} className="card p-4">
        <div className="mb-3">
          <label>Type de Facture</label>
          <select name="type" className="form-select" value={formData.type} onChange={handleChange}>
            <option value="vente">Vente</option>
            <option value="achat">Achat</option>
          </select>
        </div>

        <div className="mb-3">
          <label>Montant</label>
          <input type="number" name="montant" className="form-control" value={formData.montant} onChange={handleChange} required />
        </div>

        <div className="mb-3">
          <label>Date</label>
          <input type="date" name="date" className="form-control" value={formData.date} onChange={handleChange} required />
        </div>

        <div className="mb-3">
          <label>Nom du Client</label>
          <input type="text" name="client_nom" className="form-control" value={formData.client_nom} onChange={handleChange} required />
        </div>

        <div className="mb-3">
          <label>Adresse du Client</label>
          <input type="text" name="client_adresse" className="form-control" value={formData.client_adresse} onChange={handleChange} required />
        </div>

        <div className="mb-3">
          <label>Email du Client</label>
          <input type="email" name="client_email" className="form-control" value={formData.client_email} onChange={handleChange} required />
        </div>

        <div className="mb-3">
          <label>Nom du Fournisseur</label>
          <input type="text" name="fournisseur_nom" className="form-control" value={formData.fournisseur_nom} onChange={handleChange} required />
        </div>

        <div className="mb-3">
          <label>Adresse du Fournisseur</label>
          <input type="text" name="fournisseur_adresse" className="form-control" value={formData.fournisseur_adresse} onChange={handleChange} required />
        </div>

        <div className="mb-3">
          <label>Email du Fournisseur</label>
          <input type="email" name="fournisseur_email" className="form-control" value={formData.fournisseur_email} onChange={handleChange} required />
        </div>

        <div className="mb-3">
          <label>Spécifications (optionnel)</label>
          <textarea name="specifications" className="form-control" value={formData.specifications} onChange={handleChange}></textarea>
        </div>

        <button type="submit" className="btn btn-primary">Créer la Facture</button>
        {error && <div className="alert alert-danger mt-3">{error}</div>}
      </form>
    </div>
  );
};

export default Addfacture;
