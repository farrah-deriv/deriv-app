export type TOrder = {
    account_currency: string;
    advert_details: {
        block_trade: boolean;
        description: string;
        id: string;
        payment_method: string;
        type: string;
    };
    advertiser_details: {
        first_name: string;
        id: string;
        is_online: boolean;
        is_recommended: boolean | null;
        last_name: string;
        last_online_time: number;
        loginid: string;
        name: string;
    };
    amount: number;
    amount_display: string;
    chat_channel_url: string;
    client_details: {
        first_name: string;
        id: string;
        is_online: boolean;
        is_recommended?: boolean | null;
        last_name: string;
        last_online_time: number;
        loginid: string;
        name: string;
    };
    contact_info: string;
    created_time: number;
    dispute_details: {
        dispute_reason: string | null;
        disputer_loginid: string | null;
    };
    expiry_time: number;
    id: string;
    is_incoming: boolean;
    is_reviewable: boolean;
    is_seen: boolean;
    local_currency: string;
    payment_info: string;
    price: number;
    price_display: string;
    review_details?: {
        comment: string;
        rating: number;
    };
    rate: number;
    rate_display: string;
    status: string;
    type: string;
};

export type TOrderNotification = {
    order_id: string;
    is_seen: boolean;
    is_active: boolean;
};

export type TPaymentMethod = {
    display_name: string;
    is_enabled: boolean;
    method: string;
    type: string;
    fields: {
        [key: string]: {
            display_name: string;
            required: boolean;
            type: string;
            value: string;
        };
    };
};
