import React, { useRef } from 'react';
import { screen, render, fireEvent } from '@testing-library/react';
import { mock_channel, mock_message } from 'Pages/orders/chat/__mocks__/mock-chat-data';
import { useStores } from 'Stores/index';
import ChatMessage from 'Utils/chat-message';
import ChatMessages from '../chat-messages';

const mock_sendbird_store = {
    active_chat_channel: mock_channel,
    chat_info: {
        user_id: 'test_user_id',
    },
    chat_messages: [] as ChatMessage[],
    onMessagesScroll: jest.fn(),
    setMessagesRef: jest.fn(),
};

jest.mock('Stores', () => ({
    ...jest.requireActual('Stores'),
    useStores: jest.fn(() => ({
        sendbird_store: {
            ...mock_sendbird_store,
            chat_messages: [mock_message],
        },
    })),
}));

jest.mock('react', () => ({
    ...jest.requireActual('react'),
    useRef: jest.fn(() => ({
        current: {
            scrollTop: 0,
            scrollHeight: 100,
        },
    })),
}));

describe('<ChatMessages />', () => {
    it('should render the component with data-testid `dt_blank_chat_messages`, but without any messages', () => {
        (useStores as jest.Mock).mockImplementationOnce(() => ({
            sendbird_store: {
                ...mock_sendbird_store,
                chat_messages: [],
            },
        }));
        render(<ChatMessages />);
        expect(screen.getByTestId('dt_blank_chat_messages')).toHaveClass('chat-messages');
    });

    it('should render the component with data-testid `dt_themed_scrollbars` and with messages', () => {
        render(<ChatMessages />);
        expect(screen.getByTestId('dt_themed_scrollbars')).toHaveClass('chat-messages');
        expect(screen.getByText('test message')).toBeInTheDocument();
    });

    it('should render appropriate styles and statuses if message is from the current user', () => {
        const message = mock_message;
        message.sender_user_id = 'test_user_id';
        (useStores as jest.Mock).mockImplementationOnce(() => ({
            sendbird_store: {
                ...mock_sendbird_store,
                chat_messages: [message],
            },
        }));

        render(<ChatMessages />);
        expect(screen.getByTestId('dt_chat_messages_item')).toHaveClass('chat-messages-item--outgoing');
        expect(screen.getByText('test message')).toHaveStyle('--text-color: var(--text-colored-background)');
    });

    it('should render image and adjust scroll position if the message type is file', () => {
        const message = mock_message;
        message.message_type = 'file';
        (useStores as jest.Mock).mockImplementationOnce(() => ({
            sendbird_store: {
                ...mock_sendbird_store,
                chat_messages: [message],
            },
        }));

        const scrollRef = useRef<(HTMLDivElement & SVGSVGElement) | null>();

        render(<ChatMessages />);
        const image = screen.getByRole('img');
        fireEvent.load(image);
        expect(scrollRef.current).not.toBeNull();
        expect(scrollRef.current?.scrollTop).toBe(0);
    });

    it('should call onMessagesScroll when scrolling the messages', () => {
        render(<ChatMessages />);
        fireEvent.scroll(screen.getByTestId('dt_themed_scrollbars'));
        expect(mock_sendbird_store.onMessagesScroll).toHaveBeenCalled();
    });
});
