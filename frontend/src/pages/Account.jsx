import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { CreditCard, X } from 'lucide-react';
import api from '../api';

const Account = () => {
    const [user, setUser] = useState(null);
    const [subscription, setSubscription] = useState(null);
    const [loading, setLoading] = useState(true);

    // Edit States
    const [editingPhone, setEditingPhone] = useState(false);
    const [newPhone, setNewPhone] = useState('');

    // Modal States
    const [showPlanModal, setShowPlanModal] = useState(false);
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [newCard, setNewCard] = useState('');

    useEffect(() => {
        fetchAccountData();
    }, []);

    const fetchAccountData = async () => {
        try {
            const userResponse = await api.get('users/me/');
            setUser(userResponse.data);
            setNewPhone(userResponse.data.telefono || '');

            const subResponse = await api.get('subscriptions/me/');
            setSubscription(subResponse.data);
        } catch (error) {
            console.error("Error fetching account data:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdatePhone = async () => {
        try {
            await api.patch(`users/${user.id}/`, { telefono: newPhone });
            setEditingPhone(false);
            fetchAccountData();
            alert('Número de teléfono actualizado');
        } catch (error) {
            console.error("Error updating phone:", error);
            alert('Error al actualizar el teléfono');
        }
    };

    const handleUpdatePlan = async (newPlan) => {
        try {
            await api.patch('subscriptions/me/', { plan: newPlan });
            setShowPlanModal(false);
            fetchAccountData();
            alert('Plan actualizado correctamente');
        } catch (error) {
            console.error("Error updating plan:", error);
            alert('Error al actualizar el plan');
        }
    };

    const handleUpdatePayment = async () => {
        if (newCard.length < 4) return alert('Ingresa un número válido');
        try {
            const last4 = newCard.slice(-4);
            await api.patch('subscriptions/me/', { metodo_pago: `Visa terminada en ${last4}` });
            setShowPaymentModal(false);
            setNewCard('');
            fetchAccountData();
            alert('Método de pago actualizado');
        } catch (error) {
            console.error("Error updating payment:", error);
            alert('Error al actualizar el método de pago');
        }
    };

    const handleCancelMembership = async () => {
        if (window.confirm('¿Estás seguro de que quieres cancelar tu membresía? Perderás acceso al contenido.')) {
            try {
                await api.patch('subscriptions/me/', { esta_activo: false });
                alert('Tu membresía ha sido cancelada.');
                // Opcional: Cerrar sesión o redirigir
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                window.location.href = '/login';
            } catch (error) {
                console.error("Error cancelling membership:", error);
                alert('Error al cancelar la membresía');
            }
        }
    };

    if (loading) return <div className="min-h-screen bg-[#f3f3f3] flex items-center justify-center">Cargando...</div>;

    return (
        <div className="bg-[#f3f3f3] min-h-screen font-sans text-[#333]">
            <Navbar />
            <div className="pt-24 px-4 md:px-0 max-w-4xl mx-auto">
                <h1 className="text-3xl md:text-4xl font-normal mb-8 border-b border-[#999] pb-4">Cuenta</h1>

                <div className="flex flex-col md:flex-row gap-4 mb-8">
                    <div className="md:w-1/4">
                        <h2 className="text-[#737373] uppercase font-medium text-lg">Membresía y facturación</h2>
                        {subscription?.esta_activo ? (
                            <button onClick={handleCancelMembership} className="bg-[#e5e5e5] px-4 py-2 mt-4 shadow text-sm font-medium hover:bg-[#d5d5d5] transition w-full md:w-auto">
                                Cancelar membresía
                            </button>
                        ) : (
                            <div className="mt-4 text-red-600 font-bold">Membresía Cancelada</div>
                        )}
                    </div>
                    <div className="md:w-3/4">
                        <div className="flex justify-between items-center mb-2 font-bold">
                            <span>{user?.email}</span>
                            <a href="/transfer-profile" className="text-[#0073e6] hover:underline text-sm font-normal">Cambiar email</a>
                        </div>
                        <div className="flex justify-between items-center mb-2 text-[#737373]">
                            <span>Contraseña: ********</span>
                            <a href="/transfer-profile" className="text-[#0073e6] hover:underline text-sm font-normal">Cambiar contraseña</a>
                        </div>
                        <div className="flex justify-between items-center mb-4 text-[#737373]">
                            {editingPhone ? (
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        value={newPhone}
                                        onChange={(e) => setNewPhone(e.target.value)}
                                        className="border p-1 rounded"
                                        placeholder="Nuevo número"
                                    />
                                    <button onClick={handleUpdatePhone} className="text-green-600 font-bold">Guardar</button>
                                    <button onClick={() => setEditingPhone(false)} className="text-red-600">Cancelar</button>
                                </div>
                            ) : (
                                <span>Teléfono: {user?.telefono || 'No registrado'}</span>
                            )}
                            {!editingPhone && (
                                <button onClick={() => setEditingPhone(true)} className="text-[#0073e6] hover:underline text-sm font-normal">Cambiar número</button>
                            )}
                        </div>

                        <div className="border-t border-[#ccc] py-4">
                            <div className="flex items-center gap-2 font-bold mb-2">
                                <CreditCard className="w-5 h-5" />
                                <span>{subscription?.metodo_pago}</span>
                                <button onClick={() => setShowPaymentModal(true)} className="text-[#0073e6] hover:underline text-sm font-normal ml-auto">Actualizar información de pago</button>
                            </div>
                            <div className="text-sm text-[#737373]">
                                Tu próxima fecha de facturación es el {subscription?.fecha_fin || 'Próximamente'}.
                            </div>
                        </div>

                        <div className="border-t border-[#ccc] py-4 flex justify-end">
                            <a href="#" className="text-[#0073e6] hover:underline text-sm font-normal">Información de facturación</a>
                        </div>
                    </div>
                </div>

                <div className="border-t border-[#999] pt-8 flex flex-col md:flex-row gap-4 mb-8">
                    <div className="md:w-1/4">
                        <h2 className="text-[#737373] uppercase font-medium text-lg">Información del plan</h2>
                    </div>
                    <div className="md:w-3/4 flex justify-between items-center">
                        <div className="font-bold flex items-center gap-2">
                            <span>{subscription?.plan}</span>
                            <span className="bg-black text-white text-xs px-1 rounded font-bold">HD</span>
                        </div>
                        <button onClick={() => setShowPlanModal(true)} className="text-[#0073e6] hover:underline text-sm font-normal">Cambiar plan</button>
                    </div>
                </div>

                <div className="border-t border-[#999] pt-8 flex flex-col md:flex-row gap-4 mb-20">
                    <div className="md:w-1/4">
                        <h2 className="text-[#737373] uppercase font-medium text-lg">Configuración</h2>
                    </div>
                    <div className="md:w-3/4 space-y-3">
                        <div className="text-[#0073e6] hover:underline cursor-pointer" onClick={() => alert('Función de Control Parental próximamente')}>Control parental</div>
                        <div className="text-[#0073e6] hover:underline cursor-pointer" onClick={() => alert('Configuración de reproducción próximamente')}>Configuración de reproducción</div>
                        <div className="text-[#0073e6] hover:underline cursor-pointer" onClick={() => alert('Configuración de subtítulos próximamente')}>Subtítulos</div>
                        <div className="text-[#0073e6] hover:underline cursor-pointer" onClick={() => alert('Gestión de dispositivos próximamente')}>Activar dispositivos</div>
                        <div className="text-[#0073e6] hover:underline cursor-pointer" onClick={() => alert('Descarga de datos próximamente')}>Descargar mis datos personales</div>
                    </div>
                </div>

                {/* Payment Modal */}
                {showPaymentModal && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
                        <div className="bg-white p-6 rounded shadow-xl max-w-md w-full relative">
                            <button onClick={() => setShowPaymentModal(false)} className="absolute top-4 right-4"><X /></button>
                            <h2 className="text-xl font-bold mb-4">Actualizar Pago</h2>
                            <input
                                type="text"
                                placeholder="Número de tarjeta"
                                className="w-full border p-2 rounded mb-4"
                                value={newCard}
                                onChange={(e) => setNewCard(e.target.value)}
                            />
                            <button onClick={handleUpdatePayment} className="bg-[#E50914] text-white px-4 py-2 rounded font-bold w-full">Guardar</button>
                        </div>
                    </div>
                )}

                {/* Plan Modal */}
                {showPlanModal && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
                        <div className="bg-white p-6 rounded shadow-xl max-w-md w-full relative">
                            <button onClick={() => setShowPlanModal(false)} className="absolute top-4 right-4"><X /></button>
                            <h2 className="text-xl font-bold mb-4">Cambiar Plan</h2>
                            <div className="space-y-2">
                                {['BASICO', 'ESTANDAR', 'PREMIUM'].map((plan) => (
                                    <button
                                        key={plan}
                                        onClick={() => handleUpdatePlan(plan)}
                                        className={`w-full p-3 border rounded text-left hover:bg-gray-100 ${subscription?.plan === plan ? 'border-[#E50914] bg-red-50' : ''}`}
                                    >
                                        {plan}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Account;
