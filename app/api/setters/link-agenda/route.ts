import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';
export const revalidate = 0;

/**
 * GET /api/setters/link-agenda
 *
 * Devuelve el conteo de links de agenda enviados (state_link_sent) del proyecto FA Interiores.
 *
 * Query params:
 *   start  - fecha inicio en formato YYYY-MM-DD (default: últimos 30 días)
 *   end    - fecha fin en formato YYYY-MM-DD (default: hoy)
 *   trend  - "true" para incluir desglose diario
 */
export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;

        // Resolve FA Interiores project
        const { data: project, error: projectError } = await supabase
            .from('projects')
            .select('id, name')
            .eq('name', 'FA Interiores')
            .single();

        if (projectError || !project) {
            return NextResponse.json(
                { error: 'Proyecto FA Interiores no encontrado' },
                { status: 404 }
            );
        }

        // Date range (default: last 30 days)
        const today = new Date();
        const defaultFrom = new Date(today);
        defaultFrom.setDate(today.getDate() - 30);

        const from = searchParams.get('start') || defaultFrom.toISOString().split('T')[0];
        const to = searchParams.get('end') || today.toISOString().split('T')[0];
        const includeTrend = searchParams.get('trend') === 'true';

        // Fetch state_link_sent events for the date range
        const fromDate = new Date(`${from}T03:00:00.000Z`);
        const toDate = new Date(`${to}T03:00:00.000Z`);
        toDate.setDate(toDate.getDate() + 1);

        const { data: events, error } = await supabase
            .from('ai_events')
            .select('created_at, conversation_id')
            .eq('project_id', project.id)
            .eq('event_type', 'state_link_sent')
            .gte('created_at', fromDate.toISOString())
            .lt('created_at', toDate.toISOString())
            .order('created_at', { ascending: true });

        if (error) {
            console.error('Error fetching link-agenda:', error);
            return NextResponse.json(
                { error: 'Error al obtener los datos' },
                { status: 500 }
            );
        }

        const total = events?.length ?? 0;

        // Build daily trend if requested
        let trend: Array<{ date: string; value: number }> | undefined;
        if (includeTrend && events) {
            const dateCounts: Record<string, number> = {};

            // Initialize all dates with 0
            const cursor = new Date(from);
            const end = new Date(to);
            while (cursor <= end) {
                dateCounts[cursor.toISOString().split('T')[0]] = 0;
                cursor.setDate(cursor.getDate() + 1);
            }

            // Count per day (UTC-3 Argentina)
            events.forEach((event) => {
                const localTime = new Date(new Date(event.created_at).getTime() - 3 * 60 * 60 * 1000);
                const dateStr = localTime.toISOString().split('T')[0];
                if (dateCounts[dateStr] !== undefined) {
                    dateCounts[dateStr]++;
                }
            });

            trend = Object.entries(dateCounts)
                .sort(([a], [b]) => a.localeCompare(b))
                .map(([date, value]) => ({
                    date: new Date(date).toLocaleDateString('es-ES', { weekday: 'short', day: 'numeric', month: 'short' }),
                    value,
                }));
        }

        return NextResponse.json(
            {
                project: { id: project.id, name: project.name },
                metric: 'link_agenda_enviado',
                total,
                date_range: { from, to },
                ...(trend !== undefined && { trend }),
            },
            {
                headers: {
                    'Cache-Control': 'no-store, no-cache, must-revalidate',
                    'Pragma': 'no-cache',
                    'Expires': '0',
                },
            }
        );
    } catch (error) {
        console.error('Unexpected error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
