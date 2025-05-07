import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// This component redirects to the new dark mode calendar
const BusinessCalendarRedirect = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    // Redirect to the new dark mode calendar
    navigate('/BusinessOwner/calendar');
  }, [navigate]);

  return (
    <div className="p-4 bg-gray-900 text-white">
      <h2 className="text-xl font-bold mb-4">Redirecting to new calendar...</h2>
      <p>Please wait while we redirect you to the new calendar interface.</p>
    </div>
  );
};

export default BusinessCalendarRedirect;
