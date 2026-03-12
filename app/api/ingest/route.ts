import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// Valid event types
const VALID_EVENT_TYPES = [
    'conversation_started',
    'conversation_closed',
    'human_escalation',
    'complaint_created',
    'ai_purchase',
    'pending_payment_sent',
    'confirmed_payment_sent',
    'tracking_code_sent',
    'template_open',
    'window_24h_opened',
    // Email marketing events
    'email_cart_abandoned',
    'email_buyer_x1',
    'email_buyer_recurring',

    // Setters IA Events
    'ai_message_sent',
    'first_follow_up',
    'second_follow_up',
    'state_new_construction',
    'state_construction_over_150',
    'state_link_sent',
    'state_scheduled_video_sent',
    'state_scheduled_video_sent_under_150',
    'state_scheduled_video_sent_remodel_over_150',
    'instagram_follower'
];

export async function POST(request: NextRequest) {
    try {
        // Get ingest token from header
        const ingestToken = request.headers.get('X-INGEST-TOKEN');

        if (!ingestToken) {
            return NextResponse.json(
                { error: 'Missing X-INGEST-TOKEN header' },
                { status: 401 }
            );
        }

        // Validate token and get project
        const { data: project, error: projectError } = await supabase
            .from('projects')
            .select('id')
            .eq('ingest_token', ingestToken)
            .single();

        if (projectError || !project) {
            return NextResponse.json(
                { error: 'Invalid ingest token' },
                { status: 401 }
            );
        }

        // Parse request body
        const body = await request.json();
        const { event_type, conversation_id, channel, metadata = {} } = body;

        // Validate event_type
        if (!event_type || !VALID_EVENT_TYPES.includes(event_type)) {
            return NextResponse.json(
                {
                    error: 'Invalid event_type',
                    valid_types: VALID_EVENT_TYPES
                },
                { status: 400 }
            );
        }

        // Setters state events that use a 10-minute dedup window per conversation
        const SETTERS_STATE_EVENTS = [
            'first_follow_up',
            'second_follow_up',
            'state_new_construction',
            'state_construction_over_150',
            'state_link_sent',
            'state_scheduled_video_sent',
            'state_scheduled_video_sent_under_150',
            'state_scheduled_video_sent_remodel_over_150',
            'instagram_follower',
        ];

        // Check for duplicate events to prevent double counting
        if (conversation_id) {
            // Get the most recent event of this type for this conversation
            const { data: recentEvents, error: recentError } = await supabase
                .from('ai_events')
                .select('id, created_at')
                .eq('project_id', project.id)
                .eq('event_type', event_type)
                .eq('conversation_id', conversation_id)
                .order('created_at', { ascending: false })
                .limit(1);

            if (!recentError && recentEvents && recentEvents.length > 0) {
                const latestEventDate = new Date(recentEvents[0].created_at);
                const now = new Date();

                // Para ai_message_sent: 1 vez por día por conversación (UTC-3)
                if (event_type === 'ai_message_sent') {
                    const latestLocal = new Date(latestEventDate.getTime() - 3 * 60 * 60 * 1000);
                    const nowLocal = new Date(now.getTime() - 3 * 60 * 60 * 1000);

                    const isSameDay = latestLocal.toISOString().split('T')[0] === nowLocal.toISOString().split('T')[0];
                    if (isSameDay) {
                        console.log(`[Rate Limit] Ignored duplicate daily event: ${event_type} for conversation ${conversation_id}.`);
                        return NextResponse.json({
                            success: true,
                            message: 'Event ignored (already registered today)',
                            event_id: recentEvents[0].id,
                        });
                    }
                } else if (SETTERS_STATE_EVENTS.includes(event_type)) {
                    // Para eventos de estado de Setters: 10 minutos por conversación
                    const diffSeconds = Math.abs(now.getTime() - latestEventDate.getTime()) / 1000;
                    if (diffSeconds < 600) {
                        console.log(`[Rate Limit] Ignored duplicate setters event: ${event_type} for conversation ${conversation_id}. Time diff was ${diffSeconds}s.`);
                        return NextResponse.json({
                            success: true,
                            message: 'Event ignored (duplicate within last 10 minutes)',
                            event_id: recentEvents[0].id,
                        });
                    }
                } else {
                    // Para el resto de los eventos: 1 minuto
                    const diffSeconds = Math.abs(now.getTime() - latestEventDate.getTime()) / 1000;
                    if (diffSeconds < 60) {
                        console.log(`[Rate Limit] Ignored duplicate event: ${event_type} for conversation ${conversation_id}. Time diff was ${diffSeconds}s.`);
                        return NextResponse.json({
                            success: true,
                            message: 'Event ignored (duplicate within last minute)',
                            event_id: recentEvents[0].id,
                        });
                    }
                }
            }
        }

        // Insert event
        const { data: event, error: eventError } = await supabase
            .from('ai_events')
            .insert({
                project_id: project.id,
                event_type,
                conversation_id,
                channel,
                metadata,
            })
            .select()
            .single();

        if (eventError) {
            console.error('Error inserting event:', eventError);
            return NextResponse.json(
                { error: 'Failed to insert event' },
                { status: 500 }
            );
        }

        return NextResponse.json({
            success: true,
            event_id: event.id,
        });

    } catch (error) {
        console.error('Ingest error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
