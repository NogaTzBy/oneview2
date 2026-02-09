'use client';

import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface TrendChartProps {
    data: {
        date: string;
        value: number;
    }[];
    title: string;
}

const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-white border border-slate-200 rounded-lg p-3 shadow-xl">
                <p className="text-slate-500 text-sm mb-1">{label}</p>
                <p className="text-slate-900 font-bold text-lg">
                    {payload[0].value}
                </p>
            </div>
        );
    }
    return null;
};

export function TrendChart({ data, title }: TrendChartProps) {
    return (
        <div className="glass-panel bg-white rounded-3xl p-8 shadow-soft border border-slate-200 relative overflow-hidden">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h3 className="text-xl font-bold text-slate-900">{title}</h3>
                    <p className="text-sm text-slate-500 mt-1">Ingresos generados en los últimos 7 días</p>
                </div>
                <div className="text-right">
                    <span className="block text-3xl font-bold text-primary">
                        ${(data.reduce((sum, item) => sum + item.value, 0) / 1000).toLocaleString('en-US', { minimumFractionDigits: 1, maximumFractionDigits: 1 })}k
                    </span>
                    <span className="text-sm text-slate-400">Ingresos Totales</span>
                </div>
            </div>

            <ResponsiveContainer width="100%" height={300}>
                <AreaChart
                    data={data}
                    margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                >
                    <defs>
                        <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#7C3AED" stopOpacity={0.2} />
                            <stop offset="95%" stopColor="#7C3AED" stopOpacity={0} />
                        </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                    <XAxis
                        dataKey="date"
                        stroke="#9CA3AF"
                        tick={{ fill: '#9CA3AF', fontSize: 12 }}
                        tickLine={{ stroke: '#E5E7EB' }}
                    />
                    <YAxis
                        stroke="#9CA3AF"
                        tick={{ fill: '#9CA3AF', fontSize: 12 }}
                        tickLine={{ stroke: '#E5E7EB' }}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Area
                        type="monotone"
                        dataKey="value"
                        stroke="#7C3AED"
                        strokeWidth={3}
                        fillOpacity={1}
                        fill="url(#colorValue)"
                    />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    );
}
