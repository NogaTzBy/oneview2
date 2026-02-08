'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { createClient } from '../lib/supabase-client';

interface Project {
    id: string;
    name: string;
    ingest_token: string;
    timezone: string;
    created_at: string;
}

interface ProjectContextType {
    selectedProject: Project | null;
    projects: Project[];
    setSelectedProject: (project: Project) => void;
    refreshProjects: () => Promise<void>;
    loading: boolean;
}

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

export function ProjectProvider({ children }: { children: ReactNode }) {
    const [selectedProject, setSelectedProjectState] = useState<Project | null>(null);
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);
    const supabase = createClient();

    const fetchProjects = async () => {
        try {
            setLoading(true);
            const response = await fetch('/api/projects');
            if (response.ok) {
                const data = await response.json();
                setProjects(data.projects || []);

                // Auto-select first project if none selected
                if (data.projects && data.projects.length > 0 && !selectedProject) {
                    const savedProjectId = localStorage.getItem('selectedProjectId');
                    const projectToSelect = savedProjectId
                        ? data.projects.find((p: Project) => p.id === savedProjectId) || data.projects[0]
                        : data.projects[0];
                    setSelectedProjectState(projectToSelect);
                }
            }
        } catch (error) {
            console.error('Error fetching projects:', error);
        } finally {
            setLoading(false);
        }
    };

    const setSelectedProject = (project: Project) => {
        setSelectedProjectState(project);
        localStorage.setItem('selectedProjectId', project.id);
    };

    useEffect(() => {
        fetchProjects();
    }, []);

    return (
        <ProjectContext.Provider
            value={{
                selectedProject,
                projects,
                setSelectedProject,
                refreshProjects: fetchProjects,
                loading,
            }}
        >
            {children}
        </ProjectContext.Provider>
    );
}

export function useProject() {
    const context = useContext(ProjectContext);
    if (context === undefined) {
        throw new Error('useProject must be used within a ProjectProvider');
    }
    return context;
}
