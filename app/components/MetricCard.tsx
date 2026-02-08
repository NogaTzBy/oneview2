interface MetricCardProps {
    title: string;
    value: string | number;
    icon: string; // Material Symbol name
    trend?: number; // Porcentaje de cambio
    highlighted?: boolean; // Para la tarjeta de tasa de cierre
}

export function MetricCard({ title, value, icon, trend, highlighted = false }: MetricCardProps) {
    const getTrendColor = () => {
        if (trend === undefined || trend === 0) return 'bg-slate-100 text-slate-500';
        return trend > 0
            ? 'bg-green-100 text-green-500'
            : 'bg-red-100 text-red-500';
    };

    const getTrendDisplay = () => {
        if (trend === undefined) return null;
        const sign = trend > 0 ? '+' : '';
        return `${sign}${trend}%`;
    };

    const cardClass = highlighted
        ? 'purple-highlight p-6 rounded-2xl flex flex-col justify-between h-40 relative shadow-soft'
        : 'metric-card flex flex-col justify-between h-40 relative';

    const iconBgClass = highlighted
        ? 'bg-white/50 text-primary'
        : 'bg-slate-100 text-slate-900';

    const valueClass = highlighted
        ? 'text-3xl font-bold text-slate-900 tracking-tight'
        : 'text-3xl font-bold text-slate-900 tracking-tight';

    const titleClass = highlighted
        ? 'text-sm font-medium text-primary-dark/70 mt-1'
        : 'text-sm font-medium text-slate-500 mt-1';

    const trendBadgeClass = highlighted
        ? 'text-primary bg-white/60 px-2 py-0.5 rounded-full text-xs font-semibold'
        : `${getTrendColor()} px-2 py-0.5 rounded-full text-xs font-semibold`;

    return (
        <div className={cardClass}>
            {highlighted && (
                <div className="absolute -right-6 -top-6 w-24 h-24 bg-primary/20 rounded-full blur-2xl pointer-events-none"></div>
            )}

            <div className="flex justify-between items-start relative z-10">
                <div className={`p-2 rounded-lg ${iconBgClass}`}>
                    <span className="material-symbols-outlined">{icon}</span>
                </div>
                {trend !== undefined && (
                    <span className={trendBadgeClass}>
                        {getTrendDisplay()}
                    </span>
                )}
            </div>

            <div className="relative z-10">
                <h3 className={valueClass}>{value}</h3>
                <p className={titleClass}>{title}</p>
            </div>
        </div>
    );
}
