import axios from 'axios';

const API_URL = 'http://localhost:3001/bilan';

/**
 * Récupérer le bilan pour une année spécifique
 * @param {number} annee - L'année du bilan à récupérer
 */
export const fetchBilanByYear = async (annee) => {
  try {
    const response = await axios.get(`${API_URL}/${annee}`);
    console.log("Bilan récupéré :", response.data);
    return response.data;
  } catch (error) {
    console.error("Erreur lors de la récupération du bilan :", error);
    return null;
  }
};
