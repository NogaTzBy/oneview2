'use client';

import React, { useState } from 'react';
import { ConfigTabGeneral } from './ConfigTabGeneral';
import { ConfigTabIngesta } from './ConfigTabIngesta';
import { ConfigTabWebhook } from './ConfigTabWebhook';
import { ConfigTabBackups } from './ConfigTabBackups';
import { Project } from '../lib/types';

interface ConfigModalProps {
    isOpen: boolean;
    onClose: () => void;
    project: Project | null;
    onRefresh: () => void;
}

type TabKey = 'general' | 'ingesta' | 'webhook' | 'backups';

export function ConfigModal({ isOpen, onClose, project, onRefresh }: ConfigModalProps) {
    const [activeTab, setActiveTab] = useState<TabKey>('general');

    if (!isOpen || !project) return null;

    const tabs: { key: TabKey; label: string; icon: string }[] = [
        { key: 'general', label: 'General', icon: 'tune' },
        { key: 'ingesta', label: 'Ingesta', icon: 'cloud_upload' },
        { key: 'webhook', label: 'Webhook', icon: 'webhook' },
        { key: 'backups', label: 'Respaldos', icon: 'backup' },
    ];

    return (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col border border-slate-200">
                {/* Header */}
                <div className="px-6 py-4 border-b border-slate-200">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-semibold text-slate-900 tracking-tight">Configuración del Proyecto</h2>
                        <button
                            onClick={onClose}
                            className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
                        >
                            <span className="material-symbols-outlined text-[20px]">close</span>
                        </button>
                    </div>
                </div>

                {/* Tabs */}
                <div className="border-b border-slate-200 bg-slate-50/50">
                    <nav className="flex px-6" aria-label="Tabs">
                        {tabs.map((tab) => (
                            <button
                                key={tab.key}
                                onClick={() => setActiveTab(tab.key)}
                                className={`
                                    flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors
                                    ${activeTab === tab.key
                                        ? 'border-primary text-primary'
                                        : 'border-transparent text-slate-500 hover:text-slate-900 hover:border-slate-300'
                                    }
                                `}
                            >
                                <span className={`material-symbols-outlined text-[18px] ${activeTab === tab.key ? 'text-primary' : ''}`}>
                                    {tab.icon}
                                </span>
                                {tab.label}
                            </button>
                        ))}
                    </nav>
                </div>

                {/* Tab Content */}
                <div className="flex-1 overflow-y-auto p-6 bg-slate-50/30">
                    {activeTab === 'general' && (
                        <ConfigTabGeneral project={project} onRefresh={onRefresh} />
                    )}
                    {activeTab === 'ingesta' && (
                        <ConfigTabIngesta project={project} onRefresh={onRefresh} />
                    )}
                    {activeTab === 'webhook' && (
                        <ConfigTabWebhook project={project} onRefresh={onRefresh} />
                    )}
                    {activeTab === 'backups' && (
                        <ConfigTabBackups project={project} onRefresh={onRefresh} />
                    )}
                </div>
            </div>
        </div>
    );
}
