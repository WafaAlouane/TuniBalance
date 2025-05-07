import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAppointments } from '../redux/slices/appointmentSlice';
import axios from 'axios';
import AppointmentForm from './AppointmentForm';
import {
  Calendar,
  Plus,
  X,
  Trash2,
  Clock,
  User,
  Tag,
  AlertTriangle,
  RefreshCw
} from 'lucide-react';

// Import custom dark mode styles
import './calendar-dark.css';

const BusinessCalendar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { events, loading, error } = useSelector((state) => state.appointments);
  const { token } = useSelector((state) => state.auth);
  const [showForm, setShowForm] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showEventDetails, setShowEventDetails] = useState(false);

  useEffect(() => {
    // Redirect to the new dark mode calendar
    navigate('/BusinessOwner/calendar');
  }, [navigate]);

  useEffect(() => {
    if (token) dispatch(fetchAppointments());
  }, [dispatch, token]);

  const handleEventClick = (info) => {
    setSelectedEvent(info.event);
    setShowEventDetails(true);
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`http://localhost:3001/appointments/${selectedEvent.id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      dispatch(fetchAppointments());
      setSelectedEvent(null);
      setShowEventDetails(false);
    } catch (error) {
      console.error('Error deleting appointment:', error);
    }
  };

  const handleRefresh = () => {
    dispatch(fetchAppointments());
  };

  const closeEventDetails = () => {
    setShowEventDetails(false);
    setSelectedEvent(null);
  };

  // Define renderEventContent inside the component
  const renderEventContent = (eventInfo) => {
    return (
      <div className="p-1 text-sm">
        <div className="font-medium">{eventInfo.event.title}</div>
        <div className="text-gray-300">{eventInfo.timeText}</div>
        {eventInfo.event.extendedProps?.isFiscalDeadline && (
          <span className="inline-block mt-1 px-2 py-1 bg-red-900 bg-opacity-30 text-red-300 border border-red-800 rounded-full text-xs">
            Deadline
          </span>
        )}
        {eventInfo.event.extendedProps?.type === 'meeting' && (
          <span className="inline-block mt-1 px-2 py-1 bg-blue-900 bg-opacity-30 text-blue-300 border border-blue-800 rounded-full text-xs">
            Meeting
          </span>
        )}
      </div>
    );
  };

  return (
    <div className="p-6 bg-gray-900 min-h-screen">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold text-white flex items-center">
            <Calendar className="mr-2 text-blue-400" size={24} />
            Business Calendar
          </h1>
          <div className="flex space-x-2">
            <button
              onClick={handleRefresh}
              className="px-3 py-2 bg-gray-700 text-gray-200 rounded-md hover:bg-gray-600 transition-colors flex items-center"
            >
              <RefreshCw size={16} className="mr-1" />
              Refresh
            </button>
            {!showForm && (
              <button
                onClick={() => setShowForm(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center"
              >
                <Plus size={18} className="mr-1" />
                New Appointment
              </button>
            )}
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-900 bg-opacity-20 border border-red-800 rounded-md text-red-400 flex items-center">
            <AlertTriangle size={18} className="mr-2" />
            {error}
          </div>
        )}
      </div>

      {showForm && (
        <div className="mb-6 p-5 bg-gray-800 rounded-lg border border-gray-700 shadow-lg">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-white">New Appointment</h2>
            <button
              onClick={() => setShowForm(false)}
              className="p-1 text-gray-400 hover:text-gray-200 transition-colors"
            >
              <X size={20} />
            </button>
          </div>
          <AppointmentForm onCancel={() => setShowForm(false)} />
        </div>
      )}

      {showEventDetails && selectedEvent && (
        <div className="mb-6 p-5 bg-gray-800 rounded-lg border border-gray-700 shadow-lg">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-white">Appointment Details</h2>
            <button
              onClick={closeEventDetails}
              className="p-1 text-gray-400 hover:text-gray-200 transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div className="bg-gray-700 p-4 rounded-md">
              <div className="flex items-center text-gray-300 mb-2">
                <Tag className="mr-2" size={16} />
                <span className="text-sm font-medium">Title</span>
              </div>
              <p className="text-white">{selectedEvent.title}</p>
            </div>

            <div className="bg-gray-700 p-4 rounded-md">
              <div className="flex items-center text-gray-300 mb-2">
                <Clock className="mr-2" size={16} />
                <span className="text-sm font-medium">Time</span>
              </div>
              <p className="text-white">{selectedEvent.start ? new Date(selectedEvent.start).toLocaleString() : 'N/A'}</p>
            </div>

            {selectedEvent.extendedProps && (
              <>
                <div className="bg-gray-700 p-4 rounded-md">
                  <div className="flex items-center text-gray-300 mb-2">
                    <User className="mr-2" size={16} />
                    <span className="text-sm font-medium">Type</span>
                  </div>
                  <p className="text-white capitalize">{selectedEvent.extendedProps.type || 'Regular'}</p>
                </div>

                {selectedEvent.extendedProps.status && (
                  <div className="bg-gray-700 p-4 rounded-md">
                    <div className="flex items-center text-gray-300 mb-2">
                      <AlertTriangle className="mr-2" size={16} />
                      <span className="text-sm font-medium">Status</span>
                    </div>
                    <p className="text-white capitalize">{selectedEvent.extendedProps.status}</p>
                  </div>
                )}
              </>
            )}
          </div>

          <div className="flex justify-end space-x-3 mt-4">
            <button
              onClick={handleDelete}
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors flex items-center"
            >
              <Trash2 size={16} className="mr-1" />
              Delete
            </button>
          </div>
        </div>
      )}

      <div className="bg-gray-800 rounded-lg border border-gray-700 shadow-lg overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center h-64 text-gray-400">
            <div className="flex flex-col items-center">
              <div className="w-10 h-10 border-4 border-gray-700 border-t-blue-500 rounded-full animate-spin mb-4"></div>
              <p>Loading calendar...</p>
            </div>
          </div>
        ) : (
          <FullCalendar
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            initialView="timeGridWeek"
            headerToolbar={{
              left: 'prev,next today',
              center: 'title',
              right: 'dayGridMonth,timeGridWeek,timeGridDay'
            }}
            events={events}
            selectable={!showForm}
            eventClick={handleEventClick}
            eventContent={renderEventContent}
            height="700px"
            themeSystem="standard"
            dayMaxEvents={true}
            nowIndicator={true}
            businessHours={{
              daysOfWeek: [1, 2, 3, 4, 5], // Monday - Friday
              startTime: '08:00',
              endTime: '18:00',
            }}
            slotMinTime="07:00:00"
            slotMaxTime="20:00:00"
          />
        )}
      </div>
    </div>
  );
};

export default BusinessCalendar;
