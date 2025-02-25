import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing";
import Register from "./pages/Registrer";
import Login from "./pages/Login";

function App() {
  return (
<<<<<<< HEAD
    <>
    
       </>
  )
=======
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </Router>
  );
>>>>>>> e681b1ea36c8077828f9e10ec5aa3c314bce72f4
}

export default App;
