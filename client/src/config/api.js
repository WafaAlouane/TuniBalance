// Créer un fichier api.js
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3001',
});

api.interceptors.request.use(config => {
  const token = localStorage.getItem('accessToken');
  console.log("Token ajouté à la requête :", token);  // Vérifiez ici que le token est bien défini
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});


export default api;