'use client';

import React, { useState, useEffect } from 'react';
import { Project } from '../lib/types';

interface ConfigTabWebhookProps {
    project: Project;
    onRefresh: () => void;
}

export function ConfigTabWebhook({ project, onRefresh }: ConfigTabWebhookProps) {
    const [webhookUrl, setWebhookUrl] = useState(project.webhook_url || '');
    const [webhookInterval, setWebhookInterval] = useState(project.webhook_interval || 60);
    const [saving, setSaving] = useState(false);
    const [testing, setTesting] = useState(false);
    const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);
    const [hasChanges, setHasChanges] = useState(false);

    useEffect(() => {
        setWebhookUrl(project.webhook_url || '');
        setWebhookInterval(project.webhook_interval || 60);
    }, [project]);

    useEffect(() => {
        const urlChanged = webhookUrl !== (project.webhook_url || '');
        const intervalChanged = webhookInterval !== (project.webhook_interval || 60);
        setHasChanges(urlChanged || intervalChanged);
    }, [webhookUrl, webhookInterval, project]);

    const handleSave = async () => {
        try {
            setSaving(true);
            const response = await fetch('/api/config', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    project_id: project.id,
                    webhook_url: webhookUrl || null,
                    webhook_interval: webhookInterval,
                }),
            });

            if (response.ok) {
                onRefresh();
                setHasChanges(false);
                alert('Configuración guardada correctamente');
            } else {
                alert('Error al guardar la configuración');
            }
        } catch (error) {
            console.error('Error saving webhook config:', error);
            alert('Error al guardar la configuración');
        } finally {
            setSaving(false);
        }
    };

    const handleTest = async () => {
        if (!webhookUrl) {
            alert('Ingresa una URL de webhook para probar');
            return;
        }

        try {
            setTesting(true);
            setTestResult(null);

            // Test webhook by sending a ping
            const testPayload = {
                type: 'ping',
                project_id: project.id,
                project_name: project.name,
                timestamp: new Date().toISOString(),
                message: 'Test de conexión desde OneView Dashboard',
            };

            const response = await fetch(webhookUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(testPayload),
                mode: 'no-cors', // Permitir CORS
            });

            // Con no-cors no podemos leer la respuesta, pero si no hay error, asumimos OK
            setTestResult({
                success: true,
                message: 'Ping enviado correctamente. Verifica que tu servidor haya recibido el evento.',
            });
        } catch (error) {
            console.error('Error testing webhook:', error);
            setTestResult({
                success: false,
                message: 'Error al enviar el ping. Verifica que la URL sea correcta y el servidor esté disponible.',
            });
        } finally {
            setTesting(false);
        }
    };

    return (
        <div className="space-y-6">
            <div>
                <h3 className="text-lg font-semibold mb-2 text-white">Configuración de Webhook</h3>
                <p className="text-sm text-[#8B949E]">
                    Configura un webhook para recibir notificaciones cuando se procesen métricas.
                </p>
            </div>

            {/* Webhook URL */}
            <div className="bg-[#1A1F2B] rounded-lg p-4 border border-[#30363D]">
                <label className="block text-sm font-medium text-white mb-2">
                    URL del Webhook
                </label>
                <input
                    type="url"
                    value={webhookUrl}
                    onChange={(e) => setWebhookUrl(e.target.value)}
                    placeholder="https://tu-servidor.com/webhook"
                    className="w-full px-4 py-3 bg-[#0D1117] border border-[#30363D] rounded-lg text-white placeholder-[#8B949E] focus:border-[#7C3AED] focus:ring-1 focus:ring-[#7C3AED] outline-none transition-colors"
                />
                <p className="text-xs text-[#8B949E] mt-2">
                    Este endpoint recibirá un POST con los datos de métricas en formato JSON.
                </p>
            </div>

            {/* Webhook Interval */}
            <div className="bg-[#1A1F2B] rounded-lg p-4 border border-[#30363D]">
                <label className="block text-sm font-medium text-white mb-2">
                    Intervalo de Envío (segundos)
                </label>
                <input
                    type="number"
                    value={webhookInterval}
                    onChange={(e) => setWebhookInterval(parseInt(e.target.value) || 60)}
                    min="10"
                    max="3600"
                    className="w-full px-4 py-3 bg-[#0D1117] border border-[#30363D] rounded-lg text-white placeholder-[#8B949E] focus:border-[#7C3AED] focus:ring-1 focus:ring-[#7C3AED] outline-none transition-colors"
                />
                <p className="text-xs text-[#8B949E] mt-2">
                    Mínimo: 10 segundos. Máximo: 3600 segundos (1 hora).
                </p>
            </div>

            {/* Test Result */}
            {testResult && (
                <div className={`p-4 rounded-lg border ${testResult.success
                        ? 'bg-[#3FB950]/10 border-[#3FB950]/30 text-[#3FB950]'
                        : 'bg-[#F85149]/10 border-[#F85149]/30 text-[#F85149]'
                    }`}>
                    <div className="flex items-start gap-2">
                        <span className="text-xl">{testResult.success ? '✓' : '✗'}</span>
                        <p className="text-sm">{testResult.message}</p>
                    </div>
                </div>
            )}

            {/* Payload Example */}
            <div className="bg-[#1A1F2B] rounded-lg p-4 border border-[#30363D]">
                <h4 className="text-sm font-medium text-white mb-3">Ejemplo de Payload</h4>
                <pre className="bg-[#0D1117] text-[#8B949E] p-4 rounded-lg text-xs overflow-x-auto border border-[#30363D]">
                    {`{
  "type": "metrics_update",
  "project_id": "${project.id}",
  "timestamp": "${new Date().toISOString()}",
  "metrics": {
    "conversations_started": 10,
    "conversations_closed": 8,
    "human_escalations": 2,
    "complaints": 1,
    "ai_purchases": 3,
    "closure_rate": 80
  }
}`}
                </pre>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
                <button
                    onClick={handleSave}
                    disabled={saving || !hasChanges}
                    className="px-6 py-3 bg-[#7C3AED] text-white rounded-lg hover:bg-[#8B5CF6] disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
                >
                    {saving ? '⏳ Guardando...' : '💾 Guardar Configuración'}
                </button>
                <button
                    onClick={handleTest}
                    disabled={testing || !webhookUrl}
                    className="px-6 py-3 bg-[#1A1F2B] text-white border border-[#30363D] rounded-lg hover:border-[#7C3AED] disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
                >
                    {testing ? '⏳ Probando...' : '🧪 Probar Webhook'}
                </button>
            </div>

            {hasChanges && (
                <p className="text-sm text-[#F0883E]">
                    ⚠️ Tienes cambios sin guardar
                </p>
            )}
        </div>
    );
}
