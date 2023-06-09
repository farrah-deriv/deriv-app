import React from 'react';
import { render, screen } from '@testing-library/react';
import OrderDetailsComplain from '../order-details-complain';

const mock_store = {
    orde_store: {
        order_information: {
            id: '123',
            is_buy_order_for_user: true,
        },
        disputeOrderRequest: jest.fn(),
    },
    order_details_store: {
        error_message: '',
        should_show_order_details_complain: true,
        setErrorMessage: jest.fn(),
        setShouldShowOrderDetailsComplain: jest.fn(),
    },
};

jest.mock('Stores', () => ({
    useStores: () => mock_store,
}));

describe('< OrderDetailsComplain />', () => {
    it('should render', () => {
        render(<OrderDetailsComplain />);
        expect(screen.getByRole('heading', { name: /complaint/i })).toBeInTheDocument();
    });
});
