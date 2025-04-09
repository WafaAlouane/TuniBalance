import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTransactionsStart, fetchTransactionsSuccess, fetchTransactionsFailure } from '../../redux/slices/transactionSlice';
import '../../components/admin/admin.module.css'; // Assurez-vous d'avoir un fichier CSS pour les cartes

const AffTransaction = () => {
  const dispatch = useDispatch();
  const { transactions, loading, error } = useSelector((state) => state.transactions); // Récupérer les transactions du store

  useEffect(() => {
    const fetchTransactions = async () => {
      dispatch(fetchTransactionsStart());
      try {
        const response = await fetch('http://localhost:3001/transactions');
        if (!response.ok) throw new Error('Erreur lors de la récupération des transactions');
        const data = await response.json();
        dispatch(fetchTransactionsSuccess(data));
      } catch (err) {
        console.error('Erreur lors du fetch des transactions:', err);
        dispatch(fetchTransactionsFailure(err.message));
      }
    };

    fetchTransactions(); // Appeler la fonction pour récupérer les transactions
  }, [dispatch]);

  // Affichage du chargement, des erreurs ou des transactions
  if (loading) return <div>Chargement des transactions...</div>;
  if (error) return <div>Erreur : {error}</div>;

  if (Array.isArray(transactions) && transactions.length > 0) {
    return (
        <div className="main-content">
        <div className="pagetitle">
          <h1>Historique des Transactions</h1>
        </div>
    
        <div className="cards-container">
          
        {transactions.map((transaction) => (
          <div key={transaction.transaction_id} className="transaction-card">
            
            <p><strong>Montant :</strong> {transaction.montant} {transaction.devise}</p>
            <p><strong>Date :</strong> {new Date(transaction.date).toLocaleDateString()}</p>
            <p><strong>Type :</strong> {transaction.type}</p>
            <p><strong>Description :</strong> {transaction.description || 'Aucune description'}</p>
            <p><strong>Categorie :</strong> {transaction.categorie}</p>
            <p><strong>Mode de Paiement :</strong> {transaction.mode_paiement}</p>
            <p><strong>Statut :</strong> {transaction.statut}</p>
          </div>
        ))}
      </div>
      </div>

    );
  } else {
    return <div>Aucune transaction disponible</div>;
  }
};

export default AffTransaction;
