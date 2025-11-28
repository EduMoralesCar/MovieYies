import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import MovieGrid from '../components/MovieGrid';
import { Play, X, Check, Plus } from 'lucide-react';
import api from '../api'; // Use our backend API
import { useParams } from 'react-router-dom';
import { addToMyList, removeFromMyList, isInMyList } from '../utils/storage';

const ContentPage = ({ type = 'movie', title, initialQuery = 'popular' }) => {
    const { query } = useParams();
    const searchQuery = query || initialQuery;
    const pageTitle = title || (query ? query.charAt(0).toUpperCase() + query.slice(1) : 'Películas');

    const [peliculas, setPeliculas] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [peliculaReproduciendo, setPeliculaReproduciendo] = useState(null);
    const [mostrarModal, setMostrarModal] = useState(null);

    useEffect(() => {
        const obtenerContenido = async () => {
            setCargando(true);
            try {
                // Obtener películas de nuestro backend
                const respuesta = await api.get('movies/');
                let todasLasPeliculas = respuesta.data;

                // Filtrar basado en props/query
                if (searchQuery && searchQuery !== 'popular') {
                    const queryMinuscula = searchQuery.toLowerCase();
                    console.log("Filtrando por búsqueda:", queryMinuscula);
                    todasLasPeliculas = todasLasPeliculas.filter(m =>
                        m.titulo.toLowerCase().includes(queryMinuscula) ||
                        m.genero.toLowerCase().includes(queryMinuscula) ||
                        (m.fecha_lanzamiento && m.fecha_lanzamiento.includes(queryMinuscula))
                    );
                } else {
                    // Solo filtrar por tipo si NO se está buscando (o si la búsqueda es 'popular')
                    if (type === 'series') {
                        todasLasPeliculas = todasLasPeliculas.filter(m => m.tipo === 'series');
                    } else if (type === 'movie') {
                        todasLasPeliculas = todasLasPeliculas.filter(m => m.tipo === 'movie');
                    }
                    // Si el tipo es 'all', no filtramos por tipo
                }

                // Mezclar para variedad
                todasLasPeliculas.sort(() => 0.5 - Math.random());
                setPeliculas(todasLasPeliculas);
            } catch (error) {
                console.error("Error al obtener contenido:", error);
            } finally {
                setCargando(false);
            }
        };
        obtenerContenido();
    }, [type, searchQuery]);

    const manejarBusqueda = async (query) => {
        if (!query) return;
        setCargando(true);
        try {
            const respuesta = await api.get('movies/');
            const queryMinuscula = query.toLowerCase();
            const filtradas = respuesta.data.filter(m =>
                m.titulo.toLowerCase().includes(queryMinuscula) ||
                m.genero.toLowerCase().includes(queryMinuscula) ||
                (m.fecha_lanzamiento && m.fecha_lanzamiento.includes(queryMinuscula))
            );
            setPeliculas(filtradas);
        } catch (error) {
            console.error("Error de búsqueda:", error);
        } finally {
            setCargando(false);
        }
    };

    const manejarReproduccion = (pelicula) => {
        setPeliculaReproduciendo(pelicula);
    };

    const abrirModal = (pelicula) => {
        setMostrarModal(pelicula);
    };

    const alternarMiLista = (pelicula) => {
        if (isInMyList(pelicula.id)) {
            removeFromMyList(pelicula.id);
        } else {
            addToMyList(pelicula);
        }
        // Forzar actualización
        setPeliculas([...peliculas]);
    };

    return (
        <div className="bg-[#141414] min-h-screen text-white font-sans">
            <Navbar onSearch={manejarBusqueda} />
            <div className="pt-24 px-4 md:px-16">
                <h1 className="text-3xl font-bold mb-6">{pageTitle}</h1>
                {cargando ? (
                    <div className="flex justify-center py-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-600"></div>
                    </div>
                ) : peliculas.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 text-gray-400">
                        <p className="text-xl">No se encontraron resultados para "{searchQuery}".</p>
                    </div>
                ) : (
                    <MovieGrid
                        movies={peliculas}
                        onPlay={manejarReproduccion}
                        onInfo={abrirModal}
                    />
                )}
            </div>

            {/* Modal de Reproductor de Video */}
            {peliculaReproduciendo && (
                <div className="fixed inset-0 z-[80] bg-black flex items-center justify-center animate-fade-in">
                    <button
                        onClick={() => setPeliculaReproduciendo(null)}
                        className="absolute top-8 right-8 text-white hover:text-red-500 z-50 bg-black/50 rounded-full p-2 transition"
                    >
                        <X className="w-10 h-10" />
                    </button>
                    <div className="w-full h-full">
                        <iframe
                            src={`https://vidsrc.xyz/embed/${peliculaReproduciendo.tipo === 'series' ? 'tv' : 'movie'}?imdb=${peliculaReproduciendo.imdb_id}`}
                            title={peliculaReproduciendo.titulo}
                            className="w-full h-full"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
                            allowFullScreen
                        ></iframe>
                    </div>
                </div>
            )}

            {/* Modal de Información */}
            {mostrarModal && (
                <div className="fixed inset-0 z-[70] bg-black/80 flex items-center justify-center p-4 animate-fade-in" onClick={() => setMostrarModal(null)}>
                    <div className="bg-[#181818] w-full max-w-3xl rounded-lg overflow-hidden shadow-2xl relative" onClick={e => e.stopPropagation()}>
                        <div className="relative h-96">
                            <img
                                src={mostrarModal.poster_url?.replace('http:', 'https:')}
                                className="w-full h-full object-cover opacity-50"
                                onError={(e) => { e.target.src = `https://placehold.co/800x400/2f2f2f/FFFFFF?text=${encodeURIComponent(mostrarModal.titulo)}`; }}
                            />
                            <div className="absolute bottom-8 left-8">
                                <h2 className="text-4xl font-bold mb-4">{mostrarModal.titulo}</h2>
                                <p className="text-gray-300 line-clamp-3 max-w-xl">{mostrarModal.descripcion}</p>
                                <div className="flex gap-4 mt-4">
                                    <button
                                        onClick={() => { setMostrarModal(null); manejarReproduccion(mostrarModal); }}
                                        className="bg-white text-black px-6 py-2 rounded font-bold flex items-center gap-2 hover:bg-opacity-90"
                                    >
                                        <Play className="w-5 h-5 fill-current" /> Reproducir
                                    </button>
                                    <button
                                        onClick={() => alternarMiLista(mostrarModal)}
                                        className="border-2 border-gray-400 rounded-full p-2 hover:border-white"
                                    >
                                        {isInMyList(mostrarModal.id) ? <Check className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ContentPage;
