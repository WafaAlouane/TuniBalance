import axios from 'axios';

const API_URL = 'http://localhost:3001/appointments';

// Créer un rendez-vous
export const createAppointment = async (appointmentData) => {
  try {
    const response = await axios.post(API_URL, appointmentData);
    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.message || error.message || 'Erreur lors de la création du rendez-vous';
    throw new Error(errorMessage);
  }
};

// Récupérer tous les rendez-vous
export const getAllAppointments = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.message || error.message || 'Erreur lors de la récupération des rendez-vous';
    throw new Error(errorMessage);
  }
};

// Supprimer un rendez-vous
export const deleteAppointment = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}/${id}`);
    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.message || error.message || 'Erreur lors de la suppression';
    throw new Error(errorMessage);
  }
};

// Modifier un rendez-vous
export const updateAppointment = async (id, updatedData) => {
  try {
    const response = await axios.put(`${API_URL}/${id}`, updatedData);
    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.message || error.message || 'Erreur lors de la mise à jour';
    throw new Error(errorMessage);
  }
};
