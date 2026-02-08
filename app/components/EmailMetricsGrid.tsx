'use client';

import React from 'react';

interface EmailMetric {
    label: string;
    value: number;
    icon: string;
    color: string;
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
            icon: 'shopping_cart',
            color: 'amber'
        },
        {
            label: 'Compradores x1',
            value: metrics.email_buyer_x1 || 0,
            icon: 'person',
            color: 'blue'
        },
        {
            label: 'Compradores Recurrentes',
            value: metrics.email_buyer_recurring || 0,
            icon: 'repeat',
            color: 'green'
        }
    ];

    const colorClasses = {
        amber: {
            bg: 'bg-amber-50',
            icon: 'text-amber-500',
            border: 'border-amber-200'
        },
        blue: {
            bg: 'bg-blue-50',
            icon: 'text-blue-500',
            border: 'border-blue-200'
        },
        green: {
            bg: 'bg-green-50',
            icon: 'text-green-500',
            border: 'border-green-200'
        }
    };

    return (
        <div className="space-y-4">
            <h3 className="text-sm font-semibold text-slate-700 uppercase tracking-wide">
                Email Marketing
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {emailMetrics.map((metric) => {
                    const colors = colorClasses[metric.color as keyof typeof colorClasses];
                    return (
                        <div
                            key={metric.label}
                            className={`${colors.bg} border ${colors.border} rounded-xl p-5 transition-all hover:shadow-md`}
                        >
                            <div className="flex items-center justify-between mb-3">
                                <div className={`w-10 h-10 ${colors.bg} rounded-lg flex items-center justify-center border ${colors.border}`}>
                                    <span className={`material-symbols-outlined ${colors.icon} text-xl`}>
                                        {metric.icon}
                                    </span>
                                </div>
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-slate-900">
                                    {metric.value.toLocaleString()}
                                </p>
                                <p className="text-sm text-slate-600 mt-1">{metric.label}</p>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
