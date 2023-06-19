import { TPaymentMethod } from 'Types';

export const mock_bank_transfer_payment_method: TPaymentMethod = {
    display_name: 'Bank Transfer',
    fields: {
        account: {
            display_name: 'Account Number',
            required: true,
            type: 'text',
            value: '1234567890',
        },
        bank_code: {
            display_name: 'Swift Code',
            required: true,
            type: 'text',
            value: '1234',
        },
        bank_name: {
            display_name: 'Bank Name',
            required: true,
            type: 'text',
            value: 'DBS',
        },

        branch: {
            display_name: 'Bank Address',
            required: true,
            type: 'text',
            value: '12 Marina Boulevard, Singapore',
        },
    },
    is_enabled: true,
    method: 'bank_transfer',
    type: 'bank',
};

export const mock_ewallet_payment_method: TPaymentMethod = {
    display_name: 'Skrill',
    fields: {
        account: {
            display_name: 'Account Number',
            required: true,
            type: 'text',
            value: '1234567890',
        },
        phone_number: {
            display_name: 'Phone Number',
            required: true,
            type: 'text',
            value: '1234567890',
        },
    },
    is_enabled: true,
    method: 'Skrill',
    type: 'ewallet',
};
