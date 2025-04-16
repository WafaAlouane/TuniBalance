import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createStaff } from '../services/authService';
import { useNavigate } from 'react-router-dom';
import Header from '../components/admin/Header';
import Sidebar from '../components/admin/Sidebar';

const CreateStaff = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const { user } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phoneNumber: '',
    role: 'financier',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const normalizedData = {
        ...formData,
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

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col">
      <Header user={user} />
      <div className="flex flex-1">
        <Sidebar user={user} />

        <main className="flex-1 p-6 overflow-y-auto bg-gray-800">
          <div className="max-w-2xl mx-auto bg-gray-800 rounded-2xl shadow-xl border border-gray-700 p-8 relative z-10">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">
                Créer un membre du staff
              </h2>
              <p className="mt-2 text-sm text-gray-400">
                Remplissez les informations pour créer un nouveau compte staff
              </p>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-red-900/30 rounded-lg text-red-400 text-sm border border-red-800">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-300">Nom complet</label>
                <input
                  type="text"
                  name="name"
                  id="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 text-gray-200"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-300">Email</label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 text-gray-200"
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-300">Mot de passe</label>
                <input
                  type="password"
                  name="password"
                  id="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 text-gray-200"
                />
              </div>

              <div>
                <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-300">Numéro de téléphone</label>
                <div className="mt-1 flex rounded-lg shadow-sm">
                  <span className="inline-flex items-center px-3 rounded-l-lg border border-r-0 border-gray-600 bg-gray-700 text-gray-300 text-sm">+216</span>
                  <input
                    type="text"
                    name="phoneNumber"
                    id="phoneNumber"
                    value={formData.phoneNumber.replace('+216', '')}
                    onChange={handleChange}
                    required
                    className="flex-1 block w-full px-3 py-2 rounded-r-lg border border-gray-600 bg-gray-700 focus:ring-2 focus:ring-blue-500 text-gray-200"
                    placeholder="12345678"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="role" className="block text-sm font-medium text-gray-300">Rôle</label>
                <select
                  name="role"
                  id="role"
                  value={formData.role}
                  onChange={handleChange}
                  className="mt-1 block w-full pl-3 pr-10 py-2 bg-gray-700 border border-gray-600 rounded-lg text-gray-200"
                >
                  <option value="financier" className="bg-gray-700">Financier</option>
                  <option value="accountant" className="bg-gray-700">Comptable</option>
                </select>
              </div>

              <div>
                <button
                  type="submit"
                  className="w-full py-3 px-4 border border-transparent rounded-lg text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 transition"
                >
                  Créer le compte
                </button>
              </div>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
};

export default CreateStaff;
