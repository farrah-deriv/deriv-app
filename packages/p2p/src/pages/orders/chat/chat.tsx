import React from 'react';
import { Button, Loading, Text } from '@deriv/components';
import { observer } from '@deriv/stores';
import { Localize, localize } from 'Components/i18next';
import ChatHeader from 'Pages/orders/chat/chat-header';
import ChatMessages from 'Pages/orders/chat/chat-messages';
import ChatFooter from 'Pages/orders/chat/chat-footer';
import ChatWrapper from 'Pages/orders/chat/chat-wrapper';
import { useStores } from 'Stores';

const Chat = observer(() => {
    const { sendbird_store, order_store } = useStores();

    if (sendbird_store.is_chat_loading) {
        return (
            <div className='chat' data-testid='dt_chat_loading'>
                <Loading is_fullscreen={false} />;
            </div>
        );
    }

    const mobileWrapperReturnFunc = () => {
        sendbird_store.setShouldShowChatModal(false);
        sendbird_store.setShouldShowChatOnOrders(false);
        order_store.hideDetails(true);
    };

    if (sendbird_store.has_chat_error) {
        return (
            <div className='chat'>
                <div className='chat__error'>
                    <Text as='p' color='prominent'>
                        <Localize i18n_default_text='Oops, something went wrong' />
                    </Text>
                    <div className='chat__error-retry'>
                        <Button
                            has_effect
                            large
                            onClick={() => sendbird_store.initialiseChatWsConnection()}
                            primary
                            text={localize('Retry')}
                            type='button'
                        />
                    </div>
                </div>
            </div>
        );
    }

    return (
        <ChatWrapper is_modal_open={sendbird_store.should_show_chat_modal} mobile_return_func={mobileWrapperReturnFunc}>
            <div className='chat' data-testid='dt_chat_loaded'>
                <ChatHeader />
                <ChatMessages />
                <ChatFooter />
            </div>
        </ChatWrapper>
    );
});

Chat.displayName = 'Chat';

export default Chat;
