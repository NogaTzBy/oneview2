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
    target_currency?: string;
    exchange_rate?: number;
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
    summary: {
        conversations_started: number;
        conversations_closed: number;
        human_escalations: number;
        complaints: number;
        ai_purchases: number;
        closure_rate: number;
        template_opens: number;
        windows_24h: number;
        email_cart_abandoned?: number;
        email_buyer_x1?: number;
        email_buyer_recurring?: number;

        // Setters IA
        ai_message_sent?: number;
        first_follow_up?: number;
        second_follow_up?: number;
        state_new_construction?: number;
        state_construction_over_150?: number;
        state_link_sent?: number;
        state_scheduled_video_sent?: number;
        state_scheduled_video_sent_under_150?: number;
        state_scheduled_video_sent_remodel_over_150?: number;
    };
    trends?: Record<string, number>;
    trend?: Array<{
        date: string;
        value: number;
    }>;
    total_events: number;
    date_range: {
        from: string | null;
        to: string | null;
    };
}

