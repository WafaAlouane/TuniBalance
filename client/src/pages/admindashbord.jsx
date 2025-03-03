import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './components/';  // Import du fichier CSS

export default function Dashboard() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const user = localStorage.getItem('user');
    if (user) {
      try {
        const parsedUser = JSON.parse(user);
        if (parsedUser.role !== 'admin') {
          navigate('/login');
        }
      } catch (error) {
        console.error('Erreur de parsing JSON:', error);
        navigate('/login');
      }
    } else {
      navigate('/login');
    }
    setLoading(false);
  }, [navigate]);

  if (loading) return <p>Chargement...</p>;

  return (
    <div className="dashboard">
      <div className="sidebar">
        <h2>Menu</h2>
        <ul>
          <li><a href="/dashboard">Dashboard</a></li>
          <li><a href="/settings">Paramètres</a></li>
          <li><a href="/logout">Déconnexion</a></li>
        </ul>
      </div>

      <div className="content">
        <header>
          <h1>Tableau de Bord Admin</h1>
        </header>
        <div className="card">
          <h3>Bienvenue dans votre tableau de bord</h3>
          <p>Voici un exemple basique de tableau de bord sans dépendances externes.</p>
        </div>
      </div>
    </div>
  );
}
