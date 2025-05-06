import axios from 'axios';

const API_URL = 'http://localhost:3001/factures'; // URL for the backend factures API

// Function to create a facture along with its transactions
export const createFacture = async (factureData) => {
  try {
    const response = await axios.post(API_URL, factureData);
    return response.data; // Return the created facture data
  } catch (error) {
    const errorMessage = error.response?.data?.message || error.message || 'Error while creating facture';
    throw new Error(errorMessage); // Throw error if request fails
  }
};

// Function to get all factures
export const getAllFactures = async () => {
  try {
    const response = await axios.get(API_URL); // Send GET request to fetch all factures

    // Check if the response status is 200 (OK)
    if (response.status === 200) {
      return response.data; // Return the list of factures
    } else {
      throw new Error('Failed to fetch factures');
    }
  } catch (error) {
    // Check if the error is from axios (response error or network error)
    const errorMessage = error.response
      ? error.response?.data?.message || error.response?.statusText || 'Error while fetching factures'
      : error.message || 'Network error';

    // Log the error to the console and re-throw it with a custom message
    console.error(errorMessage);
    throw new Error(errorMessage);
  }
};

// Function to get factures for clients
export const getFacturesForClient = async () => {
  try {
    const response = await axios.get(`${API_URL}/client`); // Send GET request to fetch factures for client

    if (response.status === 200) {
      return response.data; // Return the list of client factures
    } else {
      throw new Error('Failed to fetch client factures');
    }
  } catch (error) {
    const errorMessage = error.response
      ? error.response?.data?.message || error.response?.statusText || 'Error while fetching client factures'
      : error.message || 'Network error';
    console.error(errorMessage);
    throw new Error(errorMessage);
  }
};

// Function to get factures for suppliers (fournisseurs)
export const getFacturesForFournisseur = async () => {
  try {
    const response = await axios.get(`${API_URL}/fournisseur`); // Send GET request to fetch factures for supplier

    if (response.status === 200) {
      return response.data; // Return the list of fournisseur factures
    } else {
      throw new Error('Failed to fetch fournisseur factures');
    }
  } catch (error) {
    const errorMessage = error.response
      ? error.response?.data?.message || error.response?.statusText || 'Error while fetching fournisseur factures'
      : error.message || 'Network error';
    console.error(errorMessage);
    throw new Error(errorMessage);
  }
};