import React, { useState, useEffect } from 'react';  
import { Outlet, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../redux/slices/authSlice';
import { getAllTransactions } from '../services/transactionService';
import Header from '../components/admin/Header';
import Sidebar from '../components/admin/Sidebar';
import Footer from '../components/admin/Footer';
import { FiSearch, FiChevronLeft, FiChevronRight } from 'react-icons/fi';

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

  const getCardColor = (type) => {
    switch(type) {
      case 'credit': return 'from-green-600 to-green-800';
      case 'debit': return 'from-blue-600 to-blue-800';
      case 'transfer': return 'from-purple-600 to-purple-800';
      default: return 'from-gray-600 to-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col">
      <Header user={user} onLogout={handleLogout} />
      
      <div className="flex flex-1 overflow-hidden">
        <Sidebar user={user} />
        
        <main className="flex-1 overflow-y-auto pt-2 pb-20 bg-gray-800">
          <div className="max-w-7xl mx-auto px-4">
            
            {/* Enhanced Search Section */}
            <div className="mb-6 mt-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div className="p-3 rounded-lg bg-gray-800 shadow-lg w-full md:w-auto">
                <div className="relative w-full md:w-80">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiSearch className="text-blue-400" />
                  </div>
                  <input
                    type="text"
                    placeholder="Search transactions..."
                    className="w-full pl-10 pr-4 py-2 bg-gray-700 text-white rounded-lg border border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent shadow-md transition duration-300 ease-in-out"
                    value={searchTerm}
                    onChange={(e) => {
                      setSearchTerm(e.target.value);
                      setCurrentPage(1);
                    }}
                  />
                </div>
              </div>
            </div>

            {loading ? (
              <div className="flex justify-center py-12">
                <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            ) : error ? (
              <div className="p-4 bg-red-900/30 rounded-lg text-red-400 border border-red-800 mb-6">
                {error}
              </div>
            ) : displayedTransactions.length === 0 ? (
              <div className="p-8 text-center text-gray-400 bg-gray-700/50 rounded-lg">
                {searchTerm ? 'No matching transactions found' : 'No transactions available'}
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                  {displayedTransactions.map((transaction) => (
                    <div 
                      key={transaction.transaction_id} 
                      className={`bg-gradient-to-br ${getCardColor(transaction.type)} rounded-lg shadow-md p-4 hover:shadow-lg transition-all`}
                    >
                      <div className="flex justify-between items-start mb-3">
                        <h3 className="text-lg font-medium text-white line-clamp-1">
                          {transaction.description || 'No description'}
                        </h3>
                      </div>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-gray-200">Amount:</span>
                          <span className="text-white font-bold text-lg">
                            ${transaction.montant ? transaction.montant.toFixed(2) : '0.00'} {/* Changed to 'montant' */}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-200">Date:</span>
                          <span className="text-white">
                            {transaction.date_transaction ? new Date(transaction.date_transaction).toLocaleDateString() : 'Invalid Date'}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-200">Status:</span>
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
                  <div className="flex justify-center items-center space-x-2 mt-4 mb-8">
                    <button
                      onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
                      disabled={currentPage === 1}
                      className={`p-1 rounded-full ${currentPage === 1 ? 'text-gray-500 cursor-not-allowed' : 'text-white hover:bg-gray-700'}`}
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
                          className={`w-8 h-8 flex items-center justify-center rounded-full ${currentPage === pageNum ? 'bg-blue-600 text-white' : 'text-gray-300 hover:bg-gray-700'}`}
                        >
                          {pageNum}
                        </button>
                      );
                    })}

                    <button
                      onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
                      disabled={currentPage === totalPages}
                      className={`p-1 rounded-full ${currentPage === totalPages ? 'text-gray-500 cursor-not-allowed' : 'text-white hover:bg-gray-700'}`}
                    >
                      <FiChevronRight size={18} />
                    </button>
                  </div>
                )}
              </>
            )}

            <Outlet />
          </div>
        </main>
      </div>
      
      <Footer />
    </div>
  );
}

export default BusinessOwner;
