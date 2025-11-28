import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api';

// Reusable Floating Label Input Component
const Input = ({ type, label, value, onChange }) => (
    <div className="relative group">
        <input
            type={type}
            className="floating-input w-full pt-6 pb-2 px-4 rounded bg-[#333] text-white focus:outline-none focus:bg-[#454545] border-b-2 border-transparent focus:border-[#e50914] transition-all peer placeholder-transparent"
            placeholder={label}
            value={value}
            onChange={onChange}
            required
        />
        <label className="absolute left-4 top-4 text-[#8c8c8c] text-base transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-focus:top-1 peer-focus:text-xs peer-focus:text-[#b3b3b3] pointer-events-none">
            {label}
        </label>
    </div>
);

export const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await api.post('users/login/', { email: email.trim(), password });
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('user', JSON.stringify(response.data.user));
            navigate('/');
        } catch (err) {
            console.error(err);
            setError('Invalid credentials or server error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen relative flex items-center justify-center overflow-hidden">
            <div className="absolute inset-0 z-0">
                <img
                    src="https://assets.nflxext.com/ffe/siteui/vlv3/f841d4c7-10e1-40af-bcae-07a3f8dc141a/f6d7434e-d6de-4185-a6d4-c77a2d08737b/US-en-20220502-popsignuptwoweeks-perspective_alpha_website_medium.jpg"
                    alt="Background"
                    className="w-full h-full object-cover opacity-50 animate-fade-in scale-105"
                />
                <div className="absolute inset-0 bg-black/60" />
            </div>

            <div className="absolute top-6 left-6 md:left-16 z-10 animate-fade-in">
                <h1 className="text-[#E50914] text-4xl font-bold tracking-tighter uppercase drop-shadow-md cursor-pointer" onClick={() => navigate('/')}>MovieYies</h1>
            </div>

            <div className="relative z-10 bg-black/75 p-8 md:p-16 rounded-lg w-full max-w-[450px] min-h-[600px] flex flex-col justify-center mx-4 animate-slide-up backdrop-blur-sm border border-white/10 shadow-2xl">
                <h1 className="text-3xl font-bold mb-8 text-white">Sign In</h1>
                {error && <div className="bg-[#e87c03] p-3 rounded mb-4 text-sm text-white flex items-center gap-2">⚠️ {error}</div>}

                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <Input type="email" label="Email or phone number" value={email} onChange={(e) => setEmail(e.target.value)} />
                    <Input type="password" label="Password" value={password} onChange={(e) => setPassword(e.target.value)} />

                    <button
                        type="submit"
                        disabled={loading}
                        className="bg-[#E50914] text-white py-3 rounded font-bold mt-6 hover:bg-[#f6121d] transition-all transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center"
                    >
                        {loading ? <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" /> : 'Sign In'}
                    </button>
                </form>

                <div className="flex justify-between items-center mt-4 text-sm text-[#b3b3b3]">
                    <label className="flex items-center gap-2 cursor-pointer select-none group">
                        <input type="checkbox" className="w-4 h-4 bg-[#333] border-0 rounded focus:ring-0 accent-[#737373] group-hover:accent-[#E50914] transition" />
                        <span className="group-hover:text-white transition">Remember me</span>
                    </label>
                    <a href="#" className="hover:underline hover:text-white transition">Need help?</a>
                </div>

                <div className="mt-16 text-[#737373]">
                    New to MovieYies? <Link to="/register" className="text-white hover:underline ml-1 font-medium">Sign up now</Link>.
                </div>
                <div className="mt-4 text-xs text-[#8c8c8c]">
                    This page is protected by Google reCAPTCHA to ensure you're not a bot. <span className="text-[#0071eb] hover:underline cursor-pointer">Learn more</span>.
                </div>
            </div>
        </div>
    );
};

export const Register = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const handleRegister = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await api.post('users/register/', { email: email.trim(), password });
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('user', JSON.stringify(response.data.user));
            navigate('/plan');
        } catch (err) {
            console.error(err);
            alert('Registration failed. Email might be taken.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen relative flex items-center justify-center overflow-hidden">
            <div className="absolute inset-0 z-0">
                <img
                    src="https://assets.nflxext.com/ffe/siteui/vlv3/f841d4c7-10e1-40af-bcae-07a3f8dc141a/f6d7434e-d6de-4185-a6d4-c77a2d08737b/US-en-20220502-popsignuptwoweeks-perspective_alpha_website_medium.jpg"
                    alt="Background"
                    className="w-full h-full object-cover opacity-50 animate-fade-in"
                />
                <div className="absolute inset-0 bg-black/60" />
            </div>

            <div className="absolute top-6 left-6 md:left-16 z-10 animate-fade-in">
                <Link to="/" className="text-[#E50914] text-4xl font-bold tracking-tighter uppercase drop-shadow-md">MovieYies</Link>
            </div>

            <div className="relative z-10 bg-black/75 p-8 md:p-16 rounded-lg w-full max-w-[450px] flex flex-col justify-center mx-4 animate-slide-up backdrop-blur-sm border border-white/10 shadow-2xl">
                <h1 className="text-3xl font-bold mb-4 text-white">Sign Up</h1>
                <p className="text-gray-400 mb-6">Watch anywhere. Cancel anytime.</p>
                <form onSubmit={handleRegister} className="flex flex-col gap-4">
                    <Input type="email" label="Email address" value={email} onChange={(e) => setEmail(e.target.value)} />
                    <Input type="password" label="Add a password" value={password} onChange={(e) => setPassword(e.target.value)} />

                    <button
                        type="submit"
                        disabled={loading}
                        className="bg-[#E50914] text-white py-3 rounded font-bold mt-4 hover:bg-[#f6121d] transition-all transform active:scale-95 flex justify-center items-center"
                    >
                        {loading ? <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" /> : 'Next'}
                    </button>
                </form>
            </div>
        </div>
    );
};
