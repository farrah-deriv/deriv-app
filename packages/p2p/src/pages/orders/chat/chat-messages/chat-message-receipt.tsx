import React from 'react';
import { Icon } from '@deriv/components';
import { getSnakeCase } from '@deriv/components/utils/helper';
import { GroupChannel } from 'sendbird';
import ChatMessage from 'Utils/chat-message';
import './chat-message-receipt.scss';

// need to take it out when refactoring sendbird_store
// and i think we need to upgrade the sendbird version since cachedReadReceiptStatus is no longer available in the latest version
type TChatChannel = GroupChannel & {
    cachedReadReceiptStatus: {
        [key: string]: number;
    };
};

type TChatMessageReceipt = {
    chat_channel: TChatChannel;
    message: ChatMessage;
    sendbird_user_id: string;
};

const ChatMessageReceipt = ({ chat_channel, message, sendbird_user_id }: TChatMessageReceipt) => {
    let icon_name;

    if (message.status === ChatMessage.STATUS_PENDING) {
        icon_name = 'IcMessagePending';
    } else if (message.status === ChatMessage.STATUS_ERRORED) {
        icon_name = 'IcMessageErrored';
    } else {
        const channel_user_ids = Object.keys(chat_channel.cachedReadReceiptStatus);
        const other_sendbird_user_id = channel_user_ids.find(user_id => user_id !== sendbird_user_id);

        // User's last read timestamp is larger than or equal to this message's createdAt.
        if (
            other_sendbird_user_id &&
            chat_channel.cachedReadReceiptStatus[other_sendbird_user_id] >= message.created_at
        ) {
            icon_name = 'IcMessageSeen';
        } else {
            icon_name = 'IcMessageDelivered';
        }
    }

    return (
        <Icon
            className='chat-message-receipt'
            icon={icon_name}
            data_testid={`dt_${getSnakeCase(icon_name)}`}
            size={16}
        />
    );
};

export default ChatMessageReceipt;
