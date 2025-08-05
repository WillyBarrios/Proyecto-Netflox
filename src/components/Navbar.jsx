import { useState } from "react";
import netflixLogo from "../assets/netflix.svg";
import { FaSearch, FaUserAstronaut, FaTimes } from "react-icons/fa";

// *Navbar items array  de objetos con texto y enlace
const itemsnav = [
  { text: "Incio", href: "#" },
  { text: "Peliculas", href: "#about" },
  { text: "Series", href: "#contact" },
];
// *Navbar componente
function Navbar() {
  // *Estados para controlar la visibilidad de los elementos
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  // *Estado para el input de búsqueda
  const [query, setQuery] = useState("");

  // --- Lógica y estado de la búsqueda ---
  const [isLoading, setIsLoading] = useState(false);
  const API_KEY = "AIzaSyAKon6-P8tnSxgKgP-Bxxk7wUuN0KEqbx4"

  // *Función para alternar la visibilidad de la barra de búsqueda
  const toggleSearch = () => {
    setIsSearchVisible(!isSearchVisible);
  };

  // *Función para manejar la búsqueda
  const handleSearch = async (e) => {
    e.preventDefault(); // Evita que la página se recargue
    if (!query.trim()) return;

    setIsLoading(true);
    try {
      const response = await fetch(
        `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${query.trim()}&key=${API_KEY}&maxResults=20&type=video`
      );
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error.message || "Error al buscar videos");
      }
      const data = await response.json();
      console.log("Búsqueda realizada con éxito:", query.trim());
      console.log("Resultados encontrados:", data.items?.length || 0);

      // Emitir evento personalizado para que Series.jsx pueda escucharlo
      const searchEvent = new CustomEvent('navbarSearch', {
        detail: { query: query.trim(), results: data.items }
      });
      window.dispatchEvent(searchEvent);

    } catch (err) {
      console.error("Error en la búsqueda:", err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Ya no necesitamos el efecto para controlar el scroll del body

  return (
    <>
      {/* Barra de navegación simplificada con fondo negro sólido */}
      <nav className="w-full h-16 flex justify-between items-center bg-black text-white fixed top-0 left-0 right-0 z-50 px-4 md:px-12">
        {/* Lado izquierdo: Logo y enlaces de navegación */}
        <div className="flex items-center">
          <a href="#" className="flex items-center mr-20">
            <img className="h-8" src={netflixLogo} alt="Netflix Logo" />
          </a>
          <ul className="flex text-sm font-medium">
            {itemsnav.map((item) => (
              <li key={item.text} className="mx-8">
                <a className="hover:text-gray-300 transition-colors duration-200" href={item.href}>
                  {item.text}
                </a>
              </li>
            ))}
          </ul>
        </div>
        <div className="md:hidden">
          <a href="#"><img className="h-12" src={netflixLogo} alt="Netflix Logo" /></a>
        </div>
        {/* Lado derecho: Iconos de búsqueda y usuario */}
        <div className="flex items-center space-x-4">
          {isSearchVisible ? (
            <form
              onSubmit={handleSearch}
              className="flex items-center bg-black/60 border border-gray-600 rounded-sm"
            >
              <input
                type="text"
                placeholder="Títulos, personas, géneros"
                className="bg-transparent text-white px-4 py-2 text-sm focus:outline-none w-64"
                autoFocus
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
              <button
                type="submit"
                aria-label="Buscar"
                className="p-2 hover:text-gray-300"
              >
                <FaSearch size={16} />
              </button>
              <button
                type="button"
                onClick={toggleSearch}
                aria-label="Cerrar búsqueda"
                className="p-2 hover:text-gray-300"
              >
                <FaTimes size={16} />
              </button>
            </form>
          ) : (
            <button
              onClick={toggleSearch}
              aria-label="Abrir búsqueda"
              className="p-2 hover:text-gray-300 transition-colors duration-200"
            >
              <FaSearch size={18} />
            </button>
          )}
          <button
            aria-label="Perfil de usuario"
            className="p-1 hover:text-gray-300 transition-colors duration-200"
          >
            <FaUserAstronaut size={24} />
          </button>
        </div>
      </nav>
      {/* El navbar ahora solo contiene la barra de navegación, sin menú móvil ni contenido principal */}
    </>
  );
}

export default Navbar;
