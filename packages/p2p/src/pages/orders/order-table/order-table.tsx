import React from 'react';
import { ButtonToggle } from '@deriv/components';
import { observer } from '@deriv/stores';
import { localize } from 'Components/i18next';
import ToggleContainer from 'Components/toggle-container';
import { order_list } from 'Constants/order-list';
import { useStores } from 'Stores';
import OrderTableContent from './order-table-content';

const OrderTable = () => {
    const { general_store } = useStores();
    const { active_notification_count, inactive_notification_count, order_table_type } = general_store;

    const orders_list_filters = [
        {
            text: localize('Active orders'),
            value: order_list.ACTIVE,
            count: active_notification_count,
        },
        {
            text: localize('Past orders'),
            value: order_list.INACTIVE,
            count: inactive_notification_count,
        },
    ];

    return (
        <React.Fragment>
            <div className='order-table'>
                <div className='order-table__toggle-wrapper '>
                    <ToggleContainer>
                        <ButtonToggle
                            buttons_arr={orders_list_filters}
                            className='order-table__toggle-wrapper-filter'
                            is_animated
                            name='filter'
                            onChange={({ target: { value } }) => general_store.setOrderTableType(value)}
                            value={order_table_type}
                            has_rounded_button
                        />
                    </ToggleContainer>
                </div>
            </div>
            <OrderTableContent />
        </React.Fragment>
    );
};

export default observer(OrderTable);
