require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function run() {
    console.log('Deleting project...');
    const { data: project } = await supabase.from('projects').select('id, name').eq('name', 'FA Interiores').single();
    if (project) {
        console.log('Found project:', project.name);
        // Delete dependencies first (if missing cascade rules)
        await supabase.from('project_widgets').delete().eq('project_id', project.id);
        await supabase.from('ai_events').delete().eq('project_id', project.id);
        // Delete the project
        const { data, error } = await supabase.from('projects').delete().eq('id', project.id).select();
        console.log('Deleted:', data);
        if (error) console.error(error);
    } else {
        console.log('Project not found');
    }
}
run();
