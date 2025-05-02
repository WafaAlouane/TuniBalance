import React, { useEffect, useState } from 'react';
import {
  fetchMargeBrute,
  fetchMargeNette,
  fetchRentabiliteEconomique,
  fetchTauxEndettement,
  fetchLiquiditeGenerale,
  fetchDSO,
  fetchROI,
  fetchTauxCroissanceCA,
  fetchTauxMargeCommerciale
} from '../services/kpiService';

const KpiDashboard = () => {
  const currentYear = new Date().getFullYear();
  const [annee, setAnnee] = useState(currentYear);
  const [kpis, setKpis] = useState({});
  const [loading, setLoading] = useState(false);
  const [selectedKpis, setSelectedKpis] = useState([
    "margeBrute",
    "margeNette",
    "tauxEndettement"
  ]); // Liste par défaut des KPIs affichés

  useEffect(() => {
    const loadKPIs = async () => {
      setLoading(true);
      try {
        const [
          margeBrute,
          margeNette,
          rentabiliteEconomique,
          tauxEndettement,
          liquiditeGenerale,
          dso,
          roi,
          tauxCroissanceCA,
          tauxMargeCommerciale
        ] = await Promise.all([
          fetchMargeBrute(annee),
          fetchMargeNette(annee),
          fetchRentabiliteEconomique(annee),
          fetchTauxEndettement(annee),
          fetchLiquiditeGenerale(annee),
          fetchDSO(annee),
          fetchROI(annee),
          fetchTauxCroissanceCA(annee),
          fetchTauxMargeCommerciale(annee),
        ]);

        setKpis({
          ...margeBrute,
          ...margeNette,
          ...rentabiliteEconomique,
          ...tauxEndettement,
          ...liquiditeGenerale,
          ...dso,
          ...roi,
          ...tauxCroissanceCA,
          ...tauxMargeCommerciale,
        });
      } catch (err) {
        console.error('Erreur lors du chargement des KPI:', err);
      }
      setLoading(false);
    };

    loadKPIs();
  }, [annee]);

  const toggleKpiSelection = (key) => {
    setSelectedKpis((prevSelected) =>
      prevSelected.includes(key)
        ? prevSelected.filter((item) => item !== key) // Supprime le KPI si déjà sélectionné
        : [...prevSelected, key] // Ajoute le KPI sinon
    );
  };

  const getColor = (value, thresholds) => {
    if (value === null || value === undefined) return "bg-gray-500";
    if (value < thresholds[0]) return "bg-red-500"; // Faible
    if (value > thresholds[1]) return "bg-green-500"; // Bon
    return "bg-yellow-500"; // Moyen
  };

  const kpiData = [
    { label: "Marge brute", key: "margeBrute", thresholds: [30, 60] },
    { label: "Marge nette", key: "margeNette", thresholds: [10, 30] },
    { label: "Rentabilité économique", key: "rentabiliteEconomique", thresholds: [5, 15] },
    { label: "Taux d'endettement", key: "tauxEndettement", thresholds: [30, 70] },
    { label: "Liquidité générale", key: "liquiditeGenerale", thresholds: [1, 2] },
    { label: "Délais clients", key: "dso", thresholds: [30, 60] },
    { label: "Retour sur Investissement", key: "roi", thresholds: [10, 20] },
    { label: "Taux de croissance du CA", key: "tauxCroissanceCA", thresholds: [5, 15] },
    { label: "Taux de marge commerciale", key: "tauxMargeCommerciale", thresholds: [20, 40] },
  ];

  return (
    <div className="p-6 bg-gray-800 rounded-lg shadow-md w-full max-w-4xl mx-auto text-white">
      <h2 className="text-center font-bold text-xl mb-4">KPI Dashboard ({annee})</h2>

      {/* Sélecteur d'année */}
      <div className="flex justify-center mb-6">
        <label htmlFor="annee" className="mr-2">Sélectionnez une année : </label>
        <select
          id="annee"
          value={annee}
          onChange={(e) => setAnnee(parseInt(e.target.value))}
          className="p-2 rounded bg-gray-700 text-white"
        >
          {[2020, 2021, 2022, 2023, 2024, 2025].map((year) => (
            <option key={year} value={year}>{year}</option>
          ))}
        </select>
      </div>

      {/* Sélecteur de KPIs */}
      <div className="flex flex-wrap gap-2 justify-center mb-4">
        {kpiData.map(({ label, key }) => (
          <button
            key={key}
            onClick={() => toggleKpiSelection(key)}
            className={`px-3 py-1 rounded ${selectedKpis.includes(key) ? "bg-blue-500 text-white" : "bg-gray-500 text-black"}`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Affichage des KPI */}
      {loading ? (
        <p className="text-center text-white">Chargement des données...</p>
      ) : (
        <div className="grid grid-cols-3 gap-4">
          {kpiData
            .filter(({ key }) => selectedKpis.includes(key)) // Filtre les KPIs selon la sélection
            .map(({ label, key, thresholds }) => (
              <div key={key} className={`p-4 rounded shadow-md text-center ${getColor(kpis[key], thresholds)}`}>
                <h3 className="font-bold">{label}</h3>
                <p className="text-xl">{kpis[key] ?? 'N/A'}</p>
              </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default KpiDashboard;
