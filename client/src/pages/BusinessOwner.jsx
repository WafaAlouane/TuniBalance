import React, { useState, useEffect, useRef } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../redux/slices/authSlice';
import { getAllTransactions } from '../services/transactionService';
import Header from '../components/admin/Header';
import Sidebar from '../components/admin/Sidebar';
import Footer from '../components/admin/Footer';
import { FiSearch, FiChevronLeft, FiChevronRight, FiDollarSign, FiCreditCard, FiActivity, FiCalendar } from 'react-icons/fi';

import { Pie, Bar } from "react-chartjs-2";
import { Chart as ChartJS, Title, Tooltip, Legend, ArcElement, CategoryScale, LinearScale, BarElement } from "chart.js";
import LayoutCompteRes from '../routes/LayoutCompteRes';
import LayoutBilan from '../routes/LayoutBilan';
import jsPDF from "jspdf";
import "jspdf-autotable";
import html2canvas from "html2canvas";
import axios from 'axios';
import  statistiques from '../pages/Stat';
ChartJS.register(Title, Tooltip, Legend, ArcElement, CategoryScale, LinearScale, BarElement);
function BusinessOwner() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth) || {};
  const [allTransactions, setAllTransactions] = useState([]);
  const [displayedTransactions, setDisplayedTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const transactionsPerPage = 6;

  const [generating, setGenerating] = useState(false);
  const tableRef = useRef();
    const [facturesClient, setFacturesClient] = useState([]);
  const [facturesFournisseur, setFacturesFournisseur] = useState([]);
  const [journal, setJournal] = useState(null);
  const [loadingJournal, setLoadingJournal] = useState(true);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const data = await getAllTransactions();
      console.log('Fetched Transactions:', data);  // Debug log
      setAllTransactions(data || []);
      setError('');
    } catch (err) {
      setError(err.message || 'Failed to load transactions');
      console.error('Error fetching transactions:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  useEffect(() => {
    const filtered = allTransactions.filter(transaction => {
      if (!searchTerm) return true;
      const term = searchTerm.toLowerCase();
      return (
        (transaction.description?.toLowerCase().includes(term)) ||
        (transaction.montant?.toString().includes(term)) ||  // Changed from 'amount' to 'montant'
        (transaction.type?.toLowerCase().includes(term)) ||
        (transaction.status?.toLowerCase().includes(term))
      );
    });

    const startIndex = (currentPage - 1) * transactionsPerPage;
    const paginated = filtered.slice(startIndex, startIndex + transactionsPerPage);
    setDisplayedTransactions(paginated);
  }, [allTransactions, searchTerm, currentPage]);

  const totalPages = Math.ceil(
    allTransactions.filter(t =>
      !searchTerm ||
      t.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.montant?.toString().includes(searchTerm) ||  // Changed from 'amount' to 'montant'
      t.type?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.status?.toLowerCase().includes(searchTerm.toLowerCase())
    ).length / transactionsPerPage
  );
  useEffect(() => {
    const fetchJournal = async () => {
      try {
        setLoadingJournal(true);
        const response = await axios.get(`${API_URL}`);
        setJournal(response.data);
        setError('');
      } catch (error) {
        setError(error.message);
      } finally {
        setLoadingJournal(false);
      }
    };
    
    fetchJournal();
  }, []);
  const getCardColor = (type) => {
    switch(type) {
      case 'credit': return 'from-green-600 to-green-800';
      case 'debit': return 'from-blue-600 to-blue-800';
      case 'transfer': return 'from-purple-600 to-purple-800';
      default: return 'from-gray-600 to-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex">
      <Sidebar user={user} />

      <div className="flex-1 flex flex-col">
        <Header user={user} onLogout={handleLogout} />

        <main className="flex-1 p-8 overflow-y-auto bg-gray-800">
          {/* Page header */}
          <div className="relative mb-8">
            <div className="absolute inset-0 bg-blue-600 opacity-5 rounded-xl"></div>
            <div className="relative z-10 flex justify-between items-center p-6 bg-gray-800 border border-gray-700 rounded-xl shadow-lg">
              <div>
                <h1 className="text-2xl font-bold text-white">Business Dashboard</h1>
                <p className="text-gray-400 mt-1">Manage your business finances and transactions</p>
              </div>
              <div className="flex space-x-3">
                <button
                  onClick={() => navigate('/BusinessOwner/create-staff')}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow transition-colors flex items-center"
                >
                  <FiActivity className="mr-2" />
                  Create Staff
                </button>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-gray-800 border-l-4 border-blue-500 rounded-lg p-6 shadow-lg">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-white">Total Transactions</h3>
                <div className="p-2 bg-blue-500/10 rounded-lg">
                  <FiActivity className="h-6 w-6 text-blue-400" />
                </div>
              </div>
              <p className="mt-4 text-3xl font-bold text-white">{allTransactions.length}</p>
              <div className="mt-2 flex items-center text-sm">
                <span className="text-gray-400">All time</span>
              </div>
            </div>

            <div className="bg-gray-800 border-l-4 border-green-500 rounded-lg p-6 shadow-lg">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-white">Total Income</h3>
                <div className="p-2 bg-green-500/10 rounded-lg">
                  <FiDollarSign className="h-6 w-6 text-green-400" />
                </div>
              </div>
              <p className="mt-4 text-3xl font-bold text-white">
                ${allTransactions
                  .filter(t => t.type === 'credit')
                  .reduce((sum, t) => sum + (t.montant || 0), 0)
                  .toFixed(2)}
              </p>
              <div className="mt-2 flex items-center text-sm">
                <span className="text-green-400 font-medium">+3.2%</span>
                <span className="text-gray-400 ml-2">from last month</span>
              </div>
            </div>

            <div className="bg-gray-800 border-l-4 border-purple-500 rounded-lg p-6 shadow-lg">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-white">Total Expenses</h3>
                <div className="p-2 bg-purple-500/10 rounded-lg">
                  <FiCreditCard className="h-6 w-6 text-purple-400" />
                </div>
              </div>
              <p className="mt-4 text-3xl font-bold text-white">
                ${allTransactions
                  .filter(t => t.type === 'debit')
                  .reduce((sum, t) => sum + (t.montant || 0), 0)
                  .toFixed(2)}
              </p>
              <div className="mt-2 flex items-center text-sm">
                <span className="text-red-400 font-medium">+1.8%</span>
                <span className="text-gray-400 ml-2">from last month</span>
              </div>
            </div>

            <div className="bg-gray-800 border-l-4 border-yellow-500 rounded-lg p-6 shadow-lg">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-white">Pending</h3>
                <div className="p-2 bg-yellow-500/10 rounded-lg">
                  <FiCalendar className="h-6 w-6 text-yellow-400" />
                </div>
              </div>
              <p className="mt-4 text-3xl font-bold text-white">
                ${allTransactions
                  .filter(t => t.statut === 'pending')
                  .reduce((sum, t) => sum + (t.montant || 0), 0)
                  .toFixed(2)}
              </p>
              <div className="mt-2 flex items-center text-sm">
                <span className="text-yellow-400 font-medium">{allTransactions.filter(t => t.statut === 'pending').length}</span>
                <span className="text-gray-400 ml-2">transactions</span>
              </div>
            </div>
          </div>

          {/* Transactions Section */}
          <div className="bg-gray-800 border border-gray-700 rounded-xl shadow-lg overflow-hidden mb-8">
            <div className="border-b border-gray-700 p-4 flex flex-col md:flex-row justify-between items-start md:items-center">
              <h2 className="text-xl font-bold text-white mb-3 md:mb-0">Recent Transactions</h2>

              <div className="relative w-full md:w-64">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiSearch className="text-gray-500" />
                </div>
                <input
                  type="text"
                  placeholder="Search transactions..."
                  className="w-full pl-10 pr-4 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm"
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setCurrentPage(1);
                  }}
                />
              </div>
            </div>

            <div className="p-4">
              {loading ? (
                <div className="flex justify-center py-12">
                  <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
                </div>
              ) : error ? (
                <div className="p-4 bg-red-900/30 rounded-lg text-red-400 border border-red-800 mb-6">
                  {error}
                </div>
              ) : displayedTransactions.length === 0 ? (
                <div className="p-8 text-center text-gray-400 bg-gray-700/20 rounded-lg">
                  {searchTerm ? 'No matching transactions found' : 'No transactions available'}
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                    {displayedTransactions.map((transaction) => (
                      <div
                        key={transaction.transaction_id}
                        className="bg-gray-700 rounded-lg shadow-md p-4 hover:shadow-lg transition-all border border-gray-600"
                      >
                        <div className="flex justify-between items-start mb-3">
                          <h3 className="text-lg font-medium text-white line-clamp-1">
                            {transaction.description || 'No description'}
                          </h3>
                          <div className={`p-2 rounded-full ${
                            transaction.type === 'credit'
                              ? 'bg-green-500/10'
                              : transaction.type === 'debit'
                                ? 'bg-red-500/10'
                                : 'bg-blue-500/10'
                          }`}>
                            {transaction.type === 'credit' && <FiDollarSign className="text-green-400" />}
                            {transaction.type === 'debit' && <FiCreditCard className="text-red-400" />}
                            {transaction.type === 'transfer' && <FiActivity className="text-blue-400" />}
                          </div>
                        </div>
                        <div className="space-y-3">
                          <div className="flex justify-between items-center">
                            <span className="text-gray-400">Amount:</span>
                            <span className={`text-lg font-bold ${
                              transaction.type === 'credit'
                                ? 'text-green-400'
                                : transaction.type === 'debit'
                                  ? 'text-red-400'
                                  : 'text-blue-400'
                            }`}>
                              ${transaction.montant ? transaction.montant.toFixed(2) : '0.00'}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-400">Date:</span>
                            <span className="text-white">
                              {transaction.date_transaction ? new Date(transaction.date_transaction).toLocaleDateString() : 'Invalid Date'}
                            </span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-gray-400">Status:</span>
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                              transaction.statut === 'completed'
                                ? 'bg-green-500/20 text-green-300'
                                : transaction.statut === 'pending'
                                  ? 'bg-yellow-500/20 text-yellow-300'
                                  : 'bg-gray-500/20 text-gray-300'
                            }`}>
                              {transaction.statut || 'UNKNOWN'}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {totalPages > 1 && (
                    <div className="flex justify-center items-center space-x-2 mt-4">
                      <button
                        onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
                        disabled={currentPage === 1}
                        className={`p-2 rounded-lg ${currentPage === 1 ? 'text-gray-500 cursor-not-allowed' : 'text-white hover:bg-gray-700'}`}
                      >
                        <FiChevronLeft size={18} />
                      </button>

                      {Array.from({ length: Math.min(5, totalPages) }).map((_, i) => {
                        let pageNum;
                        if (totalPages <= 5) {
                          pageNum = i + 1;
                        } else if (currentPage <= 3) {
                          pageNum = i + 1;
                        } else if (currentPage >= totalPages - 2) {
                          pageNum = totalPages - 4 + i;
                        } else {
                          pageNum = currentPage - 2 + i;
                        }

                        return (
                          <button
                            key={pageNum}
                            onClick={() => setCurrentPage(pageNum)}
                            className={`w-8 h-8 flex items-center justify-center rounded-lg ${currentPage === pageNum ? 'bg-blue-600 text-white' : 'text-gray-300 hover:bg-gray-700'}`}
                          >
                            {pageNum}
                          </button>
                        );
                      })}

                      <button
                        onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
                        disabled={currentPage === totalPages}
                        className={`p-2 rounded-lg ${currentPage === totalPages ? 'text-gray-500 cursor-not-allowed' : 'text-white hover:bg-gray-700'}`}
                      >
                        <FiChevronRight size={18} />
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>

          <Outlet />
          {/* Section Compte Résultat */}
          <div className="bg-slate-800 p-6 rounded-lg shadow-md mt-6">
            <h2 className="text-xl font-semibold text-yellow-500 mb-4 text-center">Compte Résultat</h2>
            <LayoutCompteRes />
          </div>

          {/* Section Bilan */}
          <div className="bg-slate-800 p-6 rounded-lg shadow-md mt-6">
            <h2 className="text-xl font-semibold text-yellow-500 mb-4 text-center">Bilan</h2>
            <LayoutBilan />
          </div>
        </main>

        <Footer />
      </div>
    </div>
  );
}

export default BusinessOwner;
