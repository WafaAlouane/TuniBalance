import React, { useEffect, useState, useRef } from "react";
import { useMediaQuery } from "@uidotdev/usehooks";
import { Sidebar } from "@/layouts/sidebar";
import { Header } from "@/layouts/header";
import { Footer } from "@/layouts/footer";
import { cn } from "@/utils/cn";
import { useTheme } from "@/hooks/use-theme";
import FactureClientForm from "./dashboard/FactureClientForm";
import { getAllTransactions } from '@services/transactionService';
import { getFacturesForClient, getFacturesForFournisseur } from '@services/factureService';
import { Pie, Bar } from "react-chartjs-2";
import { Chart as ChartJS, Title, Tooltip, Legend, ArcElement, CategoryScale, LinearScale, BarElement } from "chart.js";
import LayoutCompteRes from "./LayoutCompteRes";
import jsPDF from "jspdf";
import "jspdf-autotable";
import html2canvas from "html2canvas";
import axios from 'axios';
import LayoutBilan from "./LayoutBilan";
import LayoutKpi from "./LayoutKpi";
import LayoutRevenu from "./LayoutRevenu";


ChartJS.register(Title, Tooltip, Legend, ArcElement, CategoryScale, LinearScale, BarElement);

// API URL for generating the journal
const API_URL = 'http://localhost:3001/journal';

// Function to generate the journal
const generateJournal = async () => {
  try {
    const response = await axios.get(`${API_URL}/generate`);
    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.message || error.message || 'Erreur lors de la génération du journal';
    console.error(errorMessage);
    throw new Error(errorMessage);
  }
};

const Layout = () => {
  const isDesktopDevice = useMediaQuery("(min-width: 768px)");
  const [collapsed, setCollapsed] = useState(!isDesktopDevice);
  const sidebarRef = useRef(null);
  const { theme } = useTheme();
  const [showFactureForm, setShowFactureForm] = useState(false);
  const [savedFactures, setSavedFactures] = useState([]);
  const [currentFactureId, setCurrentFactureId] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [facturesClient, setFacturesClient] = useState([]);
  const [facturesFournisseur, setFacturesFournisseur] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [journal, setJournal] = useState(null);
  const [generating, setGenerating] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const transactionsPerPage = 6;

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const data = await getAllTransactions();
        setTransactions(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchTransactions();
  }, []);

  useEffect(() => {
    const fetchFactures = async () => {
      try {
        const clientData = await getFacturesForClient();
        const fournisseurData = await getFacturesForFournisseur();
        setFacturesClient(clientData);
        setFacturesFournisseur(fournisseurData);
      } catch (err) {
        setError(err.message);
      }
    };
    fetchFactures();
  }, []);

  const tableRef = useRef();
  const fournisseurTableRef = useRef();

  // Filter transactions based on search term
  const filteredTransactions = transactions.filter(transaction => {
    const searchLower = searchTerm.toLowerCase();
    return (
      transaction.description.toLowerCase().includes(searchLower) ||
      transaction.compte.toLowerCase().includes(searchLower) ||
      transaction.date_transaction.toLowerCase().includes(searchLower) ||
      (transaction.compte_details && transaction.compte_details.toLowerCase().includes(searchLower))
    );
  });

  // Get current transactions for pagination
  const indexOfLastTransaction = currentPage * transactionsPerPage;
  const indexOfFirstTransaction = indexOfLastTransaction - transactionsPerPage;
  const currentTransactions = filteredTransactions.slice(indexOfFirstTransaction, indexOfLastTransaction);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Pie chart data (Factures Client vs Fournisseur)
  const pieChartData = {
    labels: ['Factures Client', 'Factures Fournisseur'],
    datasets: [
      {
        label: 'Montant des Factures',
        data: [
          facturesClient.reduce((total, facture) => total + facture.montant_total, 0),
          facturesFournisseur.reduce((total, facture) => total + facture.montant_total, 0)
        ],
        backgroundColor: ['#34D399', '#EF4444'],
      }
    ]
  };

  // Bar chart data (Montant total per Client and Fournisseur)
  const barChartData = {
    labels: ['Client', 'Fournisseur'],
    datasets: [
      {
        label: 'Montant Total',
        data: [
          facturesClient.reduce((total, facture) => total + facture.montant_total, 0),
          facturesFournisseur.reduce((total, facture) => total + facture.montant_total, 0)
        ],
        backgroundColor: ['#34D399', '#EF4444'],
      }
    ]
  };
  const downloadExcel = async () => {
    try {
      const response = await fetch('http://localhost:3001/transactions/export/excel', {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
          }
    
      });
      if (!response.ok) {
        throw new Error(`Erreur HTTP! Statut: ${response.status}`);
      }
      const blob = await response.blob();
const url = window.URL.createObjectURL(blob);
const link = document.createElement('a');
link.href = url;
link.setAttribute('download', 'transactions.xlsx');
document.body.appendChild(link);
link.click();
link.remove();
} catch (error) {
console.error('Échec du téléchargement:', error);
alert('Impossible de télécharger le fichier. Vérifiez la connexion au serveur.');
}
};
  const totalDebit = transactions
    .filter(transaction => transaction.compte === "Débit")
    .reduce((sum, transaction) => sum + transaction.montant, 0);

  const totalCredit = transactions
    .filter(transaction => transaction.compte === "Crédit")
    .reduce((sum, transaction) => sum + transaction.montant, 0);

  const exportToPDF = () => {
    const input = tableRef.current;
    html2canvas(input).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save("factures-client.pdf");
    });
  };

  const exportFournisseurToPDF = () => {
    const input = fournisseurTableRef.current;
    html2canvas(input).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save("factures-fournisseur.pdf");
    });
  };

  const handleGenerateJournal = async () => {
    try {
      setGenerating(true);
      const generatedJournal = await generateJournal();
      setJournal(generatedJournal);
      setError(null);
    } catch (error) {
      setError(error.message);
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white transition-colors">
      <Sidebar ref={sidebarRef} collapsed={collapsed} />
      <div className={cn("transition-[margin] duration-300", collapsed ? "md:ml-[70px]" : "md:ml-[240px]")}>
        <Header collapsed={collapsed} setCollapsed={setCollapsed} onFactureClientClick={() => setShowFactureForm(true)} />
        <div className="h-[calc(100vh-60px)] overflow-y-auto overflow-x-hidden p-6 bg-slate-900">
          {showFactureForm ? (
            <FactureClientForm
              onClose={() => {
                setShowFactureForm(false);
                setCurrentFactureId(null);
              }}
              factureId={currentFactureId || savedFactures.length + 1}
            />
          ) : (
            <div className="flex flex-col gap-y-6">
              <h1 className="text-3xl font-semibold">Dashboard</h1>

              {/* Transactions Cards with Search and Pagination */}
              <div className="bg-slate-800 p-6 rounded-lg shadow-md mt-6">
                <div className="flex flex-col md:flex-row justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold text-blue-500 mb-4 md:mb-0 text-center md:text-left">Transactions</h2>
                  
                  {/* Search Input */}
                  <div className="relative w-full md:w-64">
                    <input
                      type="text"
                      placeholder="Search transactions..."
                      className="w-full px-4 py-2 rounded-lg bg-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={searchTerm}
                      onChange={(e) => {
                        setSearchTerm(e.target.value);
                        setCurrentPage(1);
                      }}
                    />
                    {searchTerm && (
                      <button
                        onClick={() => setSearchTerm("")}
                        className="absolute right-3 top-2.5 text-gray-400 hover:text-white"
                      >
                        ✕
                      </button>
                    )}
                  </div>
                </div>
                
                {/* Totals Card */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div className="bg-blue-600 p-4 rounded-lg shadow">
                    <h3 className="text-white font-medium">Total Débit</h3>
                    <p className="text-2xl font-bold text-white">{totalDebit} DH</p>
                  </div>
                  <div className="bg-green-600 p-4 rounded-lg shadow">
                    <h3 className="text-white font-medium">Total Crédit</h3>
                    <p className="text-2xl font-bold text-white">{totalCredit} DH</p>
                  </div>
                </div>

                {/* Transactions Count */}
                <div className="text-gray-400 text-sm mb-4">
                  Showing {currentTransactions.length} of {filteredTransactions.length} transactions
                </div>

                {/* Transactions Cards */}
                {currentTransactions.length > 0 ? (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {currentTransactions.map((transaction) => (
                        <div 
                          key={transaction.transaction_id} 
                          className={`p-4 rounded-lg shadow-md ${
                            transaction.compte === "Débit" ? "bg-blue-900" : "bg-green-900"
                          }`}
                        >
                          <div className="flex justify-between items-start mb-2">
                            <h3 className="font-semibold text-white">
                              {transaction.description}
                            </h3>
                            <span className={`px-2 py-1 rounded text-xs font-bold ${
                              transaction.compte === "Débit" 
                                ? "bg-blue-600 text-white" 
                                : "bg-green-600 text-white"
                            }`}>
                              {transaction.compte}
                            </span>
                          </div>
                          
                          <p className="text-gray-300 text-sm mb-1">
                            Date: {transaction.date_transaction}
                          </p>
                          
                          <p className="text-white font-bold text-lg">
                            {transaction.montant} DH
                          </p>
                          
                          {transaction.compte_details && (
                            <p className="text-gray-300 text-sm mt-2">
                              Compte: {transaction.compte_details}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>

                    {/* Pagination */}
                    <div className="flex justify-center mt-6">
                      <nav className="inline-flex rounded-md shadow">
                        <button
                          onClick={() => paginate(currentPage > 1 ? currentPage - 1 : 1)}
                          disabled={currentPage === 1}
                          className="px-3 py-1 rounded-l-md bg-slate-700 text-white disabled:opacity-50"
                        >
                          &laquo; Prev
                        </button>
                        
                        {Array.from({ length: Math.ceil(filteredTransactions.length / transactionsPerPage) }).map((_, index) => (
                          <button
                            key={index}
                            onClick={() => paginate(index + 1)}
                            className={`px-3 py-1 ${currentPage === index + 1 ? 'bg-blue-600 text-white' : 'bg-slate-700 text-white'}`}
                          >
                            {index + 1}
                          </button>
                        ))}
                        
                        <button
                          onClick={() => paginate(
                            currentPage < Math.ceil(filteredTransactions.length / transactionsPerPage) 
                              ? currentPage + 1 
                              : currentPage
                          )}
                          disabled={currentPage === Math.ceil(filteredTransactions.length / transactionsPerPage)}
                          className="px-3 py-1 rounded-r-md bg-slate-700 text-white disabled:opacity-50"
                        >
                          Next &raquo;
                        </button>
                      </nav>
                    </div>
                  </>
                ) : (
                  <div className="text-center py-8 text-gray-400">
                    No transactions found matching your search.
                  </div>
                )}
              </div>

              

              {/* Compte Résultat */}
              <div className="bg-slate-800 p-6 rounded-lg shadow-md mt-6">
                <h2 className="text-xl font-semibold text-yellow-500 mb-4 text-center">Compte Résultat</h2>
                <LayoutCompteRes />
              </div>

              {/* Export Buttons */}
              <div className="flex justify-center gap-4 mt-4">
                <button
                  onClick={exportToPDF}
                  className="bg-green-600 text-white px-4 py-2 rounded-md"
                >
                  Exporter Factures Client
                </button>
                <button
                  onClick={exportFournisseurToPDF}
                  className="bg-red-600 text-white px-4 py-2 rounded-md"
                >
                  Exporter Factures Fournisseur
                </button>
              </div>

             
                            {/* Factures Client Table */}
                          
                            <div className="flex justify-center mt-4">
                                <button
                                    onClick={exportToPDF}
                                    className="bg-green-600 text-white px-4 py-2 rounded-md"
                                >
                                    Exporter Tous les Factures en PDF
                                </button>
                            </div>

                            <div ref={tableRef}  className="overflow-x-auto bg-slate-800 p-6 rounded-lg shadow-md mt-6">
                               
 
                                <h2 className="text-xl font-semibold text-green-500 mb-4 text-center">Factures Client</h2>
                                <table className="min-w-full table-auto">
                                    <thead className="bg-green-600 text-white">
                                        <tr>
                                            <th className="px-4 py-2 text-left">Numéro Facture</th>
                                            <th className="px-4 py-2 text-left">Nom Client</th>
                                            <th className="px-4 py-2 text-left">Date Emission</th>
                                            <th className="px-4 py-2 text-left">Date Echéance</th>
                                            <th className="px-4 py-2 text-left">Montant Total</th>
                                            <th className="px-4 py-2 text-left">Statut</th>
                                            <th className="px-4 py-2 text-left">Mode Paiement</th>
                                        </tr>
                                    </thead>
                                    <tbody className="text-slate-300">
                                        {facturesClient.map((facture) => (
                                            <tr
                                                key={facture._id}
                                                className="hover:bg-slate-700 cursor-pointer"
                                                onClick={() => handleFactureClick(facture._id)} // Sélectionne la facture pour modification
                                            >
                                                <td className="px-4 py-2">{facture.numero_facture}</td>
                                                <td className="px-4 py-2">{facture.nom_client}</td>
                                                <td className="px-4 py-2">{facture.date_emission}</td>
                                                <td className="px-4 py-2">{facture.date_echeance}</td>
                                                <td className="px-4 py-2">{facture.montant_total}</td>
                                                <td className="px-4 py-2">{facture.statut}</td>
                                                <td className="px-4 py-2">{facture.mode_paiement}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>

                            </div>


              {/* Factures Fournisseur Table */}
              <div className="overflow-x-auto bg-slate-800 p-6 rounded-lg shadow-md mt-6">
                                <h2 className="text-xl font-semibold text-red-500 mb-4 text-center">Factures Fournisseur</h2>
                                <table className="min-w-full table-auto">
                                    <thead className="bg-red-600 text-white">
                                        <tr>
                                            <th className="px-4 py-2 text-left">Numéro Facture</th>
                                            <th className="px-4 py-2 text-left">Nom Fournisseur</th>
                                            <th className="px-4 py-2 text-left">Date Emission</th>
                                            <th className="px-4 py-2 text-left">Date Echéance</th>
                                            <th className="px-4 py-2 text-left">Montant Total</th>
                                            <th className="px-4 py-2 text-left">Statut</th>
                                            <th className="px-4 py-2 text-left">Mode Paiement</th>
                                        </tr>
                                    </thead>
                                    <tbody className="text-slate-300">
                                        {facturesFournisseur.map((facture) => (
                                            <tr
                                                key={facture._id}
                                                className="hover:bg-slate-700 cursor-pointer"
                                                onClick={() => handleFactureClick(facture._id)} // Sélectionne la facture pour modification
                                            >
                                                <td className="px-4 py-2">{facture.numero_facture}</td>
                                                <td className="px-4 py-2">{facture.nom_client}</td>
                                                <td className="px-4 py-2">{facture.date_emission}</td>
                                                <td className="px-4 py-2">{facture.date_echeance}</td>
                                                <td className="px-4 py-2">{facture.montant_total}</td>
                                                <td className="px-4 py-2">{facture.statut}</td>
                                                <td className="px-4 py-2">{facture.mode_paiement}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

              {/* Button to Generate Journal */}
              <div className="flex justify-center mt-8">
                <button
                  onClick={handleGenerateJournal}
                  disabled={generating}
                  className="bg-yellow-500 hover:bg-yellow-600 text-black px-6 py-2 rounded-md shadow-md disabled:opacity-50"
                >
                  {generating ? "Génération en cours..." : "Générer Journal Comptable"}
                </button>
              </div>

              {/* Display error */}
              {error && (
                <div className="text-red-500 text-center mt-4">{error}</div>
              )}

              {/* Table Journal Comptable */}
              {journal && (
                <div className="overflow-x-auto bg-slate-800 p-6 rounded-lg shadow-md mt-6">
                  <h2 className="text-xl font-semibold text-green-500 mb-4 text-center">Journal Comptable Ai</h2>
                  <table className="min-w-full table-auto">
                    <thead className="bg-green-600 text-white">
                      <tr>
                        <th className="px-4 py-2 text-left">Compte</th>
                        <th className="px-4 py-2 text-left">Débit</th>
                        <th className="px-4 py-2 text-left">Crédit</th>
                        <th className="px-4 py-2 text-left">Description</th>
                      </tr>
                    </thead>
                    <tbody className="text-slate-300">
                      {journal.map((entry, index) => (
                        <tr key={index}>
                          <td className="px-4 py-2">{entry.compte}</td>
                          <td className="px-4 py-2">{entry.debit}</td>
                          <td className="px-4 py-2">{entry.credit}</td>
                          <td className="px-4 py-2">{entry.description}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}


              
                            {/* Journal Table */}
                            <div className="overflow-x-auto bg-slate-800 p-6 rounded-lg shadow-md mt-6">
                                <h2 className="text-xl font-semibold text-blue-500 mb-4 text-center">Journal Comptable</h2>
                                <table className="min-w-full table-auto">
                                    <thead className="bg-blue-600 text-white">
                                        <tr>
                                            <th className="px-4 py-2 text-left">Date Transaction</th>
                                            <th className="px-4 py-2 text-left">Description</th>
                                            <th className="px-4 py-2 text-left">Montant</th>
                                            <th className="px-4 py-2 text-left">Débit</th>
                                            <th className="px-4 py-2 text-left">Crédit</th>
                                        </tr>
                                    </thead>
                                    <tbody className="text-slate-300">
                                        {transactions.map((transaction) => (
                                            <tr key={transaction.transaction_id} className="hover:bg-slate-700">
                                                <td className="px-4 py-2">{transaction.date_transaction}</td>
                                                <td className="px-4 py-2">{transaction.description}</td>
                                                <td className="px-4 py-2">{transaction.montant}</td>
                                                <td className="px-4 py-2">{transaction.compte === "Débit" ? transaction.montant : ""}</td>
                                                <td className="px-4 py-2">{transaction.compte === "Crédit" ? transaction.montant : ""}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                    <tfoot className="bg-green-700 text-white font-bold">
                                        <tr>
                                            <td colSpan="3" className="px-4 py-2 font-bold text-right">Total</td>
                                            <td className="px-4 py-2 font-bold">{totalDebit}</td>
                                            <td className="px-4 py-2 font-bold">{totalCredit}</td>
                                        </tr>
                                    </tfoot>
                                </table>
                            </div>
                            <button
  onClick={downloadExcel}
  className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md"
>
  Exporter en Excel
</button>
                            <div className="bg-slate-800 p-6 rounded-lg shadow-md mt-6">
                                <h2 className="text-xl font-semibold text-yellow-500 mb-4 text-center">Bilan</h2>
                                <LayoutBilan />
                            </div>
                            <div className="bg-slate-800 p-6 rounded-lg shadow-md mt-6">
                                <h2 className="text-xl font-semibold text-yellow-500 mb-4 text-center">KPI</h2>
                                <LayoutKpi />
                            </div>
                            <div className="bg-slate-800 p-6 rounded-lg shadow-md mt-6">
                                <h2 className="text-xl font-semibold text-yellow-500 mb-4 text-center">Revenus</h2>
                                <LayoutRevenu />
                            </div>
              {/* Charts */}
              <div className="mt-6">
                <h2 className="text-xl font-semibold text-center">Visualisation des Factures</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-slate-800 p-6 rounded-lg shadow-md">
                    <h3 className="text-center text-green-500">Répartition des Factures</h3>
                    <Pie data={pieChartData} />
                  </div>
                  <div className="bg-slate-800 p-6 rounded-lg shadow-md">
                    <h3 className="text-center text-red-500">Comparaison des Montants</h3>
                    <Bar data={barChartData} />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
        <Footer />
      </div>
    </div>
  );
};

export default Layout;