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
    'state_scheduled_video_sent_remodel_over_150'
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

        // Check for duplicate events within the last minute to prevent double counting
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
                const latestEventTime = new Date(recentEvents[0].created_at).getTime();
                const now = Date.now();
                // We use Math.abs to protect against future timestamps generated incorrectly in the source
                const diffSeconds = Math.abs(now - latestEventTime) / 1000;

                // If the last inserted event was less than 60 seconds ago in real time
                if (diffSeconds < 60) {
                    console.log(`[Rate Limit] Ignored duplicate event: ${event_type} for conversation ${conversation_id}. Time diff was ${diffSeconds}s.`);
                    // Return success so n8n thinks it worked and doesn't retry
                    return NextResponse.json({
                        success: true,
                        message: 'Event ignored (duplicate within last minute)',
                        event_id: recentEvents[0].id,
                    });
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
