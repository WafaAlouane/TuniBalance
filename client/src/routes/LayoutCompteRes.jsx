import { useEffect, useState } from "react";
import { getCompteResultat } from "../services/compteResultatService";

const LayoutCompteRes = () => {
  const [compteResultat, setCompteResultat] = useState({
    chargesExploitation: [],
    produitsExploitation: [],
    chargesFinancieres: [],
    produitsFinanciers: [],
    chargesExceptionnelles: [],
    produitsExceptionnels: [],
    totalChargesExploitation: 0,
    totalProduitsExploitation: 0,
    totalChargesFinancieres: 0,
    totalProduitsFinanciers: 0,
    totalChargesExceptionnelles: 0,
    totalProduitsExceptionnels: 0,
    totalCharges: 0,
    totalProduits: 0,
    benefice: 0,
  });

  const formatMontant = (montant) => 
    new Intl.NumberFormat('fr-FR').format(montant) + ' DT';

  const renderLignes = (charges, produits) => {
    const maxLines = Math.max(charges.length, produits.length);
    return Array.from({ length: maxLines }).map((_, index) => (
      <tr key={index}>
        <td className="border border-gray-400 p-2">
          {charges[index]?.sous_categorie || '\u00A0'}
          {charges[index] && ` : ${formatMontant(charges[index].montant)}`}
        </td>
        <td className="border border-gray-400 p-2">
          {produits[index]?.sous_categorie || '\u00A0'}
          {produits[index] && ` : ${formatMontant(produits[index].montant)}`}
        </td>
      </tr>
    ));
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getCompteResultat();
        setCompteResultat(data);
      } catch (error) {
        console.error("Erreur lors de la récupération des données :", error);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="bg-slate-800 p-6 rounded-lg shadow-md w-full max-w-4xl mx-auto">
      <table className="w-full border-collapse border border-gray-400">
        <thead>
          <tr>
            <th className="border border-gray-400 p-2 bg-blue-500 text-white w-1/2">Charges</th>
            <th className="border border-gray-400 p-2 bg-blue-500 text-white w-1/2">Produits</th>
          </tr>
        </thead>
        <tbody>
          {/* Section Exploitation */}
          <tr>
            <td className="border border-gray-400 p-2 font-bold">Charges d'exploitation :</td>
            <td className="border border-gray-400 p-2 font-bold">Produits d'exploitation :</td>
          </tr>
          {renderLignes(
            compteResultat.chargesExploitation, 
            compteResultat.produitsExploitation
          )}
          <tr>
            <td className="border border-gray-400 p-2 font-bold">
              Total Charges d'exploitation : {formatMontant(compteResultat.totalChargesExploitation)}
            </td>
            <td className="border border-gray-400 p-2 font-bold">
              Total Produits d'exploitation : {formatMontant(compteResultat.totalProduitsExploitation)}
            </td>
          </tr>

          {/* Section Financière */}
          <tr>
            <td className="border border-gray-400 p-2 font-bold">Charges financières :</td>
            <td className="border border-gray-400 p-2 font-bold">Produits financiers :</td>
          </tr>
          {renderLignes(
            compteResultat.chargesFinancieres, 
            compteResultat.produitsFinanciers
          )}
          <tr>
            <td className="border border-gray-400 p-2">
              Total : {formatMontant(compteResultat.totalChargesFinancieres)}
            </td>
            <td className="border border-gray-400 p-2">
              Total : {formatMontant(compteResultat.totalProduitsFinanciers)}
            </td>
          </tr>

          {/* Section Exceptionnelle */}
          <tr>
            <td className="border border-gray-400 p-2 font-bold">Charges exceptionnelles :</td>
            <td className="border border-gray-400 p-2 font-bold">Produits exceptionnels :</td>
          </tr>
          {renderLignes(
            compteResultat.chargesExceptionnelles, 
            compteResultat.produitsExceptionnels
          )}
          <tr>
            <td className="border border-gray-400 p-2">
              Total : {formatMontant(compteResultat.totalChargesExceptionnelles)}
            </td>
            <td className="border border-gray-400 p-2">
              Total : {formatMontant(compteResultat.totalProduitsExceptionnels)}
            </td>
          </tr>

          {/* Totaux généraux */}
          <tr className="bg-red-100"> {/* Version plus claire que bg-blue-100 */}
  <td className="border border-gray-400 p-2 text-black">
    TOTAL DES CHARGES : {formatMontant(compteResultat.totalCharges)}
  </td>
  <td className="border border-gray-400 p-2  text-black">
    TOTAL DES PRODUITS : {formatMontant(compteResultat.totalProduits)}
  </td>
</tr>

          {/* Bénéfice/Perte */}
          <tr>
            <td colSpan={2} className="border border-gray-400 p-2 font-bold text-center">
              {compteResultat.benefice >= 0 ? "BÉNÉFICE" : "PERTE"} : 
              {formatMontant(Math.abs(compteResultat.benefice))}
            </td>
          </tr>

          {/* Total général */}
          <tr className="bg-green-100">
            <td className="border border-gray-400 p-2 font-bold">
              TOTAL GÉNÉRAL : {formatMontant(compteResultat.totalCharges)}
            </td>
            <td className="border border-gray-400 p-2 font-bold">
              TOTAL GÉNÉRAL : {formatMontant(compteResultat.totalProduits)}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default LayoutCompteRes;