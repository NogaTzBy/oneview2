/**
 * Script para resetear todas las estadísticas del dashboard OneView
 * 
 * ADVERTENCIA: Este script eliminará TODOS los eventos de la base de datos.
 * Usar solo cuando se quiera empezar desde cero.
 */

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseKey);

async function resetStats() {
    try {
        console.log('🔍 Verificando eventos actuales...\n');

        // Contar eventos antes de eliminar
        const { data: beforeData, error: countError } = await supabase
            .from('ai_events')
            .select('event_type', { count: 'exact', head: false });

        if (countError) {
            console.error('❌ Error al contar eventos:', countError);
            return;
        }

        const totalBefore = beforeData?.length || 0;
        console.log(`📊 Total de eventos actuales: ${totalBefore}`);

        if (totalBefore === 0) {
            console.log('\n✅ No hay eventos para eliminar. La base de datos ya está limpia.');
            return;
        }

        // Mostrar distribución por tipo
        const eventTypes = beforeData?.reduce((acc: Record<string, number>, event) => {
            acc[event.event_type] = (acc[event.event_type] || 0) + 1;
            return acc;
        }, {});

        console.log('\n📈 Distribución por tipo de evento:');
        Object.entries(eventTypes || {}).forEach(([type, count]) => {
            console.log(`  - ${type}: ${count}`);
        });

        console.log('\n⚠️  ADVERTENCIA: Se eliminarán TODOS los eventos de la base de datos.');
        console.log('⏳ Iniciando eliminación en 3 segundos...\n');

        await new Promise(resolve => setTimeout(resolve, 3000));

        // Eliminar todos los eventos
        console.log('🗑️  Eliminando eventos...');
        const { error: deleteError } = await supabase
            .from('ai_events')
            .delete()
            .neq('id', '00000000-0000-0000-0000-000000000000'); // Elimina todos (neq con un UUID imposible)

        if (deleteError) {
            console.error('❌ Error al eliminar eventos:', deleteError);
            return;
        }

        // Verificar que se eliminaron
        const { count: afterCount } = await supabase
            .from('ai_events')
            .select('*', { count: 'exact', head: true });

        console.log('\n✅ Eliminación completada!');
        console.log(`📊 Eventos eliminados: ${totalBefore}`);
        console.log(`📊 Eventos restantes: ${afterCount || 0}`);
        console.log('\n🎉 Base de datos reseteada exitosamente!');
        console.log('🚀 Ahora puedes empezar a enviar eventos nuevos desde n8n o el API.\n');

    } catch (error) {
        console.error('❌ Error inesperado:', error);
    }
}

// Ejecutar
resetStats();
