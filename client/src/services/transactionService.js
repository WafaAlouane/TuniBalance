import axios from 'axios';

const API_URL = 'http://localhost:3001/transactions'; // Updated to the transactions API URL

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
