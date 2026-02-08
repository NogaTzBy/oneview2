'use client';

import React from 'react';
import { DateRangePicker } from './DateRangePicker';
import { ProjectSelector } from './ProjectSelector';
import { DateRange } from '../lib/types';

interface MobileMenuProps {
    isOpen: boolean;
    onClose: () => void;
    dateRange: DateRange;
    onDateRangeChange: (range: DateRange) => void;
    onRefresh: () => void;
    onConfigure: () => void;
}

export function MobileMenu({
    isOpen,
    onClose,
    dateRange,
    onDateRangeChange,
    onRefresh,
    onConfigure,
}: MobileMenuProps) {
    return (
        <>
            {/* Overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/60 z-40 md:hidden"
                    onClick={onClose}
                />
            )}

            {/* Sliding Panel */}
            <div
                className={`fixed top-0 right-0 h-full w-80 bg-[#161B22] border-l border-[#30363D] z-50 transform transition-transform duration-300 ease-in-out md:hidden ${isOpen ? 'translate-x-0' : 'translate-x-full'
                    }`}
            >
                <div className="p-6 space-y-6">
                    {/* Close Button */}
                    <div className="flex justify-between items-center">
                        <h2 className="text-xl font-bold text-white">Menú</h2>
                        <button
                            onClick={onClose}
                            className="text-[#8B949E] hover:text-white transition-colors"
                        >
                            <svg
                                className="w-6 h-6"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M6 18L18 6M6 6l12 12"
                                />
                            </svg>
                        </button>
                    </div>

                    {/* Project Selector */}
                    <div>
                        <label className="block text-sm font-medium text-[#8B949E] mb-2">
                            Proyecto
                        </label>
                        <ProjectSelector />
                    </div>

                    {/* Date Range Picker */}
                    <div>
                        <label className="block text-sm font-medium text-[#8B949E] mb-2">
                            Rango de Fechas
                        </label>
                        <DateRangePicker value={dateRange} onChange={onDateRangeChange} />
                    </div>

                    {/* Action Buttons */}
                    <div className="space-y-3 pt-4 border-t border-[#30363D]">
                        <button
                            onClick={() => {
                                onRefresh();
                                onClose();
                            }}
                            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-[#0D1117] border border-[#30363D] rounded-lg hover:border-[#7C3AED] transition-colors text-white"
                        >
                            <svg
                                className="w-5 h-5"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                                />
                            </svg>
                            Actualizar
                        </button>

                        <button
                            onClick={() => {
                                onConfigure();
                                onClose();
                            }}
                            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-[#7C3AED] hover:bg-[#8B5CF6] rounded-lg transition-colors text-white font-medium"
                        >
                            <svg
                                className="w-5 h-5"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                                />
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                />
                            </svg>
                            Configurar
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}
