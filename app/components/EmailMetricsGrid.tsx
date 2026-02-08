'use client';

import React from 'react';

interface EmailMetric {
    label: string;
    value: number;
    icon: string;
}

interface EmailMetricsGridProps {
    metrics: {
        email_cart_abandoned?: number;
        email_buyer_x1?: number;
        email_buyer_recurring?: number;
    };
}

export function EmailMetricsGrid({ metrics }: EmailMetricsGridProps) {
    const emailMetrics: EmailMetric[] = [
        {
            label: 'Carritos Abandonados',
            value: metrics.email_cart_abandoned || 0,
            icon: 'shopping_cart'
        },
        {
            label: 'Compradores x1',
            value: metrics.email_buyer_x1 || 0,
            icon: 'person'
        },
        {
            label: 'Compradores Recurrentes',
            value: metrics.email_buyer_recurring || 0,
            icon: 'repeat'
        }
    ];

    return (
        <div className="space-y-4 mt-8">
            <h3 className="text-sm font-semibold text-slate-700 uppercase tracking-wide">
                Email Marketing
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {emailMetrics.map((metric) => (
                    <div
                        key={metric.label}
                        className="metric-card flex flex-col justify-between h-40 relative"
                    >
                        <div className="flex items-center justify-between">
                            <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center">
                                <span className="material-symbols-outlined text-slate-900 text-xl">
                                    {metric.icon}
                                </span>
                            </div>
                        </div>
                        <div>
                            <p className="text-3xl font-bold text-slate-900 tracking-tight">
                                {metric.value.toLocaleString()}
                            </p>
                            <p className="text-sm font-medium text-slate-500 mt-1">{metric.label}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
