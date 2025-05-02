import { useState, useEffect } from "react";
import axios from "axios";
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, PieChart, AreaChart, Area } from "recharts";
import { Pie } from "react-chartjs-2";

const LayoutRevenu = () => {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [revenuData, setRevenuData] = useState([]);
  const [totalRevenus, setTotalRevenus] = useState(0);
  const [loading, setLoading] = useState(false);

  const fetchRevenus = async () => {
    if (!startDate || !endDate) return;
    setLoading(true);

    try {
      const response = await axios.get(`http://localhost:3001/transactions/revenus?startDate=${startDate}&endDate=${endDate}`);
      console.log("Réponse API :", response.data);

      setRevenuData(response.data.revenusParPeriode);
      setTotalRevenus(response.data.totalRevenus);
    } catch (error) {
      console.error("Erreur de récupération des revenus :", error);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchRevenus();
  }, [startDate, endDate]);

  return (
    <div className="p-6 bg-gray-800 rounded-lg shadow-md text-white">
      <h2 className="text-center font-bold text-xl mb-4">Suivi des Revenus</h2>

      {/* Sélecteur de période */}
      <div className="flex gap-4 justify-center mb-6">
        <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="p-2 rounded bg-gray-700 text-white" />
        <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="p-2 rounded bg-gray-700 text-white" />
      </div>

      {/* Affichage du graphique */}
      {loading ? (
        <p className="text-center text-white">Chargement des données...</p>
      ) : revenuData.length > 0 ? (
        <>
       <ResponsiveContainer width="100%" height={300}>
  <AreaChart data={revenuData}>
    <CartesianGrid strokeDasharray="3 3" />
    <XAxis dataKey="periode" />
    <YAxis />
    <Tooltip />
    <Area type="monotone" dataKey="revenus" stroke="#4CAF50" fillOpacity={0.4} fill="#4CAF50" />
  </AreaChart>
</ResponsiveContainer>

          <div className="p-4 bg-green-500 text-white rounded shadow-md text-center mt-4">
            <h3 className="font-bold">Total Revenus</h3>
            <p className="text-xl">{totalRevenus.toLocaleString()} DT</p>
          </div>
        </>
      ) : (
        <p className="text-center text-white">Aucune donnée disponible pour cette période.</p>
      )}
    </div>
  );
};

export default LayoutRevenu;
