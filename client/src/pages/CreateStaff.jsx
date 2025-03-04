import React, { useState } from 'react';
import { createStaff } from '../services/authService';
import { useAuth } from '../context/AuthContext';

const CreateStaff = () => {
  const { user } = useAuth();
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
      await createStaff(formData, user.id);
      alert('Compte staff créé avec succès !');
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Champs similaires à Register mais avec sélection de rôle */}
      <select 
        name="role" 
        value={formData.role}
        onChange={(e) => setFormData({...formData, role: e.target.value})}
      >
        <option value="financier">Financier</option>
        <option value="accountant">Comptable</option>
      </select>
      
      {/* ... autres champs ... */}
    </form>
  );
};