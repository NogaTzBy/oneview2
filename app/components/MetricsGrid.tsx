import { MetricCard } from './MetricCard';
import { Metric, Widget } from '../lib/types';

interface MetricsGridProps {
    metrics: Record<string, number>;
    widgets: Widget[];
}

const ICON_MAP: Record<string, string> = {
    conversations_started: '💬',
    conversations_closed: '✅',
    closure_rate: '📊',
    human_escalations: '👤',
    complaints: '⚠️',
    ai_purchases: '🛒',
    payment_messages: '💳',
    tracking_codes: '📦',
    template_opens: '📨',
    windows_24h: '⏰',
};

// Generar tendencias aleatorias para demo (-15 a +15%)
const generateTrend = (): number => {
    return Math.random() * 30 - 15; // Rango -15 a +15
};

export function MetricsGrid({ metrics, widgets }: MetricsGridProps) {
    const mainKPIs = [
        { key: 'conversations_started', label: 'Conversaciones Iniciadas' },
        { key: 'conversations_closed', label: 'Conversaciones Cerradas' },
        { key: 'closure_rate', label: 'Tasa de Cierre' },
    ];

    const visibleWidgets = widgets.filter((w) => w.is_visible);

    return (
        <div className="space-y-6">
            {/* Main KPIs */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {mainKPIs.map((kpi) => (
                    <MetricCard
                        key={kpi.key}
                        title={kpi.label}
                        value={
                            kpi.key === 'closure_rate'
                                ? `${metrics[kpi.key] || 0}%`
                                : metrics[kpi.key] || 0
                        }
                        icon={ICON_MAP[kpi.key] || '📊'}
                        size="large"
                        trend={generateTrend()}
                    />
                ))}
            </div>

            {/* Secondary Widgets */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {visibleWidgets
                    .filter((w) => !mainKPIs.some((kpi) => kpi.key === w.widget_key))
                    .map((widget) => {
                        let value = metrics[widget.widget_key] || 0;

                        // Handle combined widgets like payment_messages
                        if (widget.widget_key === 'payment_messages') {
                            value =
                                (metrics.pending_payment_sent || 0) +
                                (metrics.confirmed_payment_sent || 0);
                        }

                        return (
                            <MetricCard
                                key={widget.id}
                                title={widget.label}
                                value={value}
                                icon={ICON_MAP[widget.widget_key] || '📊'}
                                size="small"
                                trend={generateTrend()}
                            />
                        );
                    })}
            </div>
        </div>
    );
}
