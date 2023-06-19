import React from 'react';
import { Icon, Text } from '@deriv/components';
import { getSnakeCase } from '@deriv/components/utils/helper';
import { TPaymentMethod } from 'Types';
import './payment-method-accordion-header.scss';

type TPaymentMethodAccordionHeaderProps = {
    payment_method: TPaymentMethod;
};

const PaymentMethodAccordionHeader = ({ payment_method }: TPaymentMethodAccordionHeaderProps) => {
    const method = payment_method.display_name.replace(/\s|-/gm, '');

    if (method === 'BankTransfer' || method === 'Other') {
        return (
            <div className='payment-method-accordion-header__row'>
                <Icon
                    className='payment-method-accordion-header__icon'
                    icon={`IcCashier${method}`}
                    data_testid={getSnakeCase(`IcCashier${method}`)}
                />
                <div className='payment-method-accordion-header__title'>
                    <Text color='prominent' size='xs'>
                        {payment_method.display_name}
                    </Text>
                    {method === 'BankTransfer' && (
                        <Text color='prominent' size='xs' weight='lighter'>
                            {payment_method.fields.bank_name.value}
                        </Text>
                    )}
                </div>
            </div>
        );
    }

    return (
        <div className='payment-method-accordion-header__row'>
            <Icon icon='IcCashierEwallet' data_testid={getSnakeCase('IcCashierEwallet')} />
            <div className='payment-method-accordion-header__column'>
                <Text color='prominent' size='xs'>
                    {payment_method.display_name}
                </Text>
            </div>
        </div>
    );
};

export default PaymentMethodAccordionHeader;
