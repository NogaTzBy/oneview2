import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const projectId = searchParams.get('projectId') || searchParams.get('project_id');
        const from = searchParams.get('start') || searchParams.get('from');
        const to = searchParams.get('end') || searchParams.get('to');
        const includeTrend = searchParams.get('trend') === 'true';
        const trendMetric = searchParams.get('metric_key') || 'ai_purchase';

        if (!projectId) {
            return NextResponse.json(
                { error: 'Missing project_id parameter' },
                { status: 400 }
            );
        }

        // Build date range filter
        let query = supabase
            .from('ai_events')
            .select('event_type, created_at, conversation_id, channel, metadata')
            .eq('project_id', projectId);

        if (from) {
            query = query.gte('created_at', from);
        }

        if (to) {
            // Add one day to include the entire 'to' date
            const toDate = new Date(to);
            toDate.setDate(toDate.getDate() + 1);
            query = query.lt('created_at', toDate.toISOString());
        }

        const { data: events, error } = await query.order('created_at', { ascending: false });

        if (error) {
            console.error('Error fetching events:', error);
            return NextResponse.json(
                { error: 'Failed to fetch events' },
                { status: 500 }
            );
        }

        // Aggregate metrics
        const metrics = {
            conversations_started: 0,
            conversations_closed: 0,
            closure_rate: 0,
            human_escalations: 0,
            complaints: 0,
            ai_purchases_count: 0, // Contador de ventas
            ai_purchases_revenue: 0, // Ingresos totales
            pending_payment_sent: 0,
            confirmed_payment_sent: 0,
            tracking_codes: 0,
            template_opens: 0,
            windows_24h: 0,
            email_cart_abandoned: 0,
            email_buyer_x1: 0,
            email_buyer_recurring: 0,

            // Setters IA Metrics
            ai_message_sent: 0,
            first_follow_up: 0,
            second_follow_up: 0,
            state_new_construction: 0,
            state_construction_over_150: 0,
            state_link_sent: 0,
            state_scheduled_video_sent: 0,
            state_scheduled_video_sent_under_150: 0,
            state_scheduled_video_sent_remodel_over_150: 0,
        };

        const conversationSet = new Set<string>();
        const closedConversations = new Set<string>();

        events.forEach((event) => {
            switch (event.event_type) {
                case 'conversation_started':
                    metrics.conversations_started++;
                    conversationSet.add(event.conversation_id);
                    break;
                case 'conversation_closed':
                    metrics.conversations_closed++;
                    closedConversations.add(event.conversation_id);
                    break;
                case 'human_escalation':
                    metrics.human_escalations++;
                    break;
                case 'complaint_created':
                    metrics.complaints++;
                    break;
                case 'ai_purchase':
                    metrics.ai_purchases_count++;
                    // Sumar el monto del metadata si existe
                    const amount = event.metadata?.amount || event.metadata?.cart_value || 0;
                    metrics.ai_purchases_revenue += Number(amount);
                    break;
                case 'pending_payment_sent':
                    metrics.pending_payment_sent++;
                    break;
                case 'confirmed_payment_sent':
                    metrics.confirmed_payment_sent++;
                    break;
                case 'tracking_code_sent':
                    metrics.tracking_codes++;
                    break;
                case 'template_open':
                    metrics.template_opens++;
                    break;
                case 'window_24h_opened':
                    metrics.windows_24h++;
                    break;
                case 'email_cart_abandoned':
                    metrics.email_cart_abandoned++;
                    break;
                case 'email_buyer_x1':
                    metrics.email_buyer_x1++;
                    break;
                case 'email_buyer_recurring':
                    metrics.email_buyer_recurring++;
                    break;
                case 'ai_message_sent':
                    metrics.ai_message_sent++;
                    break;
                case 'first_follow_up':
                    metrics.first_follow_up++;
                    break;
                case 'second_follow_up':
                    metrics.second_follow_up++;
                    break;
                case 'state_new_construction':
                    metrics.state_new_construction++;
                    break;
                case 'state_construction_over_150':
                    metrics.state_construction_over_150++;
                    break;
                case 'state_link_sent':
                    metrics.state_link_sent++;
                    break;
                case 'state_scheduled_video_sent':
                    metrics.state_scheduled_video_sent++;
                    break;
                case 'state_scheduled_video_sent_under_150':
                    metrics.state_scheduled_video_sent_under_150++;
                    break;
                case 'state_scheduled_video_sent_remodel_over_150':
                    metrics.state_scheduled_video_sent_remodel_over_150++;
                    break;
            }
        });

        // Calculate closure rate based on AI purchases and conversations started
        if (metrics.conversations_started > 0) {
            metrics.closure_rate = Math.round(
                (metrics.ai_purchases_count / metrics.conversations_started) * 100
            );
        }

        // Calculate previous day metrics for comparison
        const trends: Record<string, number> = {};

        if (from && to) {
            const yesterday = new Date(to);
            yesterday.setDate(yesterday.getDate() - 1);
            const yesterdayStr = yesterday.toISOString().split('T')[0];

            const { data: yesterdayEvents } = await supabase
                .from('ai_events')
                .select('event_type, conversation_id')
                .eq('project_id', projectId)
                .gte('created_at', yesterdayStr)
                .lt('created_at', to);

            if (yesterdayEvents && yesterdayEvents.length > 0) {
                const yesterdayMetrics = {
                    conversations_started: 0,
                    conversations_closed: 0,
                    closure_rate: 0,
                    human_escalations: 0,
                    complaints: 0,
                    ai_purchases_count: 0,
                    pending_payment_sent: 0,
                    confirmed_payment_sent: 0,
                    tracking_codes: 0,
                    template_opens: 0,
                    windows_24h: 0,

                    // Setters IA
                    ai_message_sent: 0,
                    first_follow_up: 0,
                    second_follow_up: 0,
                    state_new_construction: 0,
                    state_construction_over_150: 0,
                    state_link_sent: 0,
                    state_scheduled_video_sent: 0,
                    state_scheduled_video_sent_under_150: 0,
                    state_scheduled_video_sent_remodel_over_150: 0,
                };

                const yesterdayConvSet = new Set<string>();
                const yesterdayClosedSet = new Set<string>();

                yesterdayEvents.forEach((event) => {
                    switch (event.event_type) {
                        case 'conversation_started':
                            yesterdayMetrics.conversations_started++;
                            yesterdayConvSet.add(event.conversation_id);
                            break;
                        case 'conversation_closed':
                            yesterdayMetrics.conversations_closed++;
                            yesterdayClosedSet.add(event.conversation_id);
                            break;
                        case 'human_escalation':
                            yesterdayMetrics.human_escalations++;
                            break;
                        case 'complaint':
                            yesterdayMetrics.complaints++;
                            break;
                        case 'ai_purchase':
                            yesterdayMetrics.ai_purchases_count++;
                            break;
                        case 'pending_payment_sent':
                            yesterdayMetrics.pending_payment_sent++;
                            break;
                        case 'confirmed_payment_sent':
                            yesterdayMetrics.confirmed_payment_sent++;
                            break;
                        case 'tracking_code_sent':
                            yesterdayMetrics.tracking_codes++;
                            break;
                        case 'template_opened':
                            yesterdayMetrics.template_opens++;
                            break;
                        case 'window_24h_opened':
                            yesterdayMetrics.windows_24h++;
                            break;
                        case 'ai_message_sent':
                            yesterdayMetrics.ai_message_sent++;
                            break;
                        case 'first_follow_up':
                            yesterdayMetrics.first_follow_up++;
                            break;
                        case 'second_follow_up':
                            yesterdayMetrics.second_follow_up++;
                            break;
                        case 'state_new_construction':
                            yesterdayMetrics.state_new_construction++;
                            break;
                        case 'state_construction_over_150':
                            yesterdayMetrics.state_construction_over_150++;
                            break;
                        case 'state_link_sent':
                            yesterdayMetrics.state_link_sent++;
                            break;
                        case 'state_scheduled_video_sent':
                            yesterdayMetrics.state_scheduled_video_sent++;
                            break;
                        case 'state_scheduled_video_sent_under_150':
                            yesterdayMetrics.state_scheduled_video_sent_under_150++;
                            break;
                        case 'state_scheduled_video_sent_remodel_over_150':
                            yesterdayMetrics.state_scheduled_video_sent_remodel_over_150++;
                            break;
                    }
                });

                if (yesterdayMetrics.conversations_started > 0) {
                    yesterdayMetrics.closure_rate = Math.round(
                        (yesterdayMetrics.ai_purchases_count / yesterdayMetrics.conversations_started) * 100
                    );
                }

                // Calculate percentage changes
                const calculateTrend = (current: number, previous: number): number => {
                    if (previous === 0) return current > 0 ? 100 : 0;
                    return Math.round(((current - previous) / previous) * 100);
                };

                trends.conversations_started = calculateTrend(metrics.conversations_started, yesterdayMetrics.conversations_started);
                trends.conversations_closed = calculateTrend(metrics.conversations_closed, yesterdayMetrics.conversations_closed);
                trends.closure_rate = calculateTrend(metrics.closure_rate, yesterdayMetrics.closure_rate);
                trends.human_escalations = calculateTrend(metrics.human_escalations, yesterdayMetrics.human_escalations);
                trends.complaints = calculateTrend(metrics.complaints, yesterdayMetrics.complaints);
                trends.ai_purchases_count = calculateTrend(metrics.ai_purchases_count, yesterdayMetrics.ai_purchases_count);
                trends.template_opens = calculateTrend(metrics.template_opens, yesterdayMetrics.template_opens);
                trends.windows_24h = calculateTrend(metrics.windows_24h, yesterdayMetrics.windows_24h);

                // Setters IA Trends
                trends.ai_message_sent = calculateTrend(metrics.ai_message_sent, yesterdayMetrics.ai_message_sent);
                trends.first_follow_up = calculateTrend(metrics.first_follow_up, yesterdayMetrics.first_follow_up);
                trends.second_follow_up = calculateTrend(metrics.second_follow_up, yesterdayMetrics.second_follow_up);
                trends.state_new_construction = calculateTrend(metrics.state_new_construction, yesterdayMetrics.state_new_construction);
                trends.state_construction_over_150 = calculateTrend(metrics.state_construction_over_150, yesterdayMetrics.state_construction_over_150);
                trends.state_link_sent = calculateTrend(metrics.state_link_sent, yesterdayMetrics.state_link_sent);
                trends.state_scheduled_video_sent = calculateTrend(metrics.state_scheduled_video_sent, yesterdayMetrics.state_scheduled_video_sent);
                trends.state_scheduled_video_sent_under_150 = calculateTrend(metrics.state_scheduled_video_sent_under_150, yesterdayMetrics.state_scheduled_video_sent_under_150);
                trends.state_scheduled_video_sent_remodel_over_150 = calculateTrend(metrics.state_scheduled_video_sent_remodel_over_150, yesterdayMetrics.state_scheduled_video_sent_remodel_over_150);
            }
        }

        // Generate trend data if requested
        let trend: Array<{ date: string; value: number }> | undefined;
        if (includeTrend && from && to) {
            trend = generateTrendData(events, trendMetric, from, to);
        }

        return NextResponse.json({
            summary: metrics,
            trends,
            trend,
            total_events: events.length,
            date_range: { from, to },
        });
    } catch (error) {
        console.error('Unexpected error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

function generateTrendData(
    events: any[],
    metricKey: string,
    from: string,
    to: string
): Array<{ date: string; value: number }> {
    const fromDate = new Date(from);
    const toDate = new Date(to);
    const daysDiff = Math.ceil((toDate.getTime() - fromDate.getTime()) / (1000 * 60 * 60 * 24)) || 1;

    // Create a map of date -> count
    const dateCounts: Record<string, number> = {};

    // Initialize all dates with 0
    for (let i = 0; i <= daysDiff; i++) {
        const date = new Date(fromDate);
        date.setDate(date.getDate() + i);
        const dateStr = date.toISOString().split('T')[0];
        dateCounts[dateStr] = 0;
    }

    // Sum revenue by date for ai_purchase events, count for others
    events.forEach((event) => {
        const eventDate = event.created_at.split('T')[0];
        if (dateCounts[eventDate] !== undefined && event.event_type === metricKey) {
            // Para ai_purchase, sumar el monto; para otros eventos, contar
            if (metricKey === 'ai_purchase') {
                const amount = event.metadata?.amount || event.metadata?.cart_value || 0;
                dateCounts[eventDate] += Number(amount);
            } else {
                dateCounts[eventDate]++;
            }
        }
    });

    // Convert to array format
    return Object.entries(dateCounts)
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([date, value]) => ({
            date: new Date(date).toLocaleDateString('es-ES', { weekday: 'short' }),
            value,
        }));
}
