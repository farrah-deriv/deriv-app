import React from 'react';
import { render, screen } from '@testing-library/react';
import { useStores } from 'Stores';
import OrderTableHeader from '../order-table-header';

const mock_store = {
    general_store: {
        is_active_tab: true,
        order_table_type: 'active',
    },
};

jest.mock('Stores', () => ({
    ...jest.requireActual('Stores'),
    useStores: jest.fn(() => mock_store),
}));

describe('<OrderTableHeader />', () => {
    it('should render OrderTableHeader for active orders', () => {
        render(<OrderTableHeader />);
        expect(screen.getByText('Time')).toBeInTheDocument();
    });

    it('should render OrderTableHeader for past orders', () => {
        (useStores as jest.Mock).mockReturnValueOnce({
            ...mock_store,
            general_store: {
                ...mock_store.general_store,
                order_table_type: 'inactive',
            },
        });
        render(<OrderTableHeader />);
        expect(screen.queryByText('Time')).not.toBeInTheDocument();
    });
});
