import React, { useState, useEffect } from 'react';
import api from '../../api';
import { Trash2, Plus } from 'lucide-react';

const ManageMovies = () => {
    const [movies, setMovies] = useState([]);
    const [newMovie, setNewMovie] = useState({ title: '', description: '', genre: 'ACTION', video_url: '', poster_url: '' });
    const [showForm, setShowForm] = useState(false);

    useEffect(() => {
        fetchMovies();
    }, []);

    const fetchMovies = async () => {
        try {
            const res = await api.get('movies/');
            setMovies(res.data);
        } catch (error) {
            console.error("Error fetching movies", error);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this movie?")) {
            try {
                await api.delete(`movies/${id}/`);
                setMovies(movies.filter(m => m.id !== id));
            } catch (error) {
                console.error("Error deleting movie", error);
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await api.post('movies/', { ...newMovie, release_date: '2024-01-01' }); // Default date for now
            setMovies([...movies, res.data]);
            setShowForm(false);
            setNewMovie({ title: '', description: '', genre: 'ACTION', video_url: '', poster_url: '' });
        } catch (error) {
            console.error("Error creating movie", error);
        }
    };

    return (
        <div className="p-8 bg-black min-h-screen text-white pt-24">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold">Manage Movies</h1>
                <button
                    onClick={() => setShowForm(!showForm)}
                    className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded flex items-center gap-2 transition"
                >
                    <Plus className="w-5 h-5" /> Add Movie
                </button>
            </div>

            {showForm && (
                <div className="bg-[#1f1f1f] p-6 rounded-lg mb-8 animate-fade-in">
                    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input className="bg-[#333] p-3 rounded text-white" placeholder="Title" value={newMovie.title} onChange={e => setNewMovie({ ...newMovie, title: e.target.value })} required />
                        <select className="bg-[#333] p-3 rounded text-white" value={newMovie.genre} onChange={e => setNewMovie({ ...newMovie, genre: e.target.value })}>
                            <option value="ACTION">Action</option>
                            <option value="COMEDY">Comedy</option>
                            <option value="DRAMA">Drama</option>
                            <option value="SCI_FI">Sci-Fi</option>
                        </select>
                        <input className="bg-[#333] p-3 rounded text-white" placeholder="Poster URL" value={newMovie.poster_url} onChange={e => setNewMovie({ ...newMovie, poster_url: e.target.value })} required />
                        <input className="bg-[#333] p-3 rounded text-white" placeholder="Video URL (YouTube Embed)" value={newMovie.video_url} onChange={e => setNewMovie({ ...newMovie, video_url: e.target.value })} required />
                        <textarea className="bg-[#333] p-3 rounded text-white md:col-span-2" placeholder="Description" value={newMovie.description} onChange={e => setNewMovie({ ...newMovie, description: e.target.value })} required />
                        <button type="submit" className="bg-green-600 hover:bg-green-700 p-3 rounded text-white font-bold md:col-span-2">Save Movie</button>
                    </form>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {movies.map(movie => (
                    <div key={movie.id} className="bg-[#1f1f1f] rounded-lg overflow-hidden flex">
                        <img src={movie.poster_url} alt={movie.title} className="w-24 h-36 object-cover" />
                        <div className="p-4 flex-1 flex flex-col justify-between">
                            <div>
                                <h3 className="font-bold text-lg">{movie.title}</h3>
                                <p className="text-gray-400 text-sm">{movie.genre}</p>
                            </div>
                            <button
                                onClick={() => handleDelete(movie.id)}
                                className="self-end text-red-500 hover:text-red-400 transition"
                            >
                                <Trash2 className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ManageMovies;
