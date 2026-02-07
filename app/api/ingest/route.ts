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
