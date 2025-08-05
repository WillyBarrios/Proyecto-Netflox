
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import Navbar from "./components/Navbar.jsx";
import Series from "./components/Series.jsx";
import Login from "./components/Login.jsx";
import Footer from "./Footer.jsx";
import './App.css'

// Componente para la página principal (home)
function Home() {
  useEffect(() => {
    // Aplicar estilos de Netflix cuando estamos en la página principal
    document.body.style.background = '#141414';
    document.body.style.margin = '0';
    document.body.style.padding = '0';
    document.body.style.fontFamily = '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    
    return () => {
      // Limpiar estilos cuando se desmonta
      document.body.style.background = '';
      document.body.style.margin = '';
      document.body.style.padding = '';
      document.body.style.fontFamily = '';
    };
  }, []);

  return (
    <>
      <Navbar />
      <div className="netflix-clone">
        <Series />
      </div>
      <Footer />
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
