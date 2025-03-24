import React, { useEffect, useState } from "react";
import { getUsers, deleteUser } from "../services/userservice"; // Assure-toi de bien importer ton service

function ViewBO() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await getUsers(); // Appel API pour récupérer les utilisateurs
      setUsers(response);
    } catch (error) {
      console.error("Erreur lors de la récupération des utilisateurs", error);
    }
  };

  const handleDeleteUser = async (id) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer cet utilisateur ?")) {
      try {
        await deleteUser(id); // Appel API pour supprimer un utilisateur
        setUsers(users.filter(user => user._id !== id)); // Mise à jour de la liste
      } catch (error) {
        console.error("Erreur lors de la suppression de l'utilisateur", error);
      }
    }
  };

  return (
    <div className="container">
      <h2>Liste des Utilisateurs</h2>
      <table className="table">
        <thead>
          <tr>
            <th>Nom</th>
            <th>Email</th>
            <th>Rôle</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user._id}>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>{user.role}</td>
              <td>
                <button 
                  className="btn btn-danger" 
                  onClick={() => handleDeleteUser(user._id)}
                >
                  Supprimer
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ViewBO;
