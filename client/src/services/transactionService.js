import axios from 'axios';

const API_URL = 'http://localhost:3001/transactions'; // Updated to the transactions API URL
// transactionService.js
export const filterTransactions = async (filters) => {
  try {
    const response = await axios.get('http://localhost:3001/transactions/filter', {
      params: {
        ...filters,
        search: filters.search?.trim() // Nettoyer la recherche
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error filtering transactions:', error);
    throw new Error(error.response?.data?.message || 'Erreur lors du filtrage');
  }
};
// Function to get all transactions
export const getAllTransactions = async () => {
  try {
    const response = await axios.get(API_URL); // Send GET request to fetch all transactions

    if (response.status === 200) {
      return response.data; // Return the list of transactions
    } else {
      throw new Error('Failed to fetch transactions');
    }
  } catch (error) {
    const errorMessage = error.response
      ? error.response?.data?.message || error.response?.statusText || 'Error while fetching transactions'
      : error.message || 'Network error';

    console.error(errorMessage);
    throw new Error(errorMessage);
  }
};
export const getCompteResultat = async () => {
  try {
    const response = await axios.get('http://localhost:3001/transactions/compte-resultat');
    console.log("Données reçues de l'API :", response.data);
    return response.data; // Doit être un objet contenant les champs requis
  } catch (error) {
    console.error("Erreur lors de la récupération du compte de résultat :", error);
    throw error;
  }
};

export const getMonthlyStats = async () => {
  try {
    const response = await axios.get('http://localhost:3001/transactions/monthly-stats');
    return response.data;
  } catch (error) {
    console.error('Error fetching monthly stats:', error);
    throw error;
  }
};