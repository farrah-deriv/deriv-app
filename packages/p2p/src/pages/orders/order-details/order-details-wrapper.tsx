import React from 'react';
import { DesktopWrapper, Icon, MobileFullPageModal, MobileWrapper, ThemedScrollbars } from '@deriv/components';
import { useModalManagerContext } from 'Components/modal-manager/modal-manager-context';
import PageReturn from 'Components/page-return';
import { useStores } from 'Stores';
import OrderDetailsFooter from './order-details-footer';

type TOrderDetailsWrapperProps = {
    page_title: string;
};

const OrderDetailsWrapper = ({ children, page_title }: React.PropsWithChildren<TOrderDetailsWrapperProps>) => {
    const { order_store, sendbird_store } = useStores();
    const { isCurrentModal } = useModalManagerContext();

    return (
        <React.Fragment>
            <MobileWrapper>
                <div data-testid='dt_order_details_wrapper_mobile'>
                    <MobileFullPageModal
                        className='order-details'
                        body_className='order-details__body'
                        height_offset='80px'
                        is_flex
                        is_modal_open={!isCurrentModal('OrderDetailsComplainModal')}
                        pageHeaderReturnFn={order_store.onPageReturn}
                        onClickClose={order_store.onPageReturn}
                        page_header_text={page_title}
                        renderPageHeaderTrailingIcon={() => (
                            <Icon
                                data_testid='dt_chat_icon'
                                icon='IcChat'
                                height={15}
                                width={16}
                                onClick={() => sendbird_store.setShouldShowChatModal(true)}
                            />
                        )}
                        renderPageFooterChildren={
                            order_store.order_information.should_show_order_footer && (() => <OrderDetailsFooter />)
                        }
                    >
                        {children}
                    </MobileFullPageModal>
                </div>
            </MobileWrapper>
            <DesktopWrapper>
                <PageReturn onClick={order_store.onPageReturn} page_title={page_title} />
                <ThemedScrollbars height='70vh'>{children}</ThemedScrollbars>
            </DesktopWrapper>
        </React.Fragment>
    );
};

export default OrderDetailsWrapper;
