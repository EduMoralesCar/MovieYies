import React, { useEffect, useState } from 'react';
import Navbar from '../../components/Navbar';
import api from '../../api';
import { Users, CreditCard, Film, Activity, Plus, Edit, Trash2, X, CheckCircle, AlertCircle } from 'lucide-react';

const Dashboard = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [movies, setMovies] = useState([]);
    const [filteredMovies, setFilteredMovies] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [editingMovie, setEditingMovie] = useState(null);
    const [formData, setFormData] = useState({
        titulo: '',
        descripcion: '',
        fecha_lanzamiento: '',
        genero: 'ACCION',
        tipo: 'movie',
        poster_url: '',
        backdrop_url: '',
        imdb_id: '',
        duracion_minutos: ''
    });
    const [toast, setToast] = useState(null); // { message, type: 'success' | 'error' }

    useEffect(() => {
        if (toast) {
            const timer = setTimeout(() => setToast(null), 3000);
            return () => clearTimeout(timer);
        }
    }, [toast]);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [statsRes, moviesRes] = await Promise.all([
                api.get('admin-dashboard/stats/'),
                api.get('movies/')
            ]);
            setStats(statsRes.data);
            // Ordenar por ID descendente para ver las nuevas primero
            const sortedMovies = moviesRes.data.sort((a, b) => b.id - a.id);
            setMovies(sortedMovies);
            setFilteredMovies(sortedMovies);
        } catch (error) {
            console.error("Error fetching data:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSearch = (e) => {
        const term = e.target.value.toLowerCase();
        setSearchTerm(term);
        const filtered = movies.filter(movie =>
            movie.titulo.toLowerCase().includes(term) ||
            movie.genero.toLowerCase().includes(term)
        );
        setFilteredMovies(filtered);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingMovie) {
                const res = await api.patch(`movies/${editingMovie.id}/`, formData);
                const updatedMovie = res.data;

                setMovies(prev => prev.map(m => m.id === updatedMovie.id ? updatedMovie : m));
                setFilteredMovies(prev => prev.map(m => m.id === updatedMovie.id ? updatedMovie : m));

                setToast({ message: '¡Película actualizada correctamente!', type: 'success' });
            } else {
                const res = await api.post('movies/', formData);
                const newMovie = res.data;

                setMovies(prev => [newMovie, ...prev]);
                setFilteredMovies(prev => [newMovie, ...prev]);
                setSearchTerm('');

                setToast({ message: '¡Película creada exitosamente!', type: 'success' });
            }
            await fetchData();
            setShowModal(false);
            setEditingMovie(null);
            setFormData({
                titulo: '', descripcion: '', fecha_lanzamiento: '', genero: 'ACCION',
                tipo: 'movie', poster_url: '', backdrop_url: '', imdb_id: '', duracion_minutos: ''
            });
        } catch (error) {
            console.error("Error saving movie:", error);
            setToast({ message: 'Error al guardar la película.', type: 'error' });
        }
    };

    const handleEdit = (movie) => {
        setEditingMovie(movie);
        setFormData(movie);
        setShowModal(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm('¿Estás seguro de eliminar esta película?')) {
            try {
                await api.delete(`movies/${id}/`);

                setMovies(prev => prev.filter(m => m.id !== id));
                setFilteredMovies(prev => prev.filter(m => m.id !== id));

                setToast({ message: 'Película eliminada correctamente.', type: 'success' });
            } catch (error) {
                console.error("Error deleting movie:", error);
                setToast({ message: 'Error al eliminar la película.', type: 'error' });
            }
        }
    };

    if (loading) return <div className="min-h-screen bg-[#141414] text-white flex items-center justify-center">Cargando...</div>;

    return (
        <div className="min-h-screen bg-[#141414] text-white font-sans">
            <Navbar />
            <div className="pt-24 px-4 md:px-12">
                <h1 className="text-3xl font-bold mb-8">Panel de Administración</h1>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                    <div className="bg-[#1f1f1f] p-6 rounded-lg flex items-center gap-4">
                        <div className="bg-blue-600 p-4 rounded-full">
                            <Users className="w-8 h-8 text-white" />
                        </div>
                        <div>
                            <p className="text-gray-400">Total Usuarios</p>
                            <p className="text-3xl font-bold">{stats?.total_users}</p>
                        </div>
                    </div>

                    <div className="bg-[#1f1f1f] p-6 rounded-lg flex items-center gap-4">
                        <div className="bg-green-600 p-4 rounded-full">
                            <CreditCard className="w-8 h-8 text-white" />
                        </div>
                        <div>
                            <p className="text-gray-400">Suscripciones Activas</p>
                            <p className="text-3xl font-bold">{stats?.active_subscriptions}</p>
                        </div>
                    </div>

                    <div className="bg-[#1f1f1f] p-6 rounded-lg flex items-center gap-4">
                        <div className="bg-red-600 p-4 rounded-full">
                            <Activity className="w-8 h-8 text-white" />
                        </div>
                        <div>
                            <p className="text-gray-400">Canceladas</p>
                            <p className="text-3xl font-bold">{stats?.cancelled_subscriptions}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-[#1f1f1f] p-6 rounded-lg">
                    <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
                        <h2 className="text-xl font-bold flex items-center gap-2">
                            <Film className="w-6 h-6 text-red-600" />
                            Gestión de Películas ({filteredMovies.length})
                        </h2>

                        <div className="flex gap-4 w-full md:w-auto">
                            <input
                                type="text"
                                placeholder="Buscar película..."
                                value={searchTerm}
                                onChange={handleSearch}
                                className="bg-[#2f2f2f] text-white px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-red-600 w-full md:w-64"
                            />
                            <button
                                onClick={() => {
                                    setEditingMovie(null);
                                    setFormData({
                                        titulo: '', descripcion: '', fecha_lanzamiento: '', genero: 'ACCION',
                                        tipo: 'movie', poster_url: '', backdrop_url: '', imdb_id: '', duracion_minutos: ''
                                    });
                                    setShowModal(true);
                                }}
                                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded flex items-center gap-2 whitespace-nowrap"
                            >
                                <Plus className="w-4 h-4" /> Nueva Película
                            </button>
                        </div>
                    </div>

                    <div className="overflow-x-auto max-h-[600px] overflow-y-auto">
                        <table className="w-full text-left">
                            <thead className="sticky top-0 bg-[#1f1f1f]">
                                <tr className="border-b border-gray-700 text-gray-400">
                                    <th className="pb-4">Título</th>
                                    <th className="pb-4">Género</th>
                                    <th className="pb-4">Tipo</th>
                                    <th className="pb-4">Año</th>
                                    <th className="pb-4 text-right">Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredMovies.map((movie) => (
                                    <tr key={movie.id} className="border-b border-gray-800 hover:bg-[#2a2a2a]">
                                        <td className="py-4 font-medium">{movie.titulo}</td>
                                        <td className="py-4 text-sm text-gray-400">{movie.genero}</td>
                                        <td className="py-4">
                                            <span className={`px-2 py-1 rounded text-xs ${movie.tipo === 'movie' ? 'bg-blue-900 text-blue-200' : 'bg-purple-900 text-purple-200'}`}>
                                                {movie.tipo === 'movie' ? 'Película' : 'Serie'}
                                            </span>
                                        </td>
                                        <td className="py-4 text-gray-400">{movie.fecha_lanzamiento?.split('-')[0]}</td>
                                        <td className="py-4 text-right">
                                            <div className="flex justify-end gap-2">
                                                <button onClick={() => handleEdit(movie)} className="p-2 hover:bg-gray-700 rounded text-blue-400">
                                                    <Edit className="w-4 h-4" />
                                                </button>
                                                <button onClick={() => handleDelete(movie.id)} className="p-2 hover:bg-gray-700 rounded text-red-500">
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Modal de Crear/Editar */}
                {showModal && (
                    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
                        <div className="bg-[#1f1f1f] w-full max-w-2xl rounded-lg p-6 relative max-h-[90vh] overflow-y-auto">
                            <button
                                onClick={() => setShowModal(false)}
                                className="absolute top-4 right-4 text-gray-400 hover:text-white"
                            >
                                <X className="w-6 h-6" />
                            </button>

                            <h2 className="text-2xl font-bold mb-6">
                                {editingMovie ? 'Editar Contenido' : 'Nuevo Contenido'}
                            </h2>

                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm text-gray-400 mb-1">Título</label>
                                        <input
                                            type="text"
                                            name="titulo"
                                            value={formData.titulo}
                                            onChange={handleInputChange}
                                            className="w-full bg-[#2f2f2f] rounded p-2 text-white focus:outline-none focus:ring-2 focus:ring-red-600"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm text-gray-400 mb-1">IMDb ID (para video)</label>
                                        <input
                                            type="text"
                                            name="imdb_id"
                                            value={formData.imdb_id}
                                            onChange={handleInputChange}
                                            className="w-full bg-[#2f2f2f] rounded p-2 text-white focus:outline-none focus:ring-2 focus:ring-red-600"
                                            placeholder="ej. tt1375666"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm text-gray-400 mb-1">Descripción</label>
                                    <textarea
                                        name="descripcion"
                                        value={formData.descripcion}
                                        onChange={handleInputChange}
                                        className="w-full bg-[#2f2f2f] rounded p-2 text-white focus:outline-none focus:ring-2 focus:ring-red-600 h-24"
                                        required
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm text-gray-400 mb-1">Fecha Lanzamiento</label>
                                        <input
                                            type="date"
                                            name="fecha_lanzamiento"
                                            value={formData.fecha_lanzamiento}
                                            onChange={handleInputChange}
                                            className="w-full bg-[#2f2f2f] rounded p-2 text-white focus:outline-none focus:ring-2 focus:ring-red-600"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm text-gray-400 mb-1">Duración (min)</label>
                                        <input
                                            type="number"
                                            name="duracion_minutos"
                                            value={formData.duracion_minutos}
                                            onChange={handleInputChange}
                                            className="w-full bg-[#2f2f2f] rounded p-2 text-white focus:outline-none focus:ring-2 focus:ring-red-600"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm text-gray-400 mb-1">Género</label>
                                        <select
                                            name="genero"
                                            value={formData.genero}
                                            onChange={handleInputChange}
                                            className="w-full bg-[#2f2f2f] rounded p-2 text-white focus:outline-none focus:ring-2 focus:ring-red-600"
                                        >
                                            <option value="ACCION">Acción</option>
                                            <option value="COMEDIA">Comedia</option>
                                            <option value="DRAMA">Drama</option>
                                            <option value="TERROR">Terror</option>
                                            <option value="CIENCIA_FICCION">Ciencia Ficción</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm text-gray-400 mb-1">Tipo</label>
                                        <select
                                            name="tipo"
                                            value={formData.tipo}
                                            onChange={handleInputChange}
                                            className="w-full bg-[#2f2f2f] rounded p-2 text-white focus:outline-none focus:ring-2 focus:ring-red-600"
                                        >
                                            <option value="movie">Película</option>
                                            <option value="series">Serie</option>
                                        </select>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm text-gray-400 mb-1">URL Poster</label>
                                    <input
                                        type="url"
                                        name="poster_url"
                                        value={formData.poster_url}
                                        onChange={handleInputChange}
                                        className="w-full bg-[#2f2f2f] rounded p-2 text-white focus:outline-none focus:ring-2 focus:ring-red-600"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm text-gray-400 mb-1">URL Fondo (Backdrop)</label>
                                    <input
                                        type="url"
                                        name="backdrop_url"
                                        value={formData.backdrop_url}
                                        onChange={handleInputChange}
                                        className="w-full bg-[#2f2f2f] rounded p-2 text-white focus:outline-none focus:ring-2 focus:ring-red-600"
                                    />
                                </div>

                                <button
                                    type="submit"
                                    className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded mt-4 transition"
                                >
                                    {editingMovie ? 'Guardar Cambios' : 'Crear Contenido'}
                                </button>
                            </form>
                        </div>
                    </div>
                )}
                {/* Toast Notification */}
                {toast && (
                    <div className={`fixed bottom-8 right-8 px-6 py-4 rounded shadow-2xl flex items-center gap-3 animate-fade-in z-[100] ${toast.type === 'success' ? 'bg-green-600' : 'bg-red-600'}`}>
                        {toast.type === 'success' ? <CheckCircle className="w-6 h-6" /> : <AlertCircle className="w-6 h-6" />}
                        <span className="font-bold">{toast.message}</span>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Dashboard;
