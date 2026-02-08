'use client';

import React from 'react';
import { Project } from '../lib/types';

interface ConfigTabIngestaProps {
    project: Project;
    onRefresh: () => void;
}

export function ConfigTabIngesta({ project, onRefresh }: ConfigTabIngestaProps) {
    return (
        <div className="space-y-6">
            <div>
                <h3 className="text-lg font-semibold mb-2 text-slate-900">Configuración de Ingestión</h3>
                <p className="text-sm text-slate-500">
                    Gestiona tus claves de API y puntos finales para la entrada de datos.
                </p>
            </div>

            {/* Token Section */}
            <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <h4 className="text-base font-semibold text-slate-900">Token de Ingestión</h4>
                        <p className="text-sm text-slate-500 mt-1">Utiliza este token para autenticar tus peticiones.</p>
                    </div>
                    <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-bold rounded uppercase tracking-wide">
                        Activo
                    </span>
                </div>

                <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg border border-slate-200">
                    <code className="text-sm font-mono text-slate-700 flex-1">
                        {project.ingest_token || 'sk_live_...'}
                    </code>
                    <button className="flex items-center gap-2 bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                        <span className="material-symbols-outlined text-[18px]">content_copy</span>
                        Copiar
                    </button>
                </div>
            </div>

            {/* Endpoint  URL */}
            <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
                <h4 className="text-base font-semibold text-slate-900 mb-3">URL del Endpoint</h4>
                <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg border border-slate-200">
                    <span className="material-symbols-outlined text-slate-400">link</span>
                    <code className="text-sm font-mono text-slate-700 flex-1">
                        https://api.oneview.io/v1/events
                    </code>
                    <button className="text-slate-400 hover:text-primary transition-colors">
                        <span className="material-symbols-outlined text-[18px]">content_copy</span>
                    </button>
                </div>
            </div>
        </div>
    );
}
