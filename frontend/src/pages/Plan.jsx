import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check } from 'lucide-react';

const Plan = () => {
    const navigate = useNavigate();
    const [selectedPlan, setSelectedPlan] = useState('Standard');

    const plans = [
        { name: 'Basic', price: 'S/ 24.90', quality: 'Good', resolution: '720p' },
        { name: 'Standard', price: 'S/ 34.90', quality: 'Better', resolution: '1080p' },
        { name: 'Premium', price: 'S/ 44.90', quality: 'Best', resolution: '4K+HDR' },
    ];

    const handleSubscribe = () => {
        // Simulate payment processing
        setTimeout(() => {
            navigate('/profiles');
        }, 1500);
    };

    return (
        <div className="min-h-screen bg-white text-black">
            <div className="border-b px-4 md:px-16 py-4 flex justify-between items-center">
                <h1 className="text-red-600 text-3xl font-bold uppercase">MovieYies</h1>
                <button onClick={() => navigate('/login')} className="font-bold hover:underline">Sign In</button>
            </div>

            <div className="max-w-4xl mx-auto py-12 px-4">
                <div className="text-center mb-12">
                    <div className="text-sm uppercase font-bold text-gray-500 mb-2">Step 2 of 3</div>
                    <h2 className="text-3xl font-bold mb-4">Choose the plan that's right for you</h2>
                    <div className="flex flex-col gap-2 text-lg">
                        <div className="flex items-center justify-center gap-2"><Check className="text-red-600" /> Watch all you want. Ad-free.</div>
                        <div className="flex items-center justify-center gap-2"><Check className="text-red-600" /> Recommendations just for you.</div>
                        <div className="flex items-center justify-center gap-2"><Check className="text-red-600" /> Change or cancel your plan anytime.</div>
                    </div>
                </div>

                <div className="grid md:grid-cols-3 gap-4 mb-8">
                    {plans.map((plan) => (
                        <div
                            key={plan.name}
                            onClick={() => setSelectedPlan(plan.name)}
                            className={`border-2 rounded-lg p-6 cursor-pointer transition relative ${selectedPlan === plan.name ? 'border-red-600 shadow-xl' : 'border-gray-300 opacity-80'}`}
                        >
                            {selectedPlan === plan.name && <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-red-600 text-white px-4 py-1 text-sm font-bold rounded">Selected</div>}
                            <div className="bg-red-400/10 text-red-600 font-bold p-2 rounded w-fit mb-4">{plan.name}</div>
                            <div className="text-3xl font-bold mb-4">{plan.price}</div>
                            <div className="border-t pt-4 space-y-2 text-gray-600">
                                <div className="flex justify-between"><span>Quality</span> <span className="font-bold text-black">{plan.quality}</span></div>
                                <div className="flex justify-between"><span>Resolution</span> <span className="font-bold text-black">{plan.resolution}</span></div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="text-center">
                    <button onClick={handleSubscribe} className="bg-[#E50914] text-white text-xl font-bold py-4 px-12 rounded hover:bg-[#f6121d] transition w-full md:w-auto">
                        Subscribe
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Plan;
