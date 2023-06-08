import React from 'react';
import { Text } from '@deriv/components';
import './chat-message-text.scss';

type TChatMessageText = {
    color: string;
};

const ChatMessageText = React.memo(({ children, color }: React.PropsWithChildren<TChatMessageText>) => (
    <div className='chat-message-text'>
        <Text as='p' color={color} size='xs'>
            {children}
        </Text>
    </div>
));

ChatMessageText.displayName = 'ChatMessageText';

export default ChatMessageText;
