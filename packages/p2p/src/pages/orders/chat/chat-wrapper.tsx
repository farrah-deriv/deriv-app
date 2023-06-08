import React from 'react';
import { DesktopWrapper, MobileFullPageModal, MobileWrapper } from '@deriv/components';
import { observer } from '@deriv/stores';
import ChatHeader from './chat-header';

type TChatWrapper = {
    is_modal_open: boolean;
    mobile_return_func: () => void;
};

const ChatWrapper = observer(
    ({ children, is_modal_open, mobile_return_func }: React.PropsWithChildren<TChatWrapper>) => {
        return (
            <React.Fragment>
                <MobileWrapper>
                    <MobileFullPageModal
                        className='chat'
                        height_offset='80px'
                        is_flex
                        is_modal_open={is_modal_open}
                        page_header_className='chat-header'
                        pageHeaderReturnFn={mobile_return_func}
                        onClickClose={mobile_return_func}
                        renderPageHeaderText={() => <ChatHeader.Body />}
                    >
                        {children}
                    </MobileFullPageModal>
                </MobileWrapper>
                <DesktopWrapper>{children}</DesktopWrapper>
            </React.Fragment>
        );
    }
);

export default ChatWrapper;
