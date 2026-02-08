'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '../lib/supabase-client';
import Link from 'next/link';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const supabase = createClient();

    // Check if user just registered
    React.useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        if (params.get('registered') === 'true') {
            setSuccess('¡Cuenta creada exitosamente! Revisá tu email para confirmar tu cuenta y luego iniciá sesión.');
        }
    }, []);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (error) {
                setError(error.message);
                return;
            }

            if (data.session) {
                router.push('/dashboard');
                router.refresh();
            }
        } catch (err: any) {
            setError(err.message || 'Error al iniciar sesión');
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

                {/* Login Card */}
                <div className="bg-[#161B22] border border-[#30363D] rounded-lg p-8">
                    <h2 className="text-2xl font-bold text-white mb-6">Iniciar Sesión</h2>

                    {error && (
                        <div className="mb-4 p-3 bg-[#F85149]/10 border border-[#F85149]/50 rounded-lg">
                            <p className="text-[#F85149] text-sm">{error}</p>
                        </div>
                    )}

                    {success && (
                        <div className="mb-4 p-3 bg-[#3FB950]/10 border border-[#3FB950]/50 rounded-lg">
                            <p className="text-[#3FB950] text-sm">{success}</p>
                        </div>
                    )}

                    <form onSubmit={handleLogin} className="space-y-4">
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

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3 bg-[#7C3AED] hover:bg-[#8B5CF6] disabled:bg-[#30363D] disabled:cursor-not-allowed rounded-lg text-white font-medium transition-colors"
                        >
                            {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
                        </button>
                    </form>

                    <div className="mt-6 text-center">
                        <p className="text-[#8B949E] text-sm">
                            ¿No tenés cuenta?{' '}
                            <Link href="/register" className="text-[#7C3AED] hover:text-[#8B5CF6] font-medium">
                                Registrate
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
