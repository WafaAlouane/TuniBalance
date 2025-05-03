import axios from 'axios';

const API_URL = 'http://localhost:3001/reporting-fiscal';

/**
 * Récupérer le rapport TVA pour une année et un trimestre
 */
export const fetchRapportTVA = async (annee, trimestre) => {
  try {
    const response = await axios.get(`${API_URL}/rapport-tva/${annee}/${trimestre}`);
    return response.data;
  } catch (error) {
    console.error("Erreur lors de la récupération du rapport TVA :", error);
    return null;
  }
};

/**
 * Analyser les écarts fiscaux pour une année donnée
 */
export const fetchAnalyseEcart = async (annee) => {
  try {
    const response = await axios.get(`${API_URL}/analyse-ecart/${annee}`);
    return response.data;
  } catch (error) {
    console.error("Erreur lors de l'analyse des écarts fiscaux :", error);
    return null;
  }
};

export const fetchRapportTVAPdf = async (annee, trimestre) => {
  const response = await axios.get(`${API_URL}/rapport-tva/${annee}/${trimestre}/pdf`, { responseType: 'blob' });
  return response.data;
};

export const fetchRapportTVAExcel = async (annee, trimestre) => {
  const response = await axios.get(`${API_URL}/rapport-tva/${annee}/${trimestre}/excel`, { responseType: 'blob' });
  return response.data;
};