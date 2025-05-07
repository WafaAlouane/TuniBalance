import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAppointments } from '../redux/slices/appointmentSlice';
import { FiCalendar, FiUser, FiType, FiCheckSquare, FiXCircle, FiSave } from 'react-icons/fi';
const AppointmentForm = ({ onCancel }) => {
  const dispatch = useDispatch();
  const { user, token } = useSelector((state) => state.auth);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [form, setForm] = useState({
    title: '',
    start: '',
    end: '',
    receiverId: '',
    type: 'meeting',
    isFiscalDeadline: false,
  });
    
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('http://localhost:3001/users', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUsers(response.data);
      } catch (error) {
        console.error('Erreur lors de la récupération des utilisateurs:', error);
        setError('Impossible de charger la liste des utilisateurs');
      }
    };
    fetchUsers();
  }, [token]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  useEffect(() => {
    if (form.type === 'fiscal_deadline') {
      setForm(prev => ({ ...prev, isFiscalDeadline: true }));
    } else {
      setForm(prev => ({ ...prev, isFiscalDeadline: false }));
    }
  }, [form.type]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    // Validation des dates
    const startDate = new Date(form.start);
    const endDate = new Date(form.end);
    
    if (startDate >= endDate) {
      setError('La date de fin doit être postérieure à la date de début');
      setLoading(false);
      return;
    }

    try {
      // Préparation des données
      const formattedData = {
        title: form.title,
        receiverId: form.receiverId,
        type: form.type,
        isFiscalDeadline: form.type === 'fiscal_deadline',
        // Convert dates to ISO strings
        start: startDate.toISOString(),
        end: endDate.toISOString()
      };

      console.log('Sending appointment data:', formattedData);

      const response = await axios.post(
        'http://localhost:3001/appointments', 
        formattedData,
        {
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      console.log('Appointment created:', response.data);
      dispatch(fetchAppointments());
      onCancel?.();
    } catch (error) {
      console.error('Erreur détaillée:', error.response?.data);
      setError(error.response?.data?.message || 'Erreur lors de la création du rendez-vous');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 bg-opacity-50 backdrop-blur-sm fixed inset-0 flex items-center justify-center p-4 z-50">
      <form onSubmit={handleSubmit} className="w-full max-w-2xl bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl shadow-2xl p-6 space-y-6 relative">
        {/* En-tête */}
        <div className="border-b border-gray-700 pb-4">
          <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
            Nouveau Rendez-vous
          </h2>
        </div>

        {/* Message d'erreur */}
        {error && (
          <div className="p-4 bg-red-900/30 rounded-lg border border-red-800/50 flex items-center gap-3">
            <FiXCircle className="flex-shrink-0 text-red-400" />
            <span className="text-red-300">{error}</span>
          </div>
        )}
      {/* Champ Titre */}
      <div className="space-y-2">
          <label className="flex items-center gap-2 text-gray-300 text-sm font-medium">
            <FiType className="text-blue-400" />
            Titre du rendez-vous
          </label>
          <input
            name="title"
            value={form.title}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-100 placeholder-gray-500 transition-all"
            placeholder="Ex: Réunion stratégique"
          />
        </div>

        {/* Champ Destinataire */}
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-gray-300 text-sm font-medium">
            <FiUser className="text-purple-400" />
            Destinataire
          </label>
          <select
            name="receiverId"
            value={form.receiverId}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-100 appearance-none cursor-pointer"
          >
            <option value="" className="bg-gray-800">Sélectionner un utilisateur</option>
            {users.map(user => (
              <option key={user._id} value={user._id} className="bg-gray-800">
                {user.name} ({user.role})
              </option>
            ))}
          </select>
        </div>

        {/* Dates */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-gray-300 text-sm font-medium">
              <FiCalendar className="text-green-400" />
              Date de début
            </label>
            <input
              type="datetime-local"
              name="start"
              value={form.start}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-100"
            />
          </div>

          <div className="space-y-2">
            <label className="flex items-center gap-2 text-gray-300 text-sm font-medium">
              <FiCalendar className="text-red-400" />
              Date de fin
            </label>
            <input
              type="datetime-local"
              name="end"
              value={form.end}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-100"
            />
          </div>
        </div>

        {/* Type de rendez-vous */}
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-gray-300 text-sm font-medium">
            <FiType className="text-yellow-400" />
            Type de rendez-vous
          </label>
          <select
            name="type"
            value={form.type}
            onChange={handleChange}
            className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-100 cursor-pointer"
          >
            <option value="meeting" className="bg-gray-800">Réunion</option>
            <option value="fiscal_deadline" className="bg-gray-800">Échéance fiscale</option>
            <option value="client_meeting" className="bg-gray-800">Rendez-vous client</option>
          </select>
        </div>

        {/* Checkbox Échéance fiscale */}
        <div className="flex items-center gap-3 p-3 bg-gray-800/50 rounded-lg border border-gray-700">
          <input
            type="checkbox"
            name="isFiscalDeadline"
            checked={form.isFiscalDeadline}
            onChange={handleChange}
            disabled={form.type === 'fiscal_deadline'}
            className="h-5 w-5 text-blue-500 bg-gray-700 border-gray-600 rounded focus:ring-blue-500"
          />
          <label className="text-gray-300 flex items-center gap-2">
            <FiCheckSquare className="text-blue-400" />
            Échéance fiscale
          </label>
        </div>

        {/* Boutons */}
        <div className="flex justify-end gap-3 pt-6 border-t border-gray-800">
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="px-6 py-2.5 bg-gray-700 hover:bg-gray-600 text-gray-300 rounded-lg flex items-center gap-2 transition-all"
          >
            <FiXCircle className="text-lg" />
            Annuler
          </button>
          
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2.5 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-400 hover:to-purple-400 text-white rounded-lg flex items-center gap-2 transition-all"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                Création...
              </>
            ) : (
              <>
                <FiSave className="text-lg" />
                Créer le rendez-vous
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AppointmentForm;


/*import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAppointments } from '../redux/slices/appointmentSlice';

const AppointmentForm = ({ onCancel }) => {
  const dispatch = useDispatch();
  const { user, token } = useSelector((state) => state.auth);
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({
    title: '',
    start: '',
    end: '',
    receiverId: '',
    type: 'meeting',
    isFiscalDeadline: false,
  });
    

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('http://localhost:3001/users', {
          headers: { Authorization: `Bearer ${user.token}` }
        });
        setUsers(response.data);
      } catch (error) {
        console.error('Erreur lors de la récupération des utilisateurs:', error);
      }
    };
    fetchUsers();
  }, [user.token]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };
  useEffect(() => {
    if (form.type === 'fiscal_deadline') {
      setForm(prev => ({ ...prev, isFiscalDeadline: true }));
    } else {
      setForm(prev => ({ ...prev, isFiscalDeadline: false }));
    }
  }, [form.type]);
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation des dates
    const startDate = new Date(form.start);
  const endDate = new Date(form.end);
  if (startDate >= endDate) {
    alert('La date de fin doit être postérieure à la date de début');
    return;
  }


    try {
      // Préparation des données avec formatage ISO
      const appointmentData = {
        ...form,
        start: new Date(startTime).toISOString(),
  end: new Date(endTime).toISOString(),
        isFiscalDeadline: form.type === 'fiscal_deadline'
      };

      if (appointmentData.type !== 'fiscal_deadline') {
        delete appointmentData.isFiscalDeadline;
      }

      await axios.post('http://localhost:3001/appointments', 
        appointmentData,
        {
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      dispatch(fetchAppointments());
      onCancel?.();
    } catch (error) {
      console.error('Erreur détaillée:', error.response?.data);
      alert(`Erreur: ${error.response?.data?.message || 'Erreur serveur'}`);
    }
  };


  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4 bg-white rounded-lg shadow">
      <div>
        <label className="block mb-2">Titre</label>
        <input
          name="title"
          value={form.title}
          onChange={handleChange}
          required
          className="w-full p-2 border rounded"
        />
      </div>

      <div>
        <label className="block mb-2">Destinataire</label>
        <select
          name="receiverId"
          value={form.receiverId}
          onChange={handleChange}
          required
          className="w-full p-2 border rounded"
        >
          <option value="">Sélectionner un utilisateur</option>
          {users.map(user => (
            <option key={user._id} value={user._id}>
              {user.name} ({user.role})
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block mb-2">Date de début</label>
        <input
          type="datetime-local"
          name="start"
          value={form.start}
          onChange={handleChange}
          required
          className="w-full p-2 border rounded"
        />
      </div>

      <div>
        <label className="block mb-2">Date de fin</label>
        <input
          type="datetime-local"
          name="end"
          value={form.end}
          onChange={handleChange}
          required
          className="w-full p-2 border rounded"
        />
      </div>

      <div>
        <label className="block mb-2">Type de rendez-vous</label>
        <select
  name="type"
  value={form.type}
  onChange={handleChange}
  className="w-full p-2 border rounded"
>
  <option value="meeting">Réunion</option>
  <option value="fiscal_deadline">Échéance fiscale</option>
  <option value="client_meeting">Rendez-vous client</option>
</select>
      </div>

      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          name="isFiscalDeadline"
          checked={form.isFiscalDeadline}
          onChange={handleChange}
          className="h-4 w-4"
        />
        <label>Échéance fiscale ?</label>
      </div>

      <div className="flex justify-end gap-2">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
        >
          Annuler
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Créer le rendez-vous
        </button>
      </div>
    </form>
  );
};

export default AppointmentForm;*/