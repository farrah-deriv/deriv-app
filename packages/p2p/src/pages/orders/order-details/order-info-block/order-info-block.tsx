import React from 'react';
import classNames from 'classnames';
import { Text } from '@deriv/components';

type TOrderInfoBlockProps = {
    className?: string;
    label: string;
    size?: string;
    value: string | React.ReactNode;
    weight?: string;
};

const OrderInfoBlock = ({ className, label, value, size = 'xxs', weight = 'normal' }: TOrderInfoBlockProps) => (
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
