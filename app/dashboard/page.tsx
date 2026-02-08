'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { DateRangePicker } from '../components/DateRangePicker';
import { MetricsGrid } from '../components/MetricsGrid';
import { TrendChart } from '../components/TrendChart';
import { ConfigModal } from '../components/ConfigModal';
import { ProjectSelector } from '../components/ProjectSelector';
import { MobileMenu } from '../components/MobileMenu';
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
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
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
            {/* Mobile Menu */}
            <MobileMenu
                isOpen={mobileMenuOpen}
                onClose={() => setMobileMenuOpen(false)}
                dateRange={dateRange}
                onDateRangeChange={setDateRange}
                onRefresh={fetchMetrics}
                onConfigure={() => setConfigOpen(true)}
            />

            {/* Header - Responsive */}
            <div className="bg-[#161B22] border-b border-[#30363D]">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl md:text-3xl font-bold text-white">Panel de Métricas</h1>
                            <p className="text-[#8B949E] mt-1 text-sm md:text-base">
                                Mostrando datos: {dateRange.label}
                            </p>
                        </div>

                        {/* Desktop Navigation */}
                        <div className="hidden md:flex items-center gap-3">
                            <ProjectSelector />

                            <DateRangePicker value={dateRange} onChange={setDateRange} />

                            <button
                                onClick={fetchMetrics}
                                className="flex items-center gap-2 px-4 py-2 bg-[#161B22] border border-[#30363D] rounded-lg hover:border-[#7C3AED] transition-colors text-white"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                </svg>
                                Actualizar
                            </button>

                            <button
                                onClick={() => setConfigOpen(true)}
                                className="flex items-center gap-2 px-4 py-2 bg-[#7C3AED] hover:bg-[#8B5CF6] rounded-lg transition-colors text-white font-medium"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                                Configurar
                            </button>
                        </div>

                        {/* Mobile Hamburger Button */}
                        <button
                            onClick={() => setMobileMenuOpen(true)}
                            className="md:hidden p-2 text-white hover:text-[#7C3AED] transition-colors"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        </button>
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
                        <svg className="w-16 h-16 mx-auto mb-4 text-[#30363D]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
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
