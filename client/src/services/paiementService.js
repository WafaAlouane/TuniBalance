import axios from 'axios';

const API_URL = 'http://localhost:3001/paiements';

// Global Error Handler
const handleError = (error, customMessage) => {
  console.error(error);
  alert(customMessage || 'Une erreur est survenue');
  throw error;
};

export const fetchPaiements = async () => {
  try {
    console.log('Fetching all paiements');
    const response = await axios.get(API_URL);
    console.log('All paiements response:', response);
    return response.data;
  } catch (error) {
    console.error('Error fetching all paiements:', error);
    handleError(error, 'Erreur lors du chargement des paiements');
    return []; // Return an empty array in case of error
  }
};

export const fetchPaiementsForEmprunt = async (empruntId) => {
  try {
    console.log(`Fetching paiements for emprunt ID: ${empruntId}`);
    // Get all paiements and filter by emprunt_id
    const response = await axios.get(API_URL);
    console.log('All paiements response:', response);

    // Filter paiements for this emprunt
    const filteredPaiements = response.data.filter(p =>
      p.emprunt_id === empruntId ||
      (p.emprunt_id && p.emprunt_id._id === empruntId) ||
      (p.emprunt_id && typeof p.emprunt_id === 'string' && p.emprunt_id === empruntId)
    );

    console.log('Filtered paiements for emprunt:', filteredPaiements);
    return filteredPaiements;
  } catch (error) {
    console.error('Error fetching paiements for emprunt:', error);
    handleError(error, 'Erreur lors du chargement des paiements pour cet emprunt');
    return []; // Return an empty array in case of error
  }
};

export const createPaiement = async (data) => {
  try {
    console.log('Creating new paiement with data:', data);
    const response = await axios.post(API_URL, data);
    console.log('Create paiement response:', response);
    return response.data;
  } catch (error) {
    console.error('Error creating paiement:', error);
    handleError(error, 'Erreur lors de la création du paiement');
    throw error;
  }
};
