export type TOrderNotification = {
    order_id: string;
    is_seen: boolean;
    is_active: boolean;
};

export type TPaymentMethod = {
    display_name?: string;
    fields: {
        [key: string]: {
            display_name: string;
            required: number;
            type: 'text' | 'memo';

            value: string;
        };
    };
    is_enabled: 0 | 1;
    method: string;
    type: 'bank' | 'ewallet' | 'other';
    used_by_adverts: string[] | null;
    used_by_orders: string[] | null;
};
