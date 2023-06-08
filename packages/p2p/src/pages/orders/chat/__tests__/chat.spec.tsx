import React from 'react';
import { isDesktop, isMobile } from '@deriv/shared';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { mock_channel } from 'Pages/orders/chat/__mocks__/mock-data';
import { useStores } from 'Stores';
import ChatMessage from 'Utils/chat-message';
import Chat from '../chat';

const mock_order_store = {
    order_information: {
        other_user_details: {
            name: 'Test user',
        },
    },
    hideDetails: jest.fn(),
};

const mock_sendbird_store = {
    active_chat_channel: mock_channel,
    chat_info: {
        user_id: 'test_user_id',
    },
    chat_messages: [
        new ChatMessage({
            created_at: 3,
            channel_url: 'test',
            file_type: 'image/jpeg',
            id: 1,
            message: 'test message',
            message_type: 'user',
            name: 'test',
            sender_user_id: 'test',
            url: 'test',
            status: 2,
        }),
    ],
    initialiseChatWsConnection: jest.fn(),
    is_chat_loading: false,
    last_other_user_activity: 'Last seen 1 hour ago',
    onMessagesScroll: jest.fn(),
    setMessagesRef: jest.fn(),
    setShouldShowChatModal: jest.fn(),
    setShouldShowChatOnOrders: jest.fn(),
};

jest.mock('Stores', () => ({
    ...jest.requireActual('Stores'),
    useStores: jest.fn(() => ({
        order_store: mock_order_store,
        sendbird_store: mock_sendbird_store,
    })),
}));

jest.mock('@deriv/shared', () => ({
    ...jest.requireActual('@deriv/shared'),
    isDesktop: jest.fn(() => true),
    isMobile: jest.fn(() => false),
}));

describe('<Chat />', () => {
    it('should render loading state if chat is loading', () => {
        (useStores as jest.Mock).mockImplementationOnce(() => ({
            order_store: mock_order_store,
            sendbird_store: {
                ...mock_sendbird_store,
                is_chat_loading: true,
            },
        }));
        render(<Chat />);
        expect(screen.getByTestId('dt_chat_loading')).toBeInTheDocument();
    });

    it('should render one Chat components with  the info given', () => {
        render(<Chat />);
        expect(screen.getByTestId('dt_chat_loaded')).toBeInTheDocument();
        expect(screen.getByText('Test user')).toBeInTheDocument();
        expect(screen.getByText('test message')).toBeInTheDocument();
    });

    it('should render Chat components in mobile view', () => {
        (isMobile as jest.Mock).mockImplementationOnce(() => true);
        (isDesktop as jest.Mock).mockImplementationOnce(() => false);
        (useStores as jest.Mock).mockImplementationOnce(() => ({
            order_store: mock_order_store,
            sendbird_store: {
                ...mock_sendbird_store,
                should_show_chat_modal: true,
            },
        }));

        render(<Chat />);

        const mobile_ful_page_modal_return_header = screen.getByTestId('dt_mobile_full_page_modal_return_header');
        expect(mobile_ful_page_modal_return_header).toBeInTheDocument();
        userEvent.click(mobile_ful_page_modal_return_header);
        expect(mock_sendbird_store.setShouldShowChatModal).toHaveBeenCalledWith(false);
        expect(mock_sendbird_store.setShouldShowChatOnOrders).toHaveBeenCalledWith(false);
        expect(mock_order_store.hideDetails).toHaveBeenCalledWith(true);
    });

    it('should render error message and retry button if there is an error fetching messages', () => {
        (useStores as jest.Mock).mockImplementationOnce(() => ({
            order_store: mock_order_store,
            sendbird_store: {
                ...mock_sendbird_store,
                has_chat_error: true,
            },
        }));
        render(<Chat />);
        expect(screen.getByText('Oops, something went wrong')).toBeInTheDocument();
        const retry_button = screen.getByText('Retry');

        expect(retry_button).toBeInTheDocument();
        userEvent.click(retry_button);
        expect(mock_sendbird_store.initialiseChatWsConnection).toHaveBeenCalled();
    });
});
