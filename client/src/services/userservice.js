// Suppression de l'en-tête Authorization pour que tout le monde puisse voir la liste
import axios from 'axios';

const API_URL = 'http://localhost:3001/users'; // URL correcte sans /auth

// Fonction pour récupérer tous les utilisateurs (sans token)
export const getUsers = async () => {
  try {
    const response = await axios.get(API_URL); // Pas de token nécessaire
    return response.data; // Retourne les données des utilisateurs
  } catch (error) {
    const errorMessage = error.response?.data?.message || error.message || 'Erreur lors de la récupération des utilisateurs';
    throw new Error(errorMessage);
  }
};

// Fonction pour supprimer un utilisateur (uniquement pour les admins ou utilisateurs ayant la permission)
export const deleteUser = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}/${id}`); // Pas de token nécessaire
    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.message || error.message || 'Erreur lors de la suppression de l\'utilisateur';
    throw new Error(errorMessage);
  }
};
