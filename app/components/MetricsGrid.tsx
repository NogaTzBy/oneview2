import { MetricCard } from './MetricCard';
import { Metric, Widget } from '../lib/types';

interface MetricsGridProps {
    metrics: Record<string, number>;
    widgets: Widget[];
}

export function MetricsGrid({ metrics, widgets }: MetricsGridProps) {
    // Definir las 8 tarjetas exactamente como en el HTML de referencia
    const metricCards = [
        {
            key: 'conversations_started',
            title: 'Conversaciones Iniciadas',
            icon: 'chat_bubble_outline',
            value: metrics.conversations_started || 0,
            trend: 12,
        },
        {
            key: 'conversations_closed',
            title: 'Conversaciones Cerradas',
            icon: 'check_circle_outline',
            value: metrics.conversations_closed || 0,
            trend: 8,
        },
        {
            key: 'closure_rate',
            title: 'Tasa de Cierre',
            icon: 'pie_chart',
            value: `${metrics.closure_rate || 0}%`,
            trend: 5.4,
            highlighted: true, // Tarjeta destacada con purple-highlight
        },
        {
            key: 'ai_purchases',
            title: 'Ingresos por IA',
            icon: 'shopping_bag',
            value: `$${(metrics.ai_purchases || 0).toLocaleString('en-US', { minimumFractionDigits: 1, maximumFractionDigits: 1 })}k`,
            trend: 24,
        },
        {
            key: 'human_escalations',
            title: 'Derivaciones a Humano',
            icon: 'person_outline',
            value: metrics.human_escalations || 0,
            trend: -2,
        },
        {
            key: 'complaints',
            title: 'Reclamos Abiertos',
            icon: 'warning_amber',
            value: metrics.complaints || 0,
            trend: 0,
        },
        {
            key: 'template_opens',
            title: 'Aperturas de Plantilla',
            icon: 'mail_outline',
            value: metrics.template_opens || 0,
            trend: 15,
        },
        {
            key: 'windows_24h',
            title: 'Respuesta Ventana 24h',
            icon: 'schedule',
            value: `${metrics.windows_24h || 0}%`,
            trend: undefined, // Sin badge de tendencia
        },
    ];

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {metricCards.map((card) => (
                <MetricCard
                    key={card.key}
                    title={card.title}
                    value={card.value}
                    icon={card.icon}
                    trend={card.trend}
                    highlighted={card.highlighted}
                />
            ))}
        </div>
    );
}
