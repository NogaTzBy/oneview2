'use client';

import React, { useState, useEffect } from 'react';
import { Project } from '../lib/types';

interface ConfigTabGeneralProps {
    project: Project;
    onRefresh: () => void;
}

const TIMEZONES = [
    'America/Argentina/Buenos_Aires',
    'America/New_York',
    'America/Los_Angeles',
    'America/Chicago',
    'America/Mexico_City',
    'America/Sao_Paulo',
    'Europe/London',
    'Europe/Paris',
    'Europe/Madrid',
    'Asia/Tokyo',
    'Asia/Shanghai',
    'Australia/Sydney',
];

export function ConfigTabGeneral({ project, onRefresh }: ConfigTabGeneralProps) {
    const [name, setName] = useState(project.name);
    const [timezone, setTimezone] = useState(project.timezone);
    const [targetCurrency, setTargetCurrency] = useState(project.target_currency || 'UYU');
    const [exchangeRate, setExchangeRate] = useState(project.exchange_rate || 42.0);
    const [saving, setSaving] = useState(false);
    const [hasChanges, setHasChanges] = useState(false);

    useEffect(() => {
        setName(project.name);
        setTimezone(project.timezone);
        setTargetCurrency(project.target_currency || 'UYU');
        setExchangeRate(project.exchange_rate || 42.0);
    }, [project]);

    useEffect(() => {
        const nameChanged = name !== project.name;
        const tzChanged = timezone !== project.timezone;
        const currencyChanged = targetCurrency !== (project.target_currency || 'UYU');
        const rateChanged = exchangeRate !== (project.exchange_rate || 42.0);
        setHasChanges(nameChanged || tzChanged || currencyChanged || rateChanged);
    }, [name, timezone, targetCurrency, exchangeRate, project]);

    const handleSave = async () => {
        try {
            setSaving(true);
            const response = await fetch('/api/config', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    project_id: project.id,
                    name,
                    timezone,
                    target_currency: targetCurrency,
                    exchange_rate: exchangeRate,
                }),
            });

            if (response.ok) {
                onRefresh();
                setHasChanges(false);
                alert('Configuración guardada correctamente');
            } else {
                alert('Error al guardar la configuración');
            }
        } catch (error) {
            console.error('Error saving config:', error);
            alert('Error al guardar la configuración');
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="space-y-6">
            <div>
                <h3 className="text-lg font-semibold mb-2 text-slate-900">Configuración General</h3>
                <p className="text-sm text-slate-500">
                    Administra la configuración básica del proyecto.
                </p>
            </div>

            {/* Project Info */}
            <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                        <span className="material-symbols-outlined text-primary text-2xl">dataset</span>
                    </div>
                    <div>
                        <div className="text-slate-900 font-semibold">{project.name}</div>
                        <div className="text-xs text-slate-400 font-mono mt-0.5">{project.id}</div>
                    </div>
                </div>
            </div>

            {/* Name Input */}
            <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
                <label className="block text-sm font-medium text-slate-700 mb-3">
                    Nombre del Proyecto
                </label>
                <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-3 bg-white border border-slate-200 rounded-lg text-slate-900 placeholder-slate-400 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                    placeholder="Ej: Mi Tienda"
                />
            </div>

            {/* Timezone Select */}
            <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
                <label className="block text-sm font-medium text-slate-700 mb-3">
                    Zona Horaria
                </label>
                <select
                    value={timezone}
                    onChange={(e) => setTimezone(e.target.value)}
                    className="w-full px-4 py-3 bg-white border border-slate-200 rounded-lg text-slate-900 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all cursor-pointer"
                >
                    {TIMEZONES.map((tz) => (
                        <option key={tz} value={tz}>
                            {tz}
                        </option>
                    ))}
                </select>
                <p className="text-xs text-slate-400 mt-3 flex items-center gap-1">
                    <span className="material-symbols-outlined text-xs">info</span>
                    La zona horaria afecta el cálculo de "Hoy" y "Este mes".
                </p>
            </div>

            {/* Currency Select */}
            <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-3">
                            Moneda a Mostrar
                        </label>
                        <select
                            value={targetCurrency}
                            onChange={(e) => setTargetCurrency(e.target.value)}
                            className="w-full px-4 py-3 bg-white border border-slate-200 rounded-lg text-slate-900 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all cursor-pointer"
                        >
                            <option value="UYU">Pesos Uruguayos (UYU)</option>
                            <option value="USD">Dólares (USD)</option>
                        </select>
                        <p className="text-xs text-slate-400 mt-3 flex items-center gap-1">
                            <span className="material-symbols-outlined text-xs">info</span>
                            Solo aplica visualmente.
                        </p>
                    </div>
                    {targetCurrency === 'USD' && (
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-3">
                                Tipo de Cambio (UYU → USD)
                            </label>
                            <input
                                type="number"
                                step="any"
                                value={exchangeRate}
                                onChange={(e) => setExchangeRate(parseFloat(e.target.value) || 0)}
                                className="w-full px-4 py-3 bg-white border border-slate-200 rounded-lg text-slate-900 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                                placeholder="Ej: 42.5"
                            />
                            <p className="text-xs text-slate-400 mt-3 flex items-center gap-1">
                                <span className="material-symbols-outlined text-xs">info</span>
                                Tasa usada para dividir los ingresos (Ej: Ingreso / 42.5).
                            </p>
                        </div>
                    )}
                </div>
            </div>

            {/* Save Button */}
            <div className="flex items-center gap-4">
                <button
                    onClick={handleSave}
                    disabled={saving || !hasChanges}
                    className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-dark disabled:opacity-50 disabled:cursor-not-allowed transition-all font-medium shadow-sm hover:shadow flex items-center gap-2"
                >
                    <span className="material-symbols-outlined text-[20px]">{saving ? 'sync' : 'save'}</span>
                    {saving ? 'Guardando...' : 'Guardar Cambios'}
                </button>

                {hasChanges && (
                    <span className="text-sm text-amber-600 flex items-center gap-1">
                        <span className="material-symbols-outlined text-[16px]">warning</span>
                        Tienes cambios sin guardar
                    </span>
                )}
            </div>
        </div>
    );
}
