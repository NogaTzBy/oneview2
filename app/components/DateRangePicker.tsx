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
            <span className="material-symbols-outlined text-[20px] text-primary absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none z-10">
                calendar_today
            </span>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="pl-10 pr-8 py-1.5 bg-transparent border-0 rounded-lg text-slate-900 font-medium text-sm focus:outline-none focus:bg-slate-100 transition-colors cursor-pointer hover:bg-slate-100 flex items-center gap-2"
            >
                {value.label}
            </button>
            <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none">
                <span className="material-symbols-outlined text-[16px] text-slate-400">expand_more</span>
            </div>

            {isOpen && (
                <>
                    <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
                    <div className="absolute top-full right-0 mt-2 w-64 glass-panel bg-white rounded-lg shadow-lg z-50 p-4">
                        <div className="space-y-2">
                            {presets.map((preset) => (
                                <button
                                    key={preset.label}
                                    onClick={() => {
                                        onChange(preset);
                                        setIsOpen(false);
                                    }}
                                    className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-100 text-sm text-slate-900 transition-colors"
                                >
                                    {preset.label}
                                </button>
                            ))}


                            {/* Custom Range */}
                            <div className="mt-4 p-3 bg-slate-100 rounded-lg">
                                <div className="text-sm font-semibold text-slate-900 mb-3">
                                    Rango personalizado
                                </div>

                                <div className="space-y-3">
                                    <div>
                                        <label className="text-xs font-medium text-slate-600 block mb-1">
                                            Desde
                                        </label>
                                        <input
                                            type="date"
                                            value={customFrom}
                                            onChange={(e) => setCustomFrom(e.target.value)}
                                            className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-900 focus:border-primary focus:outline-none"
                                        />
                                    </div>

                                    <div>
                                        <label className="text-xs font-medium text-slate-600 block mb-1">
                                            Hasta
                                        </label>
                                        <input
                                            type="date"
                                            value={customTo}
                                            onChange={(e) => setCustomTo(e.target.value)}
                                            className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-900 focus:border-primary focus:outline-none"
                                        />
                                    </div>
                                </div>

                                <button
                                    onClick={handleApplyCustom}
                                    disabled={!customFrom || !customTo}
                                    className="w-full mt-3 px-3 py-2 bg-primary hover:bg-primary-dark disabled:bg-slate-300 disabled:text-slate-500 text-white font-medium rounded-lg transition-colors"
                                >
                                    Aplicar
                                </button>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
