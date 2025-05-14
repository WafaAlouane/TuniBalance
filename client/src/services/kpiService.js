import axios from 'axios';

const API_URL = 'http://localhost:3001/kpi';

/**
 * Appelle un endpoint KPI spécifique avec une année donnée
 * @param {string} endpoint - Le nom du KPI (ex: 'marge-brute', 'roi')
 * @param {number} annee - L'année à interroger
 */
const fetchKPI = async (endpoint, annee) => {
  try {
    const response = await axios.get(`${API_URL}/${endpoint}`, {
      params: { annee }
    });
    return response.data;
  } catch (error) {
    console.error(`Erreur lors de la récupération du KPI ${endpoint} :`, error);
    return null;
  }
};

// Fonctions dédiées pour chaque KPI
export const fetchMargeBrute = (annee) => fetchKPI('marge-brute', annee);
export const fetchMargeNette = (annee) => fetchKPI('marge-nette', annee);
export const fetchRentabiliteEconomique = (annee) => fetchKPI('rentabilite-economique', annee);
export const fetchTauxEndettement = (annee) => fetchKPI('taux-endettement', annee);
export const fetchLiquiditeGenerale = (annee) => fetchKPI('liquidite-generale', annee);
export const fetchDSO = (annee) => fetchKPI('dso', annee);
export const fetchROI = (annee) => fetchKPI('roi', annee);
export const fetchTauxCroissanceCA = (annee) => fetchKPI('taux-croissance-ca', annee);
export const fetchTauxMargeCommerciale = (annee) => fetchKPI('taux-marge-commerciale', annee);
