import React from 'react';
import { Text } from '@deriv/components';
import { observer, useStore } from '@deriv/stores';
import { useStores } from 'Stores';
import { Localize } from 'Components/i18next';
import AddPaymentMethod from 'Pages/my-profile/payment-methods/add-payment-method/add-payment-method.jsx';
import SellAdPaymentMethodsList from 'Pages/my-ads/sell-ad-payment-methods-list.jsx';

type TAddPaymentMethodsProps = {
    selected_methods: string[];
    setSelectedMethods: React.Dispatch<React.SetStateAction<string[]>>;
};

const AddPaymentMethods = ({ selected_methods, setSelectedMethods }: TAddPaymentMethodsProps) => {
    const {
        ui: { is_mobile },
    } = useStore();
    const { my_ads_store } = useStores();

    const { payment_method_ids, should_show_add_payment_method, setShouldShowAddPaymentMethod } = my_ads_store;

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
            setSelectedMethods(selected_methods.filter((i: string) => i !== payment_method.ID));
        }
    };

    if (should_show_add_payment_method) {
        return <AddPaymentMethod should_show_page_return={false} should_show_separated_footer={true} />;
    }

    return (
        <React.Fragment>
            <Text color='prominent' size={is_mobile ? 'xxs' : 'xs'}>
                <Localize i18n_default_text='You may add up to 3 payment methods.' />
            </Text>
            <SellAdPaymentMethodsList
                is_only_horizontal
                is_scrollable
                onClickPaymentMethodCard={onClickPaymentMethodCard}
                selected_methods={selected_methods}
                onClickAdd={() => setShouldShowAddPaymentMethod(true)}
            />
        </React.Fragment>
    );
};

export default observer(AddPaymentMethods);
