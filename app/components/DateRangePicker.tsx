'use client';

import React, { useState } from 'react';
import { DateRange } from '../lib/types';

interface DateRangePickerProps {
    value: DateRange;
    onChange: (range: DateRange) => void;
}

export function DateRangePicker({ value, onChange }: DateRangePickerProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [customFrom, setCustomFrom] = useState('');
    const [customTo, setCustomTo] = useState('');

    const presets: DateRange[] = [
        {
            from: new Date().toISOString().split('T')[0],
            to: new Date().toISOString().split('T')[0],
            label: 'Hoy',
        },
        {
            from: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            to: new Date().toISOString().split('T')[0],
            label: 'Últimos 7 días',
        },
        {
            from: new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0],
            to: new Date().toISOString().split('T')[0],
            label: 'Este mes',
        },
    ];

    const handleApplyCustom = () => {
        if (customFrom && customTo) {
            onChange({
                from: customFrom,
                to: customTo,
                label: 'Rango personalizado',
            });
            setIsOpen(false);
        }
    };

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 px-4 py-2 bg-[#161B22] border border-[#30363D] rounded-lg hover:border-[#7C3AED] transition-colors text-white"
            >
                <span className="text-xl">📅</span>
                <span className="font-medium">{value.label}</span>
                <span className="text-[#8B949E]">▼</span>
            </button>

            {isOpen && (
                <div className="absolute top-full left-0 mt-2 w-80 bg-[#161B22] rounded-xl shadow-2xl border border-[#30363D] z-50 overflow-hidden">
                    <div className="p-2">
                        <div className="text-sm font-semibold text-white px-3 py-2 mb-1">
                            Ciclo actual
                        </div>

                        {/* Presets */}
                        {presets.map((preset) => (
                            <button
                                key={preset.label}
                                onClick={() => {
                                    onChange(preset);
                                    setIsOpen(false);
                                }}
                                className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${value.label === preset.label
                                        ? 'bg-[#7C3AED] text-white'
                                        : 'text-[#8B949E] hover:bg-[#1A1F2B] hover:text-white'
                                    }`}
                            >
                                {preset.label}
                            </button>
                        ))}

                        {/* Custom Range */}
                        <div className="mt-4 p-3 bg-[#1A1F2B] rounded-lg">
                            <div className="text-sm font-semibold text-white mb-3">
                                Rango personalizado
                            </div>

                            <div className="space-y-3">
                                <div>
                                    <label className="block text-xs text-[#8B949E] mb-1">Desde</label>
                                    <input
                                        type="date"
                                        value={customFrom}
                                        onChange={(e) => setCustomFrom(e.target.value)}
                                        className="w-full px-3 py-2 bg-[#0D1117] border border-[#30363D] rounded-lg text-white focus:border-[#7C3AED] focus:outline-none"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs text-[#8B949E] mb-1">Hasta</label>
                                    <input
                                        type="date"
                                        value={customTo}
                                        onChange={(e) => setCustomTo(e.target.value)}
                                        className="w-full px-3 py-2 bg-[#0D1117] border border-[#30363D] rounded-lg text-white focus:border-[#7C3AED] focus:outline-none"
                                    />
                                </div>

                                <button
                                    onClick={handleApplyCustom}
                                    disabled={!customFrom || !customTo}
                                    className="w-full px-3 py-2 bg-[#7C3AED] hover:bg-[#8B5CF6] disabled:bg-[#30363D] disabled:text-[#8B949E] text-white font-medium rounded-lg transition-colors"
                                >
                                    Aplicar
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
