import { useState } from "react";

export const ModalAjoutEmprunt = ({ onClose, onSave }) => {
  const [formData, setFormData] = useState({
    intitule: "",
    montant: "",
    taux_interet: "",
    duree: "",
    date_debut: "",
    type_amortissement: "",
    frequence_paiement: "",
    banque: "",
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
      <div className="bg-white dark:bg-slate-800 p-6 rounded-lg w-[500px] shadow-lg">
        <h2 className="text-xl font-semibold text-slate-800 dark:text-white mb-4">Ajouter un emprunt</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {[
            { label: "Intitulé", name: "intitule" },
            { label: "Montant", name: "montant", type: "number" },
            { label: "Taux (%)", name: "taux_interet", type: "number" },
            { label: "Durée", name: "duree", type: "number" },
            { label: "Date de début", name: "date_debut", type: "date" },
            { label: "Type", name: "type_amortissement" },
            { label: "Fréquence", name: "frequence_paiement" },
            { label: "Banque", name: "banque" },
          ].map(({ label, name, type = "text" }) => (
            <div key={name}>
              <label className="block text-sm text-slate-700 dark:text-slate-200">{label}</label>
              <input
                type={type}
                name={name}
                value={formData[name]}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 rounded border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-white"
              />
            </div>
          ))}
          <div className="flex justify-end space-x-2">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-400 hover:bg-gray-500 text-white rounded">
              Annuler
            </button>
            <button type="submit" className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded">
              Enregistrer
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
