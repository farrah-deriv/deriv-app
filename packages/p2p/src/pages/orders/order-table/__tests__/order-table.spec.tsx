import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useStores } from 'Stores';
import OrderTable from '../order-table';

const mock_general_store = {
    active_notification_count: 0,
    inactive_notification_count: 0,
    order_table_type: 'active',
    setOrderTableType: jest.fn(),
};

jest.mock('Stores', () => ({
    ...jest.requireActual('Stores'),
    useStores: jest.fn(
        (): DeepPartial<ReturnType<typeof useStores>> => ({
            general_store: mock_general_store,
        })
    ),
}));

jest.mock('Pages/orders/order-table/order-table-content', () => jest.fn(() => <div>Order Table Content</div>));

describe('<OrderTable/>', () => {
    it('should render OrderTableContent', () => {
        render(<OrderTable />);
        expect(screen.getByText('Order Table Content')).toBeInTheDocument();
    });

    it('should change order table type when toggle button is clicked', () => {
        render(<OrderTable />);
        const past_orders_button = screen.getByText('Past orders');
        expect(past_orders_button).toBeInTheDocument();
        userEvent.click(past_orders_button);

        expect(mock_general_store.setOrderTableType).toHaveBeenCalledWith('inactive');
    });
});
