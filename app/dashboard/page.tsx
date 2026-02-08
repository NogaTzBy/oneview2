'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { MetricsGrid } from '../components/MetricsGrid';
import { EmailMetricsGrid } from '../components/EmailMetricsGrid';
import { TrendChart } from '../components/TrendChart';
import { ConfigModal } from '../components/ConfigModal';
import { DateRange, MetricsResponse, Widget, Project } from '../lib/types';
import { useProject } from '../context/ProjectContext';
import { createClient } from '../lib/supabase-client';
import { ProjectSelector } from '../components/ProjectSelector';
import { DateRangePicker } from '../components/DateRangePicker';
import { useNotifications } from '../hooks/useNotifications';
import { NotificationsPanel } from '../components/NotificationsPanel';

export default function DashboardPage() {
    const { selectedProject } = useProject();
    const { unreadCount, notifications } = useNotifications();
    const [metrics, setMetrics] = useState<Record<string, number> | null>(null);
    const [trends, setTrends] = useState<Record<string, number>>({});
    const [trendData, setTrendData] = useState<any[]>([]);
    const [widgets, setWidgets] = useState<Widget[]>([]);
    const [dateRange, setDateRange] = useState<DateRange>({ from: '', to: '', label: 'Últimos 7 Días' });
    const [project, setProject] = useState<Project | null>(null);
    const [loading, setLoading] = useState(true);
    const [configOpen, setConfigOpen] = useState(false);
    const [notificationsOpen, setNotificationsOpen] = useState(false);
    const router = useRouter();
    const supabase = createClient();

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

    const fetchConfig = async () => {
        if (!selectedProject?.id) return;

        try {
            const response = await fetch(`/api/config/${selectedProject.id}`);
            if (response.ok) {
                const data = await response.json();
                setProject(data.project);
                setWidgets(data.widgets || []);
            }
        } catch (error) {
            console.error('Error fetching config:', error);
        }
    };

    const fetchMetrics = async () => {
        if (!selectedProject?.id || !dateRange.from || !dateRange.to) {
            setLoading(false);
            return;
        }

        setLoading(true);
        try {
            const response = await fetch(
                `/api/metrics?projectId=${selectedProject.id}&start=${dateRange.from}&end=${dateRange.to}&trend=true`
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
            fetchConfig();
            fetchMetrics();
        }
    }, [selectedProject, dateRange]);

    if (loading && !metrics) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background-light">
                <div className="text-center">
                    <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-slate-500">Cargando métricas...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background-light">
            {/* Header - Fixed with Blur */}
            <header className="w-full fixed top-0 left-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200/50">
                <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-8">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-white shadow-glow">
                                <span className="material-symbols-outlined text-xl">analytics</span>
                            </div>
                            <span className="text-xl font-bold tracking-tight text-slate-900">OneView</span>
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
                        <div className="relative">
                            <button
                                onClick={() => setNotificationsOpen(!notificationsOpen)}
                                className="relative p-2 rounded-full hover:bg-slate-100 text-slate-500 transition-colors"
                            >
                                <span className="material-symbols-outlined">notifications</span>
                                {unreadCount > 0 && (
                                    <div className="absolute top-1 right-1 flex items-center justify-center">
                                        {unreadCount === 1 ? (
                                            <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                                        ) : (
                                            <div className="min-w-[18px] h-[18px] bg-red-500 rounded-full flex items-center justify-center">
                                                <span className="text-[10px] font-bold text-white px-1">
                                                    {unreadCount > 9 ? '9+' : unreadCount}
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </button>
                            {notificationsOpen && (
                                <NotificationsPanel
                                    notifications={notifications}
                                    onClose={() => setNotificationsOpen(false)}
                                />
                            )}
                        </div>
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
                {/* Page Header */}
                <div className="mb-8 flex justify-between items-end">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Resumen del Panel</h1>
                        <p className="text-slate-500 mt-1">Sigue tus métricas de comercio impulsadas por IA en tiempo real.</p>
                    </div>
                    <div className="flex gap-3">
                        <button className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium shadow-sm hover:shadow-md transition-all flex items-center gap-2 text-slate-900">
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
                        {/* Métricas */}
                        {metrics && (
                            <MetricsGrid metrics={metrics} widgets={widgets} trends={trends} />
                        )} {/* Trend Chart */}
                        {trendData.length > 0 && (
                            <TrendChart
                                data={trendData}
                                title="Tendencia de Compras por IA"
                            />
                        )}

                        {/* Email Marketing Metrics */}
                        {metrics && (
                            <EmailMetricsGrid metrics={{
                                email_cart_abandoned: metrics.summary.email_cart_abandoned,
                                email_buyer_x1: metrics.summary.email_buyer_x1,
                                email_buyer_recurring: metrics.summary.email_buyer_recurring
                            }} />
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
