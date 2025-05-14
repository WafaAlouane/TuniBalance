import { useState, useEffect } from 'react';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { getCompteResultat, getMonthlyStats } from '../services/transactionService';
import { FiDollarSign, FiTrendingUp, FiPieChart, FiAlertTriangle } from 'react-icons/fi';

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];


export default function Statistiques() {
  const [monthlyData, setMonthlyData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erreur, setErreur] = useState(null);
  const [compteResultat, setCompteResultat] = useState({
    chargesExploitation: [],
    produitsExploitation: [],
    chargesFinancieres: [],
    produitsFinanciers: [],
    chargesExceptionnelles: [],
    produitsExceptionnels: [],
    totalCharges: 0,
    totalProduits: 0,
    benefice: 0,
  });

  // Combiner toutes les catégories de charges
  const allCharges = [
    ...compteResultat.chargesExploitation,
    ...compteResultat.chargesFinancieres,
    ...compteResultat.chargesExceptionnelles
  ];

  // Combiner toutes les catégories de produits
  const allProduits = [
    ...compteResultat.produitsExploitation,
    ...compteResultat.produitsFinanciers,
    ...compteResultat.produitsExceptionnels
  ];

  const formatMontant = (montant) => 
    new Intl.NumberFormat('fr-FR').format(montant) + ' DT';

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [compteRes, monthlyRes] = await Promise.all([
          getCompteResultat(),
          getMonthlyStats()
        ]);

        if (compteRes) {
          setCompteResultat(compteRes);
        }
        
        if (monthlyRes) {
          setMonthlyData(processMonthlyData(monthlyRes));
        }
        
        setLoading(false);
      } catch (error) {
        console.error('Erreur:', error);
        setErreur("Erreur de chargement des données");
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  const processMonthlyData = (data) => {
    return data.map(item => ({
      month: new Date(item.date).toLocaleDateString('fr-FR', { month: 'short', year: 'numeric' }),
      charges: item.charges,
      produits: item.produits,
      benefice: item.produits - item.charges
    }));
  };

  if (loading) return <p>Chargement...</p>;
  if (erreur) return <p>{erreur}</p>;

  // Vérifier la présence de données dans toutes les catégories
  const hasData = allCharges.length > 0 || allProduits.length > 0;

  return (
    <div className="min-h-screen bg-gray-900 p-6 space-y-8">
      <div className="max-w-7xl mx-auto">
        {/* En-tête */}
        <div className="mb-8 border-b border-gray-700 pb-4">
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
            Statistiques
          </h1>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-blue-500"></div>
          </div>
        ) : erreur ? (
          <div className="p-4 bg-red-900/30 rounded-lg border border-red-800/50 flex items-center gap-3">
            <FiAlertTriangle className="text-red-400" />
            <span className="text-red-300">{erreur}</span>
          </div>
        ) : !hasData ? (
          <div className="p-6 text-center text-gray-400 bg-gray-800/50 rounded-xl border-2 border-dashed border-gray-700">
            Aucune donnée disponible
          </div>
        ) : (
          <>
            {/* Cartes de statistiques */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <StatCard 
                title="Revenus Totaux" 
                value={compteResultat.totalProduits} 
                icon={<FiTrendingUp className="w-6 h-6" />}
                gradient="from-green-600 to-green-800"
              />
              <StatCard 
                title="Dépenses Totales" 
                value={compteResultat.totalCharges} 
                icon={<FiTrendingUp className="w-6 h-6 transform rotate-180" />}
                gradient="from-red-600 to-red-800"
              />
              <StatCard 
                title={compteResultat.benefice >= 0 ? "Bénéfice Net" : "Perte Nette"} 
                value={Math.abs(compteResultat.benefice)} 
                icon={<FiDollarSign className="w-6 h-6" />}
                gradient={compteResultat.benefice >= 0 ? "from-blue-600 to-blue-800" : "from-orange-600 to-orange-800"}
              />
            </div>

            {/* Graphique d'évolution */}
            <div className="bg-gray-800 p-6 rounded-xl shadow-2xl mb-8 border border-gray-700">
              <div className="flex items-center gap-3 mb-6">
                <FiTrendingUp className="text-blue-400 w-8 h-8" />
                <h3 className="text-xl font-bold text-gray-200">Évolution Mensuelle</h3>
              </div>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={monthlyData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="month" stroke="#9CA3AF" />
                    <YAxis stroke="#9CA3AF" />
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: '#1F2937',
                        border: '1px solid #374151',
                        borderRadius: '8px'
                      }}
                      formatter={(value) => formatMontant(value)}
                    />
                    <Legend 
                      wrapperStyle={{ paddingTop: '20px' }}
                      formatter={(value) => <span className="text-gray-300">{value}</span>}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="produits" 
                      stroke="#10B981" 
                      name="Revenus"
                      strokeWidth={2}
                      dot={{ fill: '#10B981', strokeWidth: 2 }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="charges" 
                      stroke="#EF4444" 
                      name="Dépenses"
                      strokeWidth={2}
                      dot={{ fill: '#EF4444', strokeWidth: 2 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Section Graphiques */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Répartition des dépenses */}
              <div className="bg-gray-800 p-6 rounded-xl shadow-2xl border border-gray-700">
                <div className="flex items-center gap-3 mb-6">
                  <FiPieChart className="text-purple-400 w-8 h-8" />
                  <h3 className="text-xl font-bold text-gray-200">Répartition des Dépenses</h3>
                </div>
                <div className="h-96">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={allCharges}
                        dataKey="montant"
                        nameKey="sous_categorie"
                        cx="50%"
                        cy="50%"
                        outerRadius={120}
                        label={({ name, percent }) => 
                          `${name} (${(percent * 100).toFixed(0)}%)`
                        }
                      >
                        {allCharges.map((_, index) => (
                          <Cell 
                            key={index} 
                            fill={COLORS[index % COLORS.length]} 
                            stroke="#1F2937"
                            strokeWidth={2}
                          />
                        ))}
                      </Pie>
                      <Tooltip 
                        contentStyle={{
                          backgroundColor: '#1F2937',
                          border: '1px solid #374151',
                          borderRadius: '8px'
                        }}
                        formatter={(value) => formatMontant(value)}
                      />
                      <Legend 
                        wrapperStyle={{ paddingTop: '20px' }}
                        formatter={(value) => <span className="text-gray-300">{value}</span>}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Performance bénéfice/perte */}
              <div className="bg-gray-800 p-6 rounded-xl shadow-2xl border border-gray-700">
                <div className="flex items-center gap-3 mb-6">
                  <FiDollarSign className="text-green-400 w-8 h-8" />
                  <h3 className="text-xl font-bold text-gray-200">Performance Mensuelle</h3>
                </div>
                <div className="h-96">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={monthlyData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                      <XAxis dataKey="month" stroke="#9CA3AF" />
                      <YAxis stroke="#9CA3AF" />
                      <Tooltip 
                        contentStyle={{
                          backgroundColor: '#1F2937',
                          border: '1px solid #374151',
                          borderRadius: '8px'
                        }}
                        formatter={(value) => formatMontant(value)}
                      />
                      <Legend 
                        wrapperStyle={{ paddingTop: '20px' }}
                        formatter={(value) => <span className="text-gray-300">{value}</span>}
                      />
                      <Bar 
                        dataKey="benefice" 
                        name="Bénéfice/Perte"
                        fill={compteResultat.benefice >= 0 ? '#10B981' : '#EF4444'}
                        radius={[4, 4, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

const StatCard = ({ title, value, icon, gradient }) => (
  <div className={`bg-gradient-to-br ${gradient} p-6 rounded-xl shadow-2xl hover:shadow-xl transition-all`}>
    <div className="flex items-center justify-between mb-4">
      <span className="text-gray-200 text-lg">{title}</span>
      <div className="p-2 bg-white/10 rounded-lg">{icon}</div>
    </div>
    <p className="text-3xl font-bold text-white">
      {value.toLocaleString('fr-FR')} DT
    </p>
  </div>
);