import React from 'react';
import { DesktopWrapper, MobileFullPageModal, MobileWrapper, Modal, Text } from '@deriv/components';
import { observer } from '@deriv/stores';
import { Localize, localize } from 'Components/i18next';
import { useModalManagerContext } from 'Components/modal-manager/modal-manager-context';
import { useStores } from 'Stores';
import OrderDetailsComplainModalFooter from './order-details-complain-modal-footer';
import OrderDetailsComplainModalRadioGroup from './order-details-complain-modal-radio-group';

const OrderDetailsComplainModal = () => {
    const { hideModal, is_modal_open } = useModalManagerContext();
    const [dispute_reason, setDisputeReason] = React.useState('');
    const { order_details_store, order_store } = useStores();

    const { id, is_buy_order_for_user } = order_store.order_information;

    const onCheckboxChange = (reason: string) => setDisputeReason(reason);

    const onClickSubmitButton = () => {
        order_store.disputeOrderRequest(id, dispute_reason);
    };

    const onClickCloseButton = () => {
        order_details_store.setErrorMessage('');
        hideModal();
    };

    return (
        <React.Fragment>
            <MobileWrapper>
                <MobileFullPageModal
                    body_className='order-details-complain-modal__body'
                    className='order-details-complain'
                    height_offset='80px'
                    is_flex
                    is_modal_open={is_modal_open}
                    page_header_className='order-details-complain-modal__header'
                    page_header_text={localize('Complaint')}
                    pageHeaderReturnFn={onClickCloseButton}
                    onClickClose={onClickCloseButton}
                    renderPageFooterChildren={() => (
                        <OrderDetailsComplainModalFooter
                            error_message={order_details_store.error_message}
                            dispute_reason={dispute_reason}
                            onClickCloseButton={onClickCloseButton}
                            onClickSubmitButton={onClickSubmitButton}
                        />
                    )}
                    page_footer_className='order-details-complain-modal__footer'
                >
                    <OrderDetailsComplainModalRadioGroup
                        is_buy_order_for_user={is_buy_order_for_user}
                        dispute_reason={dispute_reason}
                        onCheckboxChange={onCheckboxChange}
                    />
                    <div className='order-details-complain-modal__explanation'>
                        <Text size='xxs'>
                            <Localize i18n_default_text="If your complaint isn't listed here, please contact our Customer Support team." />
                        </Text>
                    </div>
                </MobileFullPageModal>
            </MobileWrapper>
            <DesktopWrapper>
                <Modal
                    className='order-details-complain-modal'
                    is_open={is_modal_open}
                    toggleModal={onClickCloseButton}
                    has_close_icon
                    renderTitle={() => (
                        <Text color='prominent' weight='bold'>
                            <Localize i18n_default_text="What's your complaint?" />
                        </Text>
                    )}
                    width='440px'
                    height='500px'
                >
                    <Modal.Body className='order-details-complain-modal__body'>
                        <OrderDetailsComplainModalRadioGroup
                            is_buy_order_for_user={is_buy_order_for_user}
                            dispute_reason={dispute_reason}
                            onCheckboxChange={onCheckboxChange}
                        />
                        <div className='order-details-complain-modal__explanation'>
                            <Text size='xxs'>
                                <Localize i18n_default_text="If your complaint isn't listed here, please contact our Customer Support team." />
                            </Text>
                        </div>
                    </Modal.Body>
                    <Modal.Footer>
                        <OrderDetailsComplainModalFooter
                            error_message={order_details_store.error_message}
                            dispute_reason={dispute_reason}
                            onClickCloseButton={onClickCloseButton}
                            onClickSubmitButton={onClickSubmitButton}
                        />
                    </Modal.Footer>
                </Modal>
            </DesktopWrapper>
        </React.Fragment>
    );
};

export default observer(OrderDetailsComplainModal);
