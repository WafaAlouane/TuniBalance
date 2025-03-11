import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing";
import Register from "./pages/Registrer";
import Login from "./pages/login";

import AdminDashboard from "./pages/admindashbord";
import  ProtectedRoute from "./routes/ProtectedRoute"
import CreateStaff from './pages/CreateStaff';
import Profile from './pages/profile/Profile';
import InfoProfile from './pages/profile/InfoProfile'; 
import BusinessOwner from "./pages/BusinessOwner";
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />

        <Route element={<ProtectedRoute allowedRoles={["business_owner"]} />}>
          <Route path="/BusinessOwner" element={<BusinessOwner />}>
            <Route index element={<BusinessOwner />} /> {/* Affiche le Dashboard par défaut */}
            <Route path="create-staff" element={<CreateStaff />} />
            <Route path="profile/edit" element={<Profile />} />
            <Route path="profile" element={<InfoProfile />} />
          </Route>
        </Route>

        {/* Admin Routes */}
        <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
          <Route path="/AdminDashboard" element={<AdminDashboard />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;