
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from "./components/Navbar.jsx";
import Series from "./components/Series.jsx";
import Login from "./components/Login.jsx";
import './App.css'

// Componente para la página principal (home)
function Home() {
  return (
    <>
      <Navbar />
      <div className="netflix-clone">
        <Series />
      </div>
    </>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        {/* Ruta por defecto - Login */}
        <Route path="/" element={<Login />} />
        {/* Ruta para la página principal después del login */}
        <Route path="/home" element={<Home />} />
        {/* Redireccionar cualquier ruta no encontrada al login */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
