import { useEffect, useState } from "react";
import { fetchBilanByYear, generateBilanByYear } from "../services/bilanService";

// Générer dynamiquement la liste des années
const generateYearsList = (startYear, endYear) => {
  let years = [];
  for (let year = startYear; year <= endYear; year++) {
    years.push(year);
  }
  return years;
};

const yearsList = generateYearsList(2020, new Date().getFullYear());

const LayoutBilan = () => {
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [bilan, setBilan] = useState({
    actifsCirculants: [],
    actifsNonCirculants: [],
    passifsDettes: [],
    passifsEmprunts: [],
    capitauxPropresDetails: [],
    totalActifsCirculants: 0,
    totalActifsNonCirculants: 0,
    totalPassifsDettes: 0,
    totalPassifsEmprunts: 0,
    totalCapitauxPropres: 0,
  });
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);

  const loadBilan = async (year) => {
    setLoading(true);
    try {
      const bilanData = await fetchBilanByYear(year);
      if (Array.isArray(bilanData) && bilanData.length > 0) {
        const bilanObject = bilanData[0];

        setBilan({
          actifsCirculants: bilanObject.actifsCirculants || [],
          actifsNonCirculants: bilanObject.actifsNonCirculants || [],
          passifsDettes: bilanObject.passifsDettes || [],
          passifsEmprunts: bilanObject.passifsEmprunts || [],
          capitauxPropresDetails: bilanObject.capitauxPropresDetails || [],
          totalActifsCirculants: bilanObject.totalActifsCirculants || 0,
          totalActifsNonCirculants: bilanObject.totalActifsNonCirculants || 0,
          totalPassifsDettes: bilanObject.totalPassifsDettes || 0,
          totalPassifsEmprunts: bilanObject.totalPassifsEmprunts || 0,
          totalCapitauxPropres: bilanObject.totalCapitauxPropres || 0,
        });
      } else {
        setBilan(null); // ✅ Affichage propre si aucun bilan trouvé
      }
    } catch (error) {
      console.error("Erreur de récupération du bilan :", error);
      setBilan(null);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadBilan(selectedYear);
  }, [selectedYear]);

  const handleGenerateBilan = async () => {
    setGenerating(true);
    await generateBilanByYear(selectedYear);
    await loadBilan(selectedYear); // 🔄 Met à jour après la génération
    setGenerating(false);
  };

  const formatMontant = (montant) =>
    montant !== undefined && montant !== null && !isNaN(montant)
      ? new Intl.NumberFormat('fr-FR').format(montant) + ' DT'
      : "0 DT";

  const renderLignesAvecTotal = (data, total) => (
    <>
      {data.map((item, index) => (
        <tr key={index}>
          <td className="border border-gray-400 p-2">{item.sous_categorie}</td>
          <td className="border border-gray-400 p-2 text-right">{formatMontant(item.montant)}</td>
        </tr>
      ))}
      <tr className="bg-gray-700 text-white">
        <td className="border border-gray-400 p-2 font-bold">Total :</td>
        <td className="border border-gray-400 p-2 font-bold text-right">{formatMontant(total)}</td>
      </tr>
    </>
  );
  const totalActifs = bilan ? bilan.totalActifsCirculants + bilan.totalActifsNonCirculants : 0;
const totalPassifs = bilan ? bilan.totalPassifsDettes + bilan.totalPassifsEmprunts + bilan.totalCapitauxPropres : 0;

  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-md w-full max-w-4xl mx-auto">
      <h2 className="text-center text-white font-bold text-xl mb-4">
        Bilan {selectedYear}
      </h2>
 {/* Sélecteur d’année */}
 <select 
        value={selectedYear} 
        onChange={(e) => setSelectedYear(Number(e.target.value))}
        className="p-2 mb-4 rounded bg-gray-700 text-white"
      >
        {yearsList.map(year => (
          <option key={year} value={year}>{year}</option>
        ))}
      </select>
      <button 
            onClick={handleGenerateBilan} 
            disabled={generating} 
            className="p-2 bg-green-600 text-white rounded mb-4"
          >
            {generating ? "Génération en cours..." : "Générer le Bilan"}
          </button>
{/* Vérification si les données existent */}
{bilan === null ? (
  <p className="text-white text-center">⚠️ Aucun bilan disponible pour l’année {selectedYear}</p>
) : bilan.actifsCirculants.length === 0 &&
  bilan.actifsNonCirculants.length === 0 &&
  bilan.passifsDettes.length === 0 &&
  bilan.passifsEmprunts.length === 0 &&
  bilan.capitauxPropresDetails.length === 0 ? (
  <p className="text-white text-center">Chargement du bilan...</p>
) : (
        <table className="w-full border-collapse border border-gray-400">
          <thead>
            <tr>
              <th className="border border-gray-400 p-2 bg-blue-500 text-white">Actifs</th>
              <th className="border border-gray-400 p-2 bg-red-500 text-white">Passifs & Capitaux Propres</th>
            </tr>
          </thead>
          <tbody>
  {/* Actifs Circulants */}
  <tr>
    <td className="border border-gray-400 p-2 font-bold">🔹 Actifs Circulants :</td>
    <td className="border border-gray-400 p-2 font-bold">🔹 Passifs Dettes :</td>
  </tr>
  {bilan.actifsCirculants.map((item, index) => (
    <tr key={index}>
      <td className="border border-gray-400 p-2">{item.sous_categorie} : {formatMontant(item.montant)}</td>
      <td className="border border-gray-400 p-2">
        {bilan.passifsDettes[index]
          ? `${bilan.passifsDettes[index].sous_categorie} : ${formatMontant(bilan.passifsDettes[index].montant)}`
          : ""}
      </td>
    </tr>
  ))}
  {/* Total Actifs Circulants & Passifs Dettes */}
  <tr className="bg-gray-700 text-white">
    <td className="border border-gray-400 p-2 font-bold">
      Total Actifs Circulants : {formatMontant(bilan.totalActifsCirculants)}
    </td>
    <td className="border border-gray-400 p-2 font-bold">
      Total Passifs Dettes : {formatMontant(bilan.totalPassifsDettes)}
    </td>
  </tr>

  {/* Actifs Non Circulants & Passifs Emprunts */}
  <tr>
    <td className="border border-gray-400 p-2 font-bold">🔹 Actifs Non Circulants :</td>
    <td className="border border-gray-400 p-2 font-bold">🔹 Passifs Emprunts :</td>
  </tr>
  {bilan.actifsNonCirculants.map((item, index) => (
    <tr key={index}>
      <td className="border border-gray-400 p-2">{item.sous_categorie} : {formatMontant(item.montant)}</td>
      <td></td>
    </tr>
  ))}
  {bilan.passifsEmprunts.map((item, index) => (
    <tr key={index}>
      <td></td>
      <td className="border border-gray-400 p-2">{item.sous_categorie} : {formatMontant(item.montant)}</td>
    </tr>
  ))}
  {/* Total Actifs Non Circulants & Passifs Emprunts */}
  <tr className="bg-gray-700 text-white">
    <td className="border border-gray-400 p-2 font-bold">
      Total Actifs Non Circulants : {formatMontant(bilan.totalActifsNonCirculants)}
    </td>
    <td className="border border-gray-400 p-2 font-bold">
      Total Passifs Emprunts : {formatMontant(bilan.totalPassifsEmprunts)}
    </td>
  </tr>

  {/* Capitaux Propres (Sous les passifs) */}
  <tr>
    <td></td>
    <td className="border border-gray-400 p-2 font-bold">🔹 Capitaux Propres :</td>
  </tr>
  {bilan.capitauxPropresDetails.map((item, index) => (
    <tr key={index}>
      <td></td>
      <td className="border border-gray-400 p-2">{item.sous_categorie} : {formatMontant(item.montant)}</td>
    </tr>
  ))}
  {/* Total Capitaux Propres */}
  <tr className="bg-green-700 text-white">
    <td></td>
    <td className="border border-gray-400 p-2 font-bold">
      Total Capitaux Propres : {formatMontant(bilan.totalCapitauxPropres)}
    </td>
  </tr>
  <tr className="bg-gray-900 text-white">
  <td className="border border-gray-400 p-2 font-bold"> Total Général des Actifs : {formatMontant(totalActifs)}</td>
  <td className="border border-gray-400 p-2 font-bold">Total Général des Passifs : {formatMontant(totalPassifs)}</td>
</tr>
</tbody>
        </table>
    )}
    </div>
  );
};

export default LayoutBilan;
