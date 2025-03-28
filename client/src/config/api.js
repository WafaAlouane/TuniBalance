// Créer un fichier api.js
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3001',
});

api.interceptors.request.use(config => {
<<<<<<< HEAD
  const token = localStorage.getItem('token');
=======
  const token = localStorage.getItem('accessToken');
  console.log("Token ajouté à la requête :", token);  // Vérifiez ici que le token est bien défini
>>>>>>> edbe1ea70015acf12bbd826e6d9117bf1c818245
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

<<<<<<< HEAD
=======

>>>>>>> edbe1ea70015acf12bbd826e6d9117bf1c818245
export default api;