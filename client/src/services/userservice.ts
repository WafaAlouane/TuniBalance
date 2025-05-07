// userservice.ts
import axios from 'axios';
import { useQuery } from '@tanstack/react-query';
import { User } from '../types/user'; // Assurez-vous que ce type existe

const API_URL = 'http://localhost:3001/users';

// Ajoutez l'interface pour les paramètres
interface DeleteUserParams {
  id: string;
}

export const getUsers = async (): Promise<User[]> => {
    try {
        const response = await axios.get(API_URL); // Pas de token nécessaire
        return response.data; // Retourne les données des utilisateurs
      } catch (error) {
        const errorMessage = error.response?.data?.message || error.message || 'Erreur lors de la récupération des utilisateurs';
        throw new Error(errorMessage);
      }
};

export const useGetUserById = (id: string | null) => {
    return useQuery<User, Error>({
      queryKey: ['user', id],
      queryFn: async () => {
        if (!id) throw new Error('ID utilisateur non fourni');
        const { data } = await axios.get(`${API_URL}/${id}`);
        return data;
      },
      enabled: !!id,
      staleTime: 5 * 60 * 1000,
      retry: 2
    });
  };

export const getUserById = async (id: string): Promise<User> => {
    const response = await axios.get(`${API_URL}/${id}`);
    return response.data;
  };

export const deleteUser = async (id: string): Promise<User> => {
    try {
        const response = await axios.delete(`${API_URL}/${id}`); // Pas de token nécessaire
        return response.data;
      } catch (error) {
        const errorMessage = error.response?.data?.message || error.message || 'Erreur lors de la suppression de l\'utilisateur';
        throw new Error(errorMessage);
      }
    };