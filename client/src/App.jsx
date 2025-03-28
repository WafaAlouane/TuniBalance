<<<<<<< HEAD
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
=======
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { ThemeProvider } from "@/contexts/theme-context";
import ProtectedRoute from "./routes/ProtectedRoute";

import Layout from "@/routes/layout";
import DashboardPage from "@/routes/dashboard/page";

>>>>>>> edbe1ea70015acf12bbd826e6d9117bf1c818245
import Landing from "./pages/Landing";
import Register from "./pages/Registrer";
import Login from "./pages/login";

import AdminDashboard from "./pages/admindashbord";
<<<<<<< HEAD
import  ProtectedRoute from "./routes/ProtectedRoute"
=======
>>>>>>> edbe1ea70015acf12bbd826e6d9117bf1c818245
import CreateStaff from './pages/CreateStaff';
import Profile from './pages/profile/Profile';
import InfoProfile from './pages/profile/InfoProfile'; 
import BusinessOwner from "./pages/BusinessOwner";
import ResetPassword from "./pages/ResetPassword";
import ChangePassword from "./pages/profile/ChangePassword";
<<<<<<< HEAD
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
            <Route path="reset-password" element={<ResetPassword />} />
            <Route path="change-password" element={<ChangePassword />} />

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
=======
import ViewBO from "./pages/viewBO";
import ComptDash from "./pages/comptdash";
import FinancierDash from "./pages/financierdash";
import ForgetPassword from "./pages/ForgetPassword";

const router = createBrowserRouter([
    {
        path: "/",
        element: <Layout />,
        children: [
            { index: true, element: <DashboardPage /> },
            { path: "analytics", element: <h1 className="title">Analytics</h1> },
            { path: "reports", element: <h1 className="title">Reports</h1> },
            { path: "customers", element: <h1 className="title">Customers</h1> },
            { path: "new-customer", element: <h1 className="title">New Customer</h1> },
            { path: "verified-customers", element: <h1 className="title">Verified Customers</h1> },
            { path: "products", element: <h1 className="title">Products</h1> },
            { path: "new-product", element: <h1 className="title">New Product</h1> },
            { path: "inventory", element: <h1 className="title">Inventory</h1> },
            { path: "settings", element: <h1 className="title">Settings</h1> },
        ],
    },
    { path: "/register", element: <Register /> },
    { path: "/login", element: <Login /> },
    { path: "/reset-password", element: <ResetPassword /> },
    { path: "/change-password", element: <ChangePassword /> },
    { path: "/forget-password", element: <ForgetPassword /> },

    // Routes protégées par rôle
    {
        path: "/comptable",
        element: <ProtectedRoute allowedRoles={["accountant"]} />,
        children: [
            { index: true, element: <ComptDash /> },
            { path: "profile", element: <InfoProfile /> },
            { path: "profile/edit", element: <Profile /> },
            { path: "reset-password", element: <ResetPassword /> },
            { path: "change-password", element: <ChangePassword /> },
        ],
    },
    {
        path: "/financier",
        element: <ProtectedRoute allowedRoles={["financier"]} />,
        children: [
            { index: true, element: <FinancierDash /> },
            { path: "profile", element: <InfoProfile /> },
            { path: "profile/edit", element: <Profile /> },
            { path: "reset-password", element: <ResetPassword /> },
            { path: "change-password", element: <ChangePassword /> },
        ],
    },
    {
        path: "/BusinessOwner",
        element: <ProtectedRoute allowedRoles={["business_owner"]} />,
        children: [
            { index: true, element: <BusinessOwner /> },
            { path: "create-staff", element: <CreateStaff /> },
            { path: "profile", element: <InfoProfile /> },
            { path: "profile/edit", element: <Profile /> },
            { path: "reset-password", element: <ResetPassword /> },
            { path: "change-password", element: <ChangePassword /> },
        ],
    },
    {
        path: "/AdminDashboard",
        element: <ProtectedRoute allowedRoles={["admin"]} />,
        children: [
            { index: true, element: <AdminDashboard /> },
            { path: "viewBO", element: <ViewBO /> },
        ],
    },
]);

function App() {
    return (
        <ThemeProvider storageKey="theme">
            <RouterProvider router={router} />
        </ThemeProvider>
    );
}

export default App;
>>>>>>> edbe1ea70015acf12bbd826e6d9117bf1c818245
