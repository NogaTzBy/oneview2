'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { DateRangePicker } from '../components/DateRangePicker';
import { MetricsGrid } from '../components/MetricsGrid';
import { TrendChart } from '../components/TrendChart';
import { ConfigModal } from '../components/ConfigModal';
import { ProjectSelector } from '../components/ProjectSelector';
import { DateRange, MetricsResponse, Widget, Project } from '../lib/types';
import { useProject } from '../context/ProjectContext';
import { createClient } from '../lib/supabase-client';

export default function DashboardPage() {
    const { selectedProject } = useProject();
    const [dateRange, setDateRange] = useState<DateRange>({
        from: new Date().toISOString().split('T')[0],
        to: new Date().toISOString().split('T')[0],
        label: 'Hoy',
    });
    const [metrics, setMetrics] = useState<MetricsResponse['metrics'] | null>(null);
    const [trendData, setTrendData] = useState<Array<{ date: string; value: number }>>([]);
    const [widgets, setWidgets] = useState<Widget[]>([]);
    const [project, setProject] = useState<Project | null>(null);
    const [loading, setLoading] = useState(true);
    const [configOpen, setConfigOpen] = useState(false);
    const router = useRouter();
    const supabase = createClient();

    const fetchMetrics = async () => {
        if (!selectedProject) return;

        try {
            setLoading(true);
            const response = await fetch(
                `/api/metrics?project_id=${selectedProject.id}&from=${dateRange.from}&to=${dateRange.to}&trend=true&metric_key=ai_purchase`
            );
            const data = await response.json();
            setMetrics(data.metrics);
            setTrendData(data.trend || []);
        } catch (error) {
            console.error('Error fetching metrics:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchConfig = async () => {
        if (!selectedProject) return;

        try {
            const response = await fetch(`/api/config?project_id=${selectedProject.id}`);
            const data = await response.json();
            setWidgets(data.widgets || []);
            setProject(data.project || null);
        } catch (error) {
            console.error('Error fetching config:', error);
        }
    };

    const handleLogout = async () => {
        await supabase.auth.signOut();
        router.push('/login');
        router.refresh();
    };

    useEffect(() => {
        if (selectedProject) {
            fetchConfig();
            fetchMetrics();
        }
    }, [selectedProject, dateRange]);

    if (!selectedProject) {
        return (
            <div className="min-h-screen bg-[#0D1117] flex items-center justify-center">
                <div className="text-center">
                    <div className="w-12 h-12 border-4 border-[#7C3AED] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-[#8B949E]">Cargando proyectos...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#0D1117]">
            {/* Header - Dark Mode */}
            <div className="bg-[#161B22] border-b border-[#30363D]">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-white">Panel de Métricas</h1>
                            <p className="text-[#8B949E] mt-1">
                                Mostrando datos: {dateRange.label}
                            </p>
                        </div>

                        <div className="flex items-center gap-3">
                            <ProjectSelector />

                            <DateRangePicker value={dateRange} onChange={setDateRange} />

                            <button
                                onClick={fetchMetrics}
                                className="flex items-center gap-2 px-4 py-2 bg-[#161B22] border border-[#30363D] rounded-lg hover:border-[#7C3AED] transition-colors text-white"
                            >
                                <span className="text-lg">🔄</span>
                                Actualizar
                            </button>

                            <button
                                onClick={() => setConfigOpen(true)}
                                className="flex items-center gap-2 px-4 py-2 bg-[#7C3AED] hover:bg-[#8B5CF6] rounded-lg transition-colors text-white font-medium"
                            >
                                <span className="text-lg">⚙️</span>
                                Configurar
                            </button>

                            <button
                                onClick={handleLogout}
                                className="flex items-center gap-2 px-4 py-2 bg-[#161B22] border border-[#30363D] rounded-lg hover:border-[#F85149] hover:text-[#F85149] transition-colors text-white"
                                title="Cerrar sesión"
                            >
                                <span className="text-lg">🚪</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {loading ? (
                    <div className="flex items-center justify-center h-64">
                        <div className="text-center">
                            <div className="w-12 h-12 border-4 border-[#7C3AED] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                            <p className="text-[#8B949E]">Cargando métricas...</p>
                        </div>
                    </div>
                ) : metrics ? (
                    <>
                        <MetricsGrid metrics={metrics} widgets={widgets} />

                        {/* Trend Chart - Now showing AI Purchases */}
                        {trendData.length > 0 && (
                            <TrendChart
                                data={trendData}
                                title="Compras por IA - Tendencia"
                            />
                        )}
                    </>
                ) : (
                    <div className="metric-card text-center py-16">
                        <div className="text-6xl mb-4">📊</div>
                        <h3 className="text-xl font-semibold text-white mb-2">
                            No hay datos disponibles
                        </h3>
                        <p className="text-[#8B949E]">
                            No hay datos disponibles para el rango seleccionado.
                        </p>
                    </div>
                )}
            </div>

            {/* Config Modal */}
            <ConfigModal
                isOpen={configOpen}
                onClose={() => setConfigOpen(false)}
                project={project}
                onRefresh={fetchConfig}
            />
        </div>
    );
}
