import React from 'react';
import classNames from 'classnames';
import { Button, DesktopWrapper, MobileWrapper, Modal } from '@deriv/components';
import { observer } from '@deriv/stores';
import { useStores } from 'Stores';
import { localize } from 'Components/i18next';
import FilterPaymentMethods from 'Components/my-ads/filter-payment-methods';

import AddPaymentMethods from './add-payment-methods';
import ChoosePaymentMethods from './choose-payment-methods';
import QuickAddModalButtons from '../quick-add-modal-buttons';

type TQuickAddModalContentProps = {
    id?: string;
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
        payment_method_names,
        should_show_add_payment_method,
        show_filter_payment_methods,
        onClickUpdatePaymentMethods,
    } = my_ads_store;

    const { selected_payment_method } = my_profile_store;

    if (is_buy_advert) {
        return (
            <React.Fragment>
                <DesktopWrapper>
                    <Modal.Body>
                        <ChoosePaymentMethods
                            is_payment_methods_selected={is_payment_methods_selected}
                            selected_methods={selected_methods}
                            setSelectedMethods={setSelectedMethods}
                        />
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
                        <ChoosePaymentMethods
                            is_payment_methods_selected={is_payment_methods_selected}
                            selected_methods={selected_methods}
                            setSelectedMethods={setSelectedMethods}
                        />
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
                    <AddPaymentMethods selected_methods={selected_methods} setSelectedMethods={setSelectedMethods} />
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
                {selected_payment_method.length === 0 && should_show_add_payment_method && (
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
                <AddPaymentMethods selected_methods={selected_methods} setSelectedMethods={setSelectedMethods} />
            </MobileWrapper>
        </React.Fragment>
    );
};

export default observer(QuickAddModalContent);
