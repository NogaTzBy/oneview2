'use client';

import React, { useState } from 'react';
import { Project } from '../lib/types';

interface ConfigTabIngestaProps {
    project: Project;
    onRefresh: () => void;
}

const EVENT_TYPES = [
    { key: 'conversation_started', label: 'Conversación Iniciada', example: { conversation_id: '12345', channel: 'whatsapp' } },
    { key: 'conversation_closed', label: 'Conversación Cerrada', example: { conversation_id: '12345', channel: 'whatsapp' } },
    { key: 'human_escalation', label: 'Derivación a Humano', example: { conversation_id: '12345', channel: 'whatsapp' } },
    { key: 'complaint_created', label: 'Reclamo Creado', example: { conversation_id: '12345', channel: 'whatsapp', metadata: { reason: 'producto defectuoso' } } },
    { key: 'ai_purchase', label: 'Compra por IA', example: { conversation_id: '12345', channel: 'whatsapp', metadata: { amount: 100, currency: 'ARS' } } },
    { key: 'pending_payment_sent', label: 'Mensaje de Pago Pendiente', example: { conversation_id: '12345', channel: 'whatsapp' } },
    { key: 'confirmed_payment_sent', label: 'Mensaje de Pago Confirmado', example: { conversation_id: '12345', channel: 'whatsapp' } },
    { key: 'tracking_code_sent', label: 'Código de Rastreo Enviado', example: { conversation_id: '12345', channel: 'whatsapp', metadata: { tracking_code: 'ABC123' } } },
    { key: 'template_open', label: 'Apertura con Plantilla', example: { conversation_id: '12345', channel: 'whatsapp', metadata: { template_name: 'bienvenida' } } },
    { key: 'window_24h_opened', label: 'Ventana 24h Abierta', example: { conversation_id: '12345', channel: 'whatsapp' } },
];

export function ConfigTabIngesta({ project, onRefresh }: ConfigTabIngestaProps) {
    const [showToken, setShowToken] = useState(false);
    const [regenerating, setRegenerating] = useState(false);
    const [copiedcURL, setCopiedcURL] = useState<string | null>(null);
    const [testing, setTesting] = useState<string | null>(null);
    const [testResult, setTestResult] = useState<{ key: string; success: boolean; message: string } | null>(null);

    const maskedToken = project.ingest_token
        ? `${project.ingest_token.substring(0, 8)}...${project.ingest_token.substring(project.ingest_token.length - 8)}`
        : '';

    const handleRegenerateToken = async () => {
        if (!confirm('¿Estás seguro de regenerar el token? El token actual dejará de funcionar.')) {
            return;
        }

        try {
            setRegenerating(true);
            const response = await fetch('/api/config', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ project_id: project.id }),
            });

            if (response.ok) {
                onRefresh();
                alert('Token regenerado correctamente');
            } else {
                alert('Error al regenerar el token');
            }
        } catch (error) {
            console.error('Error regenerating token:', error);
            alert('Error al regenerar el token');
        } finally {
            setRegenerating(false);
        }
    };

    const generatecURL = (eventType: string, example: object) => {
        const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'https://tu-app.netlify.app';
        const body = {
            event_type: eventType,
            ...example,
        };

        return `curl -X POST '${baseUrl}/api/ingest' \\
  -H 'Content-Type: application/json' \\
  -H 'X-INGEST-TOKEN: ${project.ingest_token}' \\
  -d '${JSON.stringify(body, null, 2)}'`;
    };

    const copycURL = (curl: string, eventKey: string) => {
        navigator.clipboard.writeText(curl);
        setCopiedcURL(eventKey);
        setTimeout(() => setCopiedcURL(null), 2000);
    };

    const testEndpoint = async (eventType: string, example: object, eventKey: string) => {
        setTesting(eventKey);
        setTestResult(null);

        try {
            const response = await fetch('/api/ingest', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-INGEST-TOKEN': project.ingest_token || '',
                },
                body: JSON.stringify({
                    event_type: eventType,
                    ...example,
                }),
            });

            const data = await response.json();

            if (response.ok) {
                setTestResult({ key: eventKey, success: true, message: `✓ Evento creado: ${data.event_id}` });
            } else {
                setTestResult({ key: eventKey, success: false, message: `✗ Error: ${data.error}` });
            }
        } catch (error) {
            setTestResult({ key: eventKey, success: false, message: `✗ Error de conexión` });
        } finally {
            setTesting(null);
        }
    };

    return (
        <div className="space-y-6">
            <div>
                <h3 className="text-lg font-semibold mb-4 text-white">Token de Ingesta</h3>
                <p className="text-sm text-[#8B949E] mb-4">
                    Utiliza este token para enviar eventos desde tu agente de IA.
                </p>
            </div>

            {/* Token Display */}
            <div className="bg-[#1A1F2B] rounded-lg p-4 border border-[#30363D]">
                <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-white">Token Actual</span>
                    <button
                        onClick={() => setShowToken(!showToken)}
                        className="text-sm text-[#7C3AED] hover:text-[#8B5CF6] transition-colors"
                    >
                        {showToken ? '🙈 Ocultar' : '👁️ Mostrar'}
                    </button>
                </div>
                <div className="bg-[#0D1117] rounded p-3 border border-[#30363D] font-mono text-sm text-white">
                    {showToken ? project.ingest_token : maskedToken}
                </div>
                <div className="mt-3 flex gap-2">
                    <button
                        onClick={() => {
                            navigator.clipboard.writeText(project.ingest_token || '');
                            alert('Token copiado al portapapeles');
                        }}
                        className="px-4 py-2 bg-[#7C3AED] text-white rounded-lg hover:bg-[#8B5CF6] transition-colors text-sm font-medium"
                    >
                        📋 Copiar Token
                    </button>
                    <button
                        onClick={handleRegenerateToken}
                        disabled={regenerating}
                        className="px-4 py-2 bg-[#F85149]/20 text-[#F85149] border border-[#F85149]/30 rounded-lg hover:bg-[#F85149]/30 disabled:opacity-50 transition-colors text-sm font-medium"
                    >
                        {regenerating ? 'Regenerando...' : '🔄 Regenerar Token'}
                    </button>
                </div>
            </div>

            {/* Endpoint URL */}
            <div>
                <label className="block text-sm font-medium text-white mb-2">
                    URL del Endpoint
                </label>
                <div className="bg-[#0D1117] rounded p-3 border border-[#30363D] font-mono text-sm flex items-center justify-between text-[#8B949E]">
                    <span className="truncate">
                        {typeof window !== 'undefined' ? window.location.origin : 'https://tu-app.netlify.app'}/api/ingest
                    </span>
                    <button
                        onClick={() => {
                            const url = `${typeof window !== 'undefined' ? window.location.origin : 'https://tu-app.netlify.app'}/api/ingest`;
                            navigator.clipboard.writeText(url);
                        }}
                        className="ml-2 text-[#7C3AED] hover:text-[#8B5CF6] transition-colors"
                    >
                        📋
                    </button>
                </div>
            </div>

            {/* cURL Generator */}
            <div>
                <h3 className="text-lg font-semibold mb-4 text-white">Generador de cURLs</h3>
                <p className="text-sm text-[#8B949E] mb-4">
                    Ejemplos de cURLs listos para copiar y probar cada tipo de evento.
                </p>

                <div className="space-y-3">
                    {EVENT_TYPES.map((event) => {
                        const curl = generatecURL(event.key, event.example);
                        const isCopied = copiedcURL === event.key;
                        const isTestingThis = testing === event.key;
                        const hasResult = testResult?.key === event.key;

                        return (
                            <details key={event.key} className="bg-[#1A1F2B] rounded-lg border border-[#30363D] group">
                                <summary className="px-4 py-3 cursor-pointer hover:bg-[#21262D] rounded-lg font-medium text-sm text-white flex items-center justify-between">
                                    <span>{event.label}</span>
                                    {hasResult && (
                                        <span className={`text-xs px-2 py-1 rounded ${testResult.success ? 'bg-[#3FB950]/20 text-[#3FB950]' : 'bg-[#F85149]/20 text-[#F85149]'}`}>
                                            {testResult.success ? '✓ OK' : '✗ Error'}
                                        </span>
                                    )}
                                </summary>
                                <div className="px-4 pb-4">
                                    <pre className="bg-[#0D1117] text-[#8B949E] p-4 rounded-lg text-xs overflow-x-auto mt-2 border border-[#30363D]">
                                        {curl}
                                    </pre>

                                    {hasResult && (
                                        <div className={`mt-2 p-2 rounded text-sm ${testResult.success ? 'bg-[#3FB950]/10 text-[#3FB950]' : 'bg-[#F85149]/10 text-[#F85149]'}`}>
                                            {testResult.message}
                                        </div>
                                    )}

                                    <div className="mt-3 flex gap-2">
                                        <button
                                            onClick={() => copycURL(curl, event.key)}
                                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${isCopied
                                                    ? 'bg-[#3FB950] text-white'
                                                    : 'bg-[#7C3AED] text-white hover:bg-[#8B5CF6]'
                                                }`}
                                        >
                                            {isCopied ? '✅ Copiado!' : '📋 Copiar cURL'}
                                        </button>
                                        <button
                                            onClick={() => testEndpoint(event.key, event.example, event.key)}
                                            disabled={isTestingThis}
                                            className="px-4 py-2 bg-[#1A1F2B] text-white border border-[#30363D] rounded-lg hover:border-[#7C3AED] transition-colors text-sm font-medium disabled:opacity-50"
                                        >
                                            {isTestingThis ? '⏳ Probando...' : '🧪 Probar Endpoint'}
                                        </button>
                                    </div>
                                </div>
                            </details>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
