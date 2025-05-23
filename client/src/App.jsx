import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { ThemeProvider } from "@/contexts/theme-context";
import ProtectedRoute from "./routes/ProtectedRoute";
import Statistiques from "./pages/Stat"

import Layout from "@/routes/layout";
import DashboardPage from "@/routes/dashboard/page";
import Layoutfinancier from "@/routes/layoutfinancier";

import Landing from "./pages/Landing";
import Register from "./pages/Registrer";
import Login from "./pages/login";

import AdminDashboard from "./pages/admindashbord";
import CreateStaff from './pages/CreateStaff';
import Profile from './pages/profile/Profile';
import ProfileInfo from './pages/profile/ProfileInfo';
import BusinessOwner from "./pages/BusinessOwner";
import ResetPassword from "./pages/ResetPassword";
import ChangePassword from "./pages/profile/ChangePassword";
import ViewBO from "./pages/viewBO";

import ForgetPassword from "./pages/ForgetPassword";
import AffTransaction from './pages/Transaction/Afftransaction'; // Importer la page AffTransaction

import Notifications from "@/pages/friends/Notifications"
import SendFriendRequest from "@/pages/friends/SendFriendRequest"
import UserSearch from "@/pages/friends/UserSearch"
import FriendRequestList from "./pages/friends/FriendRequestList"

import LayoutFacture from "./routes/layoutFacture"
import PrivateMessageChat from "./pages/privatemessages/PrivateMessageChat"
import BusinessCalendarDark from './pages/BusinessCalendarDark';
import AppointmentForm from './pages/AppointmentForm';



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
    path: "/friend-requests",
    element: <FriendRequestList />,
  },

  {
    path: "/private-chat/:userId",
    element: <PrivateMessageChat />,
  },
  {
    path: "/send-friend-request",
    element: <SendFriendRequest />,
  },

  {
      path: "/financier",
      element: <ProtectedRoute allowedRoles={["financier"]}><Layout  /></ProtectedRoute>,

      children: [

        { index: true, element: <Layoutfinancier /> },
        { path: "analytics", element: <h1 className="title">Analytics</h1> },
        { path: "reports", element: <LayoutFacture /> }, // Link to LayoutFacture

        { path: "customers", element: <h1 className="title">Customers</h1> },
        { path: "new-customer", element: <h1 className="title">New Customer</h1> },
        { path: "verified-customers", element: <h1 className="title">Verified Customers</h1> },
        { path: "products", element: <h1 className="title">Products</h1> },
        { path: "new-product", element: <h1 className="title">New Product</h1> },
        { path: "inventory", element: <h1 className="title">Inventory</h1> },
        { path: "settings", element: <h1 className="title">Settings</h1> },
        { path: "friend-requests", element: <FriendRequestList /> },
        { path: "send-friend-request", element: <SendFriendRequest /> },
        { path: "notifications", element: <Notifications /> },
        { path: "user-search", element: <UserSearch /> },
        { path: "calendar", element: <BusinessCalendarDark /> },
        { path: "appointment", element: <AppointmentForm /> },


    ],
  },


  {
      path: "/comptable",
      element: <ProtectedRoute allowedRoles={["accountant"]}><Layout /></ProtectedRoute>,
      children: [
        { index: true, element: <Layout /> },

        { path: "analytics", element: <h1 className="title">Analytics</h1> },
        { path: "reports", element: <LayoutFacture /> },

        { path: "customers", element: <h1 className="title">Customers</h1> },
        { path: "new-customer", element: <h1 className="title">New Customer</h1> },
        { path: "verified-customers", element: <h1 className="title">Verified Customers</h1> },
        { path: "products", element: <h1 className="title">Products</h1> },
        { path: "new-product", element: <h1 className="title">New Product</h1> },
        { path: "inventory", element: <h1 className="title">Inventory</h1> },
        { path: "settings", element: <h1 className="title">Settings</h1> },
        { path: "friend-requests", element: <FriendRequestList /> },
      { path: "send-friend-request", element: <SendFriendRequest /> },
      { path: "notifications", element: <Notifications /> },
      { path: "user-search", element: <UserSearch /> },
      { path: "calendar", element: <BusinessCalendarDark /> },
      { path: "appointment", element: <AppointmentForm /> },
    ],
  },


  {
      path: "/BusinessOwner",
      element: <ProtectedRoute allowedRoles={["business_owner"]}><BusinessOwner /></ProtectedRoute>,
      children: [
          { index: true, element: <BusinessOwner /> },
          { path: "create-staff", element: <CreateStaff /> },
          { path: "profile/edit", element: <Profile /> },
          { path: "profile", element: <ProfileInfo /> },
          { path: "reset-password", element: <ResetPassword /> },
          { path: "change-password", element: <ChangePassword /> },
          { path: "forget-password", element: <ForgetPassword /> },
          { path: "transactions", element: <AffTransaction /> },
          { path: "friend-requests", element: <FriendRequestList /> },
          { path: "send-friend-request", element: <SendFriendRequest /> },
          { path: "notifications", element: <Notifications /> },
          { path: "user-search", element: <UserSearch /> },
          { path: "stat", element: <Statistiques /> },
          { path: "calendar", element: <BusinessCalendarDark /> },
          { path: "appointment", element: <AppointmentForm /> },

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
