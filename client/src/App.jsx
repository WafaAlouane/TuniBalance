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
import ResetPassword from "./pages/ResetPassword";
import ChangePassword from "./pages/profile/ChangePassword";
import ViewBO from "./pages/viewBO";
import ComptDash from "./pages/comptdash"; // Ajouter
import FinancierDash from "./pages/financierdash"; // Ajouter
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />

{/* Routes pour Comptable */}
<Route element={<ProtectedRoute allowedRoles={["accountant"]} />}>
          <Route path="/comptable" element={<ComptDash />}>
            <Route index element={<InfoProfile />} />
            <Route path="profile" element={<InfoProfile />} />
            <Route path="change-password" element={<ChangePassword />} />
          </Route>
        </Route>

        {/* Routes pour Financier */}
        <Route element={<ProtectedRoute allowedRoles={["financier"]} />}>
          <Route path="/financier" element={<FinancierDash />}>
            <Route index element={<InfoProfile />} />
            <Route path="profile" element={<InfoProfile />} />
            <Route path="change-password" element={<ChangePassword />} />
          </Route>
        </Route>

        {/* Routes pour Business Owner */}
        <Route element={<ProtectedRoute allowedRoles={["business_owner"]} />}>
          <Route path="/BusinessOwner" element={<BusinessOwner />}>
            <Route index element={<BusinessOwner />} /> {/* Affiche le Dashboard par défaut */}
            <Route path="create-staff" element={<CreateStaff />} />
            <Route path="profile/edit" element={<Profile />} />
            <Route path="profile" element={<InfoProfile />} />
            <Route path="reset-password" element={<ResetPassword />} />
            <Route path="change-password" element={<ChangePassword />} />

          </Route>
        </Route>

        {/* Admin Routes */}
        <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
  <Route path="/AdminDashboard" element={<AdminDashboard />}>
    <Route index element={<ViewBO />} /> {/* Affiche ViewBO par défaut */}
    <Route path="viewBO" element={<ViewBO />} /> {/* Route imbriquée */}
  </Route>
</Route>
      </Routes>
    </Router>
  );
}

export default App;