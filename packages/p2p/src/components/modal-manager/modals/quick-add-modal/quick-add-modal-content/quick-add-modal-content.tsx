import React from 'react';
import classNames from 'classnames';
import { Button, DesktopWrapper, MobileWrapper, Modal, Text } from '@deriv/components';
import { isMobile } from '@deriv/shared';
import { observer } from '@deriv/stores';
import { useStores } from 'Stores';
import { localize, Localize } from 'Components/i18next';
import FilterPaymentMethods from 'Components/my-ads/filter-payment-methods';
import AddPaymentMethod from 'Pages/my-profile/payment-methods/add-payment-method/add-payment-method.jsx';
import BuyAdPaymentMethodsList from 'Pages/my-ads/buy-ad-payment-methods-list.jsx';
import SellAdPaymentMethodsList from 'Pages/my-ads/sell-ad-payment-methods-list.jsx';
import QuickAddModalButtons from '../quick-add-modal-buttons';

type TQuickAddModalContentProps = {
    id: string | undefined;
    is_buy_advert: boolean;
    is_payment_methods_selected: boolean;
    selected_methods: string[];
    setSelectedMethods: React.Dispatch<React.SetStateAction<string[]>>;
    setShouldCloseAllModals: (should_close_all_modals: boolean) => void;
};

const QuickAddModalContent = ({
    id,
    is_buy_advert,
    is_payment_methods_selected,
    selected_methods,
    setSelectedMethods,
    setShouldCloseAllModals,
}: TQuickAddModalContentProps) => {
    const { my_ads_store, my_profile_store } = useStores();
    const {
        payment_method_ids,
        payment_method_names,
        should_show_add_payment_method,
        show_filter_payment_methods,
        onClickUpdatePaymentMethods,
        setShouldShowAddPaymentMethod,
    } = my_ads_store;

    const { selected_payment_method } = my_profile_store;

    const text_size = isMobile() ? 'xxs' : 'xs';

    const onClickPaymentMethodCard = (payment_method: { ID: string }) => {
        if (!payment_method_ids.includes(payment_method.ID)) {
            if (payment_method_ids.length < 3) {
                my_ads_store.payment_method_ids.push(payment_method.ID);
                setSelectedMethods([...selected_methods, payment_method.ID]);
            }
        } else {
            my_ads_store.payment_method_ids = my_ads_store.payment_method_ids.filter(
                (payment_method_id: string) => payment_method_id !== payment_method.ID
            );
            setSelectedMethods(selected_methods.filter(i => i !== payment_method.ID));
        }
    };

    const ChoosePaymentMethods = () => {
        return (
            <React.Fragment>
                <div className='quick-add-modal-content__info'>
                    <Text color='prominent' size={text_size}>
                        <Localize i18n_default_text='You may choose up to 3 payment methods for this ad.' />
                    </Text>
                </div>
                <BuyAdPaymentMethodsList
                    is_alignment_top={false}
                    list_portal_id='modal_root'
                    should_show_hint
                    selected_methods={selected_methods}
                    setSelectedMethods={setSelectedMethods}
                    should_clear_payment_method_selections={!is_payment_methods_selected}
                />
            </React.Fragment>
        );
    };

    const AddPaymentMethods = () => {
        return should_show_add_payment_method ? (
            <AddPaymentMethod should_show_page_return={false} should_show_separated_footer={true} />
        ) : (
            <>
                <Text color='prominent' size={text_size}>
                    <Localize i18n_default_text='You may add up to 3 payment methods.' />
                </Text>
                <SellAdPaymentMethodsList
                    is_only_horizontal
                    is_scrollable
                    onClickPaymentMethodCard={onClickPaymentMethodCard}
                    selected_methods={selected_methods}
                    onClickAdd={() => setShouldShowAddPaymentMethod(true)}
                />
            </>
        );
    };

    if (is_buy_advert) {
        return (
            <React.Fragment>
                <DesktopWrapper>
                    <Modal.Body>
                        <ChoosePaymentMethods />
                    </Modal.Body>
                    <Modal.Footer has_separator>
                        <QuickAddModalButtons
                            is_disabled={selected_methods.length === 0 || payment_method_names.length === 0}
                            onCancel={() => setShouldCloseAllModals(true)}
                            onClickAdd={() => onClickUpdatePaymentMethods(id, is_buy_advert)}
                        />
                    </Modal.Footer>
                </DesktopWrapper>
                <MobileWrapper>
                    {show_filter_payment_methods ? (
                        <FilterPaymentMethods
                            selected_methods={selected_methods}
                            setSelectedMethods={setSelectedMethods}
                        />
                    ) : (
                        <ChoosePaymentMethods />
                    )}
                </MobileWrapper>
            </React.Fragment>
        );
    }

    return (
        <React.Fragment>
            <DesktopWrapper>
                <Modal.Body
                    className={classNames({
                        'quick-add-modal-content__horizontal': !should_show_add_payment_method,
                        'quick-add-modal-content__scroll': selected_payment_method,
                    })}
                >
                    <AddPaymentMethods />
                </Modal.Body>
                {!should_show_add_payment_method && (
                    <Modal.Footer has_separator>
                        <QuickAddModalButtons
                            is_disabled={selected_methods.length === 0 || my_ads_store.payment_method_ids.length === 0}
                            onCancel={() => setShouldCloseAllModals(false)}
                            onClickAdd={() => onClickUpdatePaymentMethods(id, is_buy_advert)}
                        />
                    </Modal.Footer>
                )}
                {!selected_payment_method && should_show_add_payment_method && (
                    <Modal.Footer>
                        <Button
                            has_effect
                            large
                            onClick={() => setShouldCloseAllModals(false)}
                            secondary
                            text={localize('Cancel')}
                        />
                    </Modal.Footer>
                )}
            </DesktopWrapper>
            <MobileWrapper>
                <AddPaymentMethods />
            </MobileWrapper>
        </React.Fragment>
    );
};

export default observer(QuickAddModalContent);
