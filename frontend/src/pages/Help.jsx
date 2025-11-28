import React from 'react';
import Navbar from '../components/Navbar';
import { Search, MessageCircle, Phone } from 'lucide-react';

const Help = () => {
    return (
        <div className="bg-white min-h-screen font-sans text-[#333]">
            <Navbar />

            {/* Hero Search */}
            <div className="bg-black text-white pt-32 pb-16 text-center px-4">
                <h1 className="text-3xl md:text-5xl font-bold mb-8">¿Cómo podemos ayudarte?</h1>
                <div className="max-w-2xl mx-auto relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Escribe tu problema..."
                        className="w-full py-4 pl-12 pr-4 rounded text-black focus:outline-none focus:ring-2 focus:ring-red-600"
                    />
                </div>
            </div>

            <div className="max-w-4xl mx-auto py-12 px-4">
                <h2 className="text-xl font-bold mb-6">Temas populares</h2>
                <div className="grid md:grid-cols-3 gap-6 mb-12">
                    <div className="p-4 border rounded hover:bg-gray-50 cursor-pointer">
                        <h3 className="text-[#0073e6] font-medium mb-2">Cómo restablecer tu contraseña</h3>
                        <p className="text-sm text-gray-600">Pasos para recuperar el acceso a tu cuenta si olvidaste tu clave.</p>
                    </div>
                    <div className="p-4 border rounded hover:bg-gray-50 cursor-pointer">
                        <h3 className="text-[#0073e6] font-medium mb-2">Cómo cancelar tu cuenta</h3>
                        <p className="text-sm text-gray-600">Información sobre cómo dar de baja tu suscripción en cualquier momento.</p>
                    </div>
                    <div className="p-4 border rounded hover:bg-gray-50 cursor-pointer">
                        <h3 className="text-[#0073e6] font-medium mb-2">Problemas de reproducción</h3>
                        <p className="text-sm text-gray-600">Soluciones comunes cuando el video se congela o no carga.</p>
                    </div>
                </div>

                <div className="flex flex-col md:flex-row gap-8 items-center justify-center border-t pt-12">
                    <button className="flex items-center gap-2 bg-black text-white px-6 py-3 rounded font-bold hover:bg-gray-800 transition">
                        <MessageCircle /> Chat en vivo
                    </button>
                    <button className="flex items-center gap-2 bg-black text-white px-6 py-3 rounded font-bold hover:bg-gray-800 transition">
                        <Phone /> Llámanos
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Help;
