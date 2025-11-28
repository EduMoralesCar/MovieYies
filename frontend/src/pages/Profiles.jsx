import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { PlusCircle, Edit2, Trash2, Check, X } from 'lucide-react';
import api from '../api';
import { useNavigate } from 'react-router-dom';

const Profiles = () => {
    const [profiles, setProfiles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isManaging, setIsManaging] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [editingProfile, setEditingProfile] = useState(null);
    const [newProfileName, setNewProfileName] = useState('');
    const [newProfileAvatar, setNewProfileAvatar] = useState('https://upload.wikimedia.org/wikipedia/commons/0/0b/Netflix-avatar.png');
    const navigate = useNavigate();

    const avatars = [
        "https://upload.wikimedia.org/wikipedia/commons/0/0b/Netflix-avatar.png",
        "https://mir-s3-cdn-cf.behance.net/project_modules/disp/84c20033850498.56ba69ac290ea.png",
        "https://mir-s3-cdn-cf.behance.net/project_modules/disp/64623a33850498.56ba69ac2a6f7.png",
        "https://mir-s3-cdn-cf.behance.net/project_modules/disp/1bdc9a33850498.56ba69ac2ba5b.png",
        "https://mir-s3-cdn-cf.behance.net/project_modules/disp/bb3a8833850498.56ba69ac33f26.png",
        "https://mir-s3-cdn-cf.behance.net/project_modules/disp/bf6e4a33850498.56ba69ac3064f.png"
    ];

    useEffect(() => {
        fetchProfiles();
    }, []);

    const fetchProfiles = async () => {
        try {
            const response = await api.get('profiles/');
            setProfiles(response.data);
        } catch (error) {
            console.error("Error fetching profiles:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleProfileClick = (profile) => {
        if (isManaging) {
            setEditingProfile(profile);
            setNewProfileName(profile.nombre);
            setNewProfileAvatar(profile.avatar);
            setShowModal(true);
        } else {
            localStorage.setItem('currentProfile', JSON.stringify(profile));
            navigate('/');
        }
    };

    const handleSaveProfile = async () => {
        if (!newProfileName.trim()) return;

        try {
            if (editingProfile) {
                await api.patch(`profiles/${editingProfile.id}/`, {
                    nombre: newProfileName,
                    avatar: newProfileAvatar
                });
            } else {
                await api.post('profiles/', {
                    nombre: newProfileName,
                    avatar: newProfileAvatar,
                    es_nino: false
                });
            }
            setShowModal(false);
            setEditingProfile(null);
            setNewProfileName('');
            setNewProfileAvatar(avatars[0]);
            fetchProfiles();
        } catch (error) {
            console.error("Error saving profile:", error);
            alert("Error al guardar el perfil");
        }
    };

    const handleDeleteProfile = async () => {
        if (!editingProfile) return;
        if (window.confirm(`¿Seguro que quieres eliminar el perfil de ${editingProfile.nombre}?`)) {
            try {
                await api.delete(`profiles/${editingProfile.id}/`);
                setShowModal(false);
                setEditingProfile(null);
                fetchProfiles();
            } catch (error) {
                console.error("Error deleting profile:", error);
            }
        }
    };

    if (loading) return <div className="min-h-screen bg-[#141414] text-white flex items-center justify-center">Cargando...</div>;

    return (
        <div className="min-h-screen bg-[#141414] text-white flex flex-col items-center justify-center font-sans">
            <h1 className="text-3xl md:text-5xl font-normal mb-8">¿Quién está viendo ahora?</h1>

            <div className="flex flex-wrap justify-center gap-4 md:gap-8 mb-12">
                {profiles.map(profile => (
                    <div
                        key={profile.id}
                        className="group flex flex-col items-center cursor-pointer w-24 md:w-32"
                        onClick={() => handleProfileClick(profile)}
                    >
                        <div className="relative w-24 h-24 md:w-32 md:h-32 rounded overflow-hidden border-2 border-transparent group-hover:border-white transition mb-2">
                            <img src={profile.avatar} alt={profile.nombre} className="w-full h-full object-cover" />
                            {isManaging && (
                                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                                    <Edit2 className="w-8 h-8 text-white" />
                                </div>
                            )}
                        </div>
                        <span className="text-gray-400 group-hover:text-white text-center text-sm md:text-lg truncate w-full">
                            {profile.nombre}
                        </span>
                    </div>
                ))}

                {profiles.length < 5 && (
                    <div
                        className="group flex flex-col items-center cursor-pointer w-24 md:w-32"
                        onClick={() => {
                            setEditingProfile(null);
                            setNewProfileName('');
                            setNewProfileAvatar(avatars[0]);
                            setShowModal(true);
                        }}
                    >
                        <div className="w-24 h-24 md:w-32 md:h-32 rounded flex items-center justify-center bg-transparent border-2 border-transparent group-hover:bg-white transition mb-2">
                            <PlusCircle className="w-12 h-12 text-gray-400 group-hover:text-black" />
                        </div>
                        <span className="text-gray-400 group-hover:text-white text-center text-sm md:text-lg">
                            Agregar perfil
                        </span>
                    </div>
                )}
            </div>

            <button
                onClick={() => setIsManaging(!isManaging)}
                className="border border-gray-400 text-gray-400 px-6 py-2 uppercase tracking-widest hover:border-white hover:text-white transition"
            >
                {isManaging ? 'Listo' : 'Administrar perfiles'}
            </button>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
                    <div className="bg-[#141414] p-8 max-w-2xl w-full border border-[#333]">
                        <h2 className="text-3xl mb-2 border-b border-[#333] pb-2">
                            {editingProfile ? 'Editar perfil' : 'Agregar perfil'}
                        </h2>

                        <div className="flex flex-col md:flex-row gap-6 py-6">
                            <div className="flex-shrink-0">
                                <img src={newProfileAvatar} alt="Avatar" className="w-32 h-32 rounded" />
                            </div>
                            <div className="flex-grow">
                                <input
                                    type="text"
                                    value={newProfileName}
                                    onChange={(e) => setNewProfileName(e.target.value)}
                                    placeholder="Nombre"
                                    className="w-full bg-[#333] text-white p-2 px-4 text-lg focus:outline-none focus:bg-[#444] mb-4"
                                />

                                <h3 className="text-gray-400 mb-2 text-sm uppercase">Elige un avatar:</h3>
                                <div className="grid grid-cols-4 gap-2 mb-4">
                                    {avatars.map((av, index) => (
                                        <img
                                            key={index}
                                            src={av}
                                            alt={`Avatar ${index}`}
                                            className={`w-12 h-12 rounded cursor-pointer hover:scale-110 transition ${newProfileAvatar === av ? 'border-2 border-white' : ''}`}
                                            onClick={() => setNewProfileAvatar(av)}
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-4 pt-4 border-t border-[#333]">
                            <button
                                onClick={handleSaveProfile}
                                className="bg-white text-black px-6 py-2 font-bold hover:bg-[#c00] hover:text-white transition"
                            >
                                Guardar
                            </button>
                            <button
                                onClick={() => setShowModal(false)}
                                className="border border-gray-400 text-gray-400 px-6 py-2 hover:border-white hover:text-white transition"
                            >
                                Cancelar
                            </button>
                            {editingProfile && (
                                <button
                                    onClick={handleDeleteProfile}
                                    className="ml-auto border border-gray-400 text-gray-400 px-6 py-2 hover:border-red-600 hover:text-red-600 transition"
                                >
                                    Eliminar perfil
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Profiles;
