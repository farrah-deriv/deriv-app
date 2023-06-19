import React from 'react';
import { screen, render } from '@testing-library/react';
import { mock_channel, mock_message } from 'Pages/orders/chat/__mocks__/mock-chat-data';
import ChatMessageReceipt from '../chat-message-receipt';
import ChatMessage from 'Utils/chat-message';

describe('<ChatMessageReceipt />', () => {
    it('should render pending receipt icon if status is pending', () => {
        render(<ChatMessageReceipt chat_channel={mock_channel} message={mock_message} sendbird_user_id='TEST' />);
        expect(screen.getByTestId('dt_ic_message_pending')).toBeInTheDocument();
    });

    it('should render errored receipt icon if status is errored', () => {
        const message = mock_message;
        message.status = ChatMessage.STATUS_ERRORED;
        render(<ChatMessageReceipt chat_channel={mock_channel} message={message} sendbird_user_id='TEST' />);
        expect(screen.getByTestId('dt_ic_message_errored')).toBeInTheDocument();
    });

    it('should render delivered receipt icon if status is not pending / errored and the message it not being seen', () => {
        const message = mock_message;
        message.status = 2;
        render(<ChatMessageReceipt chat_channel={mock_channel} message={message} sendbird_user_id='TEST' />);
        expect(screen.getByTestId('dt_ic_message_delivered')).toBeInTheDocument();
    });

    it('should render seen receipt icon if cachedReadReceivedStatus date is greater than message creation date', () => {
        const message = mock_message;
        message.created_at = 0;
        message.status = 3;
        render(<ChatMessageReceipt chat_channel={mock_channel} message={message} sendbird_user_id='others' />);
        expect(screen.getByTestId('dt_ic_message_seen')).toBeInTheDocument();
    });
});
