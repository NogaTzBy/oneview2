'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { SettersMetricsGrid } from '../../components/SettersMetricsGrid';
import { TrendChart } from '../../components/TrendChart';
import { DateRange, MetricsResponse, Project } from '../../lib/types';
import { useProject } from '../../context/ProjectContext';
import { ProjectSelector } from '../../components/ProjectSelector';
import { DateRangePicker } from '../../components/DateRangePicker';

interface SettersDashboardProps {
    isSuperAdmin?: boolean;
}

export function SettersDashboard({ isSuperAdmin }: SettersDashboardProps) {
    const { selectedProject } = useProject();
    const [metrics, setMetrics] = useState<Record<string, number> | null>(null);
    const [trends, setTrends] = useState<Record<string, number>>({});
    const [trendData, setTrendData] = useState<any[]>([]);
    const [dateRange, setDateRange] = useState<DateRange>({ from: '', to: '', label: 'Últimos 7 Días' });
    const [project, setProject] = useState<Project | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const now = new Date();
        const sevenDaysAgo = new Date(now);
        sevenDaysAgo.setDate(now.getDate() - 7);

        setDateRange({
            from: sevenDaysAgo.toISOString().split('T')[0],
            to: now.toISOString().split('T')[0],
            label: 'Últimos 7 Días',
        });
    }, []);

    const fetchMetrics = async () => {
        if (!selectedProject?.id || !dateRange.from || !dateRange.to) {
            setLoading(false);
            return;
        }

        setLoading(true);
        try {
            // Pasamos metric_key=ai_message_sent para que el gráfico de tendencia muestre los mensajes
            const response = await fetch(
                `/api/metrics?projectId=${selectedProject.id}&start=${dateRange.from}&end=${dateRange.to}&trend=true&metric_key=ai_message_sent`
            );

            if (response.ok) {
                const data: MetricsResponse = await response.json();
                setMetrics(data.summary);
                setTrends(data.trends || {});
                setTrendData(data.trend || []);
            }
        } catch (error) {
            console.error('Error fetching metrics:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (selectedProject) {
            setProject(selectedProject);
            fetchMetrics();
        }
    }, [selectedProject, dateRange]);

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

                        <div className="hidden md:flex items-center gap-4 pl-4 border-l border-slate-200">
                            <ProjectSelector />
                            <DateRangePicker
                                value={dateRange}
                                onChange={setDateRange}
                            />
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
                            onClick={fetchMetrics}
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

                {loading ? (
                    <div className="flex items-center justify-center h-64">
                        <div className="text-center">
                            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                            <p className="text-slate-500">Cargando métricas...</p>
                        </div>
                    </div>
                ) : metrics ? (
                    <>
                        <SettersMetricsGrid metrics={metrics} trends={trends} />

                        {trendData.length > 0 && (
                            <TrendChart
                                data={trendData}
                                title="Tendencia de Mensajes Salientes IA"
                            />
                        )}
                    </>
                ) : (
                    <div className="glass-panel bg-white/70 text-center py-16 rounded-2xl">
                        <svg className="w-16 h-16 mx-auto mb-4 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                        <h3 className="text-xl font-semibold text-slate-900 mb-2">
                            No hay datos disponibles
                        </h3>
                        <p className="text-slate-500">
                            No hay datos disponibles para el rango seleccionado.
                        </p>
                    </div>
                )}
            </main>
        </div>
    );
}
