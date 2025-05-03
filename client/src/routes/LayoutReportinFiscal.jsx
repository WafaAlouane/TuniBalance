import { useState } from "react";
import { fetchAnalyseEcart, fetchRapportTVA, fetchRapportTVAPdf, fetchRapportTVAExcel } from "../services/reportingFiscalService";

const LayoutReportingFiscal = () => {
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [trimestre, setTrimestre] = useState(1);
  const [rapportTVA, setRapportTVA] = useState(null);
  const [analyseEcart, setAnalyseEcart] = useState(null);

  const handleFetchRapportTVA = async () => {
    const data = await fetchRapportTVA(selectedYear, trimestre);
    setRapportTVA(data);
  };

  const handleFetchAnalyseEcart = async () => {
    const data = await fetchAnalyseEcart(selectedYear);
    setAnalyseEcart(data);
  };

  const handleDownloadPdf = async () => {
    const pdfBlob = await fetchRapportTVAPdf(selectedYear, trimestre);
    if (pdfBlob) {
      const url = window.URL.createObjectURL(new Blob([pdfBlob]));
      const a = document.createElement("a");
      a.href = url;
      a.download = `Rapport_TVA_${selectedYear}_T${trimestre}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
    }
  };

  const handleDownloadExcel = async () => {
    const excelBlob = await fetchRapportTVAExcel(selectedYear, trimestre);
    if (excelBlob) {
      const url = window.URL.createObjectURL(new Blob([excelBlob]));
      const a = document.createElement("a");
      a.href = url;
      a.download = `Rapport_TVA_${selectedYear}_T${trimestre}.xlsx`;
      document.body.appendChild(a);
      a.click();
      a.remove();
    }
  };

  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-md w-full max-w-4xl mx-auto">
      <h2 className="text-center text-white font-bold text-xl mb-6">
        Reporting Fiscal {selectedYear}
      </h2>

      {/* Sélection Année et Trimestre */}
      <div className="flex justify-center gap-4 mb-6">
        <select value={selectedYear} onChange={(e) => setSelectedYear(Number(e.target.value))}
          className="p-2 rounded bg-gray-700 text-white">
          {[2020, 2021, 2022, 2023, 2024, 2025].map(year => (
            <option key={year} value={year}>{year}</option>
          ))}
        </select>

        <select value={trimestre} onChange={(e) => setTrimestre(Number(e.target.value))}
          className="p-2 rounded bg-gray-700 text-white">
          {[1, 2, 3, 4].map(t => (
            <option key={t} value={t}>Trimestre {t}</option>
          ))}
        </select>
      </div>

      {/* Boutons Actions */}
      <div className="flex justify-center gap-4 mb-6">
        <button onClick={handleFetchRapportTVA} className="p-2 bg-blue-500 hover:bg-blue-600 text-white rounded">
           Voir Rapport TVA
        </button>
        <button onClick={handleFetchAnalyseEcart} className="p-2 bg-red-500 hover:bg-red-600 text-white rounded">
           Analyser les Écarts Fiscaux
        </button>
      </div>

      {/* Affichage du rapport TVA */}
      {rapportTVA && (
        <div className="bg-gray-900 p-4 rounded text-white mb-6">
          <h3 className="text-lg font-bold">📊 Rapport TVA {selectedYear} - T{trimestre}</h3>
          <p>TVA Collectée: <strong>{rapportTVA.details.tvaCollectee} DT</strong></p>
          <p>TVA Déductible: <strong>{rapportTVA.details.tvaDeductible} DT</strong></p>
          <p>TVA à Payer: <strong>{rapportTVA.details.tvaAPayer} DT</strong></p>
        </div>
      )}

      {/* Affichage de l'analyse des écarts fiscaux */}
      {analyseEcart && (
        <div className="bg-gray-900 p-4 rounded text-white mb-6">
          <h3 className="text-lg font-bold"> Analyse Écarts Fiscaux {selectedYear}</h3>
          <p>Bénéfice: <strong>{analyseEcart.details.benefice} DT</strong></p>
          <p>Impôt Théorique: <strong>{analyseEcart.details.impotTheorique} DT</strong></p>
          <p>Impôt Payé: <strong>{analyseEcart.details.impotPaye} DT</strong></p>
          <p className="font-bold text-red-400">{analyseEcart.interpretation}</p>
        </div>
      )}

      {/* Boutons d'Export (placés sous les analyses) */}
      {analyseEcart && (
        <div className="flex justify-center gap-4">
          <button onClick={handleDownloadPdf} className="p-2 bg-purple-500 hover:bg-purple-600 text-white rounded">
            📄 Télécharger PDF
          </button>
          <button onClick={handleDownloadExcel} className="p-2 bg-green-500 hover:bg-green-600 text-white rounded">
          📄 Télécharger Excel
          </button>
        </div>
      )}
    </div>
  );
};

export default LayoutReportingFiscal;
