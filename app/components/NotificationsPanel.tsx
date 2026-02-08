'use client';

import React from 'react';

interface Notification {
    id: string;
    created_at: string;
    metadata: any;
}

interface NotificationsPanelProps {
    notifications: Notification[];
    onClose: () => void;
}

export function NotificationsPanel({ notifications, onClose }: NotificationsPanelProps) {
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);

        if (diffMins < 1) return 'Hace un momento';
        if (diffMins < 60) return `Hace ${diffMins} min`;
        if (diffHours < 24) return `Hace ${diffHours}h`;
        if (diffDays === 1) return 'Ayer';
        if (diffDays < 7) return `Hace ${diffDays} días`;

        return date.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' });
    };

    const getProductName = (metadata: any) => {
        return metadata?.product_name || metadata?.product || 'Producto';
    };

    const getAmount = (metadata: any) => {
        const amount = metadata?.amount || metadata?.total || 0;
        return new Intl.NumberFormat('es-AR', {
            style: 'currency',
            currency: 'ARS'
        }).format(amount);
    };

    return (
        <>
            <div className="fixed inset-0 z-40" onClick={onClose} />
            <div className="absolute top-full right-0 mt-2 w-96 glass-panel bg-white rounded-lg shadow-lg z-50 overflow-hidden">
                {/* Header */}
                <div className="px-4 py-3 border-b border-slate-200">
                    <div className="flex items-center justify-between">
                        <h3 className="text-sm font-semibold text-slate-900">Notificaciones</h3>
                        <button
                            onClick={onClose}
                            className="p-1 rounded-full hover:bg-slate-100 text-slate-400 transition-colors"
                        >
                            <span className="material-symbols-outlined text-[18px]">close</span>
                        </button>
                    </div>
                </div>

                {/* Notifications List */}
                <div className="max-h-[400px] overflow-y-auto">
                    {notifications.length === 0 ? (
                        <div className="px-4 py-8 text-center">
                            <span className="material-symbols-outlined text-[48px] text-slate-300">notifications_off</span>
                            <p className="mt-2 text-sm text-slate-500">No hay notificaciones</p>
                        </div>
                    ) : (
                        notifications.map((notification) => (
                            <div
                                key={notification.id}
                                className="px-4 py-3 hover:bg-slate-50 transition-colors border-b border-slate-100 last:border-b-0"
                            >
                                <div className="flex gap-3">
                                    <div className="flex-shrink-0">
                                        <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                                            <span className="material-symbols-outlined text-[20px] text-green-600">shopping_bag</span>
                                        </div>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-slate-900">
                                            🤖 Compra realizada por IA
                                        </p>
                                        <p className="text-sm text-slate-600 mt-0.5">
                                            {getProductName(notification.metadata)}
                                        </p>
                                        <div className="flex items-center justify-between mt-1">
                                            <span className="text-xs font-semibold text-primary">
                                                {getAmount(notification.metadata)}
                                            </span>
                                            <span className="text-xs text-slate-400">
                                                {formatDate(notification.created_at)}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* Footer */}
                {notifications.length > 0 && (
                    <div className="px-4 py-2 border-t border-slate-200 bg-slate-50">
                        <button className="w-full text-center text-xs font-medium text-primary hover:text-primary-dark transition-colors">
                            Ver todas las notificaciones
                        </button>
                    </div>
                )}
            </div>
        </>
    );
}
