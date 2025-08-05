import { useState, useEffect } from "react";
import netflixLogo from "../assets/netflix.svg";
import { FaSearch, FaUserAstronaut, FaTimes, FaBars } from "react-icons/fa";

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
  // *Estado para controlar el estado del menú
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  // *Estado para el input de búsqueda
  const [query, setQuery] = useState("");

  // --- Lógica y estado de la búsqueda ---
  const [isLoading, setIsLoading] = useState(false);
  const API_KEY = "AIzaSyAKon6-P8tnSxgKgP-Bxxk7wUuN0KEqbx4"

  // *Función para alternar la visibilidad de la barra de búsqueda
  const toggleSearch = () => {
    setIsSearchVisible(!isSearchVisible);
  };

  // *Función para alternar el estado del menú
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
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

  // *Efecto para evitar el scroll del body cuando el menú está abierto
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    // *Función de limpieza para reestablecer el scroll si el componente se desmonta
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMenuOpen]); // Se ejecuta cada vez que isMenuOpen cambia

  return (
    <>
      {/* La barra de navegación ahora es 'fixed' para que se quede fija en la parte superior. */}
      <nav className="m-2 p-2 flex justify-between items-center bg-black text-white rounded-3xl fixed top-0 inset-x-0 z-40">
        {/* Lado izquierdo: Hamburguesa en móvil, Logo y links en desktop */}
        <div className="flex items-center space-x-5">
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              aria-label="Abrir menú"
              className="p-2"
            >
              <FaBars size={20} />
            </button>
          </div>
          <div className="hidden md:flex items-center space-x-5">
            <a href="#">
              <img className="h-12" src={netflixLogo} alt="Netflix Logo" />
            </a>
            <ul className="flex space-x-4 ">
              {itemsnav.map((item) => (
                <li key={item.text}>
                  <a className="hover:text-gray-300" href={item.href}>
                    {item.text}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Logo Centrado (solo visible en móvil) */}
        <div className="md:hidden">
          <a href="#">
            <img className="h-12" src={netflixLogo} alt="Netflix Logo" />
          </a>
        </div>

        {/* Lado derecho: Iconos de búsqueda y usuario (siempre visibles) */}
        <div className="flex items-center space-x-5">
          {isSearchVisible ? (
            <form
              onSubmit={handleSearch}
              className="flex items-center bg-gray-800 rounded-md"
            >
              <input
                type="text"
                placeholder="Buscar..."
                className="bg-transparent text-white px-3 py-1 rounded-md focus:outline-none"
                autoFocus
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
              <button
                type="submit"
                aria-label="Buscar"
                className="p-2 hover:text-gray-300"
              >
                <FaSearch size={20} />
              </button>
              <button
                type="button"
                onClick={toggleSearch}
                aria-label="Cerrar búsqueda"
                className="p-2 hover:text-gray-300"
              >
                <FaTimes size={20} />
              </button>
            </form>
          ) : (
            <button
              onClick={toggleSearch}
              aria-label="Abrir búsqueda"
              className="p-2 hover:text-gray-300"
            >
              <FaSearch size={20} />
            </button>
          )}
          {/*Icono usuario (siempre visible)*/}
          <button
            aria-label="Perfil de usuario"
            className="p-2 hover:text-gray-300"
          >
            <FaUserAstronaut size={20} />
          </button>
        </div>
      </nav>
      {/* --- Panel del Menú Móvil --- */}
      {isMenuOpen && (
        <div className="md:hidden fixed top-0 left-0 w-full h-screen bg-black/95 flex flex-col items-center justify-center text-white z-50">
          <button
            onClick={toggleMenu}
            className="absolute top-6 right-7"
            aria-label="Cerrar menú"
          >
            <FaTimes size={24} />
          </button>
          <ul className="flex flex-col items-center space-y-8">
            {itemsnav.map((item) => (
              <li key={item.text}>
                <a
                  href={item.href}
                  className="text-3xl hover:text-gray-300"
                  onClick={toggleMenu}
                >
                  {item.text}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* --- Contenido Principal --- */}
      <main className="pt-24">
        {" "}
        {/* Padding superior para que el contenido no quede debajo de la nav */}
        {isLoading && (
          <div className="text-black text-center pt-12 text-2xl">
            Buscando...
          </div>
        )}
        {!isLoading && (
          <div className="text-black text-center pt-12 text-2xl">
            Busca tus películas y series favoritas...
          </div>
        )}
      </main>
    </>
  );
}

export default Navbar;
