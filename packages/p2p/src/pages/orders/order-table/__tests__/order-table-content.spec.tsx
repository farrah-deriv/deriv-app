import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { mockStore, StoreProvider } from '@deriv/stores';
import { useStores } from 'Stores';
import { mock_order } from 'Pages/orders/__mocks__/mock-orders-data';
import OrderTableContent from '../order-table-content';

const mock_p2p_store: DeepPartial<ReturnType<typeof useStores>> = {
    general_store: {
        handleTabClick: jest.fn(),
        is_active_tab: true,
        order_table_type: 'Active orders',
    },
    order_store: {
        api_error_message: '',
        has_more_items_to_load: false,
        is_loading: false,
        loadMoreOrders: jest.fn(),
        orders: [],
        setIsLoading: jest.fn(),
        setOrders: jest.fn(),
    },
};

const mock_shared_store = mockStore({
    client: {
        loginid: 'CR1231123',
    },
});

jest.mock('Stores', () => ({
    ...jest.requireActual('Stores'),
    useStores: jest.fn(() => mock_p2p_store),
}));

jest.mock('react-virtualized', () => ({
    ...jest.requireActual('react-virtualized'),
}));

const wrapper = ({ children }: { children: JSX.Element }) => (
    <StoreProvider store={mock_shared_store}>{children}</StoreProvider>
);

describe('<OrderTableContent />', () => {
    it('should render loading component when loading', () => {
        (useStores as jest.Mock).mockReturnValueOnce({
            ...mock_p2p_store,
            order_store: {
                ...mock_p2p_store.order_store,
                is_loading: true,
            },
        });
        render(<OrderTableContent />, { wrapper });
        expect(screen.getByTestId('dt_initial_loader')).toBeInTheDocument();
    });

    it('should show error message when there is an error', () => {
        (useStores as jest.Mock).mockReturnValueOnce({
            ...mock_p2p_store,
            order_store: {
                ...mock_p2p_store.order_store,
                api_error_message: 'Error',
                is_loading: false,
            },
        });
        render(<OrderTableContent />, { wrapper });
        expect(screen.getByText('Error')).toBeInTheDocument();
    });

    it('should render empty component when there are no orders and redirect to buy/sell page when the `Buy/Sell` button is clicked', () => {
        (useStores as jest.Mock).mockReturnValueOnce({
            ...mock_p2p_store,
            order_store: {
                ...mock_p2p_store.order_store,
                is_loading: false,
            },
        });
        render(<OrderTableContent />, { wrapper });
        expect(screen.getByText('You have no orders.')).toBeInTheDocument();

        const buy_sell_button = screen.getByRole('button', { name: 'Buy/Sell' });
        expect(buy_sell_button).toBeInTheDocument();
        userEvent.click(buy_sell_button);
        expect(mock_p2p_store.general_store.handleTabClick).toHaveBeenCalled();
    });

    it('should render orders list when there are orders', () => {
        (useStores as jest.Mock).mockReturnValueOnce({
            ...mock_p2p_store,
            order_store: {
                ...mock_p2p_store.order_store,
                orders: [mock_order],
                is_loading: false,
            },
        });

        render(<OrderTableContent />, { wrapper });
        expect(screen.getByTestId('dt_data_list')).toBeInTheDocument();
    });

    it('should render inactive orders when the tab is inactive', () => {
        (useStores as jest.Mock).mockReturnValueOnce({
            ...mock_p2p_store,
            general_store: {
                ...mock_p2p_store.general_store,
                is_active_tab: false,
            },
            order_store: {
                ...mock_p2p_store.order_store,
                orders: [{ ...mock_order, status: 'completed' }],
                is_loading: false,
            },
        });

        render(<OrderTableContent />, { wrapper });
        expect(screen.getByTestId('dt_data_list')).toBeInTheDocument();
    });
});
