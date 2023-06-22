import React from 'react';
import classnames from 'classnames';
import { Table } from '@deriv/components';
import { observer } from '@deriv/stores';
import { localize } from 'Components/i18next';
import { useStores } from 'Stores';
import './order-table-header.scss';

const OrderTableHeader = ({ children }: React.PropsWithChildren<unknown>) => {
    const { general_store } = useStores();
    const { is_active_tab, order_table_type } = general_store;

    return (
        <Table className='order-table-header'>
            <Table.Header>
                <Table.Row
                    className={classnames('order-table-grid', {
                        'order-table-grid--active': is_active_tab,
                    })}
                >
                    <Table.Head>{localize('Order')}</Table.Head>
                    <Table.Head>{localize('Order ID')}</Table.Head>
                    <Table.Head>{localize('Counterparty')}</Table.Head>
                    <Table.Head>{localize('Status')}</Table.Head>
                    <Table.Head>{localize('Send')}</Table.Head>
                    <Table.Head>{localize('Receive')}</Table.Head>
                    {order_table_type === 'active' && <Table.Head>{localize('Time')}</Table.Head>}
                </Table.Row>
            </Table.Header>
            <Table.Body className='order-table-body'>{children}</Table.Body>
        </Table>
    );
};

export default observer(OrderTableHeader);
