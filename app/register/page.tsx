'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '../lib/supabase-client';
import Link from 'next/link';

export default function RegisterPage() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [dashboardType, setDashboardType] = useState('ecommerce');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const supabase = createClient();

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (password !== confirmPassword) {
            setError('Las contraseñas no coinciden');
            return;
        }

        if (password.length < 6) {
            setError('La contraseña debe tener al menos 6 caracteres');
            return;
        }

        setLoading(true);

        try {
            const { data, error } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: {
                        name,
                        dashboard_type: dashboardType
                    },
                },
            });

            if (error) {
                setError(error.message);
                return;
            }

            // Registro exitoso - puede tener sesión inmediata o requerir confirmación de email
            if (data.session) {
                // Sesión creada inmediatamente
                router.push('/dashboard');
                router.refresh();
            } else {
                // Email de confirmación enviado
                // Mostrar mensaje de éxito en lugar de error
                router.push('/login?registered=true');
            }
        } catch (err: any) {
            setError(err.message || 'Error al crear cuenta');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#0D1117] flex items-center justify-center px-4">
            <div className="w-full max-w-md">
                {/* Logo/Title */}
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-white mb-2">OneView</h1>
                    <p className="text-[#8B949E]">Panel de Métricas de IA</p>
                </div>

                {/* Register Card */}
                <div className="bg-[#161B22] border border-[#30363D] rounded-lg p-8">
                    <h2 className="text-2xl font-bold text-white mb-6">Crear Cuenta</h2>

                    {error && (
                        <div className="mb-4 p-3 bg-[#F85149]/10 border border-[#F85149]/50 rounded-lg">
                            <p className="text-[#F85149] text-sm">{error}</p>
                        </div>
                    )}

                    <form onSubmit={handleRegister} className="space-y-4">
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-[#C9D1D9] mb-2">
                                Nombre
                            </label>
                            <input
                                id="name"
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                                className="w-full px-4 py-2 bg-[#0D1117] border border-[#30363D] rounded-lg text-white focus:outline-none focus:border-[#7C3AED] transition-colors"
                                placeholder="Tu nombre"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-[#C9D1D9] mb-2">
                                Tipo de Negocio
                            </label>
                            <div className="grid grid-cols-2 gap-4">
                                <label className={`flex items-center justify-center px-4 py-3 rounded-lg border cursor-pointer transition-colors ${dashboardType === 'ecommerce' ? 'bg-[#7C3AED]/10 border-[#7C3AED] text-white' : 'bg-[#0D1117] border-[#30363D] text-[#8B949E] hover:border-[#8B949E]'}`}>
                                    <input
                                        type="radio"
                                        name="dashboardType"
                                        value="ecommerce"
                                        checked={dashboardType === 'ecommerce'}
                                        onChange={(e) => setDashboardType(e.target.value)}
                                        className="hidden"
                                    />
                                    <span className="font-medium text-sm">E-commerce</span>
                                </label>
                                <label className={`flex items-center justify-center px-4 py-3 rounded-lg border cursor-pointer transition-colors ${dashboardType === 'setters' ? 'bg-[#7C3AED]/10 border-[#7C3AED] text-white' : 'bg-[#0D1117] border-[#30363D] text-[#8B949E] hover:border-[#8B949E]'}`}>
                                    <input
                                        type="radio"
                                        name="dashboardType"
                                        value="setters"
                                        checked={dashboardType === 'setters'}
                                        onChange={(e) => setDashboardType(e.target.value)}
                                        className="hidden"
                                    />
                                    <span className="font-medium text-sm">Setters IA</span>
                                </label>
                            </div>
                        </div>

                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-[#C9D1D9] mb-2">
                                Email
                            </label>
                            <input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="w-full px-4 py-2 bg-[#0D1117] border border-[#30363D] rounded-lg text-white focus:outline-none focus:border-[#7C3AED] transition-colors"
                                placeholder="tu@email.com"
                            />
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-[#C9D1D9] mb-2">
                                Contraseña
                            </label>
                            <input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className="w-full px-4 py-2 bg-[#0D1117] border border-[#30363D] rounded-lg text-white focus:outline-none focus:border-[#7C3AED] transition-colors"
                                placeholder="••••••••"
                            />
                        </div>

                        <div>
                            <label htmlFor="confirmPassword" className="block text-sm font-medium text-[#C9D1D9] mb-2">
                                Confirmar Contraseña
                            </label>
                            <input
                                id="confirmPassword"
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                                className="w-full px-4 py-2 bg-[#0D1117] border border-[#30363D] rounded-lg text-white focus:outline-none focus:border-[#7C3AED] transition-colors"
                                placeholder="••••••••"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3 bg-[#7C3AED] hover:bg-[#8B5CF6] disabled:bg-[#30363D] disabled:cursor-not-allowed rounded-lg text-white font-medium transition-colors"
                        >
                            {loading ? 'Creando cuenta...' : 'Crear Cuenta'}
                        </button>
                    </form>

                    <div className="mt-6 text-center">
                        <p className="text-[#8B949E] text-sm">
                            ¿Ya tenés cuenta?{' '}
                            <Link href="/login" className="text-[#7C3AED] hover:text-[#8B5CF6] font-medium">
                                Iniciá sesión
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
