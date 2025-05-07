import { useEffect,useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAppointments } from '../redux/slices/appointmentSlice';
import axios from 'axios';
import AppointmentForm from './AppointmentForm';

const BusinessCalendar = () => {
  const dispatch = useDispatch();
  const { events, loading } = useSelector((state) => state.appointments);
  const { user, token } = useSelector((state) => state.auth);
  const [showForm, setShowForm] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);

  useEffect(() => {
    if (token) dispatch(fetchAppointments());
  }, [dispatch, token]);

  const handleEventClick = (info) => {
    setSelectedEvent(info.event);
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`http://localhost:3001/appointments/${selectedEvent.id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      dispatch(fetchAppointments());
      setSelectedEvent(null);
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
    }
  };

  return (
    <div className="p-4">
      {showForm && (
        <div className="mb-4 p-4 bg-gray-50 rounded">
          <AppointmentForm onCancel={() => setShowForm(false)} />
        </div>
      )}

      {!showForm && (
        <button
          onClick={() => setShowForm(true)}
          className="mb-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          + Nouveau rendez-vous
        </button>
      )}

      {loading ? (
        <p>Chargement du calendrier...</p>
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
        />
      )}

      {selectedEvent && (
        <div className="mt-4 p-4 bg-white rounded shadow">
          <h3 className="text-xl font-bold mb-2">{selectedEvent.title}</h3>
          <p>Début: {new Date(selectedEvent.start).toLocaleString()}</p>
          <p>Fin: {new Date(selectedEvent.end).toLocaleString()}</p>
          <p>Type: {selectedEvent.extendedProps.type}</p>
          <div className="mt-4 flex gap-2">
            <button
              onClick={handleDelete}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            >
              Supprimer
            </button>
            <button
              onClick={() => setSelectedEvent(null)}
              className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
            >
              Fermer
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

const renderEventContent = (eventInfo) => (
  <div className="p-1 text-sm">
    <div className="font-medium">{eventInfo.event.title}</div>
    <div className="text-gray-600">{eventInfo.timeText}</div>
    {eventInfo.event.extendedProps.isFiscalDeadline && (
      <span className="inline-block mt-1 px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs">
        Échéance
      </span>
    )}
  </div>
);

export default BusinessCalendar;
/*import { useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { useDispatch, useSelector } from 'react-redux';

import { fetchAppointments } from '../redux/slices/appointmentSlice';


const BusinessCalendar = () => {
  const dispatch = useDispatch();
  const { events, loading } = useSelector((state) => state.appointments);
const token = useSelector((state) => state.auth.token);

  useEffect(() => {
    if (token) {
      dispatch(fetchAppointments());
    }
  }, [dispatch, token]);

  const handleDateSelect = async (selectInfo) => {
    const title = prompt('Entrez le titre du rendez-vous');
    if (title) {
      try {
        await axios.post(
          `http://localhost:3001/appointments`,
          {
            title,
            start: selectInfo.start,
            end: selectInfo.end,
            receiverId: 'ID_du_comptable'
          },
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        );
        dispatch(fetchAppointments()); // Recharge après création
      } catch (error) {
        console.error('Erreur lors de la création du rendez-vous:', error);
      }
    }
  };

  return (
    <div className="p-4">
      {loading ? (
        <p>Chargement du calendrier...</p>
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
          selectable={true}
          select={handleDateSelect}
          eventContent={renderEventContent}
          height="700px"
        />
      )}
    </div>
  );
};

const renderEventContent = (eventInfo) => {
  return (
    <div className="p-1">
      <b>{eventInfo.timeText}</b>
      <i>{eventInfo.event.title}</i>
      {eventInfo.event.extendedProps?.status && (
        <span className="ml-2 badge">{eventInfo.event.extendedProps.status}</span>
      )}
    </div>
  );
};

export default BusinessCalendar;
*/