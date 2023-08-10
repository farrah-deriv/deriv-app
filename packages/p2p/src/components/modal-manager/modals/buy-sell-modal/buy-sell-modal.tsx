import React from 'react';
import classNames from 'classnames';
import { DesktopWrapper, MobileFullPageModal, MobileWrapper, Modal, ThemedScrollbars } from '@deriv/components';
import { observer } from '@deriv/stores';
import { useModalManagerContext } from 'Components/modal-manager/modal-manager-context';
import AddPaymentMethodForm from 'Pages/my-profile/payment-methods/add-payment-method/add-payment-method-form.jsx';
import BuySellForm from 'Pages/buy-sell/buy-sell-form.jsx';
import BuySellFormReceiveAmount from 'Pages/buy-sell/buy-sell-form-receive-amount.jsx';
import { useStores } from 'Stores';
import BuySellModalFooter from './buy-sell-modal-footer';
import BuySellModalTitle from './buy-sell-modal-title';
import BuySellModalError from './buy-sell-modal-error';

const BuySellModal = () => {
    const { is_modal_open } = useModalManagerContext();
    const { buy_sell_store, general_store, my_profile_store } = useStores();
    const { is_buy, selected_ad_state, onCancelBuySellOrder, onConfirmBuySellOrder } = buy_sell_store;
    const { balance } = general_store;
    const { should_show_add_payment_method_form } = my_profile_store;

    const [error_message, setErrorMessage] = React.useState('');
    const [is_submit_disabled, setIsSubmitDisabled] = React.useState(true);
    const [is_account_balance_low, setIsAccountBalanceLow] = React.useState(false);
    const submitForm = React.useRef(() => {
        // do nothing
    });

    const show_low_balance_message = !is_buy && is_account_balance_low;

    const setSubmitForm = (submitFormFn: () => void) => (submitForm.current = submitFormFn);

    React.useEffect(() => {
        const balance_check =
            parseFloat(balance) === 0 || parseFloat(balance) < buy_sell_store.advert?.min_order_amount_limit;

        setIsAccountBalanceLow(balance_check);
        if (!is_modal_open) {
            setErrorMessage('');
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [is_modal_open]);

    return (
        <React.Fragment>
            <MobileWrapper>
                <MobileFullPageModal
                    body_className='buy-sell-modal__body'
                    className='buy-sell-modal'
                    height_offset='80px'
                    is_flex
                    is_modal_open={is_modal_open}
                    page_header_className='buy-sell-modal__header'
                    page_header_text={<BuySellModalTitle />}
                    pageHeaderReturnFn={onCancelBuySellOrder}
                >
                    <BuySellModalError
                        error_message={error_message}
                        show_low_balance_message={show_low_balance_message}
                    />
                    {should_show_add_payment_method_form ? (
                        <AddPaymentMethodForm should_show_separated_footer />
                    ) : (
                        <React.Fragment>
                            <BuySellForm
                                advert={selected_ad_state}
                                handleClose={onCancelBuySellOrder}
                                handleConfirm={onConfirmBuySellOrder}
                                setIsSubmitDisabled={setIsSubmitDisabled}
                                setErrorMessage={setErrorMessage}
                                setSubmitForm={setSubmitForm}
                            />
                            <BuySellFormReceiveAmount />
                            <BuySellModalFooter
                                is_submit_disabled={!!is_submit_disabled}
                                onCancel={onCancelBuySellOrder}
                                onSubmit={submitForm.current}
                            />
                        </React.Fragment>
                    )}
                </MobileFullPageModal>
            </MobileWrapper>
            <DesktopWrapper>
                <Modal
                    className={classNames('buy-sell-modal', {
                        'buy-sell-modal__form': should_show_add_payment_method_form,
                    })}
                    height={is_buy ? 'auto' : '649px'}
                    is_open={is_modal_open}
                    portalId='modal_root'
                    title={<BuySellModalTitle />}
                    toggleModal={onCancelBuySellOrder}
                    width='456px'
                >
                    {/* Parent height - Modal.Header height - Modal.Footer height */}
                    <ThemedScrollbars height={is_buy ? '100%' : 'calc(100% - 5.8rem - 7.4rem)'}>
                        <Modal.Body className='buy-sell-modal__layout'>
                            <BuySellModalError
                                error_message={error_message}
                                show_low_balance_message={show_low_balance_message}
                            />
                            {should_show_add_payment_method_form ? (
                                <AddPaymentMethodForm should_show_separated_footer />
                            ) : (
                                <BuySellForm
                                    advert={selected_ad_state}
                                    handleClose={onCancelBuySellOrder}
                                    handleConfirm={onConfirmBuySellOrder}
                                    setIsSubmitDisabled={setIsSubmitDisabled}
                                    setErrorMessage={setErrorMessage}
                                    setSubmitForm={setSubmitForm}
                                />
                            )}
                        </Modal.Body>
                    </ThemedScrollbars>
                    {!should_show_add_payment_method_form && (
                        <Modal.Footer has_separator>
                            <BuySellModalFooter
                                is_submit_disabled={!!is_submit_disabled}
                                onCancel={onCancelBuySellOrder}
                                onSubmit={submitForm.current}
                            />
                        </Modal.Footer>
                    )}
                </Modal>
            </DesktopWrapper>
        </React.Fragment>
    );
};

export default observer(BuySellModal);
