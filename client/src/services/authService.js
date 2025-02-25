import axios from 'axios';

const API_URL = 'http://localhost:3001/auth'; // Remplace par l'URL de ton backend

// Fonction pour l'inscription
export const register = async (userData) => {
  try {
    const response = await axios.post(`${API_URL}/register`, userData);
    return response.data;
  } catch (error) {
    console.error('Erreur lors de l’inscription:', error);
    throw error;
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
