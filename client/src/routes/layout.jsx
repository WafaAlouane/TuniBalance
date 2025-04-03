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

ChartJS.register(Title, Tooltip, Legend, ArcElement, CategoryScale, LinearScale, BarElement);

const Layout = () => {
    const isDesktopDevice = useMediaQuery("(min-width: 768px)");
    const [collapsed, setCollapsed] = useState(!isDesktopDevice);
    const sidebarRef = useRef(null);
    const { theme } = useTheme();
    const [showFactureForm, setShowFactureForm] = useState(false);
    const [savedFactures, setSavedFactures] = useState([]);
    const [currentFactureId, setCurrentFactureId] = useState(null); // ID de la facture sélectionnée
    const [transactions, setTransactions] = useState([]);
    const [facturesClient, setFacturesClient] = useState([]);
    const [facturesFournisseur, setFacturesFournisseur] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

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

    const totalDebit = transactions
        .filter(transaction => transaction.compte === "Débit")
        .reduce((sum, transaction) => sum + transaction.montant, 0);

    const totalCredit = transactions
        .filter(transaction => transaction.compte === "Crédit")
        .reduce((sum, transaction) => sum + transaction.montant, 0);

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

    const handleFactureClick = (factureId) => {
        setCurrentFactureId(factureId);
        setShowFactureForm(true);
    };

    const handleFormClose = () => {
        setShowFactureForm(false);
        setCurrentFactureId(null);
    };

    return (
        <div className="min-h-screen bg-slate-950 text-white transition-colors">
            <Sidebar ref={sidebarRef} collapsed={collapsed} />
            <div className={cn("transition-[margin] duration-300", collapsed ? "md:ml-[70px]" : "md:ml-[240px]")}>
                <Header collapsed={collapsed} setCollapsed={setCollapsed} onFactureClientClick={() => setShowFactureForm(true)} />
                <div className="h-[calc(100vh-60px)] overflow-y-auto overflow-x-hidden p-6 bg-slate-900">
                    {showFactureForm ? (
                        <FactureClientForm
                            onClose={handleFormClose}
                            factureId={currentFactureId || savedFactures.length + 1} // Si aucun ID, crée une nouvelle facture
                        />
                    ) : (
                        <div className="flex flex-col gap-y-6">
                            <h1 className="text-3xl font-semibold">Dashboard</h1>

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
                            {/* Compte Resultat */}

                            <div className="bg-slate-800 p-6 rounded-lg shadow-md mt-6">
                                <h2 className="text-xl font-semibold text-yellow-500 mb-4 text-center">Compte Résultat</h2>
                                <LayoutCompteRes />
                            </div>
                            {/* Factures Client Table */}
                            <div className="overflow-x-auto bg-slate-800 p-6 rounded-lg shadow-md mt-6">
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
            </div>
            <Footer />
        </div>
    );
};

export default Layout;