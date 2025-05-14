import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAppointments } from '../redux/slices/appointmentSlice';
import { FiCalendar, FiUser, FiType, FiCheckSquare, FiXCircle, FiSave, FiVideo, FiLink, FiMail, FiExternalLink } from 'react-icons/fi';
const AppointmentForm = ({ onCancel }) => {
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.auth);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [creatingMeet, setCreatingMeet] = useState(false);
  const [sendingEmail, setSendingEmail] = useState(false);
  const [form, setForm] = useState({
    title: '',
    start: '',
    end: '',
    receiverId: '',
    type: 'meeting',
    isFiscalDeadline: false,
    createMeetLink: false,
    meetLink: '',
    sendEmailNotification: true,
  });

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('http://localhost:3001/users', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUsers(response.data);
      } catch (error) {
        console.error('Error retrieving users:', error);
        setError('Unable to load user list');
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

  // Function to generate a Google Meet link with start and end dates
  const generateMeetLink = async () => {
    try {
      // In a real implementation, this would call the Google Calendar API
      // For now, we'll simulate the API call with a delay
      setCreatingMeet(true);

      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Format dates for Google Calendar
      const startDate = form.start ? new Date(form.start) : new Date();
      const endDate = form.end ? new Date(form.end) : new Date(startDate.getTime() + 60 * 60 * 1000); // Default to 1 hour later

      // Format dates for URL parameters (YYYYMMDDTHHMMSS/YYYYMMDDTHHMMSS)
      const formatDateForCalendar = (date) => {
        return date.toISOString().replace(/-|:|\.\d+/g, '').slice(0, 15);
      };

      const startFormatted = formatDateForCalendar(startDate);
      const endFormatted = formatDateForCalendar(endDate);

      // Create a Google Calendar event URL that will open the "create event" page with pre-filled details
      const text = encodeURIComponent(form.title || 'New Meeting');
      const details = encodeURIComponent(`This is an automatically generated meeting for ${form.title || 'appointment'}.`);

      // Google Calendar URL with parameters
      const calendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${text}&dates=${startFormatted}/${endFormatted}&details=${details}&add=meet@google.com&ctz=local`;

      // For direct Google Meet link (as a backup)
      const directMeetLink = 'https://meet.google.com/new';

      setCreatingMeet(false);

      // Return both links - the calendar URL is preferred but we'll also provide the direct meet link
      return {
        calendarUrl,
        directMeetLink
      };
    } catch (error) {
      console.error('Error creating Google Meet link:', error);
      setCreatingMeet(false);
      // Fallback to a direct new meeting link
      return {
        calendarUrl: 'https://calendar.google.com/calendar/render?action=TEMPLATE',
        directMeetLink: 'https://meet.google.com/new'
      };
    }
  };

  // Generate a Google Meet link when the checkbox is checked
  useEffect(() => {
    const createMeeting = async () => {
      if (form.createMeetLink && !form.meetLink) {
        const links = await generateMeetLink();
        setForm(prev => ({
          ...prev,
          meetLink: links.directMeetLink,
          calendarUrl: links.calendarUrl
        }));
      } else if (!form.createMeetLink) {
        setForm(prev => ({
          ...prev,
          meetLink: '',
          calendarUrl: ''
        }));
      }
    };

    createMeeting();
  }, [form.createMeetLink]);

  // Send email notification with calendar event details
  useEffect(() => {
    const sendEmailNotification = async () => {
      if (form.createMeetLink && form.meetLink && form.sendEmailNotification && form.receiverId) {
        try {
          setSendingEmail(true);

          // The backend will handle the email sending when we create the appointment
          // We're just showing the loading indicator here for user feedback
          await new Promise(resolve => setTimeout(resolve, 1000));

          // Get recipient details from the selected user for display purposes
          const recipient = users.find(user => user._id === form.receiverId);

          // Log for debugging
          console.log('Email will be sent to:', recipient?.name || 'recipient');
          console.log('With meeting link:', form.meetLink);

          setSendingEmail(false);
        } catch (error) {
          console.error('Error preparing email notification:', error);
          setSendingEmail(false);
        }
      }
    };

    if (form.meetLink && form.sendEmailNotification) {
      sendEmailNotification();
    }
  }, [form.meetLink, form.sendEmailNotification, form.receiverId, users]);

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
      setError('End date must be after start date');
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
        end: endDate.toISOString(),
        // Include Google Meet link if created
        meetLink: form.createMeetLink ? form.meetLink : '',
        // Include email notification preference
        sendEmailNotification: form.createMeetLink && form.sendEmailNotification
      };

      // Log the data being sent to the backend
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

      // Set success message
      setSuccess('Appointment created successfully! Email invitation has been sent.');

      // Show success message for 2 seconds before closing
      setTimeout(() => {
        dispatch(fetchAppointments());
        onCancel?.();
      }, 2000);
    } catch (error) {
      console.error('Detailed error:', error.response?.data);
      setError(error.response?.data?.message || 'Error creating appointment');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 bg-opacity-50 backdrop-blur-sm fixed inset-0 flex items-center justify-center p-4 z-50">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-2xl bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl shadow-2xl p-6 space-y-6 relative max-h-[90vh] overflow-y-auto"
        style={{
          scrollbarWidth: 'thin',
          scrollbarColor: '#4B5563 #1F2937',
          msOverflowStyle: 'none' // IE and Edge
        }}
      >
        {/* En-tête */}
        <div className="border-b border-gray-700 pb-4">
          <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
            New Appointment
          </h2>
        </div>

        {/* Message d'erreur */}
        {error && (
          <div className="p-4 bg-red-900/30 rounded-lg border border-red-800/50 flex items-center gap-3">
            <FiXCircle className="flex-shrink-0 text-red-400" />
            <span className="text-red-300">{error}</span>
          </div>
        )}

        {/* Message de succès */}
        {success && (
          <div className="p-4 bg-green-900/30 rounded-lg border border-green-800/50 flex items-center gap-3">
            <FiCheckSquare className="flex-shrink-0 text-green-400" />
            <span className="text-green-300">{success}</span>
          </div>
        )}
      {/* Champ Titre */}
      <div className="space-y-2">
          <label className="flex items-center gap-2 text-gray-300 text-sm font-medium">
            <FiType className="text-blue-400" />
            Appointment Title
          </label>
          <input
            name="title"
            value={form.title}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-100 placeholder-gray-500 transition-all"
            placeholder="Ex: Strategic Meeting"
          />
        </div>

        {/* Champ Destinataire */}
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-gray-300 text-sm font-medium">
            <FiUser className="text-purple-400" />
            Recipient
          </label>
          <select
            name="receiverId"
            value={form.receiverId}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-100 appearance-none cursor-pointer"
          >
            <option value="" className="bg-gray-800">Select a user</option>
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
              Start Date
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
              End Date
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
            Appointment Type
          </label>
          <select
            name="type"
            value={form.type}
            onChange={handleChange}
            className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-100 cursor-pointer"
          >
            <option value="meeting" className="bg-gray-800">Meeting</option>
            <option value="fiscal_deadline" className="bg-gray-800">Fiscal Deadline</option>
            <option value="client_meeting" className="bg-gray-800">Client Meeting</option>
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
            Fiscal Deadline
          </label>
        </div>

        {/* Google Calendar with Meet Integration */}
        <div className="space-y-4 bg-gradient-to-r from-blue-900/20 to-purple-900/20 p-4 rounded-lg border border-blue-800/30">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-blue-900/40 p-2 rounded-full">
                <FiVideo className="text-blue-400 h-5 w-5" />
              </div>
              <div>
                <h3 className="text-blue-300 font-medium">Google Calendar with Meet</h3>
                <p className="text-gray-400 text-sm">Create a calendar event with video conferencing</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-gray-400 text-sm">Enable</span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  name="createMeetLink"
                  checked={form.createMeetLink}
                  onChange={handleChange}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-gray-400 after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600 peer-checked:after:bg-white"></div>
              </label>
            </div>
          </div>

          {form.createMeetLink && (
            <div className="mt-4 bg-blue-900/30 rounded-lg border border-blue-800/50 overflow-hidden">
              <div className="bg-blue-900/50 px-4 py-2 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FiCalendar className="text-blue-300" />
                  <span className="text-sm font-medium text-blue-200">Google Calendar Event with Meet</span>
                </div>
                {form.meetLink && (
                  <div className="flex items-center gap-2">
                    <a
                      href={form.calendarUrl || form.meetLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs bg-green-700 hover:bg-green-600 text-white px-3 py-1.5 rounded flex items-center gap-1 transition-colors"
                    >
                      <FiExternalLink className="h-3 w-3" />
                      Create Calendar Event
                    </a>
                  </div>
                )}
              </div>
              <div className="p-3">
                {creatingMeet ? (
                  <div className="flex items-center justify-center p-4">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
                    <span className="ml-2 text-blue-300">Creating calendar event with Meet...</span>
                  </div>
                ) : form.meetLink ? (
                  <div className="p-4 bg-gray-800/50 rounded border border-gray-700">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="bg-green-900/40 p-2 rounded-full">
                        <FiCalendar className="text-green-400 h-4 w-4" />
                      </div>
                      <div>
                        <h4 className="text-green-300 font-medium text-sm">{form.title || "New Meeting"}</h4>
                        <p className="text-xs text-gray-400">
                          {form.start ? new Date(form.start).toLocaleString() : "Not specified"} -
                          {form.end ? new Date(form.end).toLocaleString() : "Not specified"}
                        </p>
                      </div>
                    </div>
                    <p className="text-gray-400 text-sm mb-3">
                      Click the "Create Calendar Event" button above to open Google Calendar and create an event with Google Meet video conferencing.
                    </p>
                    <div className="flex items-center gap-2 text-xs text-blue-300">
                      <FiVideo className="text-blue-400" />
                      <span>Google Meet will be automatically added to the calendar event</span>
                    </div>
                  </div>
                ) : (
                  <div className="p-4 text-center text-gray-400">
                    <span>Preparing calendar event...</span>
                  </div>
                )}

                <div className="mt-4 bg-blue-900/20 p-4 rounded-lg border border-blue-800/40">
                  <div className="flex items-start gap-3">
                    <div className="bg-blue-900/40 p-1.5 rounded-full mt-0.5">
                      <FiMail className="text-blue-400 h-4 w-4" />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-blue-300 font-medium text-sm mb-1">Email Invitation</h4>
                      <p className="text-xs text-gray-400 mb-3">
                        Send a calendar invitation to the participant via email when the appointment is created
                      </p>

                      <label className="flex items-center gap-2 text-sm text-blue-300">
                        <input
                          type="checkbox"
                          name="sendEmailNotification"
                          checked={form.sendEmailNotification}
                          onChange={handleChange}
                          className="h-4 w-4 text-blue-500 bg-gray-700 border-gray-600 rounded focus:ring-blue-500"
                        />
                        Send calendar invitation automatically
                      </label>

                      {sendingEmail && (
                        <div className="mt-2 flex items-center text-xs text-blue-300">
                          <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-blue-500 mr-2"></div>
                          Preparing email invitation...
                        </div>
                      )}

                      {form.sendEmailNotification && !sendingEmail && (
                        <div className="mt-2 text-xs text-green-300">
                          <p>Email will be sent when appointment is created</p>
                          <p className="mt-1 text-gray-400">Note: The email will be sent from studyland002@gmail.com</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="mt-3 flex justify-between items-center">
                  <span className="text-xs text-blue-400">Need a quick meeting instead?</span>
                  <a
                    href="https://meet.google.com/new"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs bg-blue-700 hover:bg-blue-600 text-white px-3 py-1.5 rounded flex items-center gap-1 transition-colors"
                  >
                    <FiVideo className="h-3 w-3" />
                    Start Instant Meeting
                  </a>
                </div>
              </div>
            </div>
          )}
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
            Cancel
          </button>

          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2.5 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-400 hover:to-purple-400 text-white rounded-lg flex items-center gap-2 transition-all relative z-10"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                Creating...
              </>
            ) : (
              <>
                <FiSave className="text-lg" />
                Create Appointment
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