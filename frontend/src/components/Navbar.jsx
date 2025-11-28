import React, { useState } from 'react';
import { Search, Bell, ChevronDown, Menu, X } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api';

const Navbar = ({ onSearch }) => {
    const [estaDesplazado, setEstaDesplazado] = useState(false);
    const [menuMovilAbierto, setMenuMovilAbierto] = useState(false);
    const [mostrarBusqueda, setMostrarBusqueda] = useState(false);
    const [consultaBusqueda, setConsultaBusqueda] = useState('');
    const navegar = useNavigate();
    const usuario = JSON.parse(localStorage.getItem('user'));

    window.onscroll = () => {
        setEstaDesplazado(window.pageYOffset !== 0);
        return () => (window.onscroll = null);
    };

    const manejarCierreSesion = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navegar('/login');
    };

    const manejarEnvioBusqueda = (e) => {
        e.preventDefault();
        if (consultaBusqueda) {
            navegar(`/category/${consultaBusqueda}`);
            setMostrarBusqueda(false);
            setConsultaBusqueda('');
        }
    };

    return (
        <nav className={`fixed top-0 w-full z-50 transition-colors duration-300 ${estaDesplazado ? 'bg-[#141414]' : 'bg-gradient-to-b from-black/80 to-transparent'}`}>
            <div className="px-4 md:px-16 py-4 flex items-center justify-between">
                <div className="flex items-center gap-8">
                    <Link to="/">
                        <h1 className="text-[#E50914] text-2xl md:text-3xl font-bold tracking-tighter uppercase cursor-pointer">MovieYies</h1>
                    </Link>

                    {/* Menú de Escritorio */}
                    <div className="hidden md:flex gap-6 text-sm text-gray-200">
                        <Link to="/" className="hover:text-gray-400 transition font-medium">Inicio</Link>
                        <Link to="/series" className="hover:text-gray-400 transition">Series</Link>
                        <Link to="/movies" className="hover:text-gray-400 transition">Películas</Link>
                        <Link to="/new" className="hover:text-gray-400 transition">Novedades populares</Link>
                        <Link to="/list" className="hover:text-gray-400 transition">Mi lista</Link>
                    </div>
                </div>

                <div className="flex items-center gap-6 text-white">
                    {/* Barra de Búsqueda */}
                    <div className={`flex items-center border border-white/0 ${mostrarBusqueda ? 'border-white/100 bg-black/80' : ''} transition-all duration-300 p-1`}>
                        <Search
                            className="w-6 h-6 cursor-pointer"
                            onClick={() => setMostrarBusqueda(!mostrarBusqueda)}
                        />
                        <form onSubmit={manejarEnvioBusqueda}>
                            <input
                                type="text"
                                placeholder="Títulos, personas, géneros"
                                className={`bg-transparent text-sm text-white outline-none ml-2 transition-all duration-300 ${mostrarBusqueda ? 'w-48 md:w-64 opacity-100' : 'w-0 opacity-0'}`}
                                value={consultaBusqueda}
                                onChange={(e) => setConsultaBusqueda(e.target.value)}
                            />
                        </form>
                    </div>

                    <span className="hidden md:block text-sm">Niños</span>
                    <div className="group relative">
                        <Bell className="w-6 h-6 cursor-pointer hover:text-gray-300 transition" />
                        <div className="absolute top-full right-0 mt-2 w-64 bg-black/90 border border-gray-700 rounded shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 p-4">
                            <p className="text-sm text-gray-400 text-center">No hay notificaciones recientes</p>
                        </div>
                    </div>

                    <div className="group relative flex items-center gap-2 cursor-pointer">
                        <img
                            src="https://upload.wikimedia.org/wikipedia/commons/0/0b/Netflix-avatar.png"
                            alt="Profile"
                            className="w-8 h-8 rounded"
                        />
                        <ChevronDown className="w-4 h-4 transition-transform group-hover:rotate-180" />

                        {/* Menú Desplegable */}
                        <div className="absolute top-full right-0 mt-2 w-56 bg-black/90 border border-gray-700 rounded shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                            <div className="py-2 flex flex-col gap-2">
                                <Link to="/profiles" className="px-4 py-2 text-sm text-gray-300 hover:text-white hover:underline cursor-pointer flex items-center gap-2">
                                    <img src="https://upload.wikimedia.org/wikipedia/commons/0/0b/Netflix-avatar.png" className="w-6 h-6 rounded" />
                                    Administrar perfiles
                                </Link>
                                <Link to="/transfer-profile" className="px-4 py-2 text-sm text-gray-300 hover:text-white hover:underline cursor-pointer">Transferir perfil</Link>
                                <Link to="/account" className="px-4 py-2 text-sm text-gray-300 hover:text-white hover:underline cursor-pointer">Cuenta</Link>
                                <Link to="/help" className="px-4 py-2 text-sm text-gray-300 hover:text-white hover:underline cursor-pointer">Centro de ayuda</Link>
                                <div className="border-t border-gray-700 my-1"></div>
                                {usuario?.rol === 'admin' && (
                                    <Link to="/admin" className="px-4 py-2 text-sm hover:underline text-center text-white">Panel Admin</Link>
                                )}
                                <button onClick={manejarCierreSesion} className="px-4 py-2 text-sm hover:underline text-center w-full text-white">
                                    Cerrar sesión
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
