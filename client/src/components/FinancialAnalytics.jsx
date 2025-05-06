import React, { useState, useRef } from 'react';
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer, Cell
} from 'recharts';
// Pas besoin d'importer de bibliothèque PDF, nous utiliserons l'impression du navigateur
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

const FinancialAnalytics = ({ emprunts = [], paiements = [], immobilisations = [] }) => {
  const [activeChart, setActiveChart] = useState('loanDistribution');
  const chartRef = useRef(null);

  // Préparer les données pour les graphiques
  const prepareLoanDistributionData = () => {
    // Regrouper les emprunts par banque
    const loansByBank = emprunts.reduce((acc, emprunt) => {
      const bank = emprunt.banque || 'Non spécifiée';
      if (!acc[bank]) {
        acc[bank] = 0;
      }
      acc[bank] += Number(emprunt.montant || 0);
      return acc;
    }, {});

    // Convertir en format pour Recharts
    return Object.keys(loansByBank).map(bank => ({
      name: bank,
      value: loansByBank[bank]
    }));
  };

  const preparePaymentProgressData = () => {
    return emprunts.map(emprunt => {
      // Trouver tous les paiements pour cet emprunt
      const empruntPaiements = paiements.filter(p =>
        p.emprunt_id === emprunt._id ||
        (p.emprunt_id && p.emprunt_id._id === emprunt._id)
      );

      // Calculer le montant total payé
      const totalPaid = empruntPaiements.reduce((sum, p) => sum + Number(p.montant_amortissement || 0), 0);

      // Calculer le pourcentage de remboursement
      const montant = Number(emprunt.montant || 0);
      const progress = montant > 0 ? (totalPaid / montant) * 100 : 0;

      return {
        name: emprunt.intitule || `Emprunt ${emprunt._id}`,
        progress: Math.min(progress, 100),
        remaining: Math.max(0, 100 - progress)
      };
    });
  };

  const prepareMonthlyPaymentsData = () => {
    // Regrouper les paiements par mois
    const paymentsByMonth = paiements.reduce((acc, paiement) => {
      const date = new Date(paiement.date_paiement);
      const monthYear = `${date.getMonth() + 1}/${date.getFullYear()}`;

      if (!acc[monthYear]) {
        acc[monthYear] = {
          total: 0,
          interest: 0,
          principal: 0
        };
      }

      acc[monthYear].total += Number(paiement.montant_total || 0);
      acc[monthYear].interest += Number(paiement.montant_interet || 0);
      acc[monthYear].principal += Number(paiement.montant_amortissement || 0);

      return acc;
    }, {});

    // Convertir en format pour Recharts et trier par date
    return Object.keys(paymentsByMonth)
      .map(monthYear => {
        const [month, year] = monthYear.split('/');
        return {
          monthYear,
          sortKey: new Date(`${year}-${month}-01`).getTime(),
          name: monthYear,
          total: paymentsByMonth[monthYear].total,
          interest: paymentsByMonth[monthYear].interest,
          principal: paymentsByMonth[monthYear].principal
        };
      })
      .sort((a, b) => a.sortKey - b.sortKey)
      .map(({ name, total, interest, principal }) => ({ name, total, interest, principal }));
  };

  const prepareAssetDepreciationData = () => {
    return immobilisations.map(asset => {
      const initialValue = Number(asset.valeur_acquisition || 0);
      const duration = Number(asset.duree_amortissement || 1);
      const annualDepreciation = initialValue / duration;

      // Créer un tableau d'années avec la valeur dépréciée
      const years = [];
      for (let i = 0; i <= duration; i++) {
        years.push({
          year: i,
          value: Math.max(0, initialValue - (annualDepreciation * i))
        });
      }

      return {
        name: asset.nom || `Immobilisation ${asset._id}`,
        data: years
      };
    });
  };

  // Exporter en Excel - version simplifiée pour éviter les erreurs
  const exportToExcel = () => {
    try {
      let data = [];
      let filename = "analyse_financiere.xlsx";

      // Obtenir la date actuelle formatée pour le nom de fichier
      const now = new Date();
      const dateStr = `${now.getFullYear()}${(now.getMonth() + 1).toString().padStart(2, '0')}${now.getDate().toString().padStart(2, '0')}`;

      // Préparer les données selon le graphique actif
      if (activeChart === 'loanDistribution') {
        const rawData = prepareLoanDistributionData();
        data = rawData.map(item => ({
          Banque: item.name || 'Non spécifié',
          "Montant": parseFloat(item.value || 0).toFixed(2)
        }));
        filename = `distribution_emprunts_${dateStr}.xlsx`;
      } else if (activeChart === 'paymentProgress') {
        const rawData = preparePaymentProgressData();
        data = rawData.map(item => ({
          Emprunt: item.name || 'Non spécifié',
          "Remboursé": parseFloat(item.progress || 0).toFixed(2),
          "Restant": parseFloat(item.remaining || 0).toFixed(2)
        }));
        filename = `progression_paiements_${dateStr}.xlsx`;
      } else if (activeChart === 'monthlyPayments') {
        const rawData = prepareMonthlyPaymentsData();
        data = rawData.map(item => ({
          "Période": item.name || 'Non spécifié',
          "Total": parseFloat(item.total || 0).toFixed(2),
          "Intérêts": parseFloat(item.interest || 0).toFixed(2),
          "Principal": parseFloat(item.principal || 0).toFixed(2)
        }));
        filename = `paiements_mensuels_${dateStr}.xlsx`;
      } else if (activeChart === 'assetDepreciation') {
        const assetData = prepareAssetDepreciationData();
        data = [];
        assetData.forEach(asset => {
          if (asset.data && Array.isArray(asset.data)) {
            asset.data.forEach(yearData => {
              if (yearData) {
                data.push({
                  "Actif": asset.name || 'Non spécifié',
                  "Année": `Année ${yearData.year || 0}`,
                  "Valeur": parseFloat(yearData.value || 0).toFixed(2)
                });
              }
            });
          }
        });
        filename = `depreciation_actifs_${dateStr}.xlsx`;
      }

      // Si aucune donnée, ajouter une ligne vide avec message
      if (data.length === 0) {
        data.push({
          "Information": "Aucune donnée disponible"
        });
      }

      // Créer un workbook et une worksheet
      const ws = XLSX.utils.json_to_sheet(data);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Données");

      // Générer le fichier Excel
      const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
      const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      saveAs(blob, filename);

      console.log('Excel exporté avec succès:', filename);
    } catch (error) {
      console.error('Erreur lors de l\'export Excel:', error);
      alert('Une erreur est survenue lors de l\'export Excel. Veuillez réessayer.');
    }
  };

  // Export PDF via impression du navigateur
  const exportToPDF = () => {
    try {
      // Obtenir la date actuelle formatée
      const now = new Date();
      const dateStr = `${now.getDate().toString().padStart(2, '0')}/${(now.getMonth() + 1).toString().padStart(2, '0')}/${now.getFullYear()}`;

      // Déterminer le titre selon le graphique actif
      let title = 'Analyse Financière';
      if (activeChart === 'loanDistribution') {
        title = 'Distribution des Emprunts par Banque';
      } else if (activeChart === 'paymentProgress') {
        title = 'Progression des Remboursements';
      } else if (activeChart === 'monthlyPayments') {
        title = 'Paiements Mensuels';
      } else if (activeChart === 'assetDepreciation') {
        title = 'Dépréciation des Actifs';
      }

      // Créer une nouvelle fenêtre pour l'impression
      const printWindow = window.open('', '_blank');

      if (!printWindow) {
        alert("Veuillez autoriser les popups pour permettre l'impression.");
        return;
      }

      // Capturer le graphique actuel
      let chartImage = '';
      if (chartRef.current) {
        try {
          // Essayer de capturer le SVG du graphique
          const svgElement = chartRef.current.querySelector('svg');
          if (svgElement) {
            const svgData = new XMLSerializer().serializeToString(svgElement);
            chartImage = `<div style="text-align: center; margin: 20px 0;">
              <img src="data:image/svg+xml;base64,${btoa(svgData)}" style="max-width: 100%; height: auto;" />
            </div>`;
          }
        } catch (e) {
          console.error("Erreur lors de la capture du graphique:", e);
          // En cas d'erreur, on continue sans l'image
          chartImage = '<p style="text-align: center; color: #666;">Graphique non disponible pour l\'impression</p>';
        }
      }

      // Créer le contenu HTML pour l'impression
      const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <title>${title}</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              margin: 30px;
              color: #333;
            }
            h1 {
              color: #2c3e50;
              font-size: 24px;
              margin-bottom: 10px;
            }
            .date {
              color: #7f8c8d;
              font-size: 14px;
              margin-bottom: 5px;
            }
            .footer {
              color: #7f8c8d;
              font-size: 12px;
              margin-top: 30px;
              text-align: center;
              border-top: 1px solid #eee;
              padding-top: 10px;
            }
            table {
              width: 100%;
              border-collapse: collapse;
              margin: 20px 0;
            }
            th {
              background-color: #3498db;
              color: white;
              font-weight: bold;
              text-align: left;
              padding: 8px;
            }
            td {
              border: 1px solid #ddd;
              padding: 8px;
            }
            tr:nth-child(even) {
              background-color: #f2f2f2;
            }
            @media print {
              body {
                margin: 0;
                padding: 15px;
              }
              .no-print {
                display: none;
              }
            }
          </style>
        </head>
        <body>
          <h1>${title}</h1>
          <div class="date">Date: ${dateStr}</div>

          ${chartImage}

          <div class="footer">
            Rapport généré par TuniBalance
          </div>

          <div class="no-print" style="text-align: center; margin: 20px 0;">
            <button onclick="window.print();" style="padding: 10px 20px; background: #3498db; color: white; border: none; border-radius: 4px; cursor: pointer;">
              Imprimer
            </button>
          </div>
        </body>
        </html>
      `;

      // Écrire le contenu dans la nouvelle fenêtre
      printWindow.document.open();
      printWindow.document.write(htmlContent);
      printWindow.document.close();

      // Déclencher l'impression automatiquement après chargement
      printWindow.onload = function() {
        setTimeout(() => {
          printWindow.print();
        }, 500);
      };

      console.log('Fenêtre d\'impression ouverte avec succès');
    } catch (error) {
      console.error('Erreur lors de l\'export PDF:', error);
      alert('Une erreur est survenue lors de l\'export PDF. Veuillez réessayer.');
    }
  };

  // Couleurs pour les graphiques - adaptées au mode sombre
  const COLORS = ['#3498db', '#2ecc71', '#f39c12', '#e74c3c', '#9b59b6', '#1abc9c'];

  // Couleurs pour les graphiques en mode sombre
  const DARK_COLORS = ['#60a5fa', '#4ade80', '#fbbf24', '#f87171', '#c084fc', '#34d399'];

  return (
    <div className="bg-slate-950 text-white rounded-xl shadow ring-1 ring-slate-700 p-6">
      <div className="flex flex-col space-y-6">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
          <h2 className="text-xl font-bold text-white">Analyses Financières</h2>
          <div className="flex space-x-2">
            <button
              onClick={exportToExcel}
              className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-sm rounded shadow transition flex items-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Exporter Excel
            </button>
            <button
              onClick={exportToPDF}
              className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white text-sm rounded shadow transition flex items-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
              Exporter PDF
            </button>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setActiveChart('loanDistribution')}
            className={`px-3 py-1.5 text-sm rounded shadow transition flex items-center ${
              activeChart === 'loanDistribution'
                ? 'bg-blue-600 text-white'
                : 'bg-slate-700 text-white hover:bg-slate-600'
            }`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
            </svg>
            Distribution des Emprunts
          </button>
          <button
            onClick={() => setActiveChart('paymentProgress')}
            className={`px-3 py-1.5 text-sm rounded shadow transition flex items-center ${
              activeChart === 'paymentProgress'
                ? 'bg-blue-600 text-white'
                : 'bg-slate-700 text-white hover:bg-slate-600'
            }`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            Progression des Remboursements
          </button>
          <button
            onClick={() => setActiveChart('monthlyPayments')}
            className={`px-3 py-1.5 text-sm rounded shadow transition flex items-center ${
              activeChart === 'monthlyPayments'
                ? 'bg-blue-600 text-white'
                : 'bg-slate-700 text-white hover:bg-slate-600'
            }`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
            </svg>
            Paiements Mensuels
          </button>
          <button
            onClick={() => setActiveChart('assetDepreciation')}
            className={`px-3 py-1.5 text-sm rounded shadow transition flex items-center ${
              activeChart === 'assetDepreciation'
                ? 'bg-blue-600 text-white'
                : 'bg-slate-700 text-white hover:bg-slate-600'
            }`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
            </svg>
            Dépréciation des Actifs
          </button>
        </div>

        <div ref={chartRef} className="h-96 w-full">
          {activeChart === 'loanDistribution' && (
            <ResponsiveContainer width="100%" height="100%">
              {prepareLoanDistributionData().length > 0 ? (
                <PieChart>
                  <Pie
                    data={prepareLoanDistributionData()}
                    cx="50%"
                    cy="50%"
                    labelLine={true}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={120}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {prepareLoanDistributionData().map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={document.documentElement.classList.contains('dark')
                          ? DARK_COLORS[index % DARK_COLORS.length]
                          : COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => `${value.toFixed(2)} DT`} />
                  <Legend />
                </PieChart>
              ) : (
                <div className="flex items-center justify-center h-full w-full text-slate-300">
                  <div className="bg-slate-800 p-4 rounded-lg shadow-lg">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mx-auto mb-2 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p className="text-center">Aucune donnée d'emprunt disponible</p>
                  </div>
                </div>
              )}
            </ResponsiveContainer>
          )}

          {activeChart === 'paymentProgress' && (
            <ResponsiveContainer width="100%" height="100%">
              {preparePaymentProgressData().length > 0 ? (
                <BarChart
                  data={preparePaymentProgressData()}
                  layout="vertical"
                  margin={{ top: 20, right: 30, left: 100, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" domain={[0, 100]} />
                  <YAxis dataKey="name" type="category" width={100} />
                  <Tooltip formatter={(value) => `${value.toFixed(2)}%`} />
                  <Legend />
                  <Bar
                    dataKey="progress"
                    stackId="a"
                    fill={document.documentElement.classList.contains('dark') ? '#4ade80' : '#2ecc71'}
                    name="Remboursé"
                  />
                  <Bar
                    dataKey="remaining"
                    stackId="a"
                    fill={document.documentElement.classList.contains('dark') ? '#60a5fa' : '#3498db'}
                    name="Restant"
                  />
                </BarChart>
              ) : (
                <div className="flex items-center justify-center h-full w-full text-slate-300">
                  <div className="bg-slate-800 p-4 rounded-lg shadow-lg">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mx-auto mb-2 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p className="text-center">Aucune donnée de progression disponible</p>
                  </div>
                </div>
              )}
            </ResponsiveContainer>
          )}

          {activeChart === 'monthlyPayments' && (
            <ResponsiveContainer width="100%" height="100%">
              {prepareMonthlyPaymentsData().length > 0 ? (
                <LineChart
                  data={prepareMonthlyPaymentsData()}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip formatter={(value) => `${value.toFixed(2)} DT`} />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="total"
                    stroke={document.documentElement.classList.contains('dark') ? '#c084fc' : '#9b59b6'}
                    strokeWidth={2}
                    name="Total"
                  />
                  <Line
                    type="monotone"
                    dataKey="interest"
                    stroke={document.documentElement.classList.contains('dark') ? '#f87171' : '#e74c3c'}
                    strokeWidth={2}
                    name="Intérêts"
                  />
                  <Line
                    type="monotone"
                    dataKey="principal"
                    stroke={document.documentElement.classList.contains('dark') ? '#4ade80' : '#2ecc71'}
                    strokeWidth={2}
                    name="Principal"
                  />
                </LineChart>
              ) : (
                <div className="flex items-center justify-center h-full w-full text-slate-300">
                  <div className="bg-slate-800 p-4 rounded-lg shadow-lg">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mx-auto mb-2 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p className="text-center">Aucune donnée de paiement mensuel disponible</p>
                  </div>
                </div>
              )}
            </ResponsiveContainer>
          )}

          {activeChart === 'assetDepreciation' && (
            <ResponsiveContainer width="100%" height="100%">
              {prepareAssetDepreciationData().length > 0 ? (
                <LineChart
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  data={prepareAssetDepreciationData()[0]?.data || []}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="year" type="number" domain={[0, 'dataMax']} allowDecimals={false} />
                  <YAxis />
                  <Tooltip formatter={(value) => `${value.toFixed(2)} DT`} />
                  <Legend />
                  {prepareAssetDepreciationData().map((asset, index) => (
                    <Line
                      key={asset.name}
                      data={asset.data}
                      type="monotone"
                      dataKey="value"
                      name={asset.name}
                      stroke={document.documentElement.classList.contains('dark')
                        ? DARK_COLORS[index % DARK_COLORS.length]
                        : COLORS[index % COLORS.length]}
                      strokeWidth={2}
                      activeDot={{ r: 6 }}
                    />
                  ))}
                </LineChart>
              ) : (
                <div className="flex items-center justify-center h-full w-full text-slate-300">
                  <div className="bg-slate-800 p-4 rounded-lg shadow-lg">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mx-auto mb-2 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p className="text-center">Aucune donnée de dépréciation disponible</p>
                  </div>
                </div>
              )}
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </div>
  );
};

export default FinancialAnalytics;
