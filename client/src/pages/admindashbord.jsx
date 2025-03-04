import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';


export default function Dashboard() {
  
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

