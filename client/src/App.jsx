import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing";
import Register from "./pages/Registrer";
import Login from "./pages/login";
import BusinessOwnerDashboard from "./pages/BusinessOwnerDashboard";
import AdminDashboard from "./pages/admindashbord";
import  ProtectedRoute from "./routes/ProtectedRoute"
import CreateStaff from './pages/CreateStaff';
import Profile from './pages/profile/Profile';
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />

        {/* Business Owner Routes */}
        <Route element={<ProtectedRoute allowedRoles={["business_owner"]} />}>
  <Route path="/DashboardBusinessOwner" element={<BusinessOwnerDashboard />} />
  <Route path="/create-staff" element={<CreateStaff />} />
  <Route path="/profile" element={<Profile />} />
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