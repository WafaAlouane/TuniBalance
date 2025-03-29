import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { ThemeProvider } from "@/contexts/theme-context";
import ProtectedRoute from "./routes/ProtectedRoute";

import Layout from "@/routes/layout";
import DashboardPage from "@/routes/dashboard/page";
import Layoutcomptable from "@/routes/layoutcomptable";
import Landing from "./pages/Landing";
import Register from "./pages/Registrer";
import Login from "./pages/login";

import AdminDashboard from "./pages/admindashbord";
import CreateStaff from './pages/CreateStaff';
import Profile from './pages/profile/Profile';
import InfoProfile from './pages/profile/InfoProfile'; 
import BusinessOwner from "./pages/BusinessOwner";
import ResetPassword from "./pages/ResetPassword";
import ChangePassword from "./pages/profile/ChangePassword";
import ViewBO from "./pages/viewBO";
import ComptDash from "./pages/comptdash";
import FinancierDash from "./pages/financierdash";
import ForgetPassword from "./pages/ForgetPassword";
import AffTransaction from './pages/Transaction/Afftransaction'; // Importer la page AffTransaction




const router = createBrowserRouter([
    {
        path: "/dashboard",
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
    {
      path: "/",
      element: <Landing />,
  },
  {
      path: "/register",
      element: <Register />,
  },
  {
      path: "/login",
      element: <Login />,
  },
  {
      path: "/reset-password",
      element: <ResetPassword />,
  },
  {
      path: "/change-password",
      element: <ChangePassword />,
  },
  {
      path: "/forget-password",
      element: <ForgetPassword />,
  },
  
 
  {
      path: "/comptable",
      element: <ProtectedRoute allowedRoles={["accountant"]}><Layout  /></ProtectedRoute>,
    
      children: [
        { index: true, element: <Layoutcomptable /> },
        { path: "analytics", element: <Addfacture />  },
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

  
  {
      path: "/financier",
      element: <ProtectedRoute allowedRoles={["financier"]}><Layout /></ProtectedRoute>,
      children: [
        { index: true, element: <Layout /> },
        { path: "analytics", element: <div><h1 className="title">Analytics</h1><CreateStaff /></div> },
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

 
  {
      path: "/BusinessOwner",
      element: <ProtectedRoute allowedRoles={["business_owner"]}><BusinessOwner /></ProtectedRoute>,
      children: [
          { index: true, element: <BusinessOwner /> },
          { path: "create-staff", element: <CreateStaff /> },
          { path: "profile/edit", element: <Profile /> },
          { path: "profile", element: <InfoProfile /> },
          { path: "reset-password", element: <ResetPassword /> },
          { path: "change-password", element: <ChangePassword /> },
          { path: "forget-password", element: <ForgetPassword /> },
          
      ],
  },

 
  {
      path: "/AdminDashboard",
      element: <ProtectedRoute allowedRoles={["admin"]}><AdminDashboard /></ProtectedRoute>,
      children: [
          { index: true, element: <ViewBO /> },
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
