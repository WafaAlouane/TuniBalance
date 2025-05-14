import axios from 'axios';

const API_URL = 'http://localhost:3001/amortissement';

// Global Error Handler
const handleError = (error, customMessage) => {
  console.error(error);
  alert(customMessage || 'Une erreur est survenue');
};

// Fetch Amortissements
export const fetchAmortissements = async () => {
  try {
    console.log('Fetching all amortissements');
    const response = await axios.get(API_URL);
    console.log('All amortissements response:', response);
    return response.data;
  } catch (error) {
    console.error('Error fetching all amortissements:', error);
    handleError(error, 'Erreur lors du chargement des amortissements');
    return []; // Return an empty array in case of error
  }
};

// Generate Amortissement for Immobilisation
export const generateAmortissementForImmobilisation = async (id) => {
  try {
    const response = await axios.post(`http://localhost:3001/amortissement/immobilisation/lineaire/${id}`);
    return response.data;
  } catch (error) {
    handleError(error, 'Erreur lors de la génération de l\'amortissement pour immobilisation');
  }
};
export const fetchAmortissementsGroupes = async (id) => {
  try {
    console.log(`Fetching amortissements for ID: ${id}`);

    // Get all amortissements and filter client-side
    const response = await axios.get(`http://localhost:3001/amortissement`);
    console.log('Response from server:', response);

    // Filter the amortissements for the specific ID
    const filteredAmortissements = response.data.filter(a => {
      return (
        // Check all possible property names and formats
        a.emprunt_id === id ||
        (a.emprunt_id && a.emprunt_id._id === id) ||
        (a.emprunt_id && typeof a.emprunt_id === 'string' && a.emprunt_id === id) ||
        a.immobilisation_id === id ||
        (a.immobilisation_id && a.immobilisation_id._id === id) ||
        (a.immobilisation_id && typeof a.immobilisation_id === 'string' && a.immobilisation_id === id)
      );
    });

    console.log('Filtered amortissements:', filteredAmortissements);
    return filteredAmortissements;
  } catch (error) {
    console.error('Error fetching amortissements:', error);
    handleError(error, 'Erreur lors du chargement des amortissements groupés');
    return []; // Return an empty array in case of error
  }
};
// Generate Amortissement for Emprunt
export const generateAmortissementForEmprunt = async (id) => {
  try {
    const response = await axios.post(`http://localhost:3001/amortissement/emprunt/lineaire/${id}`);
    return response.data;
  } catch (error) {
    handleError(error, 'Erreur lors de la génération de l\'amortissement pour emprunt');
  }
};
