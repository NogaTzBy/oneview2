'use client';

import React, { useState } from 'react';
import { useProject } from '../context/ProjectContext';

export function ProjectSelector() {
    const { selectedProject, projects, setSelectedProject, refreshProjects } = useProject();
    const [showCreateModal, setShowCreateModal] = useState(false);

    const handleProjectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const value = e.target.value;

        if (value === 'new') {
            setShowCreateModal(true);
            return;
        }

        const project = projects.find(p => p.id === value);
        if (project) {
            setSelectedProject(project);
        }
    };

    return (
        <>
            <div className="relative">
                <select
                    value={selectedProject?.id || ''}
                    onChange={handleProjectChange}
                    className="appearance-none pl-4 pr-10 py-2.5 bg-gradient-to-b from-[#1C2128] to-[#161B22] border border-[#30363D] rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#7C3AED] focus:border-transparent transition-all duration-200 cursor-pointer hover:border-[#7C3AED]/50 shadow-sm"
                >
                    {projects.map((project) => (
                        <option key={project.id} value={project.id} className="bg-[#161B22]">
                            {project.name}
                        </option>
                    ))}
                    <option value="new" className="bg-[#161B22]">+ Nuevo Proyecto</option>
                </select>

                {/* Custom Chevron Icon */}
                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                    <svg
                        className="w-4 h-4 text-[#8B949E]"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 9l-7 7-7-7"
                        />
                    </svg>
                </div>
            </div>

            {showCreateModal && (
                <CreateProjectModal
                    onClose={() => setShowCreateModal(false)}
                    onSuccess={() => {
                        setShowCreateModal(false);
                        refreshProjects();
                    }}
                />
            )}
        </>
    );
}

function CreateProjectModal({ onClose, onSuccess }: { onClose: () => void; onSuccess: () => void }) {
    const [name, setName] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const response = await fetch('/api/projects', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name }),
            });

            if (!response.ok) {
                const data = await response.json();
                setError(data.error || 'Error al crear proyecto');
                return;
            }

            onSuccess();
        } catch (err: any) {
            setError(err.message || 'Error al crear proyecto');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
            <div className="bg-[#161B22] border border-[#30363D] rounded-xl p-6 w-full max-w-md shadow-2xl animate-in zoom-in-95 duration-200">
                <h3 className="text-xl font-bold text-white mb-4">Crear Nuevo Proyecto</h3>

                {error && (
                    <div className="mb-4 p-3 bg-[#F85149]/10 border border-[#F85149]/50 rounded-lg animate-in slide-in-from-top-2 duration-200">
                        <p className="text-[#F85149] text-sm">{error}</p>
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label htmlFor="projectName" className="block text-sm font-medium text-[#C9D1D9] mb-2">
                            Nombre del Proyecto
                        </label>
                        <input
                            id="projectName"
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                            className="w-full px-4 py-2.5 bg-[#0D1117] border border-[#30363D] rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#7C3AED] focus:border-transparent transition-all"
                            placeholder="Ej: Mi Tienda"
                            autoFocus
                        />
                    </div>

                    <div className="flex gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-4 py-2.5 bg-[#0D1117] border border-[#30363D] rounded-lg text-white hover:border-[#7C3AED]/50 transition-all"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 px-4 py-2.5 bg-[#7C3AED] hover:bg-[#8B5CF6] disabled:bg-[#30363D] disabled:cursor-not-allowed rounded-lg text-white font-medium transition-all shadow-lg shadow-[#7C3AED]/20"
                        >
                            {loading ? 'Creando...' : 'Crear'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
