import React from 'react';
import classNames from 'classnames';
import { DesktopWrapper, Icon, MobileFullPageModal, MobileWrapper, Modal } from '@deriv/components';
import { observer } from '@deriv/stores';
import { useStores } from 'Stores';
import { localize } from 'Components/i18next';
import { useModalManagerContext } from 'Components/modal-manager/modal-manager-context';
import { buy_sell } from 'Constants/buy-sell';
import { TAdvertProps } from 'Types/adverts.types';
import QuickAddModalContent from './quick-add-modal-content';
import QuickAddModalButtons from './quick-add-modal-buttons';

type TQuickAddModalProps = {
    advert: Partial<TAdvertProps>;
};

const QuickAddModal = ({ advert }: TQuickAddModalProps) => {
    const { my_ads_store, my_profile_store } = useStores();
    const {
        should_show_add_payment_method,
        show_filter_payment_methods,
        hideQuickAddModal,
        onClickUpdatePaymentMethods,
        setSearchTerm,
        setSearchedResults,
        setShouldShowAddPaymentMethod,
        setShowFilterPaymentMethods,
    } = my_ads_store;
    const { selected_payment_method, getPaymentMethodsList } = my_profile_store;

    const { is_modal_open, showModal, useSavedState } = useModalManagerContext();

    const type = advert ? advert.type : null;

    const [selected_methods, setSelectedMethods] = useSavedState('selected_methods', []);

    const is_buy_advert = type === buy_sell.BUY;
    const is_sell_ad_add_payment_methods_selected = !is_buy_advert && selected_payment_method.length > 0;
    const is_buy_ad_add_payment_methods_selected = is_buy_advert && selected_methods.length > 0;
    const is_payment_methods_selected =
        is_sell_ad_add_payment_methods_selected || is_buy_ad_add_payment_methods_selected;

    const setShouldCloseAllModals = (should_close_all_modals: boolean) => {
        if (show_filter_payment_methods) {
            setShowFilterPaymentMethods(false);
            setSearchTerm('');
            setSearchedResults([]);
        } else if (is_payment_methods_selected) {
            localStorage.setItem('selected_methods', JSON.stringify(selected_methods));
            showModal({
                key: 'CancelAddPaymentMethodModal',
                props: {
                    should_hide_all_modals_on_cancel: is_buy_advert,
                    onCancel: () => {
                        my_ads_store.payment_method_ids = [];
                        my_ads_store.payment_method_names = [];
                    },
                },
            });
        } else {
            my_ads_store.payment_method_ids = [];
            my_ads_store.payment_method_names = [];
            if (should_close_all_modals) {
                setShouldShowAddPaymentMethod(false);
                hideQuickAddModal();
            } else {
                if (!should_show_add_payment_method) {
                    hideQuickAddModal();
                }
                setShouldShowAddPaymentMethod(false);
            }
        }
    };

    React.useEffect(() => {
        const saved_selected_methods = localStorage.getItem('selected_methods');
        if (saved_selected_methods) {
            setSelectedMethods(JSON.parse(saved_selected_methods));
            localStorage.removeItem('selected_methods');
        }
        getPaymentMethodsList();

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <React.Fragment>
            <DesktopWrapper>
                <Modal
                    className={classNames('quick-add-modal', {
                        'quick-add-modal__form': selected_payment_method && !is_buy_advert,
                    })}
                    has_close_icon
                    height={is_buy_advert ? '452px' : (should_show_add_payment_method && '560px') || 'auto'}
                    is_open={is_modal_open}
                    title={
                        is_buy_advert ? (
                            localize('Add payment methods')
                        ) : (
                            <React.Fragment>
                                {should_show_add_payment_method && (
                                    <Icon
                                        className='quick-add-modal__icon'
                                        icon='icArrowLeftBold'
                                        onClick={() => {
                                            setShouldCloseAllModals(false);
                                        }}
                                    />
                                )}
                                {should_show_add_payment_method
                                    ? localize('Add payment method')
                                    : localize('Add payment methods')}
                            </React.Fragment>
                        )
                    }
                    toggleModal={() => setShouldCloseAllModals(true)}
                    width={is_buy_advert ? '' : '440px'}
                >
                    <QuickAddModalContent
                        id={advert.id}
                        is_buy_advert={is_buy_advert}
                        is_payment_methods_selected={is_payment_methods_selected}
                        selected_methods={selected_methods}
                        setSelectedMethods={setSelectedMethods}
                        setShouldCloseAllModals={setShouldCloseAllModals}
                    />
                </Modal>
            </DesktopWrapper>
            <MobileWrapper>
                <MobileFullPageModal
                    body_className={classNames({
                        'quick-add-modal__body': !should_show_add_payment_method,
                    })}
                    height_offset='80px'
                    is_flex
                    is_modal_open={is_modal_open}
                    page_header_text={localize('Add payment method')}
                    page_footer_className={classNames({
                        'quick-add-modal__footer':
                            (show_filter_payment_methods && is_buy_advert) ||
                            (should_show_add_payment_method && !is_buy_advert),
                    })}
                    pageHeaderReturnFn={() => setShouldCloseAllModals(false)}
                    renderPageFooterChildren={() =>
                        ((!show_filter_payment_methods && is_buy_advert) ||
                            (!should_show_add_payment_method && !is_buy_advert)) && (
                            <QuickAddModalButtons
                                className='quick-add-modal__button'
                                is_disabled={
                                    selected_methods.length === 0 ||
                                    (!is_buy_advert && my_ads_store.payment_method_ids.length === 0)
                                }
                                onCancel={() => setShouldCloseAllModals(false)}
                                onClickAdd={() => onClickUpdatePaymentMethods(advert?.id, is_buy_advert)}
                            />
                        )
                    }
                >
                    <QuickAddModalContent
                        id={advert.id}
                        is_buy_advert={is_buy_advert}
                        is_payment_methods_selected={is_payment_methods_selected}
                        selected_methods={selected_methods}
                        setSelectedMethods={setSelectedMethods}
                        setShouldCloseAllModals={setShouldCloseAllModals}
                    />
                </MobileFullPageModal>
            </MobileWrapper>
        </React.Fragment>
    );
};

export default observer(QuickAddModal);
