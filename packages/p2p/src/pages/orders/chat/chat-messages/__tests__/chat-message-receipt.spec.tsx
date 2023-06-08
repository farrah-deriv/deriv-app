import React from 'react';
import { screen, render } from '@testing-library/react';
import { mock_channel } from 'Pages/orders/chat/__mocks__/mock-data';
import ChatMessage from 'Utils/chat-message';
import ChatMessageReceipt from '../chat-message-receipt';

describe('<ChatMessageReceipt />', () => {
    it('should render pending receipt icon if status is pending', () => {
        const message = new ChatMessage({
            created_at: 3,
            channel_url: 'test',
            file_type: 'image/jpeg',
            id: 1,
            message: 'test',
            message_type: 'user',
            name: 'test',
            sender_user_id: 'test',
            url: 'test',
            status: ChatMessage.STATUS_PENDING,
        });
        render(<ChatMessageReceipt chat_channel={mock_channel} message={message} sendbird_user_id='TEST' />);
        expect(screen.getByTestId('dt_ic_message_pending')).toBeInTheDocument();
    });

    it('should render errored receipt icon if status is errored', () => {
        const message = new ChatMessage({
            created_at: 3,
            channel_url: 'test',
            file_type: 'image/jpeg',
            id: 1,
            message: 'test',
            message_type: 'user',
            name: 'test',
            sender_user_id: 'test',
            url: 'test',
            status: ChatMessage.STATUS_ERRORED,
        });
        render(<ChatMessageReceipt chat_channel={mock_channel} message={message} sendbird_user_id='TEST' />);
        expect(screen.getByTestId('dt_ic_message_errored')).toBeInTheDocument();
    });

    it('should render delivered receipt icon if status is not pending / errored and the message it not being seen', () => {
        const message = new ChatMessage({
            created_at: 3,
            channel_url: 'test',
            file_type: 'image/jpeg',
            id: 1,
            message: 'test',
            message_type: 'user',
            name: 'test',
            sender_user_id: 'test',
            url: 'test',
            status: 2,
        });
        render(<ChatMessageReceipt chat_channel={mock_channel} message={message} sendbird_user_id='TEST' />);
        expect(screen.getByTestId('dt_ic_message_delivered')).toBeInTheDocument();
    });

    it('should render seen receipt icon if cachedReadReceivedStatus date is greater than message creation date', () => {
        const message = new ChatMessage({
            created_at: 0,
            channel_url: 'test',
            file_type: 'image/jpeg',
            id: 1,
            message: 'test',
            message_type: 'user',
            name: 'test',
            sender_user_id: 'test',
            url: 'test',
            status: 3,
        });
        render(<ChatMessageReceipt chat_channel={mock_channel} message={message} sendbird_user_id='others' />);
        expect(screen.getByTestId('dt_ic_message_seen')).toBeInTheDocument();
    });
});
