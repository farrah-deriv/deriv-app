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
