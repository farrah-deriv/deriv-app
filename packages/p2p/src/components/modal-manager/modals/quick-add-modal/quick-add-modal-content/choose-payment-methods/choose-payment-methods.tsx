import React from 'react';
import { Text } from '@deriv/components';
import { isMobile } from '@deriv/shared';
import { Localize } from 'Components/i18next';
import BuyAdPaymentMethodsList from 'Pages/my-ads/buy-ad-payment-methods-list.jsx';

type TChoosePaymentMethodsProps = {
    is_payment_methods_selected: boolean;
    selected_methods: string[];
    setSelectedMethods: React.Dispatch<React.SetStateAction<string[]>>;
};

const ChoosePaymentMethods = ({
    is_payment_methods_selected,
    selected_methods,
    setSelectedMethods,
}: TChoosePaymentMethodsProps) => {
    return (
        <React.Fragment>
            <div className='quick-add-modal-content__info'>
                <Text color='prominent' size={isMobile() ? 'xxs' : 'xs'}>
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

export default ChoosePaymentMethods;
