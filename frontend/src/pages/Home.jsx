import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import MovieGrid from '../components/MovieGrid';
import api from '../api';
import { Play, X, Plus, ThumbsUp, Volume2, VolumeX, Info, Check } from 'lucide-react';
import { addToMyList, removeFromMyList, isInMyList } from '../utils/storage';

const Home = () => {
    const [peliculas, setPeliculas] = useState([]);
    const [peliculaDestacada, setPeliculaDestacada] = useState(null);
    const [peliculaSeleccionada, setPeliculaSeleccionada] = useState(null);
    const [estaReproduciendo, setEstaReproduciendo] = useState(false);
    const [estaSilenciado, setEstaSilenciado] = useState(true);

    useEffect(() => {
        const obtenerPeliculas = async () => {
            try {
                const respuesta = await api.get('movies/');
                console.log("Películas obtenidas:", respuesta.data);
                // Mezclar películas para asegurar variedad
                const peliculasMezcladas = respuesta.data.sort(() => 0.5 - Math.random());
                setPeliculas(peliculasMezcladas);
                if (peliculasMezcladas.length > 0) {
                    setPeliculaDestacada(peliculasMezcladas[0]);
                }
            } catch (error) {
                console.error("Error al obtener películas:", error);
            }
        };
        obtenerPeliculas();
    }, []);

    const manejarReproduccion = (pelicula) => {
        if (pelicula) {
            setPeliculaDestacada(pelicula);
        }
        setEstaReproduciendo(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const manejarInformacion = (pelicula) => {
        setPeliculaSeleccionada(pelicula);
    };

    const manejarCierreModal = () => {
        setPeliculaSeleccionada(null);
        setEstaReproduciendo(false);
    };

    const alternarMiLista = (pelicula) => {
        if (isInMyList(pelicula.id)) {
            removeFromMyList(pelicula.id);
        } else {
            addToMyList(pelicula);
        }
        // Forzar re-renderizado para actualizar UI
        setPeliculas([...peliculas]);
    };

    return (
        <div className="bg-[#141414] min-h-screen text-white font-sans">
            <Navbar />

            {/* Sección Principal */}
            {peliculaDestacada && (
                <div className="relative h-[80vh] w-full">
                    <div className="absolute inset-0">
                        {estaReproduciendo ? (
                            <iframe
                                src={`https://vidsrc.xyz/embed/${peliculaDestacada.tipo === 'series' ? 'tv' : 'movie'}?imdb=${peliculaDestacada.imdb_id}`}
                                className="w-full h-full object-cover"
                                allow="autoplay; encrypted-media; fullscreen"
                                title={peliculaDestacada.titulo}
                            ></iframe>
                        ) : (
                            <img
                                src={peliculaDestacada.poster_url?.replace('http:', 'https:')}
                                alt={peliculaDestacada.titulo}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                    e.target.src = `https://placehold.co/1920x1080/141414/FFFFFF?text=${encodeURIComponent(peliculaDestacada.titulo)}`;
                                }}
                            />
                        )}
                        <div className="absolute inset-0 bg-gradient-to-r from-[#141414] via-transparent to-transparent"></div>
                        <div className="absolute inset-0 bg-gradient-to-t from-[#141414] via-transparent to-transparent"></div>
                    </div>

                    <div className="absolute bottom-[30%] left-4 md:left-12 max-w-xl">
                        <h1 className="text-5xl md:text-7xl font-bold mb-4 drop-shadow-lg">{peliculaDestacada.titulo}</h1>
                        <p className="text-lg mb-6 drop-shadow-md line-clamp-3">{peliculaDestacada.descripcion}</p>
                        <div className="flex gap-4">
                            <button
                                onClick={() => setEstaReproduciendo(!estaReproduciendo)}
                                className="bg-white text-black px-8 py-3 rounded font-bold flex items-center gap-2 hover:bg-opacity-90 transition"
                            >
                                <Play className="w-6 h-6 fill-current" />
                                {estaReproduciendo ? 'Pausar' : 'Reproducir'}
                            </button>
                            <button
                                onClick={() => manejarInformacion(peliculaDestacada)}
                                className="bg-[rgba(109,109,110,0.7)] text-white px-8 py-3 rounded font-bold flex items-center gap-2 hover:bg-[rgba(109,109,110,0.4)] transition"
                            >
                                <Info className="w-6 h-6" />
                                Más información
                            </button>
                        </div>
                    </div>

                    <button
                        onClick={() => setEstaSilenciado(!estaSilenciado)}
                        className="absolute bottom-[35%] right-12 border border-white rounded-full p-2 hover:bg-white/20 transition"
                    >
                        {estaSilenciado ? <VolumeX className="w-6 h-6" /> : <Volume2 className="w-6 h-6" />}
                    </button>
                </div>
            )}

            {/* Filas de Contenido */}
            <div className="px-4 md:px-12 pb-12 -mt-32 relative z-10">
                <MovieGrid title="Tendencias" movies={peliculas.slice(0, 6)} onPlay={manejarReproduccion} onInfo={manejarInformacion} />

                <MovieGrid title="Nuevos lanzamientos" movies={peliculas.filter(m => new Date(m.fecha_lanzamiento).getFullYear() >= 2023).slice(0, 12)} onPlay={manejarReproduccion} onInfo={manejarInformacion} />
                <MovieGrid title="Populares" movies={peliculas.slice(6, 18)} onPlay={manejarReproduccion} onInfo={manejarInformacion} />
                <MovieGrid title="Acción y Aventuras" movies={peliculas.filter(m => m.genero === 'ACCION').slice(0, 12)} onPlay={manejarReproduccion} onInfo={manejarInformacion} />
                <MovieGrid title="Ciencia Ficción" movies={peliculas.filter(m => m.genero === 'CIENCIA_FICCION').slice(0, 12)} onPlay={manejarReproduccion} onInfo={manejarInformacion} />
            </div>

            {/* Modal de Información */}
            {peliculaSeleccionada && (
                <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 overflow-y-auto" onClick={manejarCierreModal}>
                    <div className="bg-[#181818] w-full max-w-4xl rounded-lg overflow-hidden relative shadow-2xl" onClick={e => e.stopPropagation()}>
                        <button onClick={manejarCierreModal} className="absolute top-4 right-4 z-10 bg-[#181818] rounded-full p-2 hover:bg-[#333]">
                            <X className="w-6 h-6" />
                        </button>

                        <div className="relative h-[400px]">
                            <iframe
                                src={`https://vidsrc.xyz/embed/${peliculaSeleccionada.tipo === 'series' ? 'tv' : 'movie'}?imdb=${peliculaSeleccionada.imdb_id}`}
                                className="w-full h-full object-cover"
                                allow="autoplay; encrypted-media; fullscreen"
                                title={peliculaSeleccionada.titulo}
                            ></iframe>
                        </div>

                        <div className="p-8 grid grid-cols-1 md:grid-cols-3 gap-8">
                            <div className="md:col-span-2">
                                <div className="flex items-center gap-4 mb-4 text-sm">
                                    <span className="text-green-400 font-bold">98% para ti</span>
                                    <span>{peliculaSeleccionada.fecha_lanzamiento}</span>
                                    <span className="border border-gray-500 px-1 text-xs">HD</span>
                                </div>
                                <div className="flex gap-4 mb-6">
                                    <button
                                        onClick={() => alternarMiLista(peliculaSeleccionada)}
                                        className="flex items-center gap-2 border border-gray-400 px-4 py-1 rounded hover:border-white transition"
                                    >
                                        {isInMyList(peliculaSeleccionada.id) ? (
                                            <>
                                                <Check className="w-5 h-5" /> En mi lista
                                            </>
                                        ) : (
                                            <>
                                                <Plus className="w-5 h-5" /> Mi lista
                                            </>
                                        )}
                                    </button>
                                </div>
                                <p className="text-lg leading-relaxed text-gray-300 mb-6">{peliculaSeleccionada.descripcion}</p>
                            </div>
                            <div className="text-sm text-gray-400 space-y-2">
                                <div><span className="text-gray-500">Género:</span> {peliculaSeleccionada.genero}</div>
                                <div><span className="text-gray-500">Duración:</span> {peliculaSeleccionada.duracion_minutos} min</div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Home;
