'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { createClient } from '../lib/supabase-client';
import { EcommerceDashboard } from './views/EcommerceDashboard';
import { SettersDashboard } from './views/SettersDashboard';
import { AdminSelection } from './views/AdminSelection';

function DashboardContent() {
    const searchParams = useSearchParams();
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const supabase = createClient();
    const view = searchParams.get('view');

    useEffect(() => {
        const getUser = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            setUser(session?.user || null);
            setLoading(false);
        };
        getUser();
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background-light">
                <div className="text-center">
                    <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                </div>
            </div>
        );
    }

    if (!user) return null; // Middleware handles unauthorized access

    const isSuperAdmin = user.email === 'fede.maccioo@gmail.com';
    const userDashboardType = user.user_metadata?.dashboard_type;

    if (isSuperAdmin) {
        if (view === 'ecommerce') {
            return <EcommerceDashboard isSuperAdmin={true} />;
        }
        if (view === 'setters') {
            return <SettersDashboard isSuperAdmin={true} />;
        }
        // Super admin default view
        return <AdminSelection />;
    }

    // Normal User View Logic
    if (userDashboardType === 'setters') {
        return <SettersDashboard isSuperAdmin={false} />;
    }

    // Default to ecommerce for normal users without specific dashboard_type
    return <EcommerceDashboard isSuperAdmin={false} />;
}

export default function DashboardPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center bg-background-light">
                <div className="text-center">
                    <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                </div>
            </div>
        }>
            <DashboardContent />
        </Suspense>
    );
}
