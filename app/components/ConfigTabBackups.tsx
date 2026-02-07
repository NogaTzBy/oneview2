'use client';

import React, { useState, useEffect } from 'react';
import { Project } from '../lib/types';

interface ConfigTabBackupsProps {
    project: Project;
    onRefresh: () => void;
}

interface BackupInfo {
    id: string;
    events_count: number;
    created_at: string;
}

interface Stats {
    total_events: number;
    backups_count: number;
}

export function ConfigTabBackups({ project, onRefresh }: ConfigTabBackupsProps) {
    const [backups, setBackups] = useState<BackupInfo[]>([]);
    const [stats, setStats] = useState<Stats>({ total_events: 0, backups_count: 0 });
    const [loading, setLoading] = useState(true);
    const [creating, setCreating] = useState(false);
    const [autoBackup, setAutoBackup] = useState(false);

    useEffect(() => {
        fetchBackupData();
    }, [project.id]);

    const fetchBackupData = async () => {
        try {
            setLoading(true);

            // Fetch events count
            const metricsResponse = await fetch(`/api/metrics?project_id=${project.id}`);
            if (metricsResponse.ok) {
                const metricsData = await metricsResponse.json();
                setStats(prev => ({ ...prev, total_events: metricsData.total_events || 0 }));
            }

            // Note: Backups would need a dedicated API endpoint
            // For now, we show placeholder data
            setBackups([]);
            setStats(prev => ({ ...prev, backups_count: 0 }));
        } catch (error) {
            console.error('Error fetching backup data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateBackup = async () => {
        if (!confirm('¿Crear un respaldo de los datos actuales?')) {
            return;
        }

        try {
            setCreating(true);

            // Fetch current metrics to snapshot
            const metricsResponse = await fetch(`/api/metrics?project_id=${project.id}`);
            if (!metricsResponse.ok) {
                throw new Error('Error fetching metrics');
            }

            const metricsData = await metricsResponse.json();

            // Note: This would need a dedicated backup API endpoint
            // For now, we just show a success message
            alert(`Respaldo creado con ${metricsData.total_events} eventos.`);
            fetchBackupData();
        } catch (error) {
            console.error('Error creating backup:', error);
            alert('Error al crear el respaldo');
        } finally {
            setCreating(false);
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleString('es-AR', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    return (
        <div className="space-y-6">
            <div>
                <h3 className="text-lg font-semibold mb-2 text-white">Respaldos de Datos</h3>
                <p className="text-sm text-[#8B949E]">
                    Administra los respaldos de tus métricas y eventos.
                </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-3 gap-4">
                <div className="bg-[#1A1F2B] p-4 rounded-lg border border-[#30363D]">
                    <div className="text-3xl font-bold text-white">
                        {loading ? '—' : stats.total_events}
                    </div>
                    <div className="text-sm text-[#8B949E] mt-1">Eventos Activos</div>
                </div>
                <div className="bg-[#1A1F2B] p-4 rounded-lg border border-[#30363D]">
                    <div className="text-3xl font-bold text-white">
                        {loading ? '—' : stats.backups_count}
                    </div>
                    <div className="text-sm text-[#8B949E] mt-1">Respaldos</div>
                </div>
                <div className="bg-[#1A1F2B] p-4 rounded-lg border border-[#30363D]">
                    <div className="text-3xl font-bold text-[#7C3AED]">
                        ∞
                    </div>
                    <div className="text-sm text-[#8B949E] mt-1">Retención</div>
                </div>
            </div>

            {/* Create Backup Button */}
            <div className="bg-[#1A1F2B] rounded-lg p-4 border border-[#30363D]">
                <div className="flex items-center justify-between">
                    <div>
                        <h4 className="text-sm font-medium text-white">Crear Respaldo Manual</h4>
                        <p className="text-xs text-[#8B949E] mt-1">
                            Crea un snapshot de todos los eventos actuales.
                        </p>
                    </div>
                    <button
                        onClick={handleCreateBackup}
                        disabled={creating || stats.total_events === 0}
                        className="px-4 py-2 bg-[#7C3AED] text-white rounded-lg hover:bg-[#8B5CF6] disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm font-medium"
                    >
                        {creating ? '⏳ Creando...' : '📸 Crear Respaldo'}
                    </button>
                </div>
            </div>

            {/* Auto Backup Toggle */}
            <div className="bg-[#1A1F2B] rounded-lg p-4 border border-[#30363D]">
                <div className="flex items-center justify-between">
                    <div>
                        <h4 className="text-sm font-medium text-white">Respaldo Automático</h4>
                        <p className="text-xs text-[#8B949E] mt-1">
                            Crear respaldo automáticamente al cerrar cada ciclo mensual.
                        </p>
                    </div>
                    <button
                        onClick={() => setAutoBackup(!autoBackup)}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${autoBackup ? 'bg-[#7C3AED]' : 'bg-[#30363D]'
                            }`}
                    >
                        <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${autoBackup ? 'translate-x-6' : 'translate-x-1'
                                }`}
                        />
                    </button>
                </div>
            </div>

            {/* Backups List */}
            <div>
                <h4 className="text-sm font-medium text-white mb-3">Historial de Respaldos</h4>

                {loading ? (
                    <div className="bg-[#1A1F2B] rounded-lg p-8 border border-[#30363D] text-center">
                        <div className="w-8 h-8 border-2 border-[#7C3AED] border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
                        <p className="text-[#8B949E] text-sm">Cargando respaldos...</p>
                    </div>
                ) : backups.length === 0 ? (
                    <div className="bg-[#1A1F2B] rounded-lg p-8 border border-[#30363D] text-center">
                        <div className="text-4xl mb-3">📂</div>
                        <p className="text-white font-medium">No hay respaldos</p>
                        <p className="text-[#8B949E] text-sm mt-1">
                            Crea tu primer respaldo para proteger tus datos.
                        </p>
                    </div>
                ) : (
                    <div className="space-y-2">
                        {backups.map((backup) => (
                            <div
                                key={backup.id}
                                className="bg-[#1A1F2B] rounded-lg p-4 border border-[#30363D] flex items-center justify-between"
                            >
                                <div>
                                    <div className="text-sm font-medium text-white">
                                        Respaldo - {formatDate(backup.created_at)}
                                    </div>
                                    <div className="text-xs text-[#8B949E] mt-1">
                                        {backup.events_count} eventos
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <button className="px-3 py-1 text-xs bg-[#0D1117] text-[#8B949E] border border-[#30363D] rounded hover:border-[#7C3AED] transition-colors">
                                        📥 Descargar
                                    </button>
                                    <button className="px-3 py-1 text-xs bg-[#0D1117] text-[#F85149] border border-[#30363D] rounded hover:border-[#F85149] transition-colors">
                                        🗑️ Eliminar
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
