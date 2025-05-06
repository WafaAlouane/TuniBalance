import { useState } from "react";
import { fetchAnalyseEcart, fetchRapportTVA, fetchRapportTVAExcel, fetchRapportTVAPdf, fetchVerificationFiscale } from "../services/reportingfiscalService";
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

const LayoutReportingFiscal = () => {
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [trimestre, setTrimestre] = useState(1);
  const [rapportTVA, setRapportTVA] = useState(null);
  const [analyseEcart, setAnalyseEcart] = useState(null);
  const [verificationFiscale, setVerificationFiscale] = useState(null);
  const [secteur, setSecteur] = useState("commerce");  // Secteur par défaut
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
  const handleExportPdfGraphes = async () => {
    const doc = new jsPDF("p", "mm", "a4"); // Format A4 pour un bon rendu
    const graphsElement = document.getElementById("graphes");

    if (graphsElement) {
      const canvas = await html2canvas(graphsElement, { scale: 3 }); // Augmenter la qualité
      const imgData = canvas.toDataURL("image/png");

      doc.addImage(imgData, "PNG", 10, 20, 180, 250); // Augmente la hauteur à 250
      doc.save(`Graphes_Report_${selectedYear}_T${trimestre}.pdf`);
    }
  };

  const handleFetchVerificationFiscale = async () => {
    const data = await fetchVerificationFiscale(selectedYear, secteur);
    setVerificationFiscale(data);
  };
  const getFiscalIndication = (verificationFiscale) => {
    if (!verificationFiscale) return { message: "⚠️ Données non disponibles.", color: "text-gray-500 bg-gray-900" };
  
    return {
      message: verificationFiscale.message,
      color: verificationFiscale.couleur
    };
  };
  // 📊 Données du graphique TVA
  const tvaData = rapportTVA ? [
    { categorie: "TVA Collectée", valeur: rapportTVA.details.tvaCollectee || 0 },
    { categorie: "TVA Déductible", valeur: rapportTVA.details.tvaDeductible || 0 },
    { categorie: "TVA à Payer", valeur: rapportTVA.details.tvaAPayer || 0 }
  ] : [];

  const ecartData = [
    { categorie: "Bénéfice", valeur: analyseEcart?.details?.benefice, fill: "#2ECC71" },
    { categorie: "Impôt Théorique", valeur: analyseEcart?.details?.impotTheorique, fill: "#3498DB" },
    { categorie: "Impôt Payé", valeur: analyseEcart?.details?.impotPaye, fill: "#F39C12" },
    { categorie: "Écart Fiscal", valeur: Math.abs(analyseEcart?.details?.impotTheorique - analyseEcart?.details?.impotPaye), fill: "#E74C3C" }
  ];
  

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
      

      <div id="graphes">
      {rapportTVA && (
  <div className="bg-gray-900 p-4 rounded text-white mb-6">
    <h3 className="text-lg font-bold "> Résumé TVA {selectedYear} - T{trimestre}</h3>
    <p>TVA Collectée: <strong>{rapportTVA.details.tvaCollectee} TND</strong></p>
    <p>TVA Déductible: <strong>{rapportTVA.details.tvaDeductible} TND</strong></p>
    <p>TVA Nette à Payer: <strong>{rapportTVA.details.tvaAPayer} TND</strong></p>
  </div>
)}
        {/*  Graphique TVA */}
        {rapportTVA && (
 <div className="mb-6">

     <h3 className="text-lg font-bold text-yellow-500 text-center mb-3"> Rapport TVA </h3>

          <ResponsiveContainer width="100%" height={500}>
            <BarChart data={tvaData}>
              <XAxis dataKey="categorie" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="valeur" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
  </div>

        )}
        {analyseEcart && (
  <div className="bg-gray-900 p-4 rounded text-white mb-6">
    <h3 className="text-lg font-bold "> Analyse des Écarts Fiscaux {selectedYear}</h3>
    <p>Bénéfice: <strong>{analyseEcart.details.benefice} TND</strong></p>
    <p>Impôt Théorique: <strong>{analyseEcart.details.impotTheorique} TND</strong></p>
    <p>Impôt Payé: <strong>{analyseEcart.details.impotPaye} TND</strong></p>
    <p className="font-bold text-red-400">{analyseEcart.interpretation}</p>
  </div>
)}


        {/* 📈 Graphique Écarts Fiscaux */}
        {analyseEcart && (
  <div className="mb-6">
    <h3 className="text-lg font-bold text-yellow-500 text-center mb-3"> Analyse des Écarts Fiscaux</h3>
    <ResponsiveContainer width="100%" height={400}>
      <BarChart data={ecartData}>
        <XAxis dataKey="categorie" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="valeur" fill="" />
                </BarChart>
    </ResponsiveContainer>
  </div>
)}
      </div>

      {/* Boutons d'Export */}
      <div className="flex justify-center gap-4 mb-36">
        <button onClick={handleDownloadPdf} className="p-2 bg-purple-500 hover:bg-purple-600 text-white rounded">
          📄 Télécharger PDF (Rapport)
        </button>
        <button onClick={handleDownloadExcel} className="p-2 bg-green-500 hover:bg-green-600 text-white rounded">
          📄 Télécharger Excel (Rapport)
        </button>
        <button onClick={handleExportPdfGraphes} className="p-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded">
          📊 Télécharger PDF (Graphes)
        </button>
      </div>
  <div className="mb-6">
  <h3 className="text-lg font-bold text-yellow-500 text-center"> Conformité Fiscale</h3>

  <div className="flex flex-col md:flex-row gap-4">
    {/* Sélection du secteur */}
    <div className="w-full md:w-1/2">
      <label className="text-white font-bold">Secteur :</label>
      <select value={secteur} onChange={(e) => setSecteur(e.target.value)}
        className="p-2 rounded bg-gray-700 text-white w-full">
        <option value="commerce">Commerce</option>
        <option value="industrie">Industrie</option>
        <option value="agriculture">Agriculture</option>
        <option value="telecom">Télécommunications</option>
        <option value="grandes_surfaces_franchises">Grandes surfaces/franchises</option>
        <option value="societe_investissement">Société d'investissement</option>
        <option value="banques">Banques & Assurances</option>
      </select>
    </div>

    {/* Sélection de l'année */}
    <div className="w-full md:w-1/2">
      <label className="text-white font-bold">Année :</label>
      <select value={selectedYear} onChange={(e) => setSelectedYear(Number(e.target.value))}
        className="p-2 rounded bg-gray-700 text-white w-full">
        {[2020, 2021, 2022, 2023, 2024, 2025].map(year => (
          <option key={year} value={year}>{year}</option>
        ))}
      </select>
    </div>
  </div>

  {/* Bouton de vérification fiscale bien espacé */}
  <div className="flex justify-center mt-6">
    <button onClick={handleFetchVerificationFiscale} className="p-3 bg-indigo-500 hover:bg-indigo-600 text-white rounded">
      Vérifier la Conformité Fiscale
    </button>
  </div>
</div>
{verificationFiscale?.details && (
  <div className={`p-4 rounded mt-6 ${getFiscalIndication(verificationFiscale).color}`}>
    <h3 className="text-lg font-bold text-white"> Résultat de Conformité Fiscale</h3>
    <p className="font-bold text-white">
      {getFiscalIndication(verificationFiscale).message}
    </p>
  </div>
)}


     


    </div>
    
  );
};

export default LayoutReportingFiscal;
