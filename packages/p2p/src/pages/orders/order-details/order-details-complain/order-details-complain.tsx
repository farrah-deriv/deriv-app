import React from 'react';
import { MobileFullPageModal, MobileWrapper, Text } from '@deriv/components';
import { observer } from '@deriv/stores';
import { Localize, localize } from 'Components/i18next';
import OrderDetailsComplainModalFooter from 'Components/modal-manager/modals/order-details-complain-modal/order-details-complain-modal-footer';
import OrderDetailsComplainModalRadioGroup from 'Components/modal-manager/modals/order-details-complain-modal/order-details-complain-modal-radio-group';
import { useStores } from 'Stores';

const OrderDetailsComplain = () => {
    const { order_details_store, order_store } = useStores();
    const [dispute_reason, setDisputeReason] = React.useState('');
    const { error_message, should_show_order_details_complain } = order_details_store;

    const { id, is_buy_order_for_user } = order_store.order_information;

    const onCheckboxChange = (reason: string) => setDisputeReason(reason);

    const onClickSubmitButton = () => {
        order_store.disputeOrderRequest(id, dispute_reason);
    };

    const onClickCloseButton = () => {
        order_details_store.setErrorMessage('');
        order_details_store.setShouldShowOrderDetailsComplain(false);
    };

    return (
        <React.Fragment>
            <MobileWrapper>
                <MobileFullPageModal
                    body_className='order-details-complain__body'
                    className='order-details-complain'
                    height_offset='80px'
                    is_flex
                    is_modal_open={should_show_order_details_complain}
                    page_header_className='order-details-complain__header'
                    page_header_text={localize('Complaint')}
                    pageHeaderReturnFn={onClickCloseButton}
                    onClickClose={onClickCloseButton}
                    renderPageFooterChildren={() => (
                        <OrderDetailsComplainModalFooter
                            error_message={error_message}
                            dispute_reason={dispute_reason}
                            onClickCloseButton={onClickCloseButton}
                            onClickSubmitButton={onClickSubmitButton}
                        />
                    )}
                    page_footer_className='order-details-complain__footer'
                >
                    <OrderDetailsComplainModalRadioGroup
                        is_buy_order_for_user={is_buy_order_for_user}
                        dispute_reason={dispute_reason}
                        onCheckboxChange={onCheckboxChange}
                    />
                    <div className='order-details-complain__explanation'>
                        <Text size='xxs'>
                            <Localize i18n_default_text="If your complaint isn't listed here, please contact our Customer Support team." />
                        </Text>
                    </div>
                </MobileFullPageModal>
            </MobileWrapper>
        </React.Fragment>
    );
};

export default observer(OrderDetailsComplain);
