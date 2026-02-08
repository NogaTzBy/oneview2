'use client';

import { useState, useEffect } from 'react';
import { useProject } from '../context/ProjectContext';

interface Notification {
    id: string;
    created_at: string;
    metadata: any;
}

interface NotificationsResponse {
    unread_count: number;
    notifications: Notification[];
}

export function useNotifications() {
    const { selectedProject } = useProject();
    const [unreadCount, setUnreadCount] = useState(0);
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [loading, setLoading] = useState(false);

    const fetchNotifications = async () => {
        if (!selectedProject?.id) return;

        try {
            setLoading(true);
            const response = await fetch(`/api/notifications?projectId=${selectedProject.id}`);

            if (!response.ok) {
                throw new Error('Failed to fetch notifications');
            }

            const data: NotificationsResponse = await response.json();
            setUnreadCount(data.unread_count);
            setNotifications(data.notifications);
        } catch (error) {
            console.error('Error fetching notifications:', error);
        } finally {
            setLoading(false);
        }
    };

    // Fetch on mount and when project changes
    useEffect(() => {
        fetchNotifications();
    }, [selectedProject?.id]);

    // Poll every 30 seconds
    useEffect(() => {
        const interval = setInterval(() => {
            fetchNotifications();
        }, 30000); // 30 seconds

        return () => clearInterval(interval);
    }, [selectedProject?.id]);

    return {
        unreadCount,
        notifications,
        loading,
        refresh: fetchNotifications
    };
}
