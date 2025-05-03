import React, { useEffect, useState } from "react";
import { useMediaQuery } from "@uidotdev/usehooks";
import { useClickOutside } from "@/hooks/use-click-outside";
import { Sidebar } from "@/layouts/sidebar";
import { Header } from "@/layouts/header";
import { Footer } from "@/layouts/footer";
import { cn } from "@/utils/cn";
import { useTheme } from "@/hooks/use-theme";
import { CreditCard, DollarSign, Package, TrendingUp, Users } from "lucide-react";
    
const LayoutFacture = () => {
    const isDesktopDevice = useMediaQuery("(min-width: 768px)");
    const [collapsed, setCollapsed] = useState(!isDesktopDevice);
    const sidebarRef = useRef(null);
    const { theme } = useTheme();
    const [factures, setFactures] = useState([]); // Store the factures here

    useEffect(() => {
        const fetchFactures = async () => {
            try {
                const facturesFromAPI = await getAllFactures(); // Fetch factures from your backend
                setFactures(facturesFromAPI); // Set factures state
            } catch (error) {
                console.error("Error fetching factures", error);
            }
        };

        fetchFactures(); // Fetch factures when the component mounts
    }, []);

    const handleFactureClick = (factureId) => {
        // Handle facture click logic
        console.log("Facture clicked: ", factureId);
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
                <Header collapsed={collapsed} setCollapsed={setCollapsed} />
                <div className="h-[calc(100vh-60px)] overflow-y-auto overflow-x-hidden p-6 bg-slate-900">
                    <div className="flex flex-col gap-y-4">
                        <h1 className="title text-white">Dashboard</h1>

                        {/* Display Factures in a Table */}
                        <div className="mt-8">
                            <h2 className="text-white text-xl font-semibold">Factures</h2>
                            <div className="mt-4 overflow-x-auto bg-slate-800 p-4 rounded-md">
                                <table className="min-w-full table-auto text-white">
                                    <thead>
                                        <tr>
                                            <th className="p-2 text-left">Facture ID</th>
                                            <th className="p-2 text-left">Client Name</th>
                                            <th className="p-2 text-left">Montant Total</th>
                                            <th className="p-2 text-left">Date d'Émission</th>
                                            <th className="p-2 text-left">Statut</th>
                                            <th className="p-2 text-left">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {factures.map((facture) => (
                                            <tr key={facture._id}>
                                                <td className="p-2">{facture.numero_facture}</td>
                                                <td className="p-2">{facture.nom_client}</td>
                                                <td className="p-2">{facture.montant_total.toFixed(2)} TND</td>
                                                <td className="p-2">{new Date(facture.date_emission).toLocaleDateString()}</td>
                                                <td className="p-2">{facture.statut}</td>
                                                <td className="p-2">
                                                    <button
                                                        className="text-blue-500 hover:underline"
                                                        onClick={() => handleFactureClick(facture._id)}
                                                    >
                                                        Voir
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default LayoutFacture;
