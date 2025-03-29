import React, { useEffect, useRef, useState } from "react";
import { useMediaQuery } from "@uidotdev/usehooks";
import { useClickOutside } from "@/hooks/use-click-outside";
import { Sidebar } from "@/layouts/sidebar";
import { Header } from "@/layouts/header";
import { Footer } from "@/layouts/footer";
import { cn } from "@/utils/cn";
import { useTheme } from "@/hooks/use-theme";
import { CreditCard, DollarSign, Package, TrendingUp, Users } from "lucide-react";
import FactureClientForm from "./dashboard/FactureClientForm";

const Layout = () => {
    const isDesktopDevice = useMediaQuery("(min-width: 768px)");
    const [collapsed, setCollapsed] = useState(!isDesktopDevice);
    const sidebarRef = useRef(null);
    const { theme } = useTheme();
    const [showFactureForm, setShowFactureForm] = useState(false);
    const [savedFactures, setSavedFactures] = useState([]);
    const [currentFactureId, setCurrentFactureId] = useState(null);

    const handleSaveFacture = (factureId, transactions) => {
        const newFacture = {
            id: factureId,
            transactions,
            total: transactions.reduce((acc, curr) => acc + curr.montant, 0),
        };
        setSavedFactures([...savedFactures, newFacture]);
        setShowFactureForm(false);
    };

    const handleFactureClick = (factureId) => {
        setCurrentFactureId(factureId);
        setShowFactureForm(true);
    };

    useEffect(() => {
        setCollapsed(!isDesktopDevice);
    }, [isDesktopDevice]);

    useClickOutside([sidebarRef], () => {
        if (!isDesktopDevice && !collapsed) {
            setCollapsed(true);
        }
    });

    return (
        <div className="min-h-screen bg-slate-950 transition-colors">
            <div className="pointer-events-none fixed inset-0 -z-10 bg-black opacity-0 transition-opacity {!collapsed && 'max-md:pointer-events-auto max-md:z-50 max-md:opacity-30'}" />
            <Sidebar ref={sidebarRef} collapsed={collapsed} />
            <div className={cn("transition-[margin] duration-300", collapsed ? "md:ml-[70px]" : "md:ml-[240px]")}>
                <Header collapsed={collapsed} setCollapsed={setCollapsed} onFactureClientClick={() => setShowFactureForm(true)} />
                <div className="h-[calc(100vh-60px)] overflow-y-auto overflow-x-hidden p-6 bg-slate-900">
                    {showFactureForm ? (
                        <FactureClientForm
                            onClose={() => setShowFactureForm(false)}
                            onSave={handleSaveFacture}
                            factureId={currentFactureId || savedFactures.length + 1} // Generate new factureId
                        />
                    ) : (
                        <div className="flex flex-col gap-y-4">
                            <h1 className="title text-white">Dashboard</h1>
                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                                {[{
                                    icon: Package,
                                    title: "Total Products",
                                    value: "25,154",
                                    trend: "25%",
                                }, {
                                    icon: DollarSign,
                                    title: "Total Paid Orders",
                                    value: "$16,000",
                                    trend: "12%",
                                }, {
                                    icon: Users,
                                    title: "Total Customers",
                                    value: "15,400k",
                                    trend: "15%",
                                }, {
                                    icon: CreditCard,
                                    title: "Sales",
                                    value: "12,340",
                                    trend: "19%",
                                }].map(({ icon: Icon, title, value, trend }, index) => (
                                    <div key={index} className="card bg-slate-800">
                                        <div className="card-header">
                                            <div className="rounded-lg bg-blue-500/20 p-2 text-blue-500">
                                                <Icon size={26} />
                                            </div>
                                            <p className="card-title text-white">{title}</p>
                                        </div>
                                        <div className="card-body bg-slate-700">
                                            <p className="text-3xl font-bold text-white">{value}</p>
                                            <span className="flex w-fit items-center gap-x-2 rounded-full border border-blue-500 px-2 py-1 font-medium text-blue-500">
                                                <TrendingUp size={18} />
                                                {trend}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Display Factures with their transactions */}
                            <div className="mt-8">
                                <h2 className="text-white text-xl font-semibold">Saved Factures</h2>
                                <div className="mt-4">
                                    {savedFactures.map((facture) => (
                                        <div key={facture.id} className="mb-4 bg-slate-800 p-4 rounded-md">
                                            <h3 className="text-white font-semibold" onClick={() => handleFactureClick(facture.id)}>
                                                Facture ID: {facture.id} - Total: {facture.total.toFixed(2)} TND
                                            </h3>
                                            <div className="mt-2 text-white">
                                                <strong>Transactions:</strong>
                                                <ul>
                                                    {facture.transactions.map((transaction, index) => (
                                                        <li key={index}>
                                                            {transaction.description} - {transaction.montant.toFixed(2)} TND
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        </div>
                                    ))}
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
