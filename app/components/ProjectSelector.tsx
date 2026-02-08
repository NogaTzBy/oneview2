'use client';

import React, { useState } from 'react';
import { useProject } from '../context/ProjectContext';

export function ProjectSelector() {
    const { selectedProject, projects, setSelectedProject, refreshProjects } = useProject();
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [isOpen, setIsOpen] = useState(false);

    const handleProjectSelect = (projectId: string) => {
        if (projectId === 'new') {
            setShowCreateModal(true);
            setIsOpen(false);
            return;
        }

        const project = projects.find(p => p.id === projectId);
        if (project) {
            setSelectedProject(project);
            setIsOpen(false);
        }
    };

    return (
        <>
            <div className="relative">
                <span className="material-symbols-outlined text-[20px] text-primary absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none z-10">
                    storefront
                </span>
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="pl-10 pr-8 py-1.5 bg-transparent border-0 rounded-lg text-slate-900 font-medium text-sm focus:outline-none focus:bg-slate-100 transition-colors cursor-pointer hover:bg-slate-100 flex items-center gap-2"
                >
                    {selectedProject?.name || 'Seleccionar Tienda'}
                </button>
                <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none">
                    <span className="material-symbols-outlined text-[16px] text-slate-400">expand_more</span>
                </div>

                {isOpen && (
                    <>
                        <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
                        <div className="absolute top-full right-0 mt-2 w-64 glass-panel bg-white rounded-lg shadow-lg z-50 p-4">
                            <div className="space-y-2">
                                {projects.map((project) => (
                                    <button
                                        key={project.id}
                                        onClick={() => handleProjectSelect(project.id)}
                                        className={`w-full text-left px-3 py-2 rounded-lg transition-colors text-sm ${selectedProject?.id === project.id
                                                ? 'bg-primary/10 text-primary font-medium'
                                                : 'text-slate-900 hover:bg-slate-100'
                                            }`}
                                    >
                                        {project.name}
                                    </button>
                                ))}
                                <div className="border-t border-slate-200 my-2"></div>
                                <button
                                    onClick={() => handleProjectSelect('new')}
                                    className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-100 text-sm text-slate-900 transition-colors flex items-center gap-2"
                                >
                                    <span className="material-symbols-outlined text-[18px] text-primary">add</span>
                                    Nuevo Proyecto
                                </button>
                            </div>
                        </div>
                    </>
                )}
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
