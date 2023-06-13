import React from 'react';
import { Text } from '@deriv/components';
import classNames from 'classnames';

type OrderInfoBlock = {
    className?: string;
    label: string;
    size?: string;
    value: string | React.ReactNode;
    weight?: string;
};

const OrderInfoBlock = ({ className, label, value, size = 'xxs', weight = 'normal' }: OrderInfoBlock) => (
    <div className={classNames('order-info-block', className)}>
        <Text as='p' color='prominent' size={size} weight={weight}>
            {label}
        </Text>
        <Text className='order-info-block-value' line_height='s' size='xs'>
            {value}
        </Text>
    </div>
);

export default OrderInfoBlock;
