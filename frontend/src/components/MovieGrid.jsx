import React, { useState } from 'react';
import { Play, Plus, ThumbsUp, ChevronDown, Check, Info } from 'lucide-react';
import { addToMyList, removeFromMyList, isInMyList } from '../utils/storage';

const MovieGrid = ({ title, movies, onPlay, onInfo, updateListTrigger }) => {
    const [erroresImagen, setErroresImagen] = useState({});
    const [actualizacionLocal, setActualizacionLocal] = useState(0);

    const manejarAlternarLista = (e, pelicula) => {
        e.stopPropagation();
        if (isInMyList(pelicula.id)) {
            removeFromMyList(pelicula.id);
        } else {
            addToMyList(pelicula);
        }
        setActualizacionLocal(prev => prev + 1);
        if (updateListTrigger) updateListTrigger();
    };

    if (!movies || movies.length === 0) return null;

    // Filtrar películas con poster N/A
    const peliculasValidas = movies.filter(movie =>
        movie.poster_url &&
        movie.poster_url !== "N/A" &&
        !erroresImagen[movie.id]
    );

    if (peliculasValidas.length === 0) return null;

    return (
        <div className="mb-8">
            <h2 className="text-xl md:text-2xl font-bold mb-4 hover:text-[#54b9c5] cursor-pointer transition inline-block">
                {title} <span className="text-sm text-[#54b9c5] opacity-0 hover:opacity-100 transition ml-2">Explorar todo &gt;</span>
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2">
                {peliculasValidas.map((movie) => (
                    <div
                        key={movie.id}
                        className="relative group aspect-[2/3] bg-[#2f2f2f] rounded overflow-hidden transition-all duration-300 hover:scale-110 hover:z-50 hover:shadow-xl cursor-pointer"
                        onClick={() => onInfo && onInfo(movie)}
                    >
                        <img
                            src={movie.poster_url?.replace('http:', 'https:')}
                            alt={movie.titulo}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                                setErroresImagen(prev => ({ ...prev, [movie.id]: true }));
                            }}
                        />

                        {/* Superposición al pasar el mouse */}
                        <div className="absolute inset-0 bg-[#141414] opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-3">
                            <div className="flex justify-between items-center">
                                <div className="flex gap-2">
                                    <button
                                        onClick={(e) => { e.stopPropagation(); onPlay && onPlay(movie); }}
                                        className="bg-white rounded-full p-1 hover:bg-gray-200 text-black"
                                    >
                                        <Play className="w-4 h-4 fill-current" />
                                    </button>
                                    <button
                                        onClick={(e) => manejarAlternarLista(e, movie)}
                                        className="border-2 border-gray-400 rounded-full p-1 hover:border-white text-white"
                                    >
                                        {isInMyList(movie.id) ? (
                                            <Check className="w-4 h-4 text-green-500" />
                                        ) : (
                                            <Plus className="w-4 h-4" />
                                        )}
                                    </button>
                                    <button className="border-2 border-gray-400 rounded-full p-1 hover:border-white text-white" onClick={(e) => { e.stopPropagation(); alert('Gracias por tu calificación!'); }}><ThumbsUp className="w-4 h-4" /></button>
                                </div>
                                <button
                                    onClick={(e) => { e.stopPropagation(); onInfo && onInfo(movie); }}
                                    className="border-2 border-gray-400 rounded-full p-1 hover:border-white text-white ml-auto"
                                >
                                    <ChevronDown className="w-4 h-4" />
                                </button>
                            </div>

                            <div>
                                <h3 className="font-bold text-sm mb-1">{movie.titulo}</h3>
                                <div className="flex items-center gap-2 text-xs text-green-400 font-bold">
                                    <span>98% para ti</span>
                                    <span className="border border-gray-500 px-1 text-white">16+</span>
                                    <span className="text-white">{movie.duracion_minutos} min</span>
                                </div>
                                <div className="flex gap-2 text-xs text-white mt-1">
                                    <span>{movie.genero}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default MovieGrid;
