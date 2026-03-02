import { MetricCard } from './MetricCard';

interface SettersMetricsGridProps {
    metrics: Record<string, number>;
    trends?: Record<string, number>;
}

export function SettersMetricsGrid({ metrics, trends = {} }: SettersMetricsGridProps) {
    // Primera fila: Métricas Generales
    const mainCards = [
        {
            key: 'ai_message_sent',
            title: 'Contactos Únicos',
            icon: 'chat',
            value: metrics.ai_message_sent || 0,
            trend: trends.ai_message_sent,
            highlighted: true, // Métricas principal para ventas/mensajes
        },
        {
            key: 'conversations_started',
            title: 'Nuevo Lead',
            icon: 'chat_bubble_outline',
            value: metrics.conversations_started || 0,
            trend: trends.conversations_started,
        },
        {
            key: 'conversations_closed',
            title: 'Conversaciones Cerradas',
            icon: 'mark_chat_read',
            value: metrics.conversations_closed || 0,
            trend: trends.conversations_closed,
        },
        {
            key: 'second_follow_up',
            title: 'Seguimientos',
            icon: 'looks_two',
            value: metrics.second_follow_up || 0,
            trend: trends.second_follow_up,
        },
    ];

    // Segunda grilla: Estados de Clientes (4 columnas = 2 filas de 4)
    const statesCards = [
        {
            key: 'instagram_follower',
            title: 'Nuevos Seguidores',
            icon: 'group_add',
            value: metrics.instagram_follower || 0,
            trend: trends.instagram_follower,
            highlighted: false
        },
        {
            key: 'state_new_construction',
            title: 'Obra desde cero',
            icon: 'home_work',
            value: metrics.state_new_construction || 0,
            trend: trends.state_new_construction,
            highlighted: false
        },
        {
            key: 'state_construction_over_150',
            title: 'Obra + planos > 150m²',
            icon: 'architecture',
            value: metrics.state_construction_over_150 || 0,
            trend: trends.state_construction_over_150,
            highlighted: false
        },
        {
            key: 'state_link_sent',
            title: 'Link de agenda enviado',
            icon: 'link',
            value: metrics.state_link_sent || 0,
            trend: trends.state_link_sent,
            highlighted: false
        },
        {
            key: 'state_scheduled_video_sent',
            title: 'Agendó + video enviado',
            icon: 'smart_display',
            value: metrics.state_scheduled_video_sent || 0,
            trend: trends.state_scheduled_video_sent,
            highlighted: false
        },
        {
            key: 'state_scheduled_video_sent_under_150',
            title: 'Agendó + video enviado < 150m²',
            icon: 'video_camera_front',
            value: metrics.state_scheduled_video_sent_under_150 || 0,
            trend: trends.state_scheduled_video_sent_under_150,
            highlighted: false
        },
        {
            key: 'state_scheduled_video_sent_remodel_over_150',
            title: 'Agendó + video enviado reforma > 150m²',
            icon: 'handyman',
            value: metrics.state_scheduled_video_sent_remodel_over_150 || 0,
            trend: trends.state_scheduled_video_sent_remodel_over_150,
            highlighted: false
        },
        {
            key: 'avg_link_to_schedule_hours',
            title: 'Tiempo Link → Agendado (prom.)',
            icon: 'avg_time',
            value: metrics.avg_link_to_schedule_hours != null ? `${metrics.avg_link_to_schedule_hours}hs` : '—',
            trend: undefined,
            highlighted: false
        },
    ];

    return (
        <div className="space-y-8 mb-8">
            {/* Sección de Métricas Generales */}
            <div>
                <h3 className="text-lg font-medium text-slate-800 mb-4 flex items-center gap-2">
                    <span className="material-symbols-outlined text-purple-600">monitoring</span>
                    Métricas Generales
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {mainCards.map((card) => (
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
            </div>

            {/* Sección de Estados de Clientes */}
            <div>
                <h3 className="text-lg font-medium text-slate-800 mb-4 flex items-center gap-2 pt-2 border-t border-slate-100">
                    <span className="material-symbols-outlined text-emerald-600">group_work</span>
                    Estados de Clientes
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {statesCards.map((card) => (
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
            </div>
        </div>
    );
}
