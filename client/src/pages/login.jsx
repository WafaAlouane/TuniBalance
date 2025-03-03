import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {AdminDashboard} from "./admindashbord";
export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = () => {
    // Simuler un compte admin
    if (email === "admin@example.com" && password === "admin123") {
      localStorage.setItem("user", JSON.stringify({ role: "admin" }));
      navigate("/AdminDashboard"); // Redirige vers le Dashboard Admin
    } else {
      alert("Identifiants incorrects !");
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="p-6 bg-white rounded shadow-md">
        <h2 className="text-lg font-bold mb-4">Connexion</h2>
        <input
          type="email"
          placeholder="Email"
          className="border p-2 w-full mb-2"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Mot de passe"
          className="border p-2 w-full mb-2"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button className="bg-blue-500 text-white p-2 w-full" onClick={handleLogin}>
          Se connecter
        </button>
      </div>
    </div>
  );
}
