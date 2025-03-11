import axios from 'axios';

const API_URL = 'http://localhost:3001/auth'; 
 // Avec le préfixe /api

// Fonction pour l'inscription
export const register = async (userData) => {
  try {
    const payload = {
      name: userData.name.trim(),
      email: userData.email.toLowerCase().trim(),
      password: userData.password.trim(),
      phoneNumber: userData.phoneNumber.trim()
    };

    const response = await axios.post(`${API_URL}/signup`, payload);
    return response.data;

  } catch (error) {
    let errorMessage = 'Erreur de connexion au serveur';
    
    if (error.response) {
      errorMessage = error.response.data.message || 
        `Erreur ${error.response.status}: ${error.response.statusText}`;
    }
    
    throw new Error(errorMessage);
  }
};
// Fonction pour la connexion
export const login = async (credentials) => {
  try {
    const response = await axios.post(`${API_URL}/login`, credentials);
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la connexion:', error);
    throw error;
  }
};
export const createStaff = async (staffData, businessOwnerId) => {
  try {
    const response = await axios.post(`${API_URL}/create-staff`, {
      ...staffData,
      role: staffData.role
    }, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Erreur de création");
  }
};