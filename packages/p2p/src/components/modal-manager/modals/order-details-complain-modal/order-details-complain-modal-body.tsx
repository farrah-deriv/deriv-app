import React from 'react';
import { Text } from '@deriv/components';
import { Localize } from 'Components/i18next';
import OrderDetailsComplainModalRadioGroup from './order-details-complain-modal-radio-group';
import './order-details-complain-modal-body.scss';

type TOrderDetailsComplainModalBodyProps = {
    dispute_reason: string;
    is_buy_order_for_user: boolean;
    onCheckboxChange: (reason: string) => void;
};

const OrderDetailsComplainModalBody = ({
    is_buy_order_for_user,
    dispute_reason,
    onCheckboxChange,
}: TOrderDetailsComplainModalBodyProps) => {
    return (
        <React.Fragment>
            <OrderDetailsComplainModalRadioGroup
                is_buy_order_for_user={is_buy_order_for_user}
                dispute_reason={dispute_reason}
                onCheckboxChange={onCheckboxChange}
            />
            <div className='order-details-complain-modal-body'>
                <Text size='xxs'>
                    <Localize i18n_default_text="If your complaint isn't listed here, please contact our Customer Support team." />
                </Text>
            </div>
        </React.Fragment>
    );
};

export default OrderDetailsComplainModalBody;
