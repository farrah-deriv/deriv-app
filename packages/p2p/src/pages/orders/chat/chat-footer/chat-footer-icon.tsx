import React from 'react';
import { Icon } from '@deriv/components';

type TChatFooterIcon = {
    should_show_attachment_icon?: boolean;
};

const ChatFooterIcon = React.memo(({ should_show_attachment_icon }: TChatFooterIcon) => (
    <Icon
        icon={should_show_attachment_icon ? 'IcAttachment' : 'IcSendMessage'}
        data_testid={should_show_attachment_icon ? 'dt_attachment_icon' : 'dt_send_message_icon'}
        width={16}
    />
));

ChatFooterIcon.displayName = 'ChatFooterIcon';

export default ChatFooterIcon;
