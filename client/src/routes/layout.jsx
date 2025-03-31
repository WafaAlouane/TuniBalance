import React, { useEffect, useState, useRef } from "react";
import { useMediaQuery } from "@uidotdev/usehooks";
import { useClickOutside } from "@/hooks/use-click-outside";
import { Sidebar } from "@/layouts/sidebar";
import { Header } from "@/layouts/header";
import { Footer } from "@/layouts/footer";
import { cn } from "@/utils/cn";
import { useTheme } from "@/hooks/use-theme";
import { CreditCard, DollarSign, Package, TrendingUp, Users } from "lucide-react";
import FactureClientForm from "./dashboard/FactureClientForm";
import { getAllTransactions } from '@services/transactionService';

const Layout = () => {
    const isDesktopDevice = useMediaQuery("(min-width: 768px)");
    const [collapsed, setCollapsed] = useState(!isDesktopDevice);
    const sidebarRef = useRef(null);
    const { theme } = useTheme();
    const [showFactureForm, setShowFactureForm] = useState(false);
    const [savedFactures, setSavedFactures] = useState([]);
    const [currentFactureId, setCurrentFactureId] = useState(null);
    const [transactions, setTransactions] = useState([]);
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

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    const totalDebit = transactions
        .filter(transaction => transaction.compte === "Débit")
        .reduce((sum, transaction) => sum + transaction.montant, 0);

    const totalCredit = transactions
        .filter(transaction => transaction.compte === "Crédit")
        .reduce((sum, transaction) => sum + transaction.montant, 0);

    return (
        <div className="min-h-screen bg-slate-950 text-white transition-colors">
            <Sidebar ref={sidebarRef} collapsed={collapsed} />
            <div className={cn("transition-[margin] duration-300", collapsed ? "md:ml-[70px]" : "md:ml-[240px]")}>
                <Header collapsed={collapsed} setCollapsed={setCollapsed} onFactureClientClick={() => setShowFactureForm(true)} />
                <div className="h-[calc(100vh-60px)] overflow-y-auto overflow-x-hidden p-6 bg-slate-900">
                    {showFactureForm ? (
                        <FactureClientForm
                            onClose={() => setShowFactureForm(false)}
                            factureId={currentFactureId || savedFactures.length + 1}
                        />
                    ) : (
                        <div className="flex flex-col gap-y-6">
                            <h1 className="text-3xl font-semibold">Dashboard</h1>

                            {/* Transactions Table */}
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
                        </div>
                    )}
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default Layout;
