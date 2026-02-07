export interface Metric {
    key: string;
    label: string;
    value: number | string;
    icon?: string;
    trend?: number;
    isPercentage?: boolean;
}

export interface DateRange {
    from: string;
    to: string;
    label: string;
}

export interface Project {
    id: string;
    name: string;
    timezone: string;
    ingest_token: string;
    webhook_url?: string;
    webhook_interval?: number;
}

export interface Widget {
    id: string;
    project_id: string;
    widget_key: string;
    label: string;
    is_visible: boolean;
    position: number;
}

export interface MetricsResponse {
    metrics: {
        conversations_started: number;
        conversations_closed: number;
        human_escalations: number;
        complaints: number;
        ai_purchases: number;
        pending_payment_sent: number;
        confirmed_payment_sent: number;
        tracking_codes: number;
        template_opens: number;
        windows_24h: number;
        closure_rate: number;
    };
    total_events: number;
    date_range: {
        from: string | null;
        to: string | null;
    };
}
