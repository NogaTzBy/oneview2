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
            <div className="bg-[#161B22] border border-[#30363D] rounded-lg p-3 shadow-xl">
                <p className="text-[#8B949E] text-sm mb-1">{label}</p>
                <p className="text-white font-bold text-lg">
                    {payload[0].value}
                </p>
            </div>
        );
    }
    return null;
};

export function TrendChart({ data, title }: TrendChartProps) {
    return (
        <div className="metric-card mt-8">
            <div className="mb-6">
                <h3 className="text-lg font-semibold text-white">{title}</h3>
                <p className="text-sm text-[#8B949E] mt-1">Last 7 days performance</p>
            </div>

            <ResponsiveContainer width="100%" height={300}>
                <AreaChart
                    data={data}
                    margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                >
                    <defs>
                        <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#7C3AED" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="#7C3AED" stopOpacity={0} />
                        </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#30363D" />
                    <XAxis
                        dataKey="date"
                        stroke="#8B949E"
                        tick={{ fill: '#8B949E', fontSize: 12 }}
                        tickLine={{ stroke: '#30363D' }}
                    />
                    <YAxis
                        stroke="#8B949E"
                        tick={{ fill: '#8B949E', fontSize: 12 }}
                        tickLine={{ stroke: '#30363D' }}
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
