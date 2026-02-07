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

        if (!projectId) {
            return NextResponse.json(
                { error: 'Missing project_id parameter' },
                { status: 400 }
            );
        }

        // Get project settings
        const { data: project, error: projectError } = await supabase
            .from('projects')
            .select('*')
            .eq('id', projectId)
            .single();

        if (projectError || !project) {
            return NextResponse.json(
                { error: 'Project not found' },
                { status: 404 }
            );
        }

        // Get widgets configuration
        const { data: widgets, error: widgetsError } = await supabase
            .from('project_widgets')
            .select('*')
            .eq('project_id', projectId)
            .order('position');

        if (widgetsError) {
            console.error('Error fetching widgets:', widgetsError);
        }

        return NextResponse.json({
            project: {
                id: project.id,
                name: project.name,
                timezone: project.timezone,
                ingest_token: project.ingest_token,
                webhook_url: project.webhook_url,
                webhook_interval: project.webhook_interval,
            },
            widgets: widgets || [],
        });

    } catch (error) {
        console.error('Config error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { project_id, name, timezone, webhook_url, webhook_interval, widgets } = body;

        if (!project_id) {
            return NextResponse.json(
                { error: 'Missing project_id' },
                { status: 400 }
            );
        }

        // Update project settings
        const updates: any = {};
        if (name !== undefined) updates.name = name;
        if (timezone !== undefined) updates.timezone = timezone;
        if (webhook_url !== undefined) updates.webhook_url = webhook_url;
        if (webhook_interval !== undefined) updates.webhook_interval = webhook_interval;

        if (Object.keys(updates).length > 0) {
            const { error: updateError } = await supabase
                .from('projects')
                .update(updates)
                .eq('id', project_id);

            if (updateError) {
                console.error('Error updating project:', updateError);
                return NextResponse.json(
                    { error: 'Failed to update project' },
                    { status: 500 }
                );
            }
        }

        // Update widgets if provided
        if (widgets && Array.isArray(widgets)) {
            for (const widget of widgets) {
                const { error: widgetError } = await supabase
                    .from('project_widgets')
                    .update({
                        is_visible: widget.is_visible,
                        position: widget.position,
                    })
                    .eq('project_id', project_id)
                    .eq('widget_key', widget.widget_key);

                if (widgetError) {
                    console.error('Error updating widget:', widgetError);
                }
            }
        }

        return NextResponse.json({ success: true });

    } catch (error) {
        console.error('Config update error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

// Regenerate ingest token
export async function PUT(request: NextRequest) {
    try {
        const body = await request.json();
        const { project_id } = body;

        if (!project_id) {
            return NextResponse.json(
                { error: 'Missing project_id' },
                { status: 400 }
            );
        }

        // Generate new token
        const newToken = require('crypto').randomBytes(32).toString('hex');

        const { data, error } = await supabase
            .from('projects')
            .update({ ingest_token: newToken })
            .eq('id', project_id)
            .select('ingest_token')
            .single();

        if (error) {
            console.error('Error regenerating token:', error);
            return NextResponse.json(
                { error: 'Failed to regenerate token' },
                { status: 500 }
            );
        }

        return NextResponse.json({
            success: true,
            ingest_token: data.ingest_token,
        });

    } catch (error) {
        console.error('Token regeneration error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
