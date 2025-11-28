import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import MovieGrid from '../components/MovieGrid';
import { getMyList, addToMyList, removeFromMyList, isInMyList } from '../utils/storage';
import { Play, X, Check, Plus } from 'lucide-react';
import axios from 'axios';

const MyList = () => {
    const [peliculas, setPeliculas] = useState([]);
    const [peliculaReproduciendo, setPeliculaReproduciendo] = useState(null);
    const [mostrarModal, setMostrarModal] = useState(null);

    useEffect(() => {
        setPeliculas(getMyList());
    }, []);

    const actualizarLista = () => {
        setPeliculas(getMyList());
    };

    const manejarReproduccion = (pelicula) => {
        setPeliculaReproduciendo(pelicula);
    };

    const manejarInformacion = (pelicula) => {
        setMostrarModal(pelicula);
    };

    const alternarMiLista = (pelicula) => {
        if (isInMyList(pelicula.id)) {
            removeFromMyList(pelicula.id);
        } else {
            addToMyList(pelicula);
        }
        actualizarLista();
    };

    return (
        <div className="bg-[#141414] min-h-screen text-white font-sans">
            <Navbar />
            <div className="pt-24 px-4 md:px-16">
                <h1 className="text-3xl font-bold mb-6">Mi Lista</h1>
                {peliculas.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-[50vh] text-gray-500">
                        <p className="text-xl mb-4">Tu lista está vacía.</p>
                        <p>Agrega películas y series para verlas más tarde.</p>
                    </div>
                ) : (
                    <MovieGrid movies={peliculas} onPlay={manejarReproduccion} onInfo={manejarInformacion} updateListTrigger={actualizarLista} />
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
                        <div className="p-8 grid grid-cols-1 md:grid-cols-3 gap-8">
                            <div className="md:col-span-2">
                                <div className="flex items-center gap-4 mb-4 text-sm">
                                    <span className="text-green-400 font-bold">98% para ti</span>
                                    <span>{mostrarModal.fecha_lanzamiento}</span>
                                    <span className="border border-gray-500 px-1 text-xs">HD</span>
                                </div>
                                <p className="text-lg leading-relaxed text-gray-300 mb-6">{mostrarModal.descripcion}</p>
                            </div>
                            <div className="text-sm text-gray-400 space-y-2">
                                <div><span className="text-gray-500">Género:</span> {mostrarModal.genero}</div>
                                <div><span className="text-gray-500">Duración:</span> {mostrarModal.duracion_minutos} min</div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MyList;
