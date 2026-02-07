import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const projectId = searchParams.get('project_id');
        const from = searchParams.get('from');
        const to = searchParams.get('to');

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
            human_escalations: 0,
            complaints: 0,
            ai_purchases: 0,
            pending_payment_sent: 0,
            confirmed_payment_sent: 0,
            tracking_codes: 0,
            template_opens: 0,
            windows_24h: 0,
            closure_rate: 0,
        };

        events.forEach((event) => {
            switch (event.event_type) {
                case 'conversation_started':
                    metrics.conversations_started++;
                    break;
                case 'conversation_closed':
                    metrics.conversations_closed++;
                    break;
                case 'human_escalation':
                    metrics.human_escalations++;
                    break;
                case 'complaint_created':
                    metrics.complaints++;
                    break;
                case 'ai_purchase':
                    metrics.ai_purchases++;
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
            }
        });

        // Calculate closure rate
        if (metrics.conversations_started > 0) {
            metrics.closure_rate = Math.round(
                (metrics.conversations_closed / metrics.conversations_started) * 100
            );
        }

        return NextResponse.json({
            metrics,
            total_events: events.length,
            date_range: { from, to },
        });

    } catch (error) {
        console.error('Metrics error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
