'use client';

import React from 'react';
import { useRouter } from 'next/navigation';

export function AdminSelection() {
    const router = useRouter();

    return (
        <div className="min-h-screen bg-[#0D1117] flex flex-col items-center justify-center p-6">
            <div className="text-center mb-12">
                <img src="/images/logo.png" alt="OneView" className="h-16 w-auto mx-auto mb-6" />
                <h1 className="text-3xl font-bold text-white mb-2">Panel del Super Administrador</h1>
                <p className="text-[#8B949E]">Selecciona la instancia a la cual deseas acceder.</p>
            </div>

            <div className="grid md:grid-cols-2 gap-6 w-full max-w-4xl">
                {/* E-commerce Card */}
                <div
                    onClick={() => router.push('/dashboard?view=ecommerce')}
                    className="bg-[#161B22] border border-[#30363D] hover:border-[#7C3AED] hover:shadow-[0_0_20px_rgba(124,58,237,0.15)] rounded-2xl p-8 cursor-pointer transition-all duration-300 group flex flex-col items-center text-center"
                >
                    <div className="w-16 h-16 rounded-full bg-[#7C3AED]/10 text-[#7C3AED] flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                        <span className="material-symbols-outlined text-3xl">storefront</span>
                    </div>
                    <h2 className="text-2xl font-bold text-white mb-3">E-commerce</h2>
                    <p className="text-[#8B949E] mb-6 flex-1">
                        Accede al panel de control de métricas para e-commerce (Eloge, Tu Espacio, etc).
                    </p>
                    <span className="inline-flex items-center gap-2 text-[#7C3AED] font-semibold">
                        Entrar al panel
                        <span className="material-symbols-outlined text-sm transition-transform group-hover:translate-x-1">arrow_forward</span>
                    </span>
                </div>

                {/* Setters IA Card */}
                <div
                    onClick={() => router.push('/dashboard?view=setters')}
                    className="bg-[#161B22] border border-[#30363D] hover:border-[#3B82F6] hover:shadow-[0_0_20px_rgba(59,130,246,0.15)] rounded-2xl p-8 cursor-pointer transition-all duration-300 group flex flex-col items-center text-center"
                >
                    <div className="w-16 h-16 rounded-full bg-blue-500/10 text-blue-500 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                        <span className="material-symbols-outlined text-3xl">smart_toy</span>
                    </div>
                    <h2 className="text-2xl font-bold text-white mb-3">Setters IA</h2>
                    <p className="text-[#8B949E] mb-6 flex-1">
                        Accede al panel de rendimiento y análisis de agentes IA y agenda (FA Interiores).
                    </p>
                    <span className="inline-flex items-center gap-2 text-blue-500 font-semibold">
                        Entrar al panel
                        <span className="material-symbols-outlined text-sm transition-transform group-hover:translate-x-1">arrow_forward</span>
                    </span>
                </div>
            </div>
        </div>
    );
}
