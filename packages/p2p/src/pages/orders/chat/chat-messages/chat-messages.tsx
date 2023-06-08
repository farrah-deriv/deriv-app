import React from 'react';
import classNames from 'classnames';
import { Text, ThemedScrollbars } from '@deriv/components';
import { formatMilliseconds } from '@deriv/shared';
import { observer } from 'mobx-react-lite';
import { useStores } from 'Stores';
import ChatMessage, { isImageType } from 'Utils/chat-message';
import ChatMessageReceipt from './chat-message-receipt';
import ChatMessageText from './chat-message-text';

const ChatMessages = observer(() => {
    const { sendbird_store } = useStores();
    const scroll_ref = React.useRef<(HTMLDivElement & SVGSVGElement) | null>(null);

    const onImageLoad: React.ReactEventHandler<HTMLImageElement> = event => {
        // Height of element changes after the image is loaded. Accommodate
        // this extra height in the scroll.
        if (scroll_ref.current) {
            scroll_ref.current.scrollTop += event.target.parentNode.clientHeight;
        }
    };

    React.useEffect(() => {
        if (sendbird_store.chat_messages.length > 0 && scroll_ref.current) {
            // Scroll all the way to the bottom of the container.
            scroll_ref.current.scrollTop = scroll_ref.current.scrollHeight;
        }
    }, [sendbird_store.chat_messages.length]); // eslint-disable-line react-hooks/exhaustive-deps

    sendbird_store.setMessagesRef(scroll_ref);

    if (sendbird_store.chat_messages.length) {
        let current_date: null | string = null;

        return (
            <ThemedScrollbars
                autohide
                className='chat-messages'
                height='unset'
                refSetter={scroll_ref ?? undefined}
                onScroll={event => sendbird_store.onMessagesScroll(event)}
            >
                {sendbird_store.chat_messages.map((chat_message: ChatMessage) => {
                    const is_my_message = chat_message.sender_user_id === sendbird_store.chat_info.user_id;
                    const message_date = formatMilliseconds(chat_message.created_at, 'MMMM D, YYYY');
                    const message_color = is_my_message ? 'colored-background' : 'general';
                    const should_render_date = current_date !== message_date && Boolean((current_date = message_date));

                    return (
                        <React.Fragment key={chat_message.id}>
                            {should_render_date && (
                                <div className='chat-messages-date'>
                                    <Text align='center' color='less-prominent' size='xs' weight='bold'>
                                        {message_date}
                                    </Text>
                                </div>
                            )}
                            <div
                                className={classNames(
                                    'chat-messages-item',
                                    `chat-messages-item--${is_my_message ? 'outgoing' : 'incoming'}`
                                )}
                                data-testid='dt_chat_messages_item'
                            >
                                {chat_message.message_type === ChatMessage.TYPE_USER && (
                                    <ChatMessageText color={message_color}>{chat_message.message}</ChatMessageText>
                                )}
                                {chat_message.message_type === ChatMessage.TYPE_FILE &&
                                    (isImageType(chat_message.file_type) ? (
                                        <a
                                            className='chat-messages-item-image'
                                            href={chat_message.url}
                                            rel='noopener noreferrer'
                                            target='_blank'
                                        >
                                            <img src={chat_message.url} onLoad={onImageLoad} />
                                        </a>
                                    ) : (
                                        <ChatMessageText color={message_color}>
                                            <a
                                                className='chat-messages-item-file'
                                                href={chat_message.url}
                                                rel='noopener noreferrer'
                                                target='_blank'
                                            >
                                                {chat_message.name}
                                            </a>
                                        </ChatMessageText>
                                    ))}
                                <div className={`chat-messages-item-timestamp`}>
                                    <Text color='less-prominent' line_height='s' size='xxxs'>
                                        {formatMilliseconds(chat_message.created_at, 'HH:mm', true)}
                                    </Text>
                                    {is_my_message && (
                                        <ChatMessageReceipt
                                            message={chat_message}
                                            chat_channel={sendbird_store.active_chat_channel}
                                            sendbird_user_id={sendbird_store.chat_info.user_id}
                                        />
                                    )}
                                </div>
                            </div>
                        </React.Fragment>
                    );
                })}
            </ThemedScrollbars>
        );
    }

    return <div className='chat-messages' data-testid='dt_blank_chat_messages' />;
});

ChatMessages.displayName = 'ChatMessages';

export default ChatMessages;
