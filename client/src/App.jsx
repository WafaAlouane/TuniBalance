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
import ForgetPassword from "./pages/ForgetPassword";
import Layout from "./routes/layout";

function App() {
  return (       
    <Router>
      <Routes>

      
        <Route path="/" element={<  Layout />} />
        {/* Affiche le Dashboard par défaut 
        <Route path="/" element={<  layout />} />
*/}
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="forget-password" element={<ForgetPassword />} />


        <Route element={<ProtectedRoute allowedRoles={["business_owner"]} />}>
          <Route path="/BusinessOwner" element={<BusinessOwner />}>
            <Route index element={<BusinessOwner />} /> {/* Affiche le Dashboard par défaut */}
            <Route path="create-staff" element={<CreateStaff />} />
            <Route path="profile/edit" element={<Profile />} />
            <Route path="profile" element={<InfoProfile />} />
            <Route path="reset-password" element={<ResetPassword />} />
            <Route path="change-password" element={<ChangePassword />} />
            <Route path="forget-password" element={<ForgetPassword />} />


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