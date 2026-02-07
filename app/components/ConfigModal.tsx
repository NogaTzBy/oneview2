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
        { key: 'general', label: 'General', icon: '⚙️' },
        { key: 'ingesta', label: 'Ingesta', icon: '📥' },
        { key: 'webhook', label: 'Webhook', icon: '🔔' },
        { key: 'backups', label: 'Respaldos', icon: '💾' },
    ];

    return (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-[#161B22] rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col border border-[#30363D]">
                {/* Header */}
                <div className="p-6 border-b border-[#30363D]">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-bold text-white">Configuración del Proyecto</h2>
                        <button
                            onClick={onClose}
                            className="text-[#8B949E] hover:text-white text-2xl transition-colors"
                        >
                            ×
                        </button>
                    </div>
                </div>

                {/* Tabs */}
                <div className="border-b border-[#30363D]">
                    <nav className="flex px-6" aria-label="Tabs">
                        {tabs.map((tab) => (
                            <button
                                key={tab.key}
                                onClick={() => setActiveTab(tab.key)}
                                className={`
                                    px-4 py-3 text-sm font-medium border-b-2 transition-colors
                                    ${activeTab === tab.key
                                        ? 'border-[#7C3AED] text-[#7C3AED]'
                                        : 'border-transparent text-[#8B949E] hover:text-white hover:border-[#30363D]'
                                    }
                                `}
                            >
                                <span className="mr-2">{tab.icon}</span>
                                {tab.label}
                            </button>
                        ))}
                    </nav>
                </div>

                {/* Tab Content */}
                <div className="flex-1 overflow-y-auto p-6">
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
