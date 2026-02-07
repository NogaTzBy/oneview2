'use client';

import React, { useState, useEffect } from 'react';
import { DateRangePicker } from '../components/DateRangePicker';
import { MetricsGrid } from '../components/MetricsGrid';
import { TrendChart } from '../components/TrendChart';
import { ConfigModal } from '../components/ConfigModal';
import { DateRange, MetricsResponse, Widget, Project } from '../lib/types';

// For MVP, hardcode the project ID (first project from database)
const PROJECT_ID = process.env.NEXT_PUBLIC_PROJECT_ID || '';

export default function DashboardPage() {
    const [dateRange, setDateRange] = useState<DateRange>({
        from: new Date().toISOString().split('T')[0],
        to: new Date().toISOString().split('T')[0],
        label: 'Hoy',
    });
    const [metrics, setMetrics] = useState<MetricsResponse['metrics'] | null>(null);
    const [widgets, setWidgets] = useState<Widget[]>([]);
    const [project, setProject] = useState<Project | null>(null);
    const [loading, setLoading] = useState(true);
    const [configOpen, setConfigOpen] = useState(false);

    const fetchMetrics = async () => {
        try {
            setLoading(true);
            const response = await fetch(
                `/api/metrics?project_id=${PROJECT_ID}&from=${dateRange.from}&to=${dateRange.to}`
            );
            const data: MetricsResponse = await response.json();
            setMetrics(data.metrics);
        } catch (error) {
            console.error('Error fetching metrics:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchConfig = async () => {
        try {
            const response = await fetch(`/api/config?project_id=${PROJECT_ID}`);
            const data = await response.json();
            setWidgets(data.widgets || []);
            setProject(data.project || null);
        } catch (error) {
            console.error('Error fetching config:', error);
        }
    };

    useEffect(() => {
        fetchConfig();
    }, []);

    useEffect(() => {
        if (PROJECT_ID) {
            fetchMetrics();
        }
    }, [dateRange]);

    // Generar datos de tendencia de ejemplo (últimos 7 días)
    const generateTrendData = () => {
        const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
        return days.map((day, index) => ({
            date: day,
            value: Math.floor(Math.random() * 50) + 10 + ((metrics?.conversations_started || 0) * (index / 7))
        }));
    };

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

                        {/* Trend Chart */}
                        <TrendChart
                            data={generateTrendData()}
                            title="Conversaciones Iniciadas - Tendencia"
                        />
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
