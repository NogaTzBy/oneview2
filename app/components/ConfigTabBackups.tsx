'use client';

import React from 'react';
import { Project } from '../lib/types';

interface ConfigTabBackupsProps {
    project: Project;
    onRefresh: () => void;
}

export function ConfigTabBackups({ project, onRefresh }: ConfigTabBackupsProps) {
    return (
        <div className="space-y-6">
            <div>
                <h3 className="text-lg font-semibold mb-2 text-slate-900">Respaldos y Recuperación</h3>
                <p className="text-sm text-slate-500">
                    Gestiona copias de seguridad de tus datos y configuración.
                </p>
            </div>

            <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
                <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                        <span className="material-symbols-outlined text-primary text-2xl">backup</span>
                    </div>
                    <div className="flex-1">
                        <h4 className="text-base font-semibold text-slate-900">Backup Automático</h4>
                        <p className="text-sm text-slate-500 mt-0.5">Los datos se respaldan diariamente de forma automática</p>
                    </div>
                    <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full">
                        Activo
                    </span>
                </div>

                <div className="pt-4 border-t border-slate-200">
                    <button className="px-6 py-3 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-all font-medium flex items-center gap-2 text-slate-700">
                        <span className="material-symbols-outlined text-[20px]">download</span>
                        Descargar Último Backup
                    </button>
                </div>
            </div>
        </div>
    );
}
