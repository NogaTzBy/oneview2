'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { SettersMetricsGrid } from '../../components/SettersMetricsGrid';
import { TrendChart } from '../../components/TrendChart';
import { ConfigModal } from '../../components/ConfigModal';
import { DateRange, MetricsResponse, Project } from '../../lib/types';
import { useProject } from '../../context/ProjectContext';
import { ProjectSelector } from '../../components/ProjectSelector';
import { DateRangePicker } from '../../components/DateRangePicker';

interface SettersDashboardProps {
    isSuperAdmin?: boolean;
}

export function SettersDashboard({ isSuperAdmin }: SettersDashboardProps) {
    const { projects } = useProject();
    const faProject = projects?.find(p => p.name === 'FA Interiores');

    const [metrics, setMetrics] = useState<Record<string, number> | null>(null);
    const [trends, setTrends] = useState<Record<string, number>>({});
    const [trendData, setTrendData] = useState<any[]>([]);
    const [dateRange, setDateRange] = useState<DateRange>({ from: '', to: '', label: 'Últimos 7 Días' });
    const [project, setProject] = useState<Project | null>(null);
    const [loading, setLoading] = useState(true);
    const [configOpen, setConfigOpen] = useState(false);
    const [showExportConfirm, setShowExportConfirm] = useState(false);
    const router = useRouter();

    const exportToCSV = () => {
        if (!metrics) return;

        const csvRows = [
            ['Métrica', 'Valor', 'Fecha de Exportación'],
            ['Conversaciones Únicas (Hoy)', metrics.ai_message_sent?.toString() || '0', new Date().toLocaleDateString()],
            ['Nuevo Lead', metrics.conversations_started?.toString() || '0', new Date().toLocaleDateString()],
            ['Conversaciones Cerradas', metrics.conversations_closed?.toString() || '0', new Date().toLocaleDateString()],
            ['Primeros Seguimientos', metrics.first_follow_up?.toString() || '0', new Date().toLocaleDateString()],
            ['Segundos Seguimientos', metrics.second_follow_up?.toString() || '0', new Date().toLocaleDateString()],
            ['Nuevos Seguidores', metrics.instagram_follower?.toString() || '0', new Date().toLocaleDateString()],
            ['Estado: Obra desde cero', metrics.state_new_construction?.toString() || '0', new Date().toLocaleDateString()],
            ['Estado: Obra + planos > 150m²', metrics.state_construction_over_150?.toString() || '0', new Date().toLocaleDateString()],
            ['Estado: Link de agenda enviado', metrics.state_link_sent?.toString() || '0', new Date().toLocaleDateString()],
            ['Estado: Agendó + video enviado', metrics.state_scheduled_video_sent?.toString() || '0', new Date().toLocaleDateString()],
            ['Estado: Agendó + video < 150m²', metrics.state_scheduled_video_sent_under_150?.toString() || '0', new Date().toLocaleDateString()],
            ['Estado: Agendó + video reforma > 150m²', metrics.state_scheduled_video_sent_remodel_over_150?.toString() || '0', new Date().toLocaleDateString()],
        ];

        const csvContent = csvRows
            .map(row => row.map(cell => `"${cell}"`).join(','))
            .join('\n');

        const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        link.setAttribute('href', URL.createObjectURL(blob));
        link.setAttribute('download', `setters-metricas-${dateRange.from}-${dateRange.to}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        setShowExportConfirm(false);
    };

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
        if (!faProject?.id || !dateRange.from || !dateRange.to) {
            setLoading(false);
            return;
        }

        setLoading(true);
        try {
            // Pasamos metric_key=ai_message_sent para que el gráfico de tendencia muestre los mensajes y agregamos _t para evitar agressive caching
            const response = await fetch(
                `/api/metrics?projectId=${faProject.id}&start=${dateRange.from}&end=${dateRange.to}&trend=true&metric_key=ai_message_sent&_t=${Date.now()}`,
                { cache: 'no-store' }
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
        if (faProject) {
            setProject(faProject);
            fetchMetrics();
        }
    }, [faProject, dateRange]);

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
                            <DateRangePicker
                                value={dateRange}
                                onChange={setDateRange}
                            />
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setConfigOpen(true)}
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
                        <button
                            onClick={() => setShowExportConfirm(true)}
                            disabled={!metrics || loading}
                            className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium shadow-sm hover:shadow-md transition-all flex items-center gap-2 text-slate-900 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <span className="material-symbols-outlined text-[18px]">download</span>
                            Exportar
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
                                title="Gráfico de Mensajes Enviados"
                                subtitle={`Mensajes enviados — ${dateRange.label}`}
                                totalLabel="Mensajes Totales"
                                isCurrency={false}
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

            {/* Export Confirmation Modal */}
            {showExportConfirm && (
                <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl shadow-xl max-w-md w-full border border-slate-200">
                        <div className="p-6">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                                    <span className="material-symbols-outlined text-primary text-2xl">download</span>
                                </div>
                                <h3 className="text-lg font-semibold text-slate-900">
                                    ¿Descargar métricas?
                                </h3>
                            </div>
                            <p className="text-slate-600 mb-6">
                                Se descargará un archivo CSV con todas las métricas de Setters para:{' '}
                                <span className="font-medium text-slate-900">
                                    {dateRange.label}
                                </span>
                            </p>
                            <div className="flex gap-3">
                                <button
                                    onClick={() => setShowExportConfirm(false)}
                                    className="flex-1 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-medium transition-colors"
                                >
                                    Cancelar
                                </button>
                                <button
                                    onClick={exportToCSV}
                                    className="flex-1 px-4 py-2.5 bg-primary hover:bg-primary-dark text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                                >
                                    <span className="material-symbols-outlined text-[18px]">download</span>
                                    Descargar
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Config Modal */}
            <ConfigModal
                isOpen={configOpen}
                onClose={() => setConfigOpen(false)}
                project={project}
                onRefresh={() => { }}
                dashboardContext="setters"
            />
        </div>
    );
}
