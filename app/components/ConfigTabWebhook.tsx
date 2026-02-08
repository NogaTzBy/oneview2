'use client';

import React from 'react';
import { Project } from '../lib/types';

interface ConfigTabWebhookProps {
    project: Project;
    onRefresh: () => void;
}

export function ConfigTabWebhook({ project, onRefresh }: ConfigTabWebhookProps) {
    return (
        <div className="space-y-6">
            <div>
                <h3 className="text-lg font-semibold mb-2 text-slate-900">Configuración de Webhooks</h3>
                <p className="text-sm text-slate-500">
                    Configura notificaciones en tiempo real para eventos de tu aplicación.
                </p>
            </div>

            <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
                <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                        <span className="material-symbols-outlined text-primary text-2xl">webhook</span>
                    </div>
                    <div>
                        <h4 className="text-base font-semibold text-slate-900">URL del Webhook</h4>
                        <p className="text-sm text-slate-500 mt-0.5">Configura la URL donde recibirás las notificaciones</p>
                    </div>
                </div>

                <input
                    type="url"
                    placeholder="https://tu-dominio.com/webhook"
                    className="w-full px-4 py-3 bg-white border border-slate-200 rounded-lg text-slate-900 placeholder-slate-400 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                />

                <button className="mt-4 px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-dark transition-all font-medium shadow-sm hover:shadow flex items-center gap-2">
                    <span className="material-symbols-outlined text-[20px]">save</span>
                    Guardar Webhook
                </button>
            </div>
        </div>
    );
}
