import { useState, useEffect } from 'react';
import netflixLogo from '../assets/netflix.svg';
import { FaSearch, FaUserAstronaut, FaTimes, FaBars } from 'react-icons/fa';

// Navbar items arry  de objetos con texto y enlace
const itemsnav = [
    { text: 'Incio', href: '#' },
    { text: 'Peliculas', href: '#about' },
    { text: 'Series', href: '#contact' }
];
// Navbar component
function Navbar() {
    // Estados para controlar la visibilidad de los elementos
    const [isSearchVisible, setIsSearchVisible] = useState(false);
    // Estado para controlar el estado del menú
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    // Función para alternar la visibilidad de la barra de búsqueda
    const toggleSearch = () => {
        setIsSearchVisible(!isSearchVisible);
    };

    // Función para alternar el estado del menú
    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    }

    // Efecto para evitar el scroll del body cuando el menú está abierto
    useEffect(() => {
        if (isMenuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }

        // Función de limpieza para reestablecer el scroll si el componente se desmonta
        return () => { document.body.style.overflow = 'unset' };
    }, [isMenuOpen]); // Se ejecuta cada vez que isMenuOpen cambia

    return (
        <>
        {/* Opción recomendada: La barra ocupa casi todo el ancho, manteniendo un margen. */}
        <nav className="m-2 p-2 flex justify-between items-center bg-black text-white rounded-3xl absolute top-0 inset-x-0 z-40">
            {/* Lado izquierdo: Hamburguesa en móvil, Logo y links en desktop */}
            <div className="flex items-center space-x-5">
                <div className="md:hidden">
                    <button onClick={toggleMenu} aria-label="Abrir menú" className="p-2">
                        <FaBars size={20} />
                    </button>
                </div>
                <div className="hidden md:flex items-center space-x-5">
                    <a href="#"><img className="h-12" src={netflixLogo} alt="Netflix Logo" /></a>
                    <ul className="flex space-x-4 ">
                        {itemsnav.map((item) => (
                            <li key={item.text}><a  className="hover:text-gray-300" href={item.href}>{item.text}</a></li>
                        ))}
                    </ul>
                </div>
            </div>

            {/* Logo Centrado (solo visible en móvil) */}
            <div className="md:hidden">
                <a href="#"><img className="h-12" src={netflixLogo} alt="Netflix Logo" /></a>
            </div>

            {/* Lado derecho: Iconos de búsqueda y usuario (siempre visibles) */}
            <div className="flex items-center space-x-5">
                {isSearchVisible ? (
                    <div className="flex items-center bg-gray-800 rounded-md">
                        <input type="text" placeholder="Buscar..." className="bg-transparent text-white px-3 py-1 rounded-md focus:outline-none" autoFocus />
                        <button onClick={toggleSearch} aria-label="Cerrar búsqueda" className="p-2 hover:text-gray-300">
                            <FaTimes size={20} />
                        </button>
                    </div>
                ) : (
                    <button onClick={toggleSearch} aria-label="Abrir búsqueda" className="p-2 hover:text-gray-300">
                        <FaSearch size={20} />
                    </button>
                )}
                {/*Icono usuario (siempre visible)*/}
                <button aria-label="Perfil de usuario" className="p-2 hover:text-gray-300"><FaUserAstronaut size={20} /></button>
            </div>
        </nav>
        {/* --- Panel del Menú Móvil --- */}
        {isMenuOpen && (
            <div className="md:hidden absolute top-0 left-0 w-full h-screen bg-black/95 flex flex-col items-center justify-center text-white z-50">
                <button onClick={toggleMenu} className="absolute top-6 right-7" aria-label="Cerrar menú">
                    <FaTimes size={24} />
                </button>
                <ul className="flex flex-col items-center space-y-8">
                    {itemsnav.map((item) => (
                        <li key={item.text}><a href={item.href} className="text-3xl hover:text-gray-300" onClick={toggleMenu}>{item.text}</a></li>
                    ))}
                </ul>
            </div>
        )}
        </>
    )
}


export default Navbar;