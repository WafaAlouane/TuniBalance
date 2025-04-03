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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getCompteResultat();
        console.log("Données brutes de l'API :", data);
  
        const formattedData = {
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
        };
  
        data.forEach((item) => {
          switch (item._id) {
            case "chargesExploitation":
              formattedData.chargesExploitation = item.details ?? []; // Vérification
              formattedData.totalChargesExploitation = item.total_debit || 0;
              break;
            case "produitsExploitation":
              formattedData.produitsExploitation = item.details ?? [];
              formattedData.totalProduitsExploitation = item.total_credit || 0;
              break;
            case "chargesFinancieres":
              formattedData.chargesFinancieres = item.details ?? [];
              formattedData.totalChargesFinancieres = item.total_debit || 0;
              break;
            case "produitsFinanciers":
              formattedData.produitsFinanciers = item.details ?? [];
              formattedData.totalProduitsFinanciers = item.total_credit || 0;
              break;
            case "chargesExceptionnelles":
              formattedData.chargesExceptionnelles = item.details ?? [];
              formattedData.totalChargesExceptionnelles = item.total_debit || 0;
              break;
            case "produitsExceptionnels":
              formattedData.produitsExceptionnels = item.details ?? [];
              formattedData.totalProduitsExceptionnels = item.total_credit || 0;
              break;
          }
        });
  
        formattedData.totalCharges =
          formattedData.totalChargesExploitation +
          formattedData.totalChargesFinancieres +
          formattedData.totalChargesExceptionnelles;
  
        formattedData.totalProduits =
          formattedData.totalProduitsExploitation +
          formattedData.totalProduitsFinanciers +
          formattedData.totalProduitsExceptionnels;
  
        formattedData.benefice = formattedData.totalProduits - formattedData.totalCharges;
  
        console.log("Données formatées :", formattedData);
        setCompteResultat(formattedData);
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
          {/* Charges et produits d'exploitation */}
          <tr>
            <td className="border border-gray-400 p-2 font-bold">Charges d'exploitation :</td>
            <td className="border border-gray-400 p-2 font-bold">Produits d'exploitation :</td>
          </tr>
          {compteResultat.chargesExploitation.map((charge, index) => (
            <tr key={`charge-${index}`}>
              <td className="border border-gray-400 p-2">{charge.description} - {charge.montant}</td>
              <td className="border border-gray-400 p-2"></td>
            </tr>
          ))}
          {compteResultat.produitsExploitation.map((produit, index) => (
            <tr key={`produit-${index}`}>
              <td className="border border-gray-400 p-2"></td>
              <td className="border border-gray-400 p-2">{produit.description} - {produit.montant}</td>
            </tr>
          ))}

          {/* Affichage du total après les transactions */}
          <tr>
            <td className="border border-gray-400 p-2 font-bold">
              Total Charges d'exploitation : {compteResultat.totalChargesExploitation}
            </td>
            <td className="border border-gray-400 p-2 font-bold">
              Total Produits d'exploitation : {compteResultat.totalProduitsExploitation}
            </td>
          </tr>

          {/* Charges et produits financières */}
          <tr>
            <td className="border border-gray-400 p-2 font-bold">Charges financières :</td>
            <td className="border border-gray-400 p-2 font-bold">Produits financiers :</td>
          </tr>
          <tr>
            <td className="border border-gray-400 p-2">{compteResultat.totalChargesFinancieres}</td>
            <td className="border border-gray-400 p-2">{compteResultat.totalProduitsFinanciers}</td>
          </tr>

          {/* Charges et produits exceptionnelles */}

          
          <tr>
            <td className="border border-gray-400 p-2 font-bold">Charges exceptionnelles :</td>
            <td className="border border-gray-400 p-2 font-bold">Produits exceptionnels :</td>
          </tr>
          <tr>
            <td className="border border-gray-400 p-2">{compteResultat.totalChargesExceptionnelles}</td>
            <td className="border border-gray-400 p-2">{compteResultat.totalProduitsExceptionnels}</td>
          </tr>

          {/* Totaux */}
          <tr>
            <td className="border border-gray-400 p-2 font-bold bg-yellow-500">
              TOTAL DES CHARGES : {compteResultat.totalCharges}
            </td>
            <td className="border border-gray-400 p-2 font-bold bg-yellow-500">
              TOTAL DES PRODUITS : {compteResultat.totalProduits}
            </td>
          </tr>

          {/* Bénéfice ou perte */}
          <tr>
            <td className="border border-gray-400 p-2 font-bold">
              {compteResultat.benefice >= 0 ? "Bénéfice" : "Perte"} : {Math.abs(compteResultat.benefice)}
            </td>
          </tr>

          {/* Total général */}
          <tr>
            <td className="border border-gray-400 p-2 font-bold bg-green-200">
              TOTAL GÉNÉRAL : {compteResultat.totalCharges}
            </td>
            <td className="border border-gray-400 p-2 font-bold bg-green-200">
              TOTAL GÉNÉRAL : {compteResultat.totalProduits}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default LayoutCompteRes;
