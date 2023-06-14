import React from 'react';
import { DesktopWrapper, Text } from '@deriv/components';
import { isMobile } from '@deriv/shared';
import { observer } from '@deriv/stores';
import { useStores } from 'Stores';
import { generateHexColourFromNickname, getShortNickname } from 'Utils/string';

const ChatHeaderBody = observer(() => {
    const { order_store, sendbird_store } = useStores();
    const { other_user_details } = order_store.order_information;
    const icon_background_colour = generateHexColourFromNickname(other_user_details.name);
    const short_nickname = getShortNickname(other_user_details.name);

    return (
        <React.Fragment>
            <div className='chat-header-icon' style={{ backgroundColor: icon_background_colour }}>
                <Text size='xs' color='colored-background'>
                    {short_nickname}
                </Text>
            </div>
            <div className='chat-header-user'>
                <Text as='p' className='chat-header-user-name' color='prominent' weight='bold'>
                    {other_user_details.name}
                </Text>
                {sendbird_store.last_other_user_activity && (
                    <Text
                        as='p'
                        className='chat-header-user-timestamp'
                        color='less-prominent'
                        size={isMobile() ? 'xxs' : 'xs'}
                    >
                        {sendbird_store.last_other_user_activity}
                    </Text>
                )}
            </div>
        </React.Fragment>
    );
});

const ChatHeader = () => {
    return (
        <DesktopWrapper>
            <div className='chat-header'>
                <ChatHeaderBody />
            </div>
        </DesktopWrapper>
    );
};

ChatHeader.Body = ChatHeaderBody;
ChatHeader.displayName = 'ChatHeader';

export default ChatHeader;
