import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/app/lib/supabase-server';

export async function GET(request: NextRequest) {
    try {
        const supabase = await createServerSupabaseClient();

        // Verify user is authenticated
        const { data: { session }, error: authError } = await supabase.auth.getSession();
        if (authError || !session) {
            return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
        }

        // Fetch all projects (RLS will handle access control)
        const { data: projects, error } = await supabase
            .from('projects')
            .select('id, name, ingest_token, timezone, created_at, target_currency, exchange_rate')
            .order('created_at', { ascending: true });

        if (error) {
            console.error('Error fetching projects:', error);
            return NextResponse.json({ error: 'Error al obtener proyectos' }, { status: 500 });
        }

        return NextResponse.json({ projects });
    } catch (error) {
        console.error('Unexpected error:', error);
        return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        const supabase = await createServerSupabaseClient();

        // Verify user is authenticated
        const { data: { session }, error: authError } = await supabase.auth.getSession();
        if (authError || !session) {
            return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
        }

        const body = await request.json();
        const { name } = body;

        if (!name || name.trim() === '') {
            return NextResponse.json({ error: 'El nombre del proyecto es requerido' }, { status: 400 });
        }

        // Create new project
        const { data: project, error: projectError } = await supabase
            .from('projects')
            .insert({
                name: name.trim(),
                timezone: 'America/Argentina/Buenos_Aires',
            })
            .select()
            .single();

        if (projectError) {
            console.error('Error creating project:', projectError);
            return NextResponse.json({ error: 'Error al crear proyecto' }, { status: 500 });
        }

        // Create default widgets for the project
        const defaultWidgets = [
            { widget_key: 'human_escalations', label: 'Derivaciones a Humano', position: 0 },
            { widget_key: 'complaints', label: 'Reclamos', position: 1 },
            { widget_key: 'ai_purchases', label: 'Compras por IA', position: 2 },
            { widget_key: 'payment_messages', label: 'Mensajería de Pagos', position: 3 },
            { widget_key: 'tracking_codes', label: 'Códigos de Rastreo', position: 4 },
            { widget_key: 'template_opens', label: 'Aperturas con Plantilla', position: 5 },
            { widget_key: 'windows_24h', label: 'Ventanas 24h', position: 6 },
        ];

        const widgetsToInsert = defaultWidgets.map((w) => ({
            project_id: project.id,
            ...w,
        }));

        const { error: widgetsError } = await supabase
            .from('project_widgets')
            .insert(widgetsToInsert);

        if (widgetsError) {
            console.error('Error creating widgets:', widgetsError);
            // Don't fail the request, widgets can be created later
        }

        return NextResponse.json({ project });
    } catch (error) {
        console.error('Unexpected error:', error);
        return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
    }
}
