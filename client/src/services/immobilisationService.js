import axios from 'axios';

const API_URL = 'http://localhost:3001/immobilisations';

// Global Error Handler
const handleError = (error, customMessage) => {
  console.error(error);
  throw error; // Re-throw the error to be handled by the component
};

export const fetchImmobilisations = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data;
  } catch (error) {
    handleError(error, 'Erreur lors du chargement des immobilisations');
    return []; // Return an empty array in case of error
  }
};

export const createImmobilisation = async (data) => {
  try {
    const response = await axios.post(API_URL, data);
    return response.data;
  } catch (error) {
    handleError(error, 'Erreur lors de la création de l\'immobilisation');
  }
};
