import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createStaff } from '../services/authService';
import { useNavigate } from 'react-router-dom';

const CreateStaff = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phoneNumber: '',
    role: 'financier'
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createStaff(formData, user._id);
      alert('Compte staff créé avec succès !');
      navigate('/DashboardBusinessOwner');
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div className="container mt-5">
      <h2>Créer un membre du staff</h2>
      <form onSubmit={handleSubmit} className="card p-4">
        {/* Ajoutez vos champs de formulaire ici */}
        <div className="mb-3">
          <label>Nom complet</label>
          <input
            type="text"
            className="form-control"
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
            required
          />
        </div>

        <div className="mb-3">
          <label>Rôle</label>
          <select 
            className="form-select"
            value={formData.role}
            onChange={(e) => setFormData({...formData, role: e.target.value})}
          >
            <option value="financier">Financier</option>
            <option value="accountant">Comptable</option>
          </select>
        </div>

        <button type="submit" className="btn btn-primary">
          Créer le compte
        </button>
      </form>
    </div>
  );
};

export default CreateStaff;