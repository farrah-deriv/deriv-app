import React from 'react';
import classNames from 'classnames';
import { Input, Text } from '@deriv/components';
import { isMobile } from '@deriv/shared';
import { observer } from 'mobx-react-lite';
import { localize, Localize } from 'Components/i18next';
import { useStores } from 'Stores';
import { handleCtrlEnterKeyPressed } from 'Utils/chat-message';
import ChatFooterIcon from './chat-footer-icon';

type TElement = HTMLInputElement | HTMLTextAreaElement;
type TChangeEvent = React.ChangeEvent<TElement> | { target: TElement };

const ChatFooter = observer(() => {
    const { order_store, sendbird_store } = useStores();
    const file_input_ref = React.useRef<TElement | null>(null);
    const text_input_ref = React.useRef<TElement | null>(null);
    const [character_count, setCharacterCount] = React.useState<number>(0);

    const updateTextAreaBounds = () => {
        const el_target = text_input_ref.current;

        if (el_target) {
            el_target.setAttribute('style', 'height: auto;');
            el_target.setAttribute('style', `height: ${el_target.scrollHeight}px;`);
        }
    };

    const handleChange = (event: TChangeEvent) => {
        setCharacterCount(event.target.value.length);
        updateTextAreaBounds();
    };

    const handleKeyDown = (event: React.KeyboardEvent<TElement>) => {
        if (event.key === 'Enter' && !isMobile()) {
            if (event.ctrlKey || event.metaKey) {
                handleCtrlEnterKeyPressed(event);
                updateTextAreaBounds();
            } else {
                event.preventDefault();
                sendMessage();
            }
        }
    };

    const sendMessage = () => {
        const el_target = text_input_ref.current;
        const should_restore_focus = document.activeElement === el_target;

        if (el_target && el_target.value) {
            sendbird_store.sendMessage(el_target.value);
            el_target.value = '';
            handleChange({ target: el_target });

            if (should_restore_focus) {
                el_target.focus();
            }
        }
    };

    React.useEffect(() => updateTextAreaBounds(), []);

    const should_show_attachment_icon = character_count === 0;
    const max_characters = 5000;

    if (sendbird_store.is_chat_frozen || order_store.order_information.is_inactive_order) {
        return (
            <Text align='center' className='chat-footer--frozen' color='prominent' line_height='s' size='xs'>
                <Localize i18n_default_text='This conversation is closed.' />
            </Text>
        );
    }

    return (
        <React.Fragment>
            <Text className='chat-footer-disclaimer' color='less-prominent' size='xxs'>
                <Localize i18n_default_text='In case of a dispute, we will only consider the communication through Deriv P2P chat channel.' />
            </Text>
            <div
                className={classNames('chat-footer', {
                    'chat-footer--empty': sendbird_store.chat_messages.length === 0,
                })}
            >
                <div className='chat-footer-input'>
                    <Input
                        has_character_counter
                        initial_character_count={character_count}
                        max_characters={max_characters}
                        onChange={handleChange}
                        onKeyDown={handleKeyDown}
                        placeholder={localize('Enter message')}
                        ref={ref => (text_input_ref.current = ref)}
                        rows={1}
                        trailing_icon={
                            <div
                                className='chat-footer-icon-container'
                                onClick={
                                    should_show_attachment_icon ? () => file_input_ref.current?.click() : sendMessage
                                }
                            >
                                <ChatFooterIcon should_show_attachment_icon={should_show_attachment_icon} />
                            </div>
                        }
                        type='textarea'
                    />
                    <input
                        onChange={e => sendbird_store.sendFile(e.target.files?.[0])}
                        ref={el => (file_input_ref.current = el)}
                        style={{ display: 'none' }}
                        type='file'
                        data-testid='dt_file_input'
                    />
                </div>
            </div>
        </React.Fragment>
    );
});

ChatFooter.displayName = 'ChatFooter';

export default ChatFooter;
