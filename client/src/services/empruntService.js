import axios from 'axios';

const API_URL = 'http://localhost:3001/emprunt';

export const fetchEmprunts = async () => {
  const res = await axios.get(API_URL);
  return res.data;
};

export const genererPaiements = async (id) => {
  const res = await axios.post(`${API_URL}/generer-paiements/${id}`);
  return res.data;
};

export const createEmprunt = async (empruntData) => {
  const res = await axios.post(API_URL, empruntData);
  return res.data;
};
