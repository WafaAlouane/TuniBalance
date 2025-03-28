import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
<<<<<<< HEAD
import { createStaff } from '../services/authService';
import { useNavigate } from 'react-router-dom';
=======
import { createStaff } from '../services/authService'; // Assurez-vous que cette fonction existe et dispatch l'action appropriée
import { useNavigate } from 'react-router-dom';
// Si vous avez un slice pour gérer les erreurs
>>>>>>> edbe1ea70015acf12bbd826e6d9117bf1c818245

const CreateStaff = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
<<<<<<< HEAD
=======
  const [error, setError] = useState("");
  
  // Utilisez useSelector pour récupérer l'état utilisateur depuis Redux
>>>>>>> edbe1ea70015acf12bbd826e6d9117bf1c818245
  const { user } = useSelector((state) => state.auth);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phoneNumber: '',
<<<<<<< HEAD
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
=======
    role: 'FINANCIER',
  });
  
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  
  // Dans CreateStaff.jsx
const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    const normalizedData = {
      ...formData,
      role: formData.role.toLowerCase(), // Conversion en minuscules
      phoneNumber: formData.phoneNumber.startsWith('+216') 
        ? formData.phoneNumber 
        : `+216${formData.phoneNumber}`
    };

    await dispatch(createStaff(normalizedData));
    alert('Compte staff créé avec succès !');
    navigate('/BusinessOwner');

  } catch (error) {
    setError(error.message);
  }
};
>>>>>>> edbe1ea70015acf12bbd826e6d9117bf1c818245

  return (
    <div className="container mt-5">
      <h2>Créer un membre du staff</h2>
      <form onSubmit={handleSubmit} className="card p-4">
<<<<<<< HEAD
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
=======
        <div className="mb-3">
          <label>Nom complet</label>
          <input type="text" name="name" className="form-control" value={formData.name} onChange={handleChange} required />
        </div>

        <div className="mb-3">
          <label>Email</label>
          <input type="email" name="email" className="form-control" value={formData.email} onChange={handleChange} required />
        </div>

        <div className="mb-3">
          <label>Mot de passe</label>
          <input type="password" name="password" className="form-control" value={formData.password} onChange={handleChange} required />
        </div>

        <div className="mb-3">
          <label>Numéro de téléphone</label>
          <input type="text" name="phoneNumber" className="form-control" value={formData.phoneNumber} onChange={handleChange} required />
>>>>>>> edbe1ea70015acf12bbd826e6d9117bf1c818245
        </div>

        <div className="mb-3">
          <label>Rôle</label>
<<<<<<< HEAD
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
=======
          // Options du select dans CreateStaff.jsx
<select name="role" className="form-select" value={formData.role} onChange={handleChange}>
  <option value="financier">Financier</option>
  <option value="accountant">Comptable</option>
</select>
        </div>

        <button type="submit" className="btn btn-primary">Créer le compte</button>
        {error && <div className="alert alert-danger">{error}</div>}
>>>>>>> edbe1ea70015acf12bbd826e6d9117bf1c818245
      </form>
    </div>
  );
};

<<<<<<< HEAD
export default CreateStaff;
=======
export default CreateStaff;
>>>>>>> edbe1ea70015acf12bbd826e6d9117bf1c818245
