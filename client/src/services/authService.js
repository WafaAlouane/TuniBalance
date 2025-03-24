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
    let redirectPath = '/';
    switch(response.data.user.role.toLowerCase()) {
      case 'accountant':
        redirectPath = '/comptable';
        break;
      case 'financier':
        redirectPath = '/financier';
        break;
      case 'business_owner':
        redirectPath = '/BusinessOwner';
        break;
      case 'admin':
        redirectPath = '/AdminDashboard';
        break;
    }
    
    return { ...response.data, redirectPath };
  } catch (error) {
    console.error('Erreur lors de la connexion:', error);
    throw error;
  }
};

// services/authService.js
export const createStaff = (staffData) => async (dispatch, getState) => {
  try {
    const token = getState().auth.token; // Récupère le token depuis le store
    if (!token) throw new Error("Utilisateur non authentifié");

    const response = await axios.post(
      "http://localhost:3001/auth/create-staff",
      staffData,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    return response.data; // Retourne les données pour une utilisation ultérieure

  } catch (error) {
    throw new Error(error.response?.data?.message || "Erreur lors de la création du staff");
  }
};

  
export const setup2FA = (token) => {
  return axios.post(`${API_URL}/2fa-setup`, {}, {
    headers: { Authorization: `Bearer ${token}` }
  });
};

export const verify2FA = (token, twoFactorToken) => {
  console.log("Données envoyées :", { token: twoFactorToken });
  return axios.post(`${API_URL}/2fa-verify`, { token: twoFactorToken }, {
    headers: { Authorization: `Bearer ${token}` }
  });

  
};

