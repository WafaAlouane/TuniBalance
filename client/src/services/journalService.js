import axios from 'axios';

const API_URL = 'http://localhost:3000/journal'; // This matches your NestJS route

// Function to generate the journal
export const generateJournal = async () => {
  try {
    // Make the GET request to the backend to generate the journal
    const response = await axios.get(`${API_URL}/generate`);
    
    // Return the journal data from the response
    return response.data;
  } catch (error) {
    // Handle errors and display an appropriate message
    const errorMessage = error.response?.data?.message || error.message || 'Erreur lors de la génération du journal';
    console.error(errorMessage);
    throw new Error(errorMessage);
  }
};

