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
            <select
                value={selectedProject?.id || ''}
                onChange={handleProjectChange}
                className="px-4 py-2 bg-[#161B22] border border-[#30363D] rounded-lg text-white focus:outline-none focus:border-[#7C3AED] transition-colors cursor-pointer"
            >
                {projects.map((project) => (
                    <option key={project.id} value={project.id}>
                        {project.name}
                    </option>
                ))}
                <option value="new">+ Nuevo Proyecto</option>
            </select>

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
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-[#161B22] border border-[#30363D] rounded-lg p-6 w-full max-w-md">
                <h3 className="text-xl font-bold text-white mb-4">Crear Nuevo Proyecto</h3>

                {error && (
                    <div className="mb-4 p-3 bg-[#F85149]/10 border border-[#F85149]/50 rounded-lg">
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
                            className="w-full px-4 py-2 bg-[#0D1117] border border-[#30363D] rounded-lg text-white focus:outline-none focus:border-[#7C3AED] transition-colors"
                            placeholder="Ej: Mi Tienda"
                        />
                    </div>

                    <div className="flex gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-4 py-2 bg-[#0D1117] border border-[#30363D] rounded-lg text-white hover:border-[#7C3AED] transition-colors"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 px-4 py-2 bg-[#7C3AED] hover:bg-[#8B5CF6] disabled:bg-[#30363D] disabled:cursor-not-allowed rounded-lg text-white font-medium transition-colors"
                        >
                            {loading ? 'Creando...' : 'Crear'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
