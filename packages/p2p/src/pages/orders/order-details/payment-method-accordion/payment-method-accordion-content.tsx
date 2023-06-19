import React from 'react';
import { Text } from '@deriv/components';
import { TPaymentMethod } from 'Types';
import './payment-method-accordion-content.scss';

type TPaymentMethodAccordionContentProps = {
    payment_method: TPaymentMethod;
};

const PaymentMethodAccordionContent = ({ payment_method }: TPaymentMethodAccordionContentProps) => {
    return (
        <React.Fragment>
            {Object.entries(payment_method?.fields).map((field, key) => {
                return (
                    <div key={key} className='payment-method-accordion-content--field'>
                        <Text color='less-prominent' size='xxs'>
                            {field[1].display_name}
                        </Text>
                        <Text color='prominent' size='xs'>
                            {field[1].value}
                        </Text>
                    </div>
                );
            })}
        </React.Fragment>
    );
};

export default PaymentMethodAccordionContent;
