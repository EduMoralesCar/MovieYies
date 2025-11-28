import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import { ArrowRight } from 'lucide-react';
import api from '../api';
import { useNavigate } from 'react-router-dom';

const TransferProfile = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleTransfer = async () => {
        if (!email || !password) {
            alert('Por favor completa todos los campos');
            return;
        }

        if (!window.confirm('¿Estás seguro? Al transferir el perfil se cerrará tu sesión y deberás ingresar con los nuevos datos.')) {
            return;
        }

        setLoading(true);
        try {
            const user = JSON.parse(localStorage.getItem('user'));
            await api.patch(`users/${user.id}/`, { email, password });

            alert('Transferencia exitosa. Por favor inicia sesión con los nuevos datos.');
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            navigate('/login');
        } catch (error) {
            console.error(error);
            alert('Error al transferir el perfil. Intenta nuevamente.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-[#f3f3f3] min-h-screen font-sans text-[#333]">
            <Navbar />
            <div className="pt-32 px-4 max-w-2xl mx-auto text-center">
                <div className="w-20 h-20 bg-gray-300 rounded-full mx-auto mb-6 flex items-center justify-center">
                    <ArrowRight className="w-10 h-10 text-gray-600" />
                </div>
                <h1 className="text-3xl md:text-4xl font-bold mb-4">Transferir Perfil</h1>
                <p className="text-lg text-gray-600 mb-8">
                    Copia tu historial, recomendaciones y configuración a una cuenta nueva.
                </p>

                <div className="bg-white p-8 rounded shadow-md text-left">
                    <h2 className="font-bold text-xl mb-6">Ingresa los datos de la nueva cuenta</h2>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                            <input
                                type="email"
                                className="w-full border p-3 rounded focus:outline-none focus:border-black"
                                placeholder="nuevo@email.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Contraseña</label>
                            <input
                                type="password"
                                className="w-full border p-3 rounded focus:outline-none focus:border-black"
                                placeholder="********"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                        <button
                            onClick={handleTransfer}
                            disabled={loading}
                            className="w-full bg-[#E50914] text-white font-bold py-3 rounded mt-4 hover:bg-[#f6121d] transition disabled:opacity-50"
                        >
                            {loading ? 'Procesando...' : 'Iniciar Transferencia'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TransferProfile;
