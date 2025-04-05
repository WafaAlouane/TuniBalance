import axios from 'axios';
const API_URL = 'http://localhost:3001/transactions/compte-resultat'; 

// Action creators
export const fetchTransactionsStart = () => ({ type: "FETCH_TRANSACTIONS_START" });
export const fetchTransactionsSuccess = (data) => ({ type: "FETCH_TRANSACTIONS_SUCCESS", payload: data });
export const fetchTransactionsFailure = (error) => ({ type: "FETCH_TRANSACTIONS_FAILURE", payload: error });

export const getCompteResultat = async () => {
  try {
    const response = await axios.get(API_URL);
    console.log("Données reçues de l'API :", response.data);
    return response.data;
  } catch (error) {
    console.error("Erreur lors de la récupération des données :", error);
    return [];
  }
};