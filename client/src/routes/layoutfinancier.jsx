import { useEffect, useState } from "react";
import React from "react";
import { fetchEmprunts, createEmprunt } from "@/services/empruntService";
import {
  fetchAmortissements,
  generateAmortissementForEmprunt,
  generateAmortissementForImmobilisation
} from "@/services/amortissementService";
import { fetchImmobilisations, createImmobilisation } from "@/services/immobilisationService";
import { fetchPaiements, createPaiement } from "@/services/paiementService";
import { Outlet } from "react-router-dom";
import { useMediaQuery } from "@uidotdev/usehooks";
import { HeaderF } from "@/layouts/HeaderF";
import SidebarF from "@/layouts/SidebarF";
import { cn } from "@/utils/cn";
import FinancialAnalytics from "@/components/FinancialAnalytics";
import AIPredictions from "@/components/AIPredictions";
import LayoutKpi from "./LayoutKpi";
import LayoutRevenu from "./LayoutRevenu";
import LayoutReportingFiscal from "./LayoutReportinFiscal";

const Layout = () => {
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const [collapsed, setCollapsed] = useState(!isDesktop);
  const [emprunts, setEmprunts] = useState([]);
  const [immobilisations, setImmobilisations] = useState([]);
  const [amortissements, setAmortissements] = useState([]);
  const [message, setMessage] = useState(null);
  const [visibleRows, setVisibleRows] = useState({});
  const [activeTab, setActiveTab] = useState("emprunts"); // "emprunts", "immobilisations", "paiements", "analyses", or "ia_predictions"
  const [paiements, setPaiements] = useState([]);
  const [showEmpruntForm, setShowEmpruntForm] = useState(false);
  const [showImmobilisationForm, setShowImmobilisationForm] = useState(false);
  const [showPaiementForm, setShowPaiementForm] = useState(false);

  // Form data for emprunt
  const [empruntFormData, setEmpruntFormData] = useState({
    intitule: "",
    montant: "",
    taux_interet: "",
    duree: "",
    date_debut: "",
    type_amortissement: "constant",
    frequence_paiement: "mensuel",
    banque: ""
  });

  // Form data for immobilisation
  const [immobilisationFormData, setImmobilisationFormData] = useState({
    nom: "",
    categorie: "",
    date_acquisition: "",
    valeur_acquisition: "",
    duree_amortissement: "",
    type_amortissement: "lineaire",
    taux_amortissement: "",
    valeur_residuelle: "",
    etat: "Neuf",
    fournisseur: "",
    compte_comptable: ""
  });

  // Form data for paiement
  const [paiementFormData, setPaiementFormData] = useState({
    emprunt_id: "",
    date_paiement: "",
    montant_total: "",
    montant_interet: "",
    montant_amortissement: "",
    capital_restant_du: "",
    mode_paiement: "virement",
    justificatif: ""
  });

  // Form validation errors
  const [empruntErrors, setEmpruntErrors] = useState({});
  const [immobilisationErrors, setImmobilisationErrors] = useState({});
  const [paiementErrors, setPaiementErrors] = useState({});

  useEffect(() => {
    setCollapsed(!isDesktop);
  }, [isDesktop]);

  useEffect(() => {
    const loadAll = async () => {
      try {
        const empruntData = await fetchEmprunts();
        setEmprunts(empruntData);

        const immobilisationData = await fetchImmobilisations();
        setImmobilisations(immobilisationData);

        const amortissementData = await fetchAmortissements();
        setAmortissements(amortissementData);

        const paiementsData = await fetchPaiements();
        setPaiements(paiementsData);
        console.log("Fetched payments:", paiementsData);
      } catch (err) {
        console.error("Erreur chargement :", err.message);
      }
    };
    loadAll();
  }, []);

  const handleGenererPaiements = async (id) => {
    try {
      const result = await generateAmortissementForEmprunt(id);
      setMessage({ type: "success", text: result.message });

      // Refresh the amortissements list
      const updatedAmortissements = await fetchAmortissements();
      console.log("Updated amortissements after generation:", updatedAmortissements);
      setAmortissements(updatedAmortissements);

      // Automatically show the amortization table
      setVisibleRows((prev) => ({
        ...prev,
        [id]: true,
      }));
    } catch (err) {
      console.error("Error generating amortissements:", err);
      setMessage({
        type: "error",
        text: err.response?.data?.message || "Erreur serveur",
      });
    }
  };

  const toggleRow = async (id) => {
    // Toggle the row visibility
    const newVisibility = !visibleRows[id];
    setVisibleRows((prev) => ({
      ...prev,
      [id]: newVisibility,
    }));

    // If we're showing the row, fetch the specific amortissements for this item
    if (newVisibility) {
      try {
        console.log("Fetching amortissements for ID:", id);

        // Directly use the fetchAmortissements function which now uses the correct endpoint
        const allAmortissements = await fetchAmortissements();
        console.log("All amortissements:", allAmortissements);

        if (!allAmortissements || allAmortissements.length === 0) {
          console.log("No amortissements found, you may need to generate them first");
          return;
        }

        // Filter amortissements for this specific ID
        const itemAmortissements = allAmortissements.filter(a => {
          // Check all possible property names and formats
          const matchesItem =
            // Direct ID match
            a.emprunt_id === id ||
            // Object ID match
            (a.emprunt_id && a.emprunt_id._id === id) ||
            // String ID match
            (a.emprunt_id && typeof a.emprunt_id === 'string' && a.emprunt_id === id) ||
            // Immobilisation matches
            a.immobilisation_id === id ||
            (a.immobilisation_id && a.immobilisation_id._id === id) ||
            (a.immobilisation_id && typeof a.immobilisation_id === 'string' && a.immobilisation_id === id);

          console.log(`Amortissement ${a._id} matches item ${id}: ${matchesItem}`);
          return matchesItem;
        });

        console.log("Filtered amortissements for this ID:", itemAmortissements);

        if (itemAmortissements && itemAmortissements.length > 0) {
          // Update the amortissements state with the filtered data
          setAmortissements(prev => {
            // Filter out any existing amortissements for this item
            const filteredAmortissements = prev.filter(a => {
              return !(
                a.emprunt_id === id ||
                (a.emprunt_id && a.emprunt_id._id === id) ||
                a.immobilisation_id === id ||
                (a.immobilisation_id && a.immobilisation_id._id === id)
              );
            });

            // Add the filtered amortissements
            return [...filteredAmortissements, ...itemAmortissements];
          });
        } else {
          console.log("No amortissements found for this ID, you may need to generate them first");
        }
      } catch (err) {
        console.error("Error in toggleRow:", err);
        // Don't show an error message to the user, just log it
      }
    }
  };



  // Handle emprunt form input changes
  const handleEmpruntInputChange = (e) => {
    const { name, value } = e.target;
    setEmpruntFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear error for this field when user types
    if (empruntErrors[name]) {
      setEmpruntErrors(prev => ({
        ...prev,
        [name]: null
      }));
    }
  };

  // Handle immobilisation form input changes
  const handleImmobilisationInputChange = (e) => {
    const { name, value } = e.target;
    setImmobilisationFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear error for this field when user types
    if (immobilisationErrors[name]) {
      setImmobilisationErrors(prev => ({
        ...prev,
        [name]: null
      }));
    }
  };

  // Validate emprunt form
  const validateEmpruntForm = () => {
    const errors = {};

    if (!empruntFormData.intitule.trim()) errors.intitule = "L'intitulé est requis";
    if (!empruntFormData.montant) errors.montant = "Le montant est requis";
    else if (isNaN(empruntFormData.montant) || Number(empruntFormData.montant) <= 0)
      errors.montant = "Le montant doit être un nombre positif";

    if (!empruntFormData.taux_interet) errors.taux_interet = "Le taux d'intérêt est requis";
    else if (isNaN(empruntFormData.taux_interet) || Number(empruntFormData.taux_interet) < 0)
      errors.taux_interet = "Le taux d'intérêt doit être un nombre positif";

    if (!empruntFormData.duree) errors.duree = "La durée est requise";
    else if (isNaN(empruntFormData.duree) || Number(empruntFormData.duree) <= 0)
      errors.duree = "La durée doit être un nombre positif";

    if (!empruntFormData.date_debut) errors.date_debut = "La date de début est requise";
    if (!empruntFormData.banque.trim()) errors.banque = "La banque est requise";

    setEmpruntErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Validate immobilisation form
  const validateImmobilisationForm = () => {
    const errors = {};

    if (!immobilisationFormData.nom.trim()) errors.nom = "Le nom est requis";
    if (!immobilisationFormData.categorie.trim()) errors.categorie = "La catégorie est requise";
    if (!immobilisationFormData.date_acquisition) errors.date_acquisition = "La date d'acquisition est requise";

    if (!immobilisationFormData.valeur_acquisition) errors.valeur_acquisition = "La valeur d'acquisition est requise";
    else if (isNaN(immobilisationFormData.valeur_acquisition) || Number(immobilisationFormData.valeur_acquisition) <= 0)
      errors.valeur_acquisition = "La valeur d'acquisition doit être un nombre positif";

    if (!immobilisationFormData.duree_amortissement) errors.duree_amortissement = "La durée d'amortissement est requise";
    else if (isNaN(immobilisationFormData.duree_amortissement) || Number(immobilisationFormData.duree_amortissement) <= 0)
      errors.duree_amortissement = "La durée d'amortissement doit être un nombre positif";

    if (immobilisationFormData.taux_amortissement &&
        (isNaN(immobilisationFormData.taux_amortissement) || Number(immobilisationFormData.taux_amortissement) < 0))
      errors.taux_amortissement = "Le taux d'amortissement doit être un nombre positif";

    if (immobilisationFormData.valeur_residuelle &&
        (isNaN(immobilisationFormData.valeur_residuelle) || Number(immobilisationFormData.valeur_residuelle) < 0))
      errors.valeur_residuelle = "La valeur résiduelle doit être un nombre positif";

    if (!immobilisationFormData.fournisseur.trim()) errors.fournisseur = "Le fournisseur est requis";
    if (!immobilisationFormData.compte_comptable.trim()) errors.compte_comptable = "Le compte comptable est requis";

    setImmobilisationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Submit emprunt form
  const handleEmpruntSubmit = async (e) => {
    e.preventDefault();

    if (!validateEmpruntForm()) return;

    try {
      await createEmprunt(empruntFormData);
      setMessage({ type: "success", text: "Emprunt créé avec succès" });

      // Reset form
      setEmpruntFormData({
        intitule: "",
        montant: "",
        taux_interet: "",
        duree: "",
        date_debut: "",
        type_amortissement: "constant",
        frequence_paiement: "mensuel",
        banque: ""
      });

      // Hide form
      setShowEmpruntForm(false);

      // Refresh the emprunts list
      const updatedEmprunts = await fetchEmprunts();
      setEmprunts(updatedEmprunts);
    } catch (err) {
      setMessage({
        type: "error",
        text: err.response?.data?.message || "Erreur lors de la création de l'emprunt",
      });
    }
  };

  // Submit immobilisation form
  const handleImmobilisationSubmit = async (e) => {
    e.preventDefault();

    if (!validateImmobilisationForm()) return;

    try {
      await createImmobilisation(immobilisationFormData);
      setMessage({ type: "success", text: "Immobilisation créée avec succès" });

      // Reset form
      setImmobilisationFormData({
        nom: "",
        categorie: "",
        date_acquisition: "",
        valeur_acquisition: "",
        duree_amortissement: "",
        type_amortissement: "lineaire",
        taux_amortissement: "",
        valeur_residuelle: "",
        etat: "Neuf",
        fournisseur: "",
        compte_comptable: ""
      });

      // Hide form
      setShowImmobilisationForm(false);

      // Refresh the immobilisations list
      const updatedImmobilisations = await fetchImmobilisations();
      setImmobilisations(updatedImmobilisations);
    } catch (err) {
      setMessage({
        type: "error",
        text: err.response?.data?.message || "Erreur lors de la création de l'immobilisation",
      });
    }
  };

  // Handle paiement form input changes
  const handlePaiementInputChange = (e) => {
    const { name, value } = e.target;
    setPaiementFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear error for this field when user types
    if (paiementErrors[name]) {
      setPaiementErrors(prev => ({
        ...prev,
        [name]: null
      }));
    }
  };

  // Validate paiement form
  const validatePaiementForm = () => {
    const errors = {};

    // All fields are required according to the server schema
    if (!paiementFormData.emprunt_id) errors.emprunt_id = "L'emprunt est requis";
    if (!paiementFormData.date_paiement) errors.date_paiement = "La date de paiement est requise";

    if (!paiementFormData.montant_total) errors.montant_total = "Le montant total est requis";
    else if (isNaN(paiementFormData.montant_total) || Number(paiementFormData.montant_total) <= 0)
      errors.montant_total = "Le montant total doit être un nombre positif";

    if (!paiementFormData.montant_interet) errors.montant_interet = "Le montant des intérêts est requis";
    else if (isNaN(paiementFormData.montant_interet) || Number(paiementFormData.montant_interet) < 0)
      errors.montant_interet = "Le montant des intérêts doit être un nombre positif";

    if (!paiementFormData.montant_amortissement) errors.montant_amortissement = "Le montant d'amortissement est requis";
    else if (isNaN(paiementFormData.montant_amortissement) || Number(paiementFormData.montant_amortissement) < 0)
      errors.montant_amortissement = "Le montant d'amortissement doit être un nombre positif";

    if (!paiementFormData.capital_restant_du) errors.capital_restant_du = "Le capital restant dû est requis";
    else if (isNaN(paiementFormData.capital_restant_du) || Number(paiementFormData.capital_restant_du) < 0)
      errors.capital_restant_du = "Le capital restant dû doit être un nombre positif";

    if (!paiementFormData.mode_paiement) errors.mode_paiement = "Le mode de paiement est requis";

    if (!paiementFormData.justificatif) errors.justificatif = "Le justificatif est requis";

    setPaiementErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Submit paiement form
  const handlePaiementSubmit = async (e) => {
    e.preventDefault();

    if (!validatePaiementForm()) return;

    try {
      console.log("Submitting payment form with data:", paiementFormData);

      // Use the createPaiement service to send data to the backend
      const result = await createPaiement(paiementFormData);
      console.log("Payment creation result:", result);

      setMessage({ type: "success", text: "Paiement enregistré avec succès" });

      // Reset form
      setPaiementFormData({
        emprunt_id: "",
        date_paiement: "",
        montant_total: "",
        montant_interet: "",
        montant_amortissement: "",
        capital_restant_du: "",
        mode_paiement: "virement",
        justificatif: ""
      });

      // Hide form
      setShowPaiementForm(false);

      // Refresh the emprunts list
      const updatedEmprunts = await fetchEmprunts();
      setEmprunts(updatedEmprunts);

      // Also fetch updated paiements
      const updatedPaiements = await fetchPaiements();
      console.log("Updated paiements:", updatedPaiements);
    } catch (err) {
      console.error("Error submitting payment form:", err);
      setMessage({
        type: "error",
        text: err.response?.data?.message || "Erreur lors de l'enregistrement du paiement",
      });
    }
  };

  const handleGenererAmortissementImmobilisation = async (id) => {
    try {
      const result = await generateAmortissementForImmobilisation(id);
      setMessage({ type: "success", text: result.message });

      // Refresh the amortissements list
      const updatedAmortissements = await fetchAmortissements();
      console.log("Updated amortissements after immobilisation generation:", updatedAmortissements);
      setAmortissements(updatedAmortissements);

      // Automatically show the amortization table
      setVisibleRows((prev) => ({
        ...prev,
        [id]: true,
      }));
    } catch (err) {
      console.error("Error generating immobilisation amortissements:", err);
      setMessage({
        type: "error",
        text: err.response?.data?.message || "Erreur serveur",
      });
    }
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-900 dark:to-slate-950 transition-colors perspective-1000">
      <aside
        className={cn(
          "fixed z-40 h-full transition-all duration-300 shadow-2xl",
          collapsed ? "w-[70px]" : "w-[240px]"
        )}
        style={{
          transform: "translateZ(0)",
          backfaceVisibility: "hidden",
          willChange: "transform",
          boxShadow: "0 0 20px rgba(0, 0, 0, 0.1)"
        }}
      >
        <SidebarF collapsed={collapsed} />
      </aside>

      <div
        className={cn(
          "fixed inset-0 z-30 bg-black opacity-0 transition-opacity pointer-events-none backdrop-blur-sm",
          !collapsed && "max-md:pointer-events-auto max-md:opacity-30"
        )}
      />

      <div
        className={cn(
          "flex flex-col flex-1 transition-all duration-300 ml-0",
          isDesktop && (collapsed ? "md:ml-[70px]" : "md:ml-[240px]")
        )}
        style={{
          transform: "translateZ(0)",
          backfaceVisibility: "hidden",
          willChange: "transform"
        }}
      >
        <HeaderF collapsed={collapsed} setCollapsed={setCollapsed} />

        <main className="flex-1 px-6 py-8 bg-gradient-to-br from-slate-50/90 to-slate-100/90 dark:from-slate-900/90 dark:to-slate-800/90 space-y-8 backdrop-blur-sm">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white/30 dark:bg-slate-800/30 p-6 rounded-xl backdrop-blur-md shadow-lg transform hover:shadow-xl transition-all duration-300 border border-white/20 dark:border-slate-700/20">
            <h1 className="text-3xl font-semibold text-slate-800 dark:text-white relative">
              <span className="relative z-10">Financial Management</span>
              <span className="absolute -bottom-1 left-0 w-1/3 h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></span>
            </h1>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => {
                  setShowEmpruntForm(!showEmpruntForm);
                  setShowImmobilisationForm(false);
                  setShowPaiementForm(false);
                }}
                className={`px-5 py-2.5 ${
                  showEmpruntForm
                    ? 'bg-gray-600 hover:bg-gray-700'
                    : 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700'
                } text-white rounded-lg shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 font-medium flex items-center gap-2`}
                style={{
                  transform: showEmpruntForm ? "translateZ(5px)" : "translateZ(0)",
                }}
              >
                <span className="relative">{showEmpruntForm ? 'Annuler' : 'Ajouter un emprunt'}</span>
              </button>
              <button
                onClick={() => {
                  setShowImmobilisationForm(!showImmobilisationForm);
                  setShowEmpruntForm(false);
                  setShowPaiementForm(false);
                }}
                className={`px-5 py-2.5 ${
                  showImmobilisationForm
                    ? 'bg-gray-600 hover:bg-gray-700'
                    : 'bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700'
                } text-white rounded-lg shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 font-medium flex items-center gap-2`}
                style={{
                  transform: showImmobilisationForm ? "translateZ(5px)" : "translateZ(0)",
                }}
              >
                <span className="relative">{showImmobilisationForm ? 'Annuler' : 'Ajouter une immobilisation'}</span>
              </button>
              <button
                onClick={() => {
                  setShowPaiementForm(!showPaiementForm);
                  setShowEmpruntForm(false);
                  setShowImmobilisationForm(false);
                }}
                className={`px-5 py-2.5 ${
                  showPaiementForm
                    ? 'bg-gray-600 hover:bg-gray-700'
                    : 'bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700'
                } text-white rounded-lg shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 font-medium flex items-center gap-2`}
                style={{
                  transform: showPaiementForm ? "translateZ(5px)" : "translateZ(0)",
                }}
              >
                <span className="relative">{showPaiementForm ? 'Annuler' : 'Ajouter un paiement'}</span>
              </button>
            </div>
          </div>

          {message && (
            <div
              className={cn(
                "px-6 py-4 rounded-xl font-medium shadow-lg text-white backdrop-blur-sm animate-fadeIn",
                message.type === "success"
                  ? "bg-gradient-to-r from-green-500/90 to-emerald-600/90 border border-green-400/20"
                  : "bg-gradient-to-r from-red-500/90 to-rose-600/90 border border-red-400/20"
              )}
              style={{
                transform: "translateZ(10px)",
                animation: "slideIn 0.3s ease-out forwards"
              }}
            >
              <div className="flex items-center gap-3">
                <div className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center",
                  message.type === "success" ? "bg-green-400/30" : "bg-red-400/30"
                )}>
                  {message.type === "success" ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  )}
                </div>
                <span>{message.text}</span>
              </div>
            </div>
          )}

          {/* Emprunt Form */}
          {showEmpruntForm && (
            <div
              className="mt-6 bg-white/80 dark:bg-slate-800/80 rounded-xl shadow-xl p-8 border border-white/50 dark:border-slate-700/50 backdrop-blur-md transform transition-all duration-300"
              style={{
                transform: "translateZ(20px) perspective(1000px)",
                boxShadow: "0 10px 30px -5px rgba(0, 0, 0, 0.1), 0 0 20px rgba(0, 0, 0, 0.05)",
                animation: "fadeIn 0.5s ease-out forwards"
              }}
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z" />
                    <path fillRule="evenodd" d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" clipRule="evenodd" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-blue-600 dark:text-blue-400 relative">
                  <span className="relative z-10">Ajouter un nouvel emprunt</span>
                  <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-gradient-to-r from-blue-500 to-blue-300 rounded-full"></span>
                </h2>
              </div>
              <div className="border-b border-blue-200/30 dark:border-blue-700/30 mb-6"></div>

              <form onSubmit={handleEmpruntSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Intitulé */}
                  <div className="transform transition-all duration-200 hover:translate-z-2">
                    <label htmlFor="intitule" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 flex items-center">
                      <span className="relative">
                        Intitulé <span className="text-red-500">*</span>
                        <span className="absolute -bottom-0.5 left-0 w-full h-0.5 bg-blue-500/30 rounded-full"></span>
                      </span>
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        id="intitule"
                        name="intitule"
                        value={empruntFormData.intitule}
                        onChange={handleEmpruntInputChange}
                        className={`w-full px-4 py-3 border-2 ${
                          empruntErrors.intitule
                            ? 'border-red-500 focus:border-red-500'
                            : 'border-slate-200 dark:border-slate-700 focus:border-blue-500 dark:focus:border-blue-400'
                        } rounded-lg shadow-sm focus:outline-none focus:ring-0 dark:bg-slate-800/50 dark:text-white backdrop-blur-sm transition-all duration-200`}
                        placeholder="Ex: Emprunt pour achat de matériel"
                        style={{
                          transform: "translateZ(0)",
                          boxShadow: empruntErrors.intitule
                            ? "0 0 0 1px rgba(239, 68, 68, 0.2)"
                            : "0 2px 4px rgba(0, 0, 0, 0.05)"
                        }}
                      />
                      <div className="absolute inset-0 rounded-lg pointer-events-none" style={{
                        boxShadow: "inset 0 1px 1px rgba(255, 255, 255, 0.1)",
                        zIndex: 2
                      }}></div>
                    </div>
                    {empruntErrors.intitule && (
                      <p className="mt-2 text-sm text-red-500 flex items-center gap-1">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        {empruntErrors.intitule}
                      </p>
                    )}
                  </div>

                  {/* Montant */}
                  <div>
                    <label htmlFor="montant" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                      Montant (DT) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      id="montant"
                      name="montant"
                      value={empruntFormData.montant}
                      onChange={handleEmpruntInputChange}
                      className={`w-full px-3 py-2 border ${empruntErrors.montant ? 'border-red-500' : 'border-slate-300 dark:border-slate-600'} rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-slate-700 dark:text-white`}
                      placeholder="Ex: 10000"
                      step="0.01"
                    />
                    {empruntErrors.montant && (
                      <p className="mt-1 text-sm text-red-500">{empruntErrors.montant}</p>
                    )}
                  </div>

                  {/* Taux d'intérêt */}
                  <div>
                    <label htmlFor="taux_interet" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                      Taux d'intérêt (%) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      id="taux_interet"
                      name="taux_interet"
                      value={empruntFormData.taux_interet}
                      onChange={handleEmpruntInputChange}
                      className={`w-full px-3 py-2 border ${empruntErrors.taux_interet ? 'border-red-500' : 'border-slate-300 dark:border-slate-600'} rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-slate-700 dark:text-white`}
                      placeholder="Ex: 5"
                      step="0.01"
                    />
                    {empruntErrors.taux_interet && (
                      <p className="mt-1 text-sm text-red-500">{empruntErrors.taux_interet}</p>
                    )}
                  </div>

                  {/* Durée */}
                  <div>
                    <label htmlFor="duree" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                      Durée (années) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      id="duree"
                      name="duree"
                      value={empruntFormData.duree}
                      onChange={handleEmpruntInputChange}
                      className={`w-full px-3 py-2 border ${empruntErrors.duree ? 'border-red-500' : 'border-slate-300 dark:border-slate-600'} rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-slate-700 dark:text-white`}
                      placeholder="Ex: 5"
                    />
                    {empruntErrors.duree && (
                      <p className="mt-1 text-sm text-red-500">{empruntErrors.duree}</p>
                    )}
                  </div>

                  {/* Date de début */}
                  <div>
                    <label htmlFor="date_debut" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                      Date de début <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      id="date_debut"
                      name="date_debut"
                      value={empruntFormData.date_debut}
                      onChange={handleEmpruntInputChange}
                      className={`w-full px-3 py-2 border ${empruntErrors.date_debut ? 'border-red-500' : 'border-slate-300 dark:border-slate-600'} rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-slate-700 dark:text-white`}
                    />
                    {empruntErrors.date_debut && (
                      <p className="mt-1 text-sm text-red-500">{empruntErrors.date_debut}</p>
                    )}
                  </div>

                  {/* Type d'amortissement */}
                  <div>
                    <label htmlFor="type_amortissement" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                      Type d'amortissement
                    </label>
                    <select
                      id="type_amortissement"
                      name="type_amortissement"
                      value={empruntFormData.type_amortissement}
                      onChange={handleEmpruntInputChange}
                      className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-slate-700 dark:text-white"
                    >
                      <option value="constant">Amortissement constant</option>
                      <option value="annuite_constante">Annuités constantes</option>
                      <option value="in_fine">In fine</option>
                    </select>
                  </div>

                  {/* Fréquence de paiement */}
                  <div>
                    <label htmlFor="frequence_paiement" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                      Fréquence de paiement
                    </label>
                    <select
                      id="frequence_paiement"
                      name="frequence_paiement"
                      value={empruntFormData.frequence_paiement}
                      onChange={handleEmpruntInputChange}
                      className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-slate-700 dark:text-white"
                    >
                      <option value="mensuel">Mensuel</option>
                      <option value="trimestriel">Trimestriel</option>
                      <option value="semestriel">Semestriel</option>
                      <option value="annuel">Annuel</option>
                    </select>
                  </div>

                  {/* Banque */}
                  <div>
                    <label htmlFor="banque" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                      Banque <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="banque"
                      name="banque"
                      value={empruntFormData.banque}
                      onChange={handleEmpruntInputChange}
                      className={`w-full px-3 py-2 border ${empruntErrors.banque ? 'border-red-500' : 'border-slate-300 dark:border-slate-600'} rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-slate-700 dark:text-white`}
                      placeholder="Ex: BIAT"
                    />
                    {empruntErrors.banque && (
                      <p className="mt-1 text-sm text-red-500">{empruntErrors.banque}</p>
                    )}
                  </div>
                </div>

                <div className="flex justify-end space-x-4 pt-6 border-t border-slate-200/50 dark:border-slate-700/50 mt-6">
                  <button
                    type="button"
                    onClick={() => setShowEmpruntForm(false)}
                    className="px-6 py-3 bg-white dark:bg-slate-700 hover:bg-slate-100 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 rounded-lg shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 font-medium border border-slate-200 dark:border-slate-600"
                    style={{
                      transform: "translateZ(5px)",
                      boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)"
                    }}
                  >
                    <span className="flex items-center gap-2">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                      Annuler
                    </span>
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-lg shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 font-medium"
                    style={{
                      transform: "translateZ(10px)",
                      boxShadow: "0 4px 6px -1px rgba(59, 130, 246, 0.5), 0 2px 4px -1px rgba(59, 130, 246, 0.06)"
                    }}
                  >
                    <span className="flex items-center gap-2">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      Enregistrer
                    </span>
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Payment Form */}
          {showPaiementForm && (
            <div className="mt-6 bg-white dark:bg-slate-800 rounded-lg shadow-lg p-6 border border-slate-200 dark:border-slate-700">
              <h2 className="text-xl font-bold text-purple-600 dark:text-purple-400 mb-4 border-b pb-2 border-purple-200 dark:border-purple-700">
                Ajouter un nouveau paiement
              </h2>

              <form onSubmit={handlePaiementSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Emprunt */}
                  <div>
                    <label htmlFor="emprunt_id" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                      Emprunt <span className="text-red-500">*</span>
                    </label>
                    <select
                      id="emprunt_id"
                      name="emprunt_id"
                      value={paiementFormData.emprunt_id}
                      onChange={handlePaiementInputChange}
                      className={`w-full px-3 py-2 border ${paiementErrors.emprunt_id ? 'border-red-500' : 'border-slate-300 dark:border-slate-600'} rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-slate-700 dark:text-white`}
                    >
                      <option value="">Sélectionner un emprunt</option>
                      {emprunts.map(emprunt => (
                        <option key={emprunt._id} value={emprunt._id}>
                          {emprunt.intitule} - {emprunt.montant} DT
                        </option>
                      ))}
                    </select>
                    {paiementErrors.emprunt_id && (
                      <p className="mt-1 text-sm text-red-500">{paiementErrors.emprunt_id}</p>
                    )}
                  </div>

                  {/* Date de paiement */}
                  <div>
                    <label htmlFor="date_paiement" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                      Date de paiement <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      id="date_paiement"
                      name="date_paiement"
                      value={paiementFormData.date_paiement}
                      onChange={handlePaiementInputChange}
                      className={`w-full px-3 py-2 border ${paiementErrors.date_paiement ? 'border-red-500' : 'border-slate-300 dark:border-slate-600'} rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-slate-700 dark:text-white`}
                    />
                    {paiementErrors.date_paiement && (
                      <p className="mt-1 text-sm text-red-500">{paiementErrors.date_paiement}</p>
                    )}
                  </div>

                  {/* Montant total */}
                  <div>
                    <label htmlFor="montant_total" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                      Montant total (DT) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      id="montant_total"
                      name="montant_total"
                      value={paiementFormData.montant_total}
                      onChange={handlePaiementInputChange}
                      className={`w-full px-3 py-2 border ${paiementErrors.montant_total ? 'border-red-500' : 'border-slate-300 dark:border-slate-600'} rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-slate-700 dark:text-white`}
                      placeholder="Ex: 1000"
                      step="0.01"
                    />
                    {paiementErrors.montant_total && (
                      <p className="mt-1 text-sm text-red-500">{paiementErrors.montant_total}</p>
                    )}
                  </div>

                  {/* Montant intérêt */}
                  <div>
                    <label htmlFor="montant_interet" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                      Montant des intérêts (DT) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      id="montant_interet"
                      name="montant_interet"
                      value={paiementFormData.montant_interet}
                      onChange={handlePaiementInputChange}
                      className={`w-full px-3 py-2 border ${paiementErrors.montant_interet ? 'border-red-500' : 'border-slate-300 dark:border-slate-600'} rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-slate-700 dark:text-white`}
                      placeholder="Ex: 200"
                      step="0.01"
                      required
                    />
                    {paiementErrors.montant_interet && (
                      <p className="mt-1 text-sm text-red-500">{paiementErrors.montant_interet}</p>
                    )}
                  </div>

                  {/* Montant amortissement */}
                  <div>
                    <label htmlFor="montant_amortissement" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                      Montant d'amortissement (DT) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      id="montant_amortissement"
                      name="montant_amortissement"
                      value={paiementFormData.montant_amortissement}
                      onChange={handlePaiementInputChange}
                      className={`w-full px-3 py-2 border ${paiementErrors.montant_amortissement ? 'border-red-500' : 'border-slate-300 dark:border-slate-600'} rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-slate-700 dark:text-white`}
                      placeholder="Ex: 800"
                      step="0.01"
                      required
                    />
                    {paiementErrors.montant_amortissement && (
                      <p className="mt-1 text-sm text-red-500">{paiementErrors.montant_amortissement}</p>
                    )}
                  </div>

                  {/* Capital restant dû */}
                  <div>
                    <label htmlFor="capital_restant_du" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                      Capital restant dû (DT) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      id="capital_restant_du"
                      name="capital_restant_du"
                      value={paiementFormData.capital_restant_du}
                      onChange={handlePaiementInputChange}
                      className={`w-full px-3 py-2 border ${paiementErrors.capital_restant_du ? 'border-red-500' : 'border-slate-300 dark:border-slate-600'} rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-slate-700 dark:text-white`}
                      placeholder="Ex: 9000"
                      step="0.01"
                      required
                    />
                    {paiementErrors.capital_restant_du && (
                      <p className="mt-1 text-sm text-red-500">{paiementErrors.capital_restant_du}</p>
                    )}
                  </div>

                  {/* Mode de paiement */}
                  <div>
                    <label htmlFor="mode_paiement" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                      Mode de paiement <span className="text-red-500">*</span>
                    </label>
                    <select
                      id="mode_paiement"
                      name="mode_paiement"
                      value={paiementFormData.mode_paiement}
                      onChange={handlePaiementInputChange}
                      className={`w-full px-3 py-2 border ${paiementErrors.mode_paiement ? 'border-red-500' : 'border-slate-300 dark:border-slate-600'} rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-slate-700 dark:text-white`}
                      required
                    >
                      <option value="virement">Virement</option>
                      <option value="cheque">Chèque</option>
                      <option value="especes">Espèces</option>
                      <option value="carte">Carte bancaire</option>
                      <option value="prelevement">Prélèvement</option>
                    </select>
                    {paiementErrors.mode_paiement && (
                      <p className="mt-1 text-sm text-red-500">{paiementErrors.mode_paiement}</p>
                    )}
                  </div>

                  {/* Justificatif */}
                  <div>
                    <label htmlFor="justificatif" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                      Justificatif <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="justificatif"
                      name="justificatif"
                      value={paiementFormData.justificatif}
                      onChange={handlePaiementInputChange}
                      className={`w-full px-3 py-2 border ${paiementErrors.justificatif ? 'border-red-500' : 'border-slate-300 dark:border-slate-600'} rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-slate-700 dark:text-white`}
                      placeholder="Ex: Référence du virement"
                      required
                    />
                    {paiementErrors.justificatif && (
                      <p className="mt-1 text-sm text-red-500">{paiementErrors.justificatif}</p>
                    )}
                  </div>
                </div>

                <div className="flex justify-end space-x-3 pt-4 border-t border-slate-200 dark:border-slate-700">
                  <button
                    type="button"
                    onClick={() => setShowPaiementForm(false)}
                    className="px-4 py-2 bg-slate-300 hover:bg-slate-400 text-slate-800 rounded shadow"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded shadow"
                  >
                    Enregistrer
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Immobilisation Form */}
          {showImmobilisationForm && (
            <div className="mt-6 bg-white dark:bg-slate-800 rounded-lg shadow-lg p-6 border border-slate-200 dark:border-slate-700">
              <h2 className="text-xl font-bold text-green-600 dark:text-green-400 mb-4 border-b pb-2 border-green-200 dark:border-green-700">
                Ajouter une nouvelle immobilisation
              </h2>

              <form onSubmit={handleImmobilisationSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Nom */}
                  <div>
                    <label htmlFor="nom" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                      Nom <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="nom"
                      name="nom"
                      value={immobilisationFormData.nom}
                      onChange={handleImmobilisationInputChange}
                      className={`w-full px-3 py-2 border ${immobilisationErrors.nom ? 'border-red-500' : 'border-slate-300 dark:border-slate-600'} rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-slate-700 dark:text-white`}
                      placeholder="Ex: Machine de production"
                    />
                    {immobilisationErrors.nom && (
                      <p className="mt-1 text-sm text-red-500">{immobilisationErrors.nom}</p>
                    )}
                  </div>

                  {/* Catégorie */}
                  <div>
                    <label htmlFor="categorie" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                      Catégorie <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="categorie"
                      name="categorie"
                      value={immobilisationFormData.categorie}
                      onChange={handleImmobilisationInputChange}
                      className={`w-full px-3 py-2 border ${immobilisationErrors.categorie ? 'border-red-500' : 'border-slate-300 dark:border-slate-600'} rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-slate-700 dark:text-white`}
                      placeholder="Ex: Matériel informatique"
                    />
                    {immobilisationErrors.categorie && (
                      <p className="mt-1 text-sm text-red-500">{immobilisationErrors.categorie}</p>
                    )}
                  </div>

                  {/* Date d'acquisition */}
                  <div>
                    <label htmlFor="date_acquisition" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                      Date d'acquisition <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      id="date_acquisition"
                      name="date_acquisition"
                      value={immobilisationFormData.date_acquisition}
                      onChange={handleImmobilisationInputChange}
                      className={`w-full px-3 py-2 border ${immobilisationErrors.date_acquisition ? 'border-red-500' : 'border-slate-300 dark:border-slate-600'} rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-slate-700 dark:text-white`}
                    />
                    {immobilisationErrors.date_acquisition && (
                      <p className="mt-1 text-sm text-red-500">{immobilisationErrors.date_acquisition}</p>
                    )}
                  </div>

                  {/* Valeur d'acquisition */}
                  <div>
                    <label htmlFor="valeur_acquisition" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                      Valeur d'acquisition (DT) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      id="valeur_acquisition"
                      name="valeur_acquisition"
                      value={immobilisationFormData.valeur_acquisition}
                      onChange={handleImmobilisationInputChange}
                      className={`w-full px-3 py-2 border ${immobilisationErrors.valeur_acquisition ? 'border-red-500' : 'border-slate-300 dark:border-slate-600'} rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-slate-700 dark:text-white`}
                      placeholder="Ex: 5000"
                      step="0.01"
                    />
                    {immobilisationErrors.valeur_acquisition && (
                      <p className="mt-1 text-sm text-red-500">{immobilisationErrors.valeur_acquisition}</p>
                    )}
                  </div>

                  {/* Durée d'amortissement */}
                  <div>
                    <label htmlFor="duree_amortissement" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                      Durée d'amortissement (années) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      id="duree_amortissement"
                      name="duree_amortissement"
                      value={immobilisationFormData.duree_amortissement}
                      onChange={handleImmobilisationInputChange}
                      className={`w-full px-3 py-2 border ${immobilisationErrors.duree_amortissement ? 'border-red-500' : 'border-slate-300 dark:border-slate-600'} rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-slate-700 dark:text-white`}
                      placeholder="Ex: 5"
                    />
                    {immobilisationErrors.duree_amortissement && (
                      <p className="mt-1 text-sm text-red-500">{immobilisationErrors.duree_amortissement}</p>
                    )}
                  </div>

                  {/* Type d'amortissement */}
                  <div>
                    <label htmlFor="type_amortissement_immo" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                      Type d'amortissement
                    </label>
                    <select
                      id="type_amortissement_immo"
                      name="type_amortissement"
                      value={immobilisationFormData.type_amortissement}
                      onChange={handleImmobilisationInputChange}
                      className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-slate-700 dark:text-white"
                    >
                      <option value="lineaire">Linéaire</option>
                      <option value="degressif">Dégressif</option>
                      <option value="exceptionnel">Exceptionnel</option>
                    </select>
                  </div>

                  {/* Taux d'amortissement */}
                  <div>
                    <label htmlFor="taux_amortissement" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                      Taux d'amortissement (%)
                    </label>
                    <input
                      type="number"
                      id="taux_amortissement"
                      name="taux_amortissement"
                      value={immobilisationFormData.taux_amortissement}
                      onChange={handleImmobilisationInputChange}
                      className={`w-full px-3 py-2 border ${immobilisationErrors.taux_amortissement ? 'border-red-500' : 'border-slate-300 dark:border-slate-600'} rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-slate-700 dark:text-white`}
                      placeholder="Ex: 20"
                      step="0.01"
                    />
                    {immobilisationErrors.taux_amortissement && (
                      <p className="mt-1 text-sm text-red-500">{immobilisationErrors.taux_amortissement}</p>
                    )}
                  </div>

                  {/* Valeur résiduelle */}
                  <div>
                    <label htmlFor="valeur_residuelle" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                      Valeur résiduelle (DT)
                    </label>
                    <input
                      type="number"
                      id="valeur_residuelle"
                      name="valeur_residuelle"
                      value={immobilisationFormData.valeur_residuelle}
                      onChange={handleImmobilisationInputChange}
                      className={`w-full px-3 py-2 border ${immobilisationErrors.valeur_residuelle ? 'border-red-500' : 'border-slate-300 dark:border-slate-600'} rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-slate-700 dark:text-white`}
                      placeholder="Ex: 500"
                      step="0.01"
                    />
                    {immobilisationErrors.valeur_residuelle && (
                      <p className="mt-1 text-sm text-red-500">{immobilisationErrors.valeur_residuelle}</p>
                    )}
                  </div>

                  {/* État */}
                  <div>
                    <label htmlFor="etat" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                      État
                    </label>
                    <select
                      id="etat"
                      name="etat"
                      value={immobilisationFormData.etat}
                      onChange={handleImmobilisationInputChange}
                      className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-slate-700 dark:text-white"
                    >
                      <option value="Neuf">Neuf</option>
                      <option value="Occasion">Occasion</option>
                      <option value="Reconditionné">Reconditionné</option>
                    </select>
                  </div>

                  {/* Fournisseur */}
                  <div>
                    <label htmlFor="fournisseur" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                      Fournisseur <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="fournisseur"
                      name="fournisseur"
                      value={immobilisationFormData.fournisseur}
                      onChange={handleImmobilisationInputChange}
                      className={`w-full px-3 py-2 border ${immobilisationErrors.fournisseur ? 'border-red-500' : 'border-slate-300 dark:border-slate-600'} rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-slate-700 dark:text-white`}
                      placeholder="Ex: Fournisseur XYZ"
                    />
                    {immobilisationErrors.fournisseur && (
                      <p className="mt-1 text-sm text-red-500">{immobilisationErrors.fournisseur}</p>
                    )}
                  </div>

                  {/* Compte comptable */}
                  <div>
                    <label htmlFor="compte_comptable" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                      Compte comptable <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="compte_comptable"
                      name="compte_comptable"
                      value={immobilisationFormData.compte_comptable}
                      onChange={handleImmobilisationInputChange}
                      className={`w-full px-3 py-2 border ${immobilisationErrors.compte_comptable ? 'border-red-500' : 'border-slate-300 dark:border-slate-600'} rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-slate-700 dark:text-white`}
                      placeholder="Ex: 2183"
                    />
                    {immobilisationErrors.compte_comptable && (
                      <p className="mt-1 text-sm text-red-500">{immobilisationErrors.compte_comptable}</p>
                    )}
                  </div>
                </div>

                <div className="flex justify-end space-x-3 pt-4 border-t border-slate-200 dark:border-slate-700">
                  <button
                    type="button"
                    onClick={() => setShowImmobilisationForm(false)}
                    className="px-4 py-2 bg-slate-300 hover:bg-slate-400 text-slate-800 rounded shadow"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded shadow"
                  >
                    Enregistrer
                  </button>
                </div>
              </form>
            </div>
          )}



          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-md p-1 border border-slate-200 dark:border-slate-700 mb-6 flex flex-wrap">
            <button
              className={cn(
                "flex items-center px-5 py-3 font-medium rounded-lg transition-all",
                activeTab === "emprunts"
                  ? "bg-blue-600 text-white shadow-md"
                  : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700"
              )}
              onClick={() => setActiveTab("emprunts")}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Emprunts
              <span className="ml-2 bg-white bg-opacity-20 text-xs py-0.5 px-2 rounded-full">
                {emprunts.length}
              </span>
            </button>

            <button
              className={cn(
                "flex items-center px-5 py-3 font-medium rounded-lg transition-all",
                activeTab === "immobilisations"
                  ? "bg-green-600 text-white shadow-md"
                  : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700"
              )}
              onClick={() => setActiveTab("immobilisations")}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
              Immobilisations
              <span className="ml-2 bg-white bg-opacity-20 text-xs py-0.5 px-2 rounded-full">
                {immobilisations.length}
              </span>
            </button>

            <button
              className={cn(
                "flex items-center px-5 py-3 font-medium rounded-lg transition-all",
                activeTab === "paiements"
                  ? "bg-purple-600 text-white shadow-md"
                  : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700"
              )}
              onClick={() => setActiveTab("paiements")}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              Paiements
              <span className="ml-2 bg-white bg-opacity-20 text-xs py-0.5 px-2 rounded-full">
                {paiements.length}
              </span>
            </button>

            <button
              className={cn(
                "flex items-center px-5 py-3 font-medium rounded-lg transition-all",
                activeTab === "analyses"
                  ? "bg-amber-600 text-white shadow-md"
                  : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700"
              )}
              onClick={() => setActiveTab("analyses")}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              Analyses
            </button>

            <button
              className={cn(
                "flex items-center px-5 py-3 font-medium rounded-lg transition-all",
                activeTab === "ia_predictions"
                  ? "bg-indigo-600 text-white shadow-md"
                  : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700"
              )}
              onClick={() => setActiveTab("ia_predictions")}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
              IA Prédictive
              <span className="ml-2 bg-indigo-500 bg-opacity-20 text-xs py-0.5 px-2 rounded-full">
                Nouveau
              </span>
            </button>
          </div>

          {activeTab === "emprunts" && (
            <div className="rounded-xl shadow ring-1 ring-slate-200 dark:ring-slate-700 bg-white dark:bg-slate-800 overflow-hidden">
              <table className="table-fixed w-full text-sm">
                <thead className="bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-100 uppercase text-xs">
                  <tr>
                    <th className="px-3 py-3 w-[150px] truncate">Intitulé</th>
                    <th className="px-3 py-3 w-[100px]">Montant</th>
                    <th className="px-3 py-3 w-[90px]">Taux (%)</th>
                    <th className="px-3 py-3 w-[80px]">Durée</th>
                    <th className="px-3 py-3 w-[120px] truncate">Date de début</th>
                    <th className="px-3 py-3 w-[120px] truncate">Type</th>
                    <th className="px-3 py-3 w-[110px]">Fréquence</th>
                    <th className="px-3 py-3 w-[120px] truncate">Banque</th>
                    <th className="px-3 py-3 w-[110px] text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                  {emprunts.length > 0 ? (
                    emprunts.map((emprunt) => {
                      const amortissementsEmprunt = amortissements.filter((a) => {
                        // Log the amortissement to debug
                        console.log("Checking amortissement for emprunt:", a);

                        // Check all possible property names and formats
                        const matchesEmprunt =
                          // Direct ID match
                          a.emprunt_id === emprunt._id ||
                          // Object ID match
                          (a.emprunt_id && a.emprunt_id._id === emprunt._id) ||
                          // String ID match
                          (a.emprunt_id && typeof a.emprunt_id === 'string' && a.emprunt_id === emprunt._id) ||
                          // Alternative property names
                          a.empruntId === emprunt._id ||
                          (a.empruntId && a.empruntId._id === emprunt._id) ||
                          a.emprunt === emprunt._id ||
                          (a.emprunt && a.emprunt._id === emprunt._id);

                        console.log(`Amortissement ${a._id} matches emprunt ${emprunt._id}: ${matchesEmprunt}`);
                        return matchesEmprunt;
                      });

                      return (
                        <React.Fragment key={emprunt._id}>
                          <tr className="hover:bg-slate-50 dark:hover:bg-slate-700">
                            <td className="px-3 py-3 truncate">{emprunt.intitule}</td>
                            <td className="px-3 py-3">{emprunt.montant}</td>
                            <td className="px-3 py-3">{emprunt.taux_interet}</td>
                            <td className="px-3 py-3">{emprunt.duree}</td>
                            <td className="px-3 py-3 truncate">
                              {new Date(emprunt.date_debut).toLocaleDateString()}
                            </td>
                            <td className="px-3 py-3 truncate">{emprunt.type_amortissement}</td>
                            <td className="px-3 py-3">{emprunt.frequence_paiement}</td>
                            <td className="px-3 py-3 truncate">{emprunt.banque}</td>
                            <td className="px-3 py-3 text-center space-x-1">
                              <button
                                onClick={() => handleGenererPaiements(emprunt._id)}
                                className="text-xs bg-blue-600 hover:bg-blue-700 text-white px-2 py-1 rounded shadow transition"
                              >
                                Générer
                              </button>
                              <button
                                onClick={() => toggleRow(emprunt._id)}
                                className="text-xs bg-slate-600 hover:bg-slate-700 text-white px-2 py-1 rounded shadow transition"
                              >
                                {visibleRows[emprunt._id] ? "Cacher" : "Voir"}
                              </button>
                            </td>
                          </tr>

                          {visibleRows[emprunt._id] && (
                            <tr>
                              <td colSpan="9" className="p-0">
                                <div className="bg-white dark:bg-slate-800 px-6 py-4 rounded-lg shadow-md">
                                  <h3 className="text-base font-bold mb-3 text-blue-600 dark:text-blue-400 border-b pb-2 border-blue-200 dark:border-blue-700">
                                    Tableau d'amortissement
                                  </h3>
                                  <div className="mb-4 bg-blue-50 dark:bg-slate-700 p-3 rounded-md border-l-4 border-blue-500">
                                    <h4 className="text-sm font-bold text-slate-800 dark:text-white mb-1">
                                      Tableau d'amortissement d'un emprunt (financier)
                                    </h4>
                                    <p className="text-xs text-slate-700 dark:text-slate-300">
                                      Utilisé pour suivre le remboursement d'un prêt.
                                    </p>
                                  </div>

                                  <div className="overflow-x-auto">
                                    <table className="table-auto w-full text-sm border-collapse border border-slate-300 dark:border-slate-600">
                                      <thead>
                                        <tr className="bg-blue-500 dark:bg-blue-800">
                                          <th className="border border-slate-300 dark:border-slate-600 px-3 py-2 text-white font-semibold">Période</th>
                                          <th className="border border-slate-300 dark:border-slate-600 px-3 py-2 text-white font-semibold">Date</th>
                                          <th className="border border-slate-300 dark:border-slate-600 px-3 py-2 text-white font-semibold">Annuité</th>
                                          <th className="border border-slate-300 dark:border-slate-600 px-3 py-2 text-white font-semibold">Intérêts</th>
                                          <th className="border border-slate-300 dark:border-slate-600 px-3 py-2 text-white font-semibold">Amortissement du capital</th>
                                          <th className="border border-slate-300 dark:border-slate-600 px-3 py-2 text-white font-semibold">Capital restant dû</th>
                                        </tr>
                                      </thead>
                                      <tbody>
                                        {amortissementsEmprunt.length > 0 ? (
                                          amortissementsEmprunt.map((a, index) => {
                                            // Calculate interest based on remaining capital and interest rate
                                            // This is an approximation since we don't have the actual interest data
                                            const empruntData = emprunts.find(e => e._id === (a.emprunt_id?._id || a.emprunt_id));
                                            const tauxInteret = empruntData?.taux_interet || 0;
                                            const capitalRestant = a.valeur_nette || 0;
                                            const interet = capitalRestant * (tauxInteret / 100);
                                            const annuite = (a.montant_amortissement || 0) + interet;

                                            return (
                                              <tr
                                                key={a._id}
                                                className={index % 2 === 0 ? "bg-white dark:bg-slate-800" : "bg-blue-50 dark:bg-slate-700"}
                                              >
                                                <td className="border border-slate-300 dark:border-slate-600 px-3 py-2 text-black dark:text-white font-medium">{a.exercice || `Période ${index + 1}`}</td>
                                                <td className="border border-slate-300 dark:border-slate-600 px-3 py-2 text-black dark:text-white">
                                                  {new Date(a.date).toLocaleDateString()}
                                                </td>
                                                <td className="border border-slate-300 dark:border-slate-600 px-3 py-2 text-black dark:text-white font-bold">{annuite.toFixed(2)} DT</td>
                                                <td className="border border-slate-300 dark:border-slate-600 px-3 py-2 text-black dark:text-white">{interet.toFixed(2)} DT</td>
                                                <td className="border border-slate-300 dark:border-slate-600 px-3 py-2 text-black dark:text-white">{a.montant_amortissement?.toFixed(2) || a.montant?.toFixed(2)} DT</td>
                                                <td className="border border-slate-300 dark:border-slate-600 px-3 py-2 text-black dark:text-white font-bold">{a.valeur_nette?.toFixed(2) || "-"} DT</td>
                                              </tr>
                                            );
                                          })
                                        ) : (
                                          <tr>
                                            <td colSpan="6" className="border border-slate-300 dark:border-slate-600 px-3 py-4 text-center text-slate-500 dark:text-slate-400 font-medium">
                                              Aucun amortissement trouvé.
                                            </td>
                                          </tr>
                                        )}
                                      </tbody>
                                    </table>
                                  </div>
                                </div>
                              </td>
                            </tr>
                          )}
                        </React.Fragment>
                      );
                    })
                  ) : (
                    <tr>
                      <td
                        colSpan="10"
                        className="px-6 py-8 text-center text-slate-500 dark:text-slate-300"
                      >
                        Aucun emprunt trouvé.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === "immobilisations" && (
            <div className="rounded-xl shadow ring-1 ring-slate-200 dark:ring-slate-700 bg-white dark:bg-slate-800 overflow-hidden">
              <table className="table-fixed w-full text-sm">
                <thead className="bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-100 uppercase text-xs">
                  <tr>
                    <th className="px-3 py-3 w-[150px] truncate">Nom</th>
                    <th className="px-3 py-3 w-[100px]">Catégorie</th>
                    <th className="px-3 py-3 w-[120px] truncate">Date d'acquisition</th>
                    <th className="px-3 py-3 w-[100px]">Valeur</th>
                    <th className="px-3 py-3 w-[80px]">Durée</th>
                    <th className="px-3 py-3 w-[120px] truncate">Type</th>
                    <th className="px-3 py-3 w-[100px]">État</th>
                    <th className="px-3 py-3 w-[120px] truncate">Fournisseur</th>
                    <th className="px-3 py-3 w-[110px] text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                  {immobilisations.length > 0 ? (
                    immobilisations.map((immobilisation) => {
                      const amortissementsImmo = amortissements.filter((a) => {
                        // Log the amortissement to debug
                        console.log("Checking immobilisation amortissement:", a);

                        // Check all possible property names and formats
                        const matchesImmo =
                          // Direct ID match
                          a.immobilisation_id === immobilisation._id ||
                          // Object ID match
                          (a.immobilisation_id && a.immobilisation_id._id === immobilisation._id) ||
                          // String ID match
                          (a.immobilisation_id && typeof a.immobilisation_id === 'string' && a.immobilisation_id === immobilisation._id) ||
                          // Alternative property names
                          a.immobilisationId === immobilisation._id ||
                          (a.immobilisationId && a.immobilisationId._id === immobilisation._id);

                        console.log(`Amortissement ${a._id} matches immobilisation ${immobilisation._id}: ${matchesImmo}`);
                        return matchesImmo;
                      });

                      return (
                        <React.Fragment key={immobilisation._id}>
                          <tr className="hover:bg-slate-50 dark:hover:bg-slate-700">
                            <td className="px-3 py-3 truncate">{immobilisation.nom}</td>
                            <td className="px-3 py-3">{immobilisation.categorie}</td>
                            <td className="px-3 py-3 truncate">
                              {new Date(immobilisation.date_acquisition).toLocaleDateString()}
                            </td>
                            <td className="px-3 py-3">{immobilisation.valeur_acquisition}</td>
                            <td className="px-3 py-3">{immobilisation.duree_amortissement}</td>
                            <td className="px-3 py-3 truncate">{immobilisation.type_amortissement}</td>
                            <td className="px-3 py-3">{immobilisation.etat}</td>
                            <td className="px-3 py-3 truncate">{immobilisation.fournisseur}</td>
                            <td className="px-3 py-3 text-center space-x-1">
                              <button
                                onClick={() => handleGenererAmortissementImmobilisation(immobilisation._id)}
                                className="text-xs bg-blue-600 hover:bg-blue-700 text-white px-2 py-1 rounded shadow transition"
                              >
                                Générer
                              </button>
                              <button
                                onClick={() => toggleRow(immobilisation._id)}
                                className="text-xs bg-slate-600 hover:bg-slate-700 text-white px-2 py-1 rounded shadow transition"
                              >
                                {visibleRows[immobilisation._id] ? "Cacher" : "Voir"}
                              </button>
                            </td>
                          </tr>

                          {visibleRows[immobilisation._id] && (
                            <tr>
                              <td colSpan="9" className="p-0">
                                <div className="bg-white dark:bg-slate-800 px-6 py-4 rounded-lg shadow-md">
                                  <h3 className="text-base font-bold mb-3 text-green-600 dark:text-green-400 border-b pb-2 border-green-200 dark:border-green-700">
                                    Tableau d'amortissement
                                  </h3>
                                  <div className="mb-4 bg-green-50 dark:bg-slate-700 p-3 rounded-md border-l-4 border-green-500">
                                    <h4 className="text-sm font-bold text-slate-800 dark:text-white mb-1">
                                      Tableau d'amortissement des immobilisations (comptable)
                                    </h4>
                                    <p className="text-xs text-slate-700 dark:text-slate-300">
                                      Utilisé pour suivre la dépréciation des actifs immobilisés.
                                    </p>
                                  </div>

                                  <div className="overflow-x-auto">
                                    <table className="table-auto w-full text-sm border-collapse border border-slate-300 dark:border-slate-600">
                                      <thead>
                                        <tr className="bg-green-600 dark:bg-green-800">
                                          <th className="border border-slate-300 dark:border-slate-600 px-3 py-2 text-white font-semibold">Année</th>
                                          <th className="border border-slate-300 dark:border-slate-600 px-3 py-2 text-white font-semibold">Valeur brute</th>
                                          <th className="border border-slate-300 dark:border-slate-600 px-3 py-2 text-white font-semibold">Taux</th>
                                          <th className="border border-slate-300 dark:border-slate-600 px-3 py-2 text-white font-semibold">Amortissement annuel</th>
                                          <th className="border border-slate-300 dark:border-slate-600 px-3 py-2 text-white font-semibold">Cumul des amortissements</th>
                                          <th className="border border-slate-300 dark:border-slate-600 px-3 py-2 text-white font-semibold">Valeur nette comptable</th>
                                        </tr>
                                      </thead>
                                      <tbody>
                                        {amortissementsImmo.length > 0 ? (
                                          amortissementsImmo.map((a, index) => {
                                            // Get immobilisation data
                                            const immoData = immobilisations.find(i => i._id === (a.immobilisation_id?._id || a.immobilisation_id));
                                            const valeurBrute = immoData?.valeur_acquisition || 0;
                                            const tauxAmortissement = immoData?.taux_amortissement ||
                                              (immoData?.duree_amortissement ? (100 / immoData.duree_amortissement) : 0);

                                            return (
                                              <tr
                                                key={a._id}
                                                className={index % 2 === 0 ? "bg-white dark:bg-slate-800" : "bg-green-50 dark:bg-slate-700"}
                                              >
                                                <td className="border border-slate-300 dark:border-slate-600 px-3 py-2 text-black dark:text-white font-medium">{a.exercice || `Année ${index + 1}`}</td>
                                                <td className="border border-slate-300 dark:border-slate-600 px-3 py-2 text-black dark:text-white">{valeurBrute.toFixed(2)} DT</td>
                                                <td className="border border-slate-300 dark:border-slate-600 px-3 py-2 text-black dark:text-white">{tauxAmortissement.toFixed(2)}%</td>
                                                <td className="border border-slate-300 dark:border-slate-600 px-3 py-2 text-black dark:text-white font-bold">{a.montant_amortissement?.toFixed(2) || a.montant?.toFixed(2)} DT</td>
                                                <td className="border border-slate-300 dark:border-slate-600 px-3 py-2 text-black dark:text-white">{a.cumul_amortissement?.toFixed(2) || "-"} DT</td>
                                                <td className="border border-slate-300 dark:border-slate-600 px-3 py-2 text-black dark:text-white font-bold">{a.valeur_nette?.toFixed(2) || "-"} DT</td>
                                              </tr>
                                            );
                                          })
                                        ) : (
                                          <tr>
                                            <td colSpan="6" className="border border-slate-300 dark:border-slate-600 px-3 py-4 text-center text-slate-500 dark:text-slate-400 font-medium">
                                              Aucun amortissement trouvé.
                                            </td>
                                          </tr>
                                        )}
                                      </tbody>
                                    </table>
                                  </div>
                                </div>
                              </td>
                            </tr>
                          )}
                        </React.Fragment>
                      );
                    })
                  ) : (
                    <tr>
                      <td
                        colSpan="10"
                        className="px-6 py-8 text-center text-slate-500 dark:text-slate-300"
                      >
                        Aucune immobilisation trouvée.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}

          {/* Payments Tab */}
          {activeTab === "paiements" && (
            <div className="space-y-6">
              {/* Payments Table */}
              <div className="rounded-xl shadow ring-1 ring-slate-200 dark:ring-slate-700 bg-white dark:bg-slate-800 overflow-hidden">
                <table className="table-fixed w-full text-sm">
                  <thead className="bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-100 uppercase text-xs">
                    <tr>
                      <th className="px-3 py-3 w-[150px] truncate">Emprunt</th>
                      <th className="px-3 py-3 w-[120px] truncate">Date</th>
                      <th className="px-3 py-3 w-[100px]">Montant total</th>
                      <th className="px-3 py-3 w-[100px]">Intérêts</th>
                      <th className="px-3 py-3 w-[120px]">Amortissement</th>
                      <th className="px-3 py-3 w-[120px]">Capital restant</th>
                      <th className="px-3 py-3 w-[100px]">Mode</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                    {paiements.length > 0 ? (
                      paiements.map((paiement) => {
                        // Find the related loan
                        const emprunt = emprunts.find(e =>
                          e._id === paiement.emprunt_id ||
                          (paiement.emprunt_id && paiement.emprunt_id._id === e._id)
                        );

                        return (
                          <tr key={paiement._id} className="hover:bg-slate-50 dark:hover:bg-slate-700">
                            <td className="px-3 py-3 truncate">
                              {emprunt ? emprunt.intitule : "Emprunt inconnu"}
                            </td>
                            <td className="px-3 py-3 truncate">
                              {new Date(paiement.date_paiement).toLocaleDateString()}
                            </td>
                            <td className="px-3 py-3">
                              {Number(paiement.montant_total || 0).toFixed(2)} DT
                            </td>
                            <td className="px-3 py-3">
                              {Number(paiement.montant_interet || 0).toFixed(2)} DT
                            </td>
                            <td className="px-3 py-3">
                              {Number(paiement.montant_amortissement || 0).toFixed(2)} DT
                            </td>
                            <td className="px-3 py-3">
                              {Number(paiement.capital_restant_du || 0).toFixed(2)} DT
                            </td>
                            <td className="px-3 py-3">
                              {paiement.mode_paiement}
                            </td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td
                          colSpan="7"
                          className="px-6 py-8 text-center text-slate-500 dark:text-slate-300"
                        >
                          Aucun paiement trouvé.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Loan Status Table */}
              <div className="rounded-xl shadow ring-1 ring-slate-200 dark:ring-slate-700 bg-white dark:bg-slate-800 overflow-hidden">
                <table className="table-fixed w-full text-sm">
                  <thead className="bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-100 uppercase text-xs">
                    <tr>
                      <th className="px-3 py-3 w-[150px] truncate">Emprunt</th>
                      <th className="px-3 py-3 w-[100px]">Montant initial</th>
                      <th className="px-3 py-3 w-[120px]">Montant remboursé</th>
                      <th className="px-3 py-3 w-[120px]">Capital restant</th>
                      <th className="px-3 py-3 w-[100px]">Statut</th>
                      <th className="px-3 py-3 w-[150px]">Progression</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                    {emprunts.length > 0 ? (
                      emprunts.map((emprunt) => {
                        // Find all payments for this loan
                        const empruntPaiements = paiements.filter(p =>
                          p.emprunt_id === emprunt._id ||
                          (p.emprunt_id && p.emprunt_id._id === emprunt._id)
                        );

                        // Calculate total paid amount
                        const totalPaid = empruntPaiements.reduce((sum, p) => sum + Number(p.montant_amortissement || 0), 0);

                        // Get the latest payment to know the remaining capital
                        const latestPaiement = empruntPaiements.length > 0 ?
                          empruntPaiements.sort((a, b) =>
                            new Date(b.date_paiement || 0) - new Date(a.date_paiement || 0)
                          )[0] : null;

                        const capitalRestant = latestPaiement ? Number(latestPaiement.capital_restant_du || 0) : Number(emprunt.montant || 0);

                        // Calculate payment progress
                        const montant = Number(emprunt.montant || 0);
                        const progress = montant > 0 ? ((montant - capitalRestant) / montant) * 100 : 0;

                        // Determine status
                        let status = "Non commencé";
                        let statusColor = "bg-gray-500";
                        let progressColor = "bg-gray-500";
                        let textColor = "text-slate-500";

                        if (empruntPaiements.length > 0) {
                          if (capitalRestant <= 0) {
                            status = "Remboursé";
                            statusColor = "bg-green-600";
                            progressColor = "bg-green-600";
                            textColor = "text-green-600";
                          } else {
                            status = "En cours";
                            statusColor = "bg-blue-600";
                            progressColor = "bg-blue-600";
                            textColor = "text-blue-600";
                          }
                        }

                        return (
                          <tr key={emprunt._id} className="hover:bg-slate-50 dark:hover:bg-slate-700">
                            <td className="px-3 py-3 truncate">
                              {emprunt.intitule}
                            </td>
                            <td className="px-3 py-3">
                              {Number(emprunt.montant || 0).toFixed(2)} DT
                            </td>
                            <td className="px-3 py-3">
                              {Number(totalPaid || 0).toFixed(2)} DT
                            </td>
                            <td className="px-3 py-3">
                              {Number(capitalRestant || 0).toFixed(2)} DT
                            </td>
                            <td className="px-3 py-3">
                              <span className={`px-2 py-1 rounded text-xs text-white ${statusColor}`}>
                                {status}
                              </span>
                            </td>
                            <td className="px-3 py-3">
                              <div className="w-full bg-slate-200 dark:bg-slate-700 rounded h-1.5">
                                <div
                                  className={`${progressColor} h-1.5 rounded`}
                                  style={{ width: `${Math.min(progress, 100)}%` }}
                                ></div>
                              </div>
                              <div className={`text-xs ${textColor} dark:${textColor} mt-1 font-medium`}>
                                {Math.round(progress)}% remboursé
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td
                          colSpan="6"
                          className="px-6 py-8 text-center text-slate-500 dark:text-slate-300"
                        >
                          Aucun emprunt trouvé.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Analytics Tab */}
          {activeTab === "analyses" && (
            <FinancialAnalytics
              emprunts={emprunts}
              paiements={paiements}
              immobilisations={immobilisations}
            />
          )}

          {/* AI Predictions Tab */}
          {activeTab === "ia_predictions" && (
            <AIPredictions
              emprunts={emprunts}
              immobilisations={immobilisations}
            />
          )}

                            <div className="bg-slate-800 p-6 rounded-lg shadow-md mt-6">
                                <h2 className="text-xl font-semibold text-yellow-500 mb-4 text-center">KPI</h2>
                                <LayoutKpi />
                            </div>
                            <div className="bg-slate-800 p-6 rounded-lg shadow-md mt-6">
                                <h2 className="text-xl font-semibold text-yellow-500 mb-4 text-center">Revenus</h2>
                                <LayoutRevenu />
                            </div>
                            <div className="bg-slate-800 p-6 rounded-lg shadow-md mt-6">
                                <h2 className="text-xl font-semibold text-yellow-500 mb-4 text-center">Reporting fiscal</h2>
                                <LayoutReportingFiscal />
                            </div>
          <Outlet />
        </main>
      </div>
      {/* Forms are now displayed inline */}
    </div>
  );
};

export default Layout;
