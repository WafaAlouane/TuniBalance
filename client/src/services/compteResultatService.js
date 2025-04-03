import axios from 'axios';
const API_URL = 'http://localhost:3001/transactions/compte-resultat'; 

export const getCompteResultat = async () => {
    try {
      const response = await axios.get(API_URL);
      return response.data;
    } catch (error) {
      console.error("Erreur lors du chargement du compte de résultat:", error);
      return [];
    }
  };
  