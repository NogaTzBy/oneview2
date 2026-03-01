'use client';

import React, { useState } from 'react';
import { Project } from '../lib/types';

interface ConfigTabIngestaProps {
    project: Project;
    onRefresh: () => void;
    dashboardContext?: 'ecommerce' | 'setters';
}

const ECOMMERCE_EVENT_TYPES = [
    { key: 'conversation_started', label: 'Conversación Iniciada', icon: 'chat_bubble_outline' },
    { key: 'conversation_closed', label: 'Conversación Cerrada', icon: 'check_circle' },
    { key: 'human_escalation', label: 'Derivación a Humano', icon: 'person' },
    { key: 'complaint', label: 'Reclamo Creado', icon: 'warning' },
    { key: 'ai_purchase', label: 'Compra por IA', icon: 'shopping_bag' },
    { key: 'pending_payment_sent', label: 'Pago Pendiente Enviado', icon: 'schedule' },
    { key: 'confirmed_payment_sent', label: 'Pago Confirmado Enviado', icon: 'check_circle' },
    { key: 'tracking_code_sent', label: 'Código de Rastreo Enviado', icon: 'local_shipping' },
    { key: 'template_opened', label: 'Apertura con Plantilla', icon: 'mail' },
    { key: 'window_24h_opened', label: 'Ventana 24h Abierta', icon: 'schedule' },
    { key: 'email_cart_abandoned', label: 'Email a Carrito Abandonado', icon: 'shopping_cart' },
    { key: 'email_buyer_x1', label: 'Email a Comprador x1', icon: 'person' },
    { key: 'email_buyer_recurring', label: 'Email a Comprador Recurrente', icon: 'repeat' },
];

const SETTERS_EVENT_TYPES = [
    { key: 'conversation_started', label: 'Conversación Iniciada', icon: 'chat_bubble_outline' },
    { key: 'conversation_closed', label: 'Conversación Cerrada', icon: 'mark_chat_read' },
    { key: 'ai_message_sent', label: 'Conversaciones Únicas (Hoy)', icon: 'chat' },
    { key: 'first_follow_up', label: 'Primer Seguimiento', icon: 'counter_1' },
    { key: 'second_follow_up', label: 'Segundo Seguimiento', icon: 'counter_2' },
    { key: 'state_new_construction', label: 'Estado: Obra desde cero', icon: 'home_work' },
    { key: 'state_construction_over_150', label: 'Estado: Obra + planos > 150m²', icon: 'architecture' },
    { key: 'state_link_sent', label: 'Estado: Link de agenda enviado', icon: 'link' },
    { key: 'state_scheduled_video_sent', label: 'Estado: Agendó + video enviado', icon: 'smart_display' },
    { key: 'state_scheduled_video_sent_under_150', label: 'Estado: Agendó + video < 150m²', icon: 'video_camera_front' },
    { key: 'state_scheduled_video_sent_remodel_over_150', label: 'Estado: Agendó + video reforma > 150m²', icon: 'handyman' },
    { key: 'instagram_follower', label: 'Nuevos Seguidores', icon: 'group_add' },
];

export function ConfigTabIngesta({ project, onRefresh, dashboardContext = 'ecommerce' }: ConfigTabIngestaProps) {
    const EVENT_TYPES = dashboardContext === 'setters' ? SETTERS_EVENT_TYPES : ECOMMERCE_EVENT_TYPES;
    const [selectedEvent, setSelectedEvent] = useState(EVENT_TYPES[0]);
    const [showToken, setShowToken] = useState(false);
    const [copied, setCopied] = useState(false);

    const handleCopy = (text: string) => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const generateCurl = (eventType: string) => {
        const token = project.ingest_token || 'sk_live_...';

        // E-commerce examples
        const ecommerceExamples: Record<string, any> = {
            'conversation_started': {
                event_type: 'conversation_started',
                project_id: project.id,
                conversation_id: 'conv_12345',
                channel: 'whatsapp',
                created_at: new Date().toISOString()
            },
            'conversation_closed': {
                event_type: 'conversation_closed',
                project_id: project.id,
                conversation_id: 'conv_12345',
                channel: 'whatsapp',
                created_at: new Date().toISOString()
            },
            'human_escalation': {
                event_type: 'human_escalation',
                project_id: project.id,
                conversation_id: 'conv_12345',
                channel: 'whatsapp',
                created_at: new Date().toISOString()
            },
            'complaint': {
                event_type: 'complaint',
                project_id: project.id,
                conversation_id: 'conv_12345',
                channel: 'whatsapp',
                metadata: { reason: 'producto defectuoso' },
                created_at: new Date().toISOString()
            },
            'ai_purchase': {
                event_type: 'ai_purchase',
                project_id: project.id,
                conversation_id: 'conv_12345',
                channel: 'whatsapp',
                metadata: { amount: 12500, currency: 'ARS', product_name: 'Producto X' },
                created_at: new Date().toISOString()
            },
            'pending_payment_sent': {
                event_type: 'pending_payment_sent',
                project_id: project.id,
                conversation_id: 'conv_12345',
                channel: 'whatsapp',
                created_at: new Date().toISOString()
            },
            'confirmed_payment_sent': {
                event_type: 'confirmed_payment_sent',
                project_id: project.id,
                conversation_id: 'conv_12345',
                channel: 'whatsapp',
                created_at: new Date().toISOString()
            },
            'tracking_code_sent': {
                event_type: 'tracking_code_sent',
                project_id: project.id,
                conversation_id: 'conv_12345',
                channel: 'whatsapp',
                metadata: { tracking_code: 'ABC123XYZ' },
                created_at: new Date().toISOString()
            },
            'template_opened': {
                event_type: 'template_opened',
                project_id: project.id,
                conversation_id: 'conv_12345',
                channel: 'whatsapp',
                metadata: { template_name: 'bienvenida' },
                created_at: new Date().toISOString()
            },
            'window_24h_opened': {
                event_type: 'window_24h_opened',
                project_id: project.id,
                conversation_id: 'conv_12345',
                channel: 'whatsapp',
                created_at: new Date().toISOString()
            },
            'email_cart_abandoned': {
                event_type: 'email_cart_abandoned',
                project_id: project.id,
                user_email: 'cliente@example.com',
                cart_value: 25000,
                created_at: new Date().toISOString()
            },
            'email_buyer_x1': {
                event_type: 'email_buyer_x1',
                project_id: project.id,
                user_email: 'comprador@example.com',
                created_at: new Date().toISOString()
            },
            'email_buyer_recurring': {
                event_type: 'email_buyer_recurring',
                project_id: project.id,
                user_email: 'clienterecurrente@example.com',
                purchase_count: 5,
                created_at: new Date().toISOString()
            }
        };

        // Setters examples
        const settersExamples: Record<string, any> = {
            'conversation_started': {
                event_type: 'conversation_started',
                project_id: project.id,
                conversation_id: 'conv_12345',
                channel: 'whatsapp',
                created_at: new Date().toISOString()
            },
            'conversation_closed': {
                event_type: 'conversation_closed',
                project_id: project.id,
                conversation_id: 'conv_12345',
                channel: 'whatsapp',
                created_at: new Date().toISOString()
            },
            'ai_message_sent': {
                event_type: 'ai_message_sent',
                project_id: project.id,
                conversation_id: 'conv_12345',
                channel: 'whatsapp',
                created_at: new Date().toISOString()
            },
            'first_follow_up': {
                event_type: 'first_follow_up',
                project_id: project.id,
                conversation_id: 'conv_12345',
                channel: 'whatsapp',
                created_at: new Date().toISOString()
            },
            'second_follow_up': {
                event_type: 'second_follow_up',
                project_id: project.id,
                conversation_id: 'conv_12345',
                channel: 'whatsapp',
                created_at: new Date().toISOString()
            },
            'state_new_construction': {
                event_type: 'state_new_construction',
                project_id: project.id,
                conversation_id: 'conv_12345',
                channel: 'whatsapp',
                created_at: new Date().toISOString()
            },
            'state_construction_over_150': {
                event_type: 'state_construction_over_150',
                project_id: project.id,
                conversation_id: 'conv_12345',
                channel: 'whatsapp',
                created_at: new Date().toISOString()
            },
            'state_link_sent': {
                event_type: 'state_link_sent',
                project_id: project.id,
                conversation_id: 'conv_12345',
                channel: 'whatsapp',
                created_at: new Date().toISOString()
            },
            'state_scheduled_video_sent': {
                event_type: 'state_scheduled_video_sent',
                project_id: project.id,
                conversation_id: 'conv_12345',
                channel: 'whatsapp',
                created_at: new Date().toISOString()
            },
            'state_scheduled_video_sent_under_150': {
                event_type: 'state_scheduled_video_sent_under_150',
                project_id: project.id,
                conversation_id: 'conv_12345',
                channel: 'whatsapp',
                created_at: new Date().toISOString()
            },
            'state_scheduled_video_sent_remodel_over_150': {
                event_type: 'state_scheduled_video_sent_remodel_over_150',
                project_id: project.id,
                conversation_id: 'conv_12345',
                channel: 'whatsapp',
                created_at: new Date().toISOString()
            },
            'instagram_follower': {
                event_type: 'instagram_follower',
                project_id: project.id,
                conversation_id: 'conv_12345',
                channel: 'instagram',
                created_at: new Date().toISOString()
            },
        };

        const examples = dashboardContext === 'setters' ? settersExamples : ecommerceExamples;
        const payload = examples[eventType] || examples['conversation_started'];

        return `curl -X POST https://oneview2.vercel.app/api/ingest \\
  -H "X-INGEST-TOKEN: ${token}" \\
  -H "Content-Type: application/json" \\
  -d '${JSON.stringify(payload, null, 2)}'`;
    };

    const displayToken = showToken
        ? project.ingest_token
        : project.ingest_token
            ? `${project.ingest_token.substring(0, 12)}...${project.ingest_token.substring(project.ingest_token.length - 8)}`
            : 'sk_live_...';

    return (
        <div className="space-y-6">
            <div>
                <h3 className="text-lg font-semibold mb-2 text-slate-900">Configuración de Ingestión</h3>
                <p className="text-sm text-slate-500">
                    Gestiona tus claves de API y puntos finales para la entrada de datos.
                </p>
            </div>

            {/* Token Section */}
            <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <h4 className="text-base font-semibold text-slate-900">Token de Ingestión</h4>
                        <p className="text-sm text-slate-500 mt-1">Utiliza este token para autenticar tus peticiones.</p>
                    </div>
                    <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-bold rounded uppercase tracking-wide">
                        Activo
                    </span>
                </div>

                <div className="flex items-center gap-3">
                    <div className="flex-1 flex items-center gap-3 p-3 bg-slate-50 rounded-lg border border-slate-200">
                        <code className="text-sm font-mono text-slate-700 flex-1">
                            {displayToken}
                        </code>
                        <button
                            onClick={() => setShowToken(!showToken)}
                            className="text-slate-400 hover:text-slate-600 transition-colors"
                        >
                            <span className="material-symbols-outlined text-[20px]">
                                {showToken ? 'visibility' : 'visibility_off'}
                            </span>
                        </button>
                    </div>
                    <button
                        onClick={() => handleCopy(project.ingest_token || '')}
                        className="flex items-center gap-2 bg-primary hover:bg-primary-dark text-white px-4 py-3 rounded-lg text-sm font-medium transition-colors shadow-sm"
                    >
                        <span className="material-symbols-outlined text-[18px]">
                            {copied ? 'check' : 'content_copy'}
                        </span>
                        {copied ? 'Copiado' : 'Copiar'}
                    </button>
                </div>

                <p className="mt-3 text-xs text-slate-400 flex items-center gap-1">
                    <span className="material-symbols-outlined text-xs">info</span>
                    No compartas este token en repositorios públicos.
                </p>
            </div>

            {/* Endpoint URL */}
            <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
                <h4 className="text-base font-semibold text-slate-900 mb-3">URL del Endpoint</h4>
                <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg border border-slate-200">
                    <span className="material-symbols-outlined text-slate-400">link</span>
                    <code className="text-sm font-mono text-slate-700 flex-1">
                        https://oneview2.vercel.app/api/ingest
                    </code>
                    <button
                        onClick={() => handleCopy('https://oneview2.vercel.app/api/ingest')}
                        className="px-3 py-1.5 text-sm font-medium text-primary hover:bg-primary/5 rounded-lg transition-colors flex items-center gap-1.5"                  >
                        <span className="material-symbols-outlined text-[18px]">content_copy</span>
                    </button>
                </div>
            </div>

            {/* cURL Generator */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-slate-200">
                    <h4 className="text-base font-semibold text-slate-900">Generador de cURL</h4>
                    <p className="text-sm text-slate-500 mt-1">Prueba tu integración enviando un evento de ejemplo.</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 divide-y lg:divide-y-0 lg:divide-x divide-slate-200">
                    {/* Event Type Selector */}
                    <div className="p-6 bg-slate-50/50">
                        <label className="block text-sm font-medium text-slate-700 mb-3">Tipo de Evento</label>
                        <div className="space-y-2 max-h-96 overflow-y-auto">
                            {EVENT_TYPES.map((event) => (
                                <button
                                    key={event.key}
                                    onClick={() => setSelectedEvent(event)}
                                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${selectedEvent.key === event.key
                                        ? 'bg-primary text-white'
                                        : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                                        }`}
                                >
                                    <span className="material-symbols-outlined text-[18px]">
                                        {event.icon}
                                    </span>
                                    {event.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* cURL & Response */}
                    <div className="col-span-1 lg:col-span-2 divide-y divide-slate-200">
                        {/* cURL Request */}
                        <div className="p-6 bg-slate-50">
                            <div className="flex justify-between items-center mb-3">
                                <div className="flex items-center gap-2">
                                    <span className="material-symbols-outlined text-slate-400 text-[18px]">terminal</span>
                                    <span className="text-xs font-semibold text-slate-700 uppercase tracking-wide">Request</span>
                                </div>
                                <button
                                    onClick={() => handleCopy(generateCurl(selectedEvent.key))}
                                    className="text-slate-500 hover:text-primary transition-colors flex items-center gap-1 text-xs font-medium"
                                >
                                    <span className="material-symbols-outlined text-[16px]">
                                        {copied ? 'check' : 'content_copy'}
                                    </span>
                                    {copied ? 'Copiado' : 'Copiar'}
                                </button>
                            </div>
                            <div className="bg-white border border-slate-200 rounded-lg p-4 overflow-x-auto">
                                <pre className="text-xs text-slate-700 font-mono leading-relaxed whitespace-pre">
                                    {generateCurl(selectedEvent.key)}
                                </pre>
                            </div>
                        </div>

                        {/* Response Example */}
                        <div className="p-6 bg-white">
                            <div className="flex items-center gap-2 mb-3">
                                <span className="material-symbols-outlined text-green-500 text-[18px]">check_circle</span>
                                <span className="text-xs font-semibold text-slate-700 uppercase tracking-wide">Respuesta Exitosa</span>
                            </div>
                            <div className="bg-green-50 border border-green-200 rounded-lg p-4 overflow-x-auto">
                                <pre className="text-xs text-green-800 font-mono leading-relaxed">
                                    {`{
  "success": true,
  "message": "Evento recibido correctamente",
  "event_id": "evt_${Math.random().toString(36).substr(2, 9)}",
  "event_type": "${selectedEvent.key}",
  "timestamp": "${new Date().toISOString()}"
}`}
                                </pre>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
