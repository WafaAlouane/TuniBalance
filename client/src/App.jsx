import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing";
import Register from "./pages/Registrer";
import Login from "./pages/login";
import BusinessOwnerDashboard from "./pages/BusinessOwnerDashboard";
import Dashboard from "./pages/admindashbord";


function App() {
  return (

    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/DashboardBusinessOwner" element={<BusinessOwnerDashboard />} />
        <Route path="/Dashboard" element={<Dashboard />} />
      </Routes>
    </Router>
  );

}

export default App;
