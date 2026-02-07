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
    const [saving, setSaving] = useState(false);
    const [hasChanges, setHasChanges] = useState(false);

    useEffect(() => {
        setName(project.name);
        setTimezone(project.timezone);
    }, [project]);

    useEffect(() => {
        const nameChanged = name !== project.name;
        const tzChanged = timezone !== project.timezone;
        setHasChanges(nameChanged || tzChanged);
    }, [name, timezone, project]);

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
                <h3 className="text-lg font-semibold mb-2 text-white">Configuración General</h3>
                <p className="text-sm text-[#8B949E]">
                    Administra la configuración básica del proyecto.
                </p>
            </div>

            {/* Project Info */}
            <div className="bg-[#1A1F2B] rounded-lg p-4 border border-[#30363D]">
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-[#7C3AED]/20 rounded-lg flex items-center justify-center">
                        <span className="text-2xl">📊</span>
                    </div>
                    <div>
                        <div className="text-white font-semibold">{project.name}</div>
                        <div className="text-xs text-[#8B949E] font-mono">{project.id}</div>
                    </div>
                </div>
            </div>

            {/* Name Input */}
            <div className="bg-[#1A1F2B] rounded-lg p-4 border border-[#30363D]">
                <label className="block text-sm font-medium text-white mb-2">
                    Nombre del Proyecto
                </label>
                <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-3 bg-[#0D1117] border border-[#30363D] rounded-lg text-white placeholder-[#8B949E] focus:border-[#7C3AED] focus:ring-1 focus:ring-[#7C3AED] outline-none transition-colors"
                    placeholder="Ej: Mi Tienda"
                />
            </div>

            {/* Timezone Select */}
            <div className="bg-[#1A1F2B] rounded-lg p-4 border border-[#30363D]">
                <label className="block text-sm font-medium text-white mb-2">
                    Zona Horaria
                </label>
                <select
                    value={timezone}
                    onChange={(e) => setTimezone(e.target.value)}
                    className="w-full px-4 py-3 bg-[#0D1117] border border-[#30363D] rounded-lg text-white focus:border-[#7C3AED] focus:ring-1 focus:ring-[#7C3AED] outline-none transition-colors appearance-none cursor-pointer"
                >
                    {TIMEZONES.map((tz) => (
                        <option key={tz} value={tz} className="bg-[#0D1117]">
                            {tz}
                        </option>
                    ))}
                </select>
                <p className="text-xs text-[#8B949E] mt-2">
                    La zona horaria afecta el cálculo de "Hoy" y "Este mes".
                </p>
            </div>

            {/* Save Button */}
            <div className="flex items-center gap-4">
                <button
                    onClick={handleSave}
                    disabled={saving || !hasChanges}
                    className="px-6 py-3 bg-[#7C3AED] text-white rounded-lg hover:bg-[#8B5CF6] disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
                >
                    {saving ? '⏳ Guardando...' : '💾 Guardar Cambios'}
                </button>

                {hasChanges && (
                    <span className="text-sm text-[#F0883E]">
                        ⚠️ Tienes cambios sin guardar
                    </span>
                )}
            </div>
        </div>
    );
}
