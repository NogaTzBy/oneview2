'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

interface SettersDashboardProps {
    isSuperAdmin?: boolean;
}

export function SettersDashboard({ isSuperAdmin }: SettersDashboardProps) {
    const router = useRouter();
    // TODO: implement real metrics fetch and logic for FA Interiores Setters IA
    const [loading] = useState(false);

    return (
        <div className="min-h-screen bg-background-light">
            {/* Header - Fixed with Blur */}
            <header className="w-full fixed top-0 left-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200/50">
                <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-8">
                        <div className="flex items-center gap-4">
                            {isSuperAdmin && (
                                <button
                                    onClick={() => router.push('/dashboard')}
                                    className="p-2 -ml-2 rounded-lg hover:bg-slate-100 text-slate-500 transition-colors"
                                    title="Volver al menú principal"
                                >
                                    <span className="material-symbols-outlined">arrow_back</span>
                                </button>
                            )}
                            <h2 className="text-xl font-bold text-slate-900 hidden md:block border-l pl-4 ml-2 max-h-[40px]">
                                FA Interiores (Setters IA)
                            </h2>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <button
                            className="p-2 rounded-full hover:bg-slate-100 text-slate-500 transition-colors"
                        >
                            <span className="material-symbols-outlined">settings</span>
                        </button>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="pt-24 pb-12 px-6 max-w-7xl mx-auto">
                <div className="mb-8 flex justify-between items-end">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Resumen de Setters IA</h1>
                        <p className="text-slate-500 mt-1">Sigue el rendimiento de tus agentes setters en tiempo real.</p>
                    </div>
                    <div className="flex gap-3">
                        <button
                            disabled={loading}
                            className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium shadow-sm hover:shadow-md transition-all flex items-center gap-2 text-slate-900 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <span className={`material-symbols-outlined text-[18px] ${loading ? 'animate-spin' : ''}`}>
                                refresh
                            </span>
                            Actualizar
                        </button>
                    </div>
                </div>

                <div className="glass-panel bg-white/70 text-center py-16 rounded-2xl">
                    <div className="w-16 h-16 mx-auto mb-4 bg-primary/10 rounded-full flex items-center justify-center">
                        <span className="material-symbols-outlined text-primary text-3xl">smart_toy</span>
                    </div>
                    <h3 className="text-xl font-semibold text-slate-900 mb-2">
                        Próximamente
                    </h3>
                    <p className="text-slate-500 max-w-md mx-auto">
                        Este panel está en construcción. Aquí verás las métricas específicas para los agentes de setters de FA Interiores.
                    </p>
                </div>
            </main>
        </div>
    );
}
