import { useState } from "react";

export const ModalAjoutImmobilisation = ({ onClose, onSave }) => {
  const [formData, setFormData] = useState({
    nom: "",
    categorie: "",
    date_acquisition: "",
    valeur_acquisition: "",
    duree_amortissement: "",
    type_amortissement: "lineaire",
    taux_amortissement: "",
    valeur_residuelle: "",
    etat: "Neuf",
    fournisseur: "",
    compte_comptable: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await onSave(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-40 flex items-center justify-center">
      <div className="bg-white dark:bg-slate-800 p-6 rounded-lg w-[500px] shadow-lg max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-semibold text-slate-800 dark:text-white mb-4">Ajouter une immobilisation</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-slate-700 dark:text-slate-200">Nom</label>
            <input
              type="text"
              name="nom"
              value={formData.nom}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 rounded border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-white"
            />
          </div>
          
          <div>
            <label className="block text-sm text-slate-700 dark:text-slate-200">Catégorie</label>
            <input
              type="text"
              name="categorie"
              value={formData.categorie}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 rounded border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-white"
            />
          </div>
          
          <div>
            <label className="block text-sm text-slate-700 dark:text-slate-200">Date d'acquisition</label>
            <input
              type="date"
              name="date_acquisition"
              value={formData.date_acquisition}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 rounded border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-white"
            />
          </div>
          
          <div>
            <label className="block text-sm text-slate-700 dark:text-slate-200">Valeur d'acquisition</label>
            <input
              type="number"
              name="valeur_acquisition"
              value={formData.valeur_acquisition}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 rounded border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-white"
            />
          </div>
          
          <div>
            <label className="block text-sm text-slate-700 dark:text-slate-200">Durée d'amortissement (années)</label>
            <input
              type="number"
              name="duree_amortissement"
              value={formData.duree_amortissement}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 rounded border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-white"
            />
          </div>
          
          <div>
            <label className="block text-sm text-slate-700 dark:text-slate-200">Type d'amortissement</label>
            <select
              name="type_amortissement"
              value={formData.type_amortissement}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 rounded border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-white"
            >
              <option value="lineaire">Linéaire</option>
              <option value="degressif">Dégressif</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm text-slate-700 dark:text-slate-200">Taux d'amortissement (%)</label>
            <input
              type="number"
              name="taux_amortissement"
              value={formData.taux_amortissement}
              onChange={handleChange}
              className="w-full px-3 py-2 rounded border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-white"
            />
          </div>
          
          <div>
            <label className="block text-sm text-slate-700 dark:text-slate-200">Valeur résiduelle</label>
            <input
              type="number"
              name="valeur_residuelle"
              value={formData.valeur_residuelle}
              onChange={handleChange}
              className="w-full px-3 py-2 rounded border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-white"
            />
          </div>
          
          <div>
            <label className="block text-sm text-slate-700 dark:text-slate-200">État</label>
            <select
              name="etat"
              value={formData.etat}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 rounded border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-white"
            >
              <option value="Neuf">Neuf</option>
              <option value="Occasion">Occasion</option>
              <option value="Reconditionné">Reconditionné</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm text-slate-700 dark:text-slate-200">Fournisseur</label>
            <input
              type="text"
              name="fournisseur"
              value={formData.fournisseur}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 rounded border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-white"
            />
          </div>
          
          <div>
            <label className="block text-sm text-slate-700 dark:text-slate-200">Compte comptable</label>
            <input
              type="text"
              name="compte_comptable"
              value={formData.compte_comptable}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 rounded border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-white"
            />
          </div>
          
          <div className="flex justify-end space-x-2">
            <button 
              type="button" 
              onClick={onClose} 
              className="px-4 py-2 bg-gray-400 hover:bg-gray-500 text-white rounded"
            >
              Annuler
            </button>
            <button 
              type="submit" 
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded"
            >
              Enregistrer
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
