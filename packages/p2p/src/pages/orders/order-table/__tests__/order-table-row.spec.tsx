import React from 'react';
import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { isDesktop, isMobile } from '@deriv/shared';
import { StoreProvider, mockStore } from '@deriv/stores';
import { useModalManagerContext } from 'Components/modal-manager/modal-manager-context';
import { mock_order } from 'Pages/orders/__mocks__/mock-orders-data';
import { useStores } from 'Stores';
import { createExtendedOrderDetails } from 'Utils/orders';
import serverTime from 'Utils/server-time';
import OrderTableRow from '../order-table-row';

const server_time: typeof serverTime = {
    init: jest.fn(() => new Date().getTime()),
    get: jest.fn(() => new Date().getTime()),
    getDistanceToServerTime: jest.fn(),
};

const mock_p2p_store: DeepPartial<ReturnType<typeof useStores>> = {
    general_store: {
        getLocalStorageSettingsForLoginId: jest.fn(() => ({
            notifications: [{ order_id: 'ORD123456', is_seen: true, is_active: true }],
        })),
        is_active_tab: true,
        server_time,
    },
    order_store: {
        loadMoreOrders: jest.fn(),
        setIsLoading: jest.fn(),
        setOrderId: jest.fn(),
        setOrders: jest.fn(),
        setOrderRating: jest.fn(),
        setRatingValue: jest.fn(),
    },
    sendbird_store: {
        setShouldShowChatModal: jest.fn(),
        setShouldShowChatOnOrders: jest.fn(),
    },
};

const mock_shared_store = mockStore({
    notifications: { removeNotificationByKey: jest.fn(), removeNotificationMessage: jest.fn() },
    client: { loginid: 'CR1231123' },
});

const extended_mock_order = createExtendedOrderDetails(
    mock_order,
    'CR1231123',
    mock_p2p_store.general_store.server_time
);

const mock_modal_manager: DeepPartial<ReturnType<typeof useModalManagerContext>> = {
    showModal: jest.fn(),
    hideModal: jest.fn(),
};

jest.mock('Stores', () => ({
    ...jest.requireActual('Stores'),
    useStores: jest.fn(() => mock_p2p_store),
}));

jest.mock('Components/modal-manager/modal-manager-context', () => ({
    ...jest.requireActual('Components/modal-manager/modal-manager-context'),
    useModalManagerContext: jest.fn(() => mock_modal_manager),
}));

jest.mock('@deriv/shared', () => ({
    ...jest.requireActual('@deriv/shared'),
    isMobile: jest.fn(() => false),
    isDesktop: jest.fn(() => true),
}));

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useHistory: jest.fn(() => ({
        replace: jest.fn(),
    })),
}));

const wrapper = ({ children }: { children: JSX.Element }) => (
    <StoreProvider store={mock_shared_store}>{children}</StoreProvider>
);

describe('<OrderTableRow />', () => {
    it('should render OrderTableRow with the details provided in desktop view', () => {
        render(<OrderTableRow row={extended_mock_order} />, {
            wrapper,
        });
        expect(screen.getByText('Sell')).toBeInTheDocument();
        expect(screen.getByText('ORD123456')).toBeInTheDocument();
        expect(screen.getByText('John Doe')).toBeInTheDocument();
    });

    it('should show rating modal if rate button is clicked when the order is completed in desktop view', () => {
        (useStores as jest.Mock).mockReturnValueOnce({
            ...mock_p2p_store,
            general_store: {
                ...mock_p2p_store.general_store,
                is_active_tab: false,
            },
        });
        mock_order.review_details = undefined;
        mock_order.status = 'completed';
        render(<OrderTableRow row={extended_mock_order} />, {
            wrapper,
        });
        const rate_button = screen.getByText('Rate');
        userEvent.click(rate_button);
        expect(mock_modal_manager.showModal).toHaveBeenCalled();
    });

    it('should update countdown timer every 1 seconds', () => {
        jest.useFakeTimers();
        render(<OrderTableRow row={extended_mock_order} />, {
            wrapper,
        });
        act(() => {
            jest.advanceTimersByTime(1000);
            expect(screen.getByText('00:00:00')).toBeInTheDocument();
        });
        jest.useRealTimers();
    });

    it('should call onClickDone function in showRatingModal when rate button is clicked', () => {
        (useStores as jest.Mock).mockReturnValueOnce({
            ...mock_p2p_store,
            general_store: {
                ...mock_p2p_store.general_store,
                is_active_tab: false,
            },
        });
        mock_order.review_details = undefined;
        mock_order.status = 'completed';
        render(<OrderTableRow row={extended_mock_order} />, {
            wrapper,
        });
        const rate_button = screen.getByText('Rate');
        userEvent.click(rate_button);

        mock_modal_manager.showModal.mock.calls[0][0].props.onClickDone();

        expect(mock_p2p_store.order_store.setOrderRating).toHaveBeenCalled();
        expect(mock_modal_manager.hideModal).toHaveBeenCalled();
        expect(mock_p2p_store.order_store.setRatingValue).toHaveBeenCalled();
        expect(mock_shared_store.notifications.removeNotificationByKey).toHaveBeenCalled();
        expect(mock_shared_store.notifications.removeNotificationMessage).toHaveBeenCalled();
        expect(mock_p2p_store.order_store.setIsLoading).toHaveBeenCalled();
        expect(mock_p2p_store.order_store.setOrders).toHaveBeenCalled();
        expect(mock_p2p_store.order_store.loadMoreOrders).toHaveBeenCalled();
    });

    it('should call onClickSkip function in showRatingModal when rate button is clicked', () => {
        (useStores as jest.Mock).mockReturnValueOnce({
            ...mock_p2p_store,
            general_store: {
                ...mock_p2p_store.general_store,
                is_active_tab: false,
            },
        });
        mock_order.review_details = undefined;
        mock_order.status = 'completed';
        render(<OrderTableRow row={extended_mock_order} />, {
            wrapper,
        });
        const rate_button = screen.getByText('Rate');
        userEvent.click(rate_button);

        mock_modal_manager.showModal.mock.calls[0][0].props.onClickSkip();

        expect(mock_modal_manager.hideModal).toHaveBeenCalled();
        expect(mock_p2p_store.order_store.setRatingValue).toHaveBeenCalled();
    });

    it('should render OrderTableRow with the details provided in mobile view', () => {
        (isDesktop as jest.Mock).mockReturnValueOnce(false);
        (isMobile as jest.Mock).mockReturnValueOnce(true);
        render(<OrderTableRow row={extended_mock_order} />, {
            wrapper,
        });
        expect(screen.getByText('Sell 0.50 USD')).toBeInTheDocument();
    });

    it('should show chat screen if chat icon is clicked', () => {
        (isDesktop as jest.Mock).mockReturnValueOnce(false);
        (isMobile as jest.Mock).mockReturnValueOnce(true);
        render(<OrderTableRow row={extended_mock_order} />, {
            wrapper,
        });

        const chat_icon = screen.getByTestId('dt_chat_icon');
        userEvent.click(chat_icon);
        expect(mock_p2p_store.sendbird_store.setShouldShowChatModal).toHaveBeenCalled();
        expect(mock_p2p_store.sendbird_store.setShouldShowChatOnOrders).toHaveBeenCalled();
    });

    it('should show rating modal if rate button is clicked when the order is completed in mobile view', () => {
        (isDesktop as jest.Mock).mockReturnValueOnce(false);
        (isMobile as jest.Mock).mockReturnValueOnce(true);
        (useStores as jest.Mock).mockReturnValueOnce({
            ...mock_p2p_store,
            general_store: {
                ...mock_p2p_store.general_store,
                is_active_tab: false,
            },
        });
        mock_order.review_details = undefined;
        mock_order.status = 'completed';
        render(<OrderTableRow row={extended_mock_order} />, {
            wrapper,
        });
        const rate_button = screen.getByText('Rate');
        userEvent.click(rate_button);
        expect(mock_modal_manager.showModal).toHaveBeenCalled();
    });
});
