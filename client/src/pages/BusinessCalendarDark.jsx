import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import listPlugin from '@fullcalendar/list';
import multiMonthPlugin from '@fullcalendar/multimonth';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAppointments } from '../redux/slices/appointmentSlice';
import { logout } from '../redux/slices/authSlice';
import axios from 'axios';
import AppointmentForm from './AppointmentForm';
import Header from '../components/admin/Header';
import Sidebar from '../components/admin/Sidebar';
import {
  Calendar,
  Plus,
  X,
  Trash2,
  Clock,
  User,
  Tag,
  AlertTriangle,
  RefreshCw,
  Calendar as CalendarIcon,
  Video,
  ExternalLink,
  Link,
  Mail
} from 'lucide-react';

// Import custom dark mode styles
import './calendar-dark.css';

const BusinessCalendarDark = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { events, loading, error } = useSelector((state) => state.appointments);
  const { user, token } = useSelector((state) => state.auth);
  const [showForm, setShowForm] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showEventDetails, setShowEventDetails] = useState(false);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

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
    const hasMeetLink = eventInfo.event.extendedProps?.meetLink;

    return (
      <div className={`p-1 text-sm ${hasMeetLink ? 'border-l-2 border-green-500' : ''}`}>
        <div className="font-medium flex items-center">
          {eventInfo.event.title}
          {hasMeetLink && (
            <div className="ml-1 bg-green-900/50 rounded-full p-0.5 border border-green-700">
              <Video size={12} className="text-green-400" />
            </div>
          )}
        </div>
        <div className="text-gray-300">{eventInfo.timeText}</div>
        <div className="flex flex-wrap gap-1 mt-1">
          {eventInfo.event.extendedProps?.isFiscalDeadline && (
            <span className="inline-block px-2 py-0.5 bg-red-900 bg-opacity-30 text-red-300 border border-red-800 rounded-full text-xs">
              Deadline
            </span>
          )}
          {eventInfo.event.extendedProps?.type === 'meeting' && (
            <span className="inline-block px-2 py-0.5 bg-blue-900 bg-opacity-30 text-blue-300 border border-blue-800 rounded-full text-xs">
              Meeting
            </span>
          )}
          {hasMeetLink && (
            <span className="inline-block px-2 py-0.5 bg-green-900 bg-opacity-30 text-green-300 border border-green-800 rounded-full text-xs flex items-center">
              <Video size={10} className="mr-1" />
              Virtual
            </span>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-900 flex">
      <Sidebar user={user} />

      <div className="flex-1 flex flex-col">
        <Header user={user} onLogout={handleLogout} />

        <main className="flex-1 p-8 overflow-y-auto bg-gray-800 mt-16">
          {/* Page header */}
          <div className="relative mb-8">
            <div className="absolute inset-0 bg-blue-600 opacity-5 rounded-xl"></div>
            <div className="relative z-10 flex justify-between items-center p-6 bg-gray-800 border border-gray-700 rounded-xl shadow-lg">
              <div>
                <h1 className="text-2xl font-bold text-white flex items-center">
                  <CalendarIcon className="mr-2 text-blue-400" size={24} />
                  Business Calendar
                </h1>
                <p className="text-gray-400 mt-1">Manage your appointments and schedules</p>
              </div>
              <div className="flex space-x-3">
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
          </div>

          {error && (
            <div className="mb-6 p-3 bg-red-900 bg-opacity-20 border border-red-800 rounded-md text-red-400 flex items-center">
              <AlertTriangle size={18} className="mr-2" />
              {error}
            </div>
          )}

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

                    {/* Google Meet Link */}
                    {selectedEvent.extendedProps.meetLink && (
                      <div className="bg-gradient-to-r from-green-900/30 to-blue-900/30 p-4 rounded-md border border-green-800/50 col-span-1 md:col-span-2 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-24 h-24 -mt-8 -mr-8 bg-green-500/10 rounded-full blur-xl"></div>
                        <div className="absolute bottom-0 left-0 w-16 h-16 -mb-4 -ml-4 bg-blue-500/10 rounded-full blur-xl"></div>

                        <div className="flex items-center text-green-300 mb-3">
                          <div className="bg-green-900/50 p-2 rounded-full mr-3">
                            <Video className="text-green-400" size={18} />
                          </div>
                          <div>
                            <h4 className="text-sm font-medium">Virtual Meeting</h4>
                            <p className="text-xs text-green-400/70">Join with Google Meet</p>
                          </div>
                        </div>

                        <div className="bg-gray-900/50 p-3 rounded-md border border-gray-800 mb-3">
                          <p className="text-green-100 break-all font-mono text-sm">{selectedEvent.extendedProps.meetLink}</p>
                        </div>

                        <div className="flex justify-end">
                          <div className="flex gap-2">
                            <button
                              onClick={() => navigator.clipboard.writeText(selectedEvent.extendedProps.meetLink)}
                              className="px-3 py-1.5 bg-gray-700 hover:bg-gray-600 text-gray-200 rounded flex items-center transition-colors"
                            >
                              <Link size={14} className="mr-1" />
                              Copy
                            </button>
                            <a
                              href={selectedEvent.extendedProps.meetLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="px-3 py-1.5 bg-green-700 hover:bg-green-600 text-white rounded flex items-center transition-colors"
                            >
                              <ExternalLink size={14} className="mr-1" />
                              Join Meeting
                            </a>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Email Notification */}
                    {selectedEvent.extendedProps.meetLink && (
                      <div className="bg-blue-900/20 p-4 rounded-md border border-blue-800/50 col-span-1 md:col-span-2 mt-4">
                        <div className="flex items-center text-blue-300 mb-3">
                          <div className="bg-blue-900/50 p-2 rounded-full mr-3">
                            <Mail className="text-blue-400" size={18} />
                          </div>
                          <div>
                            <h4 className="text-sm font-medium">Send Meeting Invitation</h4>
                            <p className="text-xs text-blue-400/70">Email the meeting link to participants</p>
                          </div>
                        </div>

                        <button
                          onClick={() => {
                            // This would typically call an API endpoint to send the email
                            alert('Meeting invitation sent to participants!');
                          }}
                          className="w-full mt-2 px-4 py-2 bg-blue-700 hover:bg-blue-600 text-white rounded flex items-center justify-center transition-colors"
                        >
                          <Mail size={14} className="mr-2" />
                          Send Invitation Email
                        </button>
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
                plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin, listPlugin, multiMonthPlugin]}
                initialView="timeGridWeek"
                headerToolbar={{
                  left: 'prev,next today',
                  center: 'title',
                  right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek,multiMonthYear'
                }}
                views={{
                  timeGridWeek: {
                    titleFormat: { year: 'numeric', month: 'short', day: 'numeric' },
                    slotDuration: '01:00:00',
                    slotLabelFormat: {
                      hour: '2-digit',
                      minute: '2-digit',
                      hour12: false
                    }
                  },
                  multiMonthYear: {
                    titleFormat: { year: 'numeric' },
                    multiMonthMaxColumns: 3,
                    duration: { years: 1 }
                  },
                  listWeek: {
                    titleFormat: { year: 'numeric', month: 'short', day: 'numeric' },
                    listDayFormat: { weekday: 'long', month: 'short', day: 'numeric' },
                    listDaySideFormat: { weekday: 'short' }
                  }
                }}
                buttonText={{
                  today: 'Today',
                  month: 'Month',
                  week: 'Week',
                  day: 'Day',
                  list: 'List',
                  year: 'Year'
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
                  daysOfWeek: [1, 2, 3, 4, 5],
                  startTime: '08:00',
                  endTime: '18:00',
                }}
                slotMinTime="07:00:00"
                slotMaxTime="20:00:00"
                weekNumbers={true}
                weekNumberCalculation="ISO"
                weekText="Week "
              />
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default BusinessCalendarDark;
