import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { StoreProvider, mockStore } from '@deriv/stores';
import { useModalManagerContext } from 'Components/modal-manager/modal-manager-context';
import { useStores } from 'Stores';
import OrderDetails from '../order-details';

const mock_order_info = {
    account_currency: 'USD',
    advert_details: { description: 'P2P Dev' },
    amount_display: 20,
    chat_channel_url: 'http://www.deriv.com',
    contact_info: '123-456',
    completion_time: 0,
    has_timer_expired: false,
    id: 123,
    is_active_order: false,
    is_completed_order: false,
    is_buy_order_for_user: false,
    is_buyer_confirmed_order: false,
    is_my_ad: false,
    is_pending_order: false,
    is_reviewable: false,
    is_sell_order: false,
    labels: {
        counterparty_nickname_label: 'Test',
        result_string: 'Result str',
        left_send_or_receive: 'Left Send or receive',
        right_send_or_receive: 'Right Send or receive',
        payment_details: 'Payment details',
        contact_details: 'Contact',
        instructions: ' Test Instructions',
    },
    local_currency: 'AED',
    other_user_details: { name: 'Deriv P2P', first_name: 'Deriv', last_name: 'P2P' },
    payment_info: 'Online',
    purchase_time: '10.00',
    rate: 2,
    review_details: 'Test',
    should_highlight_alert: false,
    should_highlight_danger: false,
    should_highlight_success: false,
    should_show_lost_funds_banner: false,
    should_show_order_footer: false,
    status_string: 'Check',
};

const mock_order_store = {
    order_information: { ...mock_order_info },
    order_id: '123',
    has_order_payment_method_details: false,
    order_payment_method_details: [],
    setOrderPaymentMethodDetails: jest.fn(),
    getSettings: jest.fn(),
    getWebsiteStatus: jest.fn(),
    setRatingValue: jest.fn(),
    setIsRecommended: jest.fn(),
    setOrderId: jest.fn(),
    setActiveOrder: jest.fn(),
};

const mock_set_chat_channel_url = jest.fn();
const mock_create_chat_for_new_order = jest.fn();

const mock_sendbird_store = {
    should_show_chat_on_orders: false,
    setChatChannelUrl: mock_set_chat_channel_url,
    setHasChatError: jest.fn(),
    createChatForNewOrder: mock_create_chat_for_new_order,
    registerEventListeners: jest.fn().mockReturnValue(jest.fn()),
    registerMobXReactions: jest.fn().mockReturnValue(jest.fn()),
};

const mock_my_profile_store = {
    getPaymentMethodsList: jest.fn(),
};

const mock_buy_sell_store = {
    is_create_order_subscribed: true,
    setIsCreateOrderSubscribed: jest.fn(),
    unsubscribeCreateOrder: jest.fn(),
};

const mock_general_store = {
    redirectToOrderDetails: jest.fn(),
};

jest.mock('Stores', () => ({
    ...jest.requireActual('Stores'),
    useStores: jest.fn(() => ({
        order_store: { ...mock_order_store },
        sendbird_store: { ...mock_sendbird_store },
        my_profile_store: { ...mock_my_profile_store },
        buy_sell_store: { ...mock_buy_sell_store },
        general_store: { ...mock_general_store },
    })),
}));

const mock_show_modal = jest.fn();
const mock_hide_modal = jest.fn();
const mock_use_register_modal_props = jest.fn();

const mock_modal_manager_context = {
    isCurrentModal: jest.fn(() => false),
    showModal: mock_show_modal,
    hideModal: mock_hide_modal,
    useRegisterModalProps: mock_use_register_modal_props,
};

jest.mock('Components/modal-manager/modal-manager-context', () => ({
    ...jest.requireActual('Components/modal-manager/modal-manager-context'),
    useModalManagerContext: jest.fn(() => mock_modal_manager_context),
}));

jest.mock('@deriv/shared', () => ({
    ...jest.requireActual('@deriv/shared'),
    isDesktop: jest.fn(() => true),
}));

// jest.mock('react', () => ({
//     ...jest.requireActual('react'),
//     useState: jest.fn(),
// }));

jest.mock('Components/p2p-accordion/p2p-accordion', () => jest.fn(() => <div>Payment methods listed</div>));

jest.mock('Pages/orders/chat/chat.jsx', () => jest.fn(() => <div>Chat section</div>));

jest.mock('Pages/orders/order-details/order-details-footer', () => jest.fn(() => <div>Order details footer</div>));

jest.mock('Pages/orders/order-details/order-info-block', () => jest.fn(() => <div>Order Info Block</div>));

describe('<OrderDetails/>', () => {
    it('should render component with loss of funds warning banner', () => {
        useStores.mockReturnValueOnce({
            order_store: {
                ...mock_order_store,
                order_information: {
                    ...mock_order_info,
                    should_show_lost_funds_banner: true,
                    chat_channel_url: null,
                },
            },
            sendbird_store: { ...mock_sendbird_store },
            my_profile_store: { ...mock_my_profile_store },
            buy_sell_store: { ...mock_buy_sell_store },
            general_store: { ...mock_general_store },
        });
        render(<OrderDetails />, {
            wrapper: ({ children }) => <StoreProvider store={mockStore({})}>{children}</StoreProvider>,
        });
        expect(
            screen.getByText("Don't risk your funds with cash transactions. Use bank transfers or e-wallets instead.")
        ).toBeInTheDocument();
    });
    it('should render success message when highlight success is true', () => {
        useStores.mockReturnValueOnce({
            order_store: {
                ...mock_order_store,
                order_information: { ...mock_order_info, should_highlight_success: true },
            },
            sendbird_store: { ...mock_sendbird_store },
            my_profile_store: { ...mock_my_profile_store },
            buy_sell_store: { ...mock_buy_sell_store },
            general_store: { ...mock_general_store },
        });
        render(<OrderDetails />, {
            wrapper: ({ children }) => <StoreProvider store={mockStore({})}>{children}</StoreProvider>,
        });
        expect(screen.getByText('Result str')).toBeInTheDocument();
    });
    it('should display footer info when show_order_footer is set', () => {
        useStores.mockReturnValueOnce({
            order_store: {
                ...mock_order_store,
                order_information: { ...mock_order_info, should_show_order_footer: true },
            },
            sendbird_store: { ...mock_sendbird_store },
            my_profile_store: { ...mock_my_profile_store },
            buy_sell_store: { ...mock_buy_sell_store },
            general_store: { ...mock_general_store },
        });
        render(<OrderDetails />, {
            wrapper: ({ children }) => <StoreProvider store={mockStore({})}>{children}</StoreProvider>,
        });
        expect(screen.getByText('Order details footer')).toBeInTheDocument();
    });
    it('should display formatted currency when the order is pending', () => {
        useStores.mockReturnValueOnce({
            order_store: {
                ...mock_order_store,
                order_information: { ...mock_order_info, is_pending_order: true },
            },
            sendbird_store: { ...mock_sendbird_store },
            my_profile_store: { ...mock_my_profile_store },
            buy_sell_store: { ...mock_buy_sell_store },
            general_store: { ...mock_general_store },
        });
        render(<OrderDetails />, {
            wrapper: ({ children }) => <StoreProvider store={mockStore({})}>{children}</StoreProvider>,
        });
        expect(screen.getByText('40.00 AED')).toBeInTheDocument();
    });
    it('should display payment details when Order is active', () => {
        useStores.mockReturnValueOnce({
            order_store: {
                ...mock_order_store,
                order_information: { ...mock_order_info, is_active_order: true },
                has_order_payment_method_details: true,
            },
            sendbird_store: { ...mock_sendbird_store },
            my_profile_store: { ...mock_my_profile_store },
            buy_sell_store: { ...mock_buy_sell_store },
            general_store: { ...mock_general_store },
        });
        render(<OrderDetails />, {
            wrapper: ({ children }) => <StoreProvider store={mockStore({})}>{children}</StoreProvider>,
        });
        expect(screen.getByText('Payment details')).toBeInTheDocument();
    });
    it('should render Chat component if should_show_chat_on_orders is enabled', () => {
        useStores.mockReturnValueOnce({
            order_store: {
                ...mock_order_store,
            },
            sendbird_store: { ...mock_sendbird_store, should_show_chat_on_orders: true },
            my_profile_store: { ...mock_my_profile_store },
            buy_sell_store: { ...mock_buy_sell_store },
            general_store: { ...mock_general_store },
        });
        render(<OrderDetails />, {
            wrapper: ({ children }) => <StoreProvider store={mockStore({})}>{children}</StoreProvider>,
        });
        expect(screen.getByText('Chat section')).toBeInTheDocument();
    });
    it('should display Buy section when is_buy_order_for_user flag is enabled', () => {
        useStores.mockReturnValueOnce({
            order_store: {
                ...mock_order_store,
                order_information: { ...mock_order_info, is_buy_order_for_user: true },
            },
            sendbird_store: { ...mock_sendbird_store },
            my_profile_store: { ...mock_my_profile_store },
            buy_sell_store: { ...mock_buy_sell_store },
            general_store: { ...mock_general_store },
        });
        render(<OrderDetails />, {
            wrapper: ({ children }) => <StoreProvider store={mockStore({})}>{children}</StoreProvider>,
        });
        expect(screen.getByText('Buy USD order')).toBeInTheDocument();
    });

    it('should show rating modal when rate button is clicked', () => {
        useStores.mockReturnValueOnce({
            order_store: {
                ...mock_order_store,
                order_information: {
                    ...mock_order_info,
                    is_completed_order: true,
                    is_reviewable: true,
                    review_details: null,
                },
            },
            sendbird_store: { ...mock_sendbird_store },
            my_profile_store: { ...mock_my_profile_store },
            buy_sell_store: { ...mock_buy_sell_store },
            general_store: { ...mock_general_store },
        });
        render(<OrderDetails />, {
            wrapper: ({ children }) => <StoreProvider store={mockStore({})}>{children}</StoreProvider>,
        });
        userEvent.click(screen.getByTestId('dt_user_rating_button'));
        expect(mock_show_modal).toHaveBeenCalledWith({ key: 'RatingModal' });
    });

    it('should set chat channel after 1250ms if chat_channel_url is present', async () => {
        jest.useFakeTimers();
        render(<OrderDetails />, {
            wrapper: ({ children }) => <StoreProvider store={mockStore({})}>{children}</StoreProvider>,
        });
        jest.advanceTimersByTime(1250);
        await waitFor(() => expect(mock_set_chat_channel_url).toHaveBeenCalledWith('http://www.deriv.com'));
        jest.useRealTimers();
    });
    it('should set chat channel onmount if chat_channel_url is present', () => {
        useStores.mockReturnValueOnce({
            order_store: {
                ...mock_order_store,
                order_information: { ...mock_order_info },
            },
            sendbird_store: { ...mock_sendbird_store },
            my_profile_store: { ...mock_my_profile_store },
            buy_sell_store: { ...mock_buy_sell_store, is_create_order_subscribed: false },
            general_store: { ...mock_general_store },
        });
        render(<OrderDetails />, {
            wrapper: ({ children }) => <StoreProvider store={mockStore({})}>{children}</StoreProvider>,
        });

        expect(mock_set_chat_channel_url).toHaveBeenCalledWith('http://www.deriv.com');
    });

    it('should create chat channel onmount if chat_channel_url is not present', () => {
        useStores.mockReturnValueOnce({
            order_store: {
                ...mock_order_store,
                order_information: { ...mock_order_info, chat_channel_url: null },
            },
            sendbird_store: { ...mock_sendbird_store },
            my_profile_store: { ...mock_my_profile_store },
            buy_sell_store: { ...mock_buy_sell_store, is_create_order_subscribed: false },
            general_store: { ...mock_general_store },
        });
        render(<OrderDetails />, {
            wrapper: ({ children }) => <StoreProvider store={mockStore({})}>{children}</StoreProvider>,
        });

        expect(mock_create_chat_for_new_order).toHaveBeenCalled();
    });

    it('should show email link expired modal if email is expired', () => {
        useStores.mockReturnValueOnce({
            order_store: {
                ...mock_order_store,
                error_code: null,
                order_information: { ...mock_order_info, verification_pending: 0, is_buy_order_for_user: false },
            },
            sendbird_store: { ...mock_sendbird_store },
            my_profile_store: { ...mock_my_profile_store },
            buy_sell_store: { ...mock_buy_sell_store },
            general_store: { ...mock_general_store },
        });
        render(<OrderDetails />, {
            wrapper: ({ children }) => <StoreProvider store={mockStore({})}>{children}</StoreProvider>,
        });
        expect(mock_show_modal).toBeCalledWith({ key: 'EmailLinkExpiredModal' }, { should_stack_modal: false });
    });

    it('should hide modal when the order is expired', () => {
        useStores.mockReturnValueOnce({
            order_store: {
                ...mock_order_store,
                order_information: { ...mock_order_info, status_string: 'Expired' },
            },
            sendbird_store: { ...mock_sendbird_store },
            my_profile_store: { ...mock_my_profile_store },
            buy_sell_store: { ...mock_buy_sell_store },
            general_store: { ...mock_general_store },
        });
        (useModalManagerContext as jest.Mock).mockReturnValueOnce({
            ...mock_modal_manager_context,
            isCurrentModal: jest.fn(() => true),
        });
        render(<OrderDetails />, {
            wrapper: ({ children }) => <StoreProvider store={mockStore({})}>{children}</StoreProvider>,
        });
        expect(mock_hide_modal).toHaveBeenCalled();
    });

    it('should show order remaining time', () => {
        useStores.mockReturnValueOnce({
            order_store: {
                ...mock_order_store,
                order_information: {
                    ...mock_order_info,
                    is_completed_order: true,
                    is_reviewable: true,
                    review_details: null,
                    completion_time: new Date().getTime() / 1000,
                },
            },
            sendbird_store: { ...mock_sendbird_store },
            my_profile_store: { ...mock_my_profile_store },
            buy_sell_store: { ...mock_buy_sell_store },
            general_store: { ...mock_general_store, review_period: 24 },
        });
        render(<OrderDetails />, {
            wrapper: ({ children }) => <StoreProvider store={mockStore({})}>{children}</StoreProvider>,
        });
        expect(screen.getByText('Your transaction experience')).toBeInTheDocument();
    });

    it('should be able to expand payment methods accordion', () => {
        useStores.mockReturnValueOnce({
            order_store: {
                ...mock_order_store,
                order_information: { ...mock_order_info, is_active_order: true },
                has_order_payment_method_details: true,
            },
            sendbird_store: { ...mock_sendbird_store },
            my_profile_store: { ...mock_my_profile_store },
            buy_sell_store: { ...mock_buy_sell_store },
            general_store: { ...mock_general_store },
        });
        render(<OrderDetails />, {
            wrapper: ({ children }) => <StoreProvider store={mockStore({})}>{children}</StoreProvider>,
        });
        const expand_button = screen.getByText('Expand all');
        expect(expand_button).toBeInTheDocument();
        userEvent.click(expand_button);
    });
});
