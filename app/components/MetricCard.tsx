interface MetricCardProps {
    title: string;
    value: string | number;
    icon: string;
    size?: 'small' | 'large';
    trend?: number; // Porcentaje de cambio (-100 a 100)
}

export function MetricCard({ title, value, icon, size = 'small', trend }: MetricCardProps) {
    const isPositive = trend !== undefined && trend > 0;
    const isNegative = trend !== undefined && trend < 0;
    const hasChange = trend !== undefined && trend !== 0;

    return (
        <div className={`metric-card ${size === 'large' ? 'col-span-2' : ''}`}>
            <div className="flex items-start justify-between mb-3">
                <span className="text-3xl opacity-80">{icon}</span>
                {hasChange && (
                    <div className={`flex items-center gap-1 text-sm font-medium px-2 py-1 rounded-md ${isPositive ? 'bg-[#3FB950]/10 text-[#3FB950]' :
                            isNegative ? 'bg-[#F85149]/10 text-[#F85149]' :
                                'bg-[#8B949E]/10 text-[#8B949E]'
                        }`}>
                        <span>{isPositive ? '↗' : isNegative ? '↘' : '→'}</span>
                        <span>{Math.abs(trend).toFixed(1)}%</span>
                    </div>
                )}
            </div>

            <div>
                <div className={`font-bold mb-2 ${size === 'large' ? 'text-5xl' : 'text-3xl'
                    } text-white`}>
                    {value}
                </div>
                <div className="text-sm text-[#8B949E] font-medium">
                    {title}
                </div>
            </div>
        </div>
    );
}
