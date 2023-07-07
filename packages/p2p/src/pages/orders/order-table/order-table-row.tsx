import React from 'react';
import classNames from 'classnames';
import { useHistory, useLocation } from 'react-router-dom';
import { useStore, observer } from '@deriv/stores';
import { DesktopWrapper, Icon, MobileWrapper, Table, Text } from '@deriv/components';
import { formatMoney, routes } from '@deriv/shared';
import { localize } from 'Components/i18next';
import { useModalManagerContext } from 'Components/modal-manager/modal-manager-context';
import { useStores } from 'Stores';
import { TOrderNotification } from 'Types';
import { secondsToTimer } from 'Utils/date-time';
import ExtendedOrderDetails, { createExtendedOrderDetails } from 'Utils/orders';
import ServerTime from 'Utils/server-time';
import RatingCellRenderer from './rating-cell-renderer';
import './order-table-row.scss';

type TTitleProps = {
    send_amount: string;
    currency: string;
    order_purchase_datetime: string;
    order_type: string;
};

type TOrderTableRowProps = {
    row: ExtendedOrderDetails;
};

const Title = ({ send_amount, currency, order_purchase_datetime, order_type }: TTitleProps) => {
    return (
        <React.Fragment>
            <Text size='sm' color='prominent' line_height='xxs' weight='bold' as='p'>
                {order_type} {formatMoney(currency, send_amount, true)} {currency}
            </Text>
            <Text color='less-prominent' as='p' line_height='xxs' size='xxs' align='left'>
                {order_purchase_datetime}
            </Text>
        </React.Fragment>
    );
};

const OrderTableRow = ({ row: order }: TOrderTableRowProps) => {
    const getTimeLeft = (time: number) => {
        const distance = ServerTime.getDistanceToServerTime(time);
        return {
            distance,
            label: distance < 0 ? localize('expired') : secondsToTimer(distance),
        };
    };

    const { general_store, order_store, sendbird_store } = useStores();
    const { is_active_tab, server_time } = general_store;
    const {
        notifications: { removeNotificationByKey, removeNotificationMessage },
        client: { loginid },
    } = useStore();
    const [order_state, setOrderState] = React.useState(order); // Use separate state to force refresh when (FE-)expired.
    const {
        account_currency,
        amount_display,
        has_review_details,
        id,
        is_buy_order_for_user,
        is_completed_order,
        is_order_reviewable,
        is_user_recommended_previously,
        local_currency,
        order_expiry_milliseconds,
        order_purchase_datetime,
        other_user_details,
        price_display,
        rating,
        should_highlight_alert,
        should_highlight_danger,
        should_highlight_disabled,
        should_highlight_success,
        status_string,
    } = order_state;
    const [remaining_time, setRemainingTime] = React.useState(getTimeLeft(order_expiry_milliseconds).label);
    const interval = React.useRef<NodeJS.Timeout | null>(null);
    const should_show_order_details = React.useRef(true);
    const history = useHistory();
    const location = useLocation();
    const { showModal, hideModal } = useModalManagerContext() || {};

    const is_timer_visible = is_active_tab && remaining_time !== localize('expired');
    const offer_amount = `${amount_display} ${account_currency}`;
    const transaction_amount = `${Number(price_display).toFixed(2)} ${local_currency}`;
    const order_type = is_buy_order_for_user ? localize('Buy') : localize('Sell');

    const isOrderSeen = (order_id: string) => {
        const { notifications } = general_store.getLocalStorageSettingsForLoginId();
        return notifications.some(
            (notification: TOrderNotification) => notification.order_id === order_id && notification.is_seen === true
        );
    };

    const onRowClick = () => {
        if (should_show_order_details.current) {
            const current_query_params = new URLSearchParams(location.search);

            current_query_params.append('order', order.id);

            history.replace({
                pathname: routes.p2p_orders,
                search: current_query_params.toString(),
                hash: location.hash,
            });

            return order_store.setOrderId(order.id);
        }

        return () => {
            // do nothing
        };
    };

    const showRatingModal = () => {
        showModal({
            key: 'RatingModal',
            props: {
                is_buy_order_for_user,
                is_user_recommended_previously,
                onClickDone: () => {
                    order_store.setOrderRating(id);
                    hideModal();
                    should_show_order_details.current = true;
                    order_store.setRatingValue(0);
                    removeNotificationMessage({ key: `p2p_order_${id}` });
                    removeNotificationByKey({ key: `p2p_order_${id}` });
                    order_store.setIsLoading(true);
                    order_store.setOrders([]);
                    order_store.loadMoreOrders({ startIndex: 0 });
                },
                onClickSkip: () => {
                    order_store.setRatingValue(0);
                    hideModal();
                    should_show_order_details.current = true;
                },
            },
        });
    };

    React.useEffect(() => {
        const countDownTimer = () => {
            const { distance, label } = getTimeLeft(order_expiry_milliseconds);

            if (distance < 0 && interval.current) {
                setRemainingTime(label);
                setOrderState(createExtendedOrderDetails(order.order_details, loginid, server_time));
                clearInterval(interval.current);
            } else {
                setRemainingTime(label);
            }
        };

        interval.current = setInterval(countDownTimer, 1000);
        return () => {
            if (interval.current) clearInterval(interval.current);
        };
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    return (
        <div data-testid='dt_order_table_row' onClick={onRowClick}>
            <DesktopWrapper>
                <Table.Row
                    className={classNames('order-table-row order-table-grid', {
                        'order-table-grid--active': is_active_tab,
                        'order-table-row--attention': !isOrderSeen(id),
                    })}
                >
                    <Table.Cell>{order_type}</Table.Cell>
                    <Table.Cell>{id}</Table.Cell>
                    <Table.Cell>{other_user_details.name}</Table.Cell>
                    <Table.Cell>
                        <Text
                            as='div'
                            size='xxs' // TODO: Change the font-size once design is ready
                            weight='bold'
                            className={classNames('order-table-status', {
                                'order-table-status--danger': should_highlight_danger,
                                'order-table-status--alert': should_highlight_alert,
                                'order-table-status--success': should_highlight_success,
                                'order-table-status--disabled': should_highlight_disabled,
                            })}
                        >
                            {status_string}
                        </Text>
                    </Table.Cell>
                    <Table.Cell>{is_buy_order_for_user ? transaction_amount : offer_amount}</Table.Cell>
                    <Table.Cell>{is_buy_order_for_user ? offer_amount : transaction_amount}</Table.Cell>
                    <Table.Cell>
                        {is_active_tab ? (
                            <div className='order-table-row-time'>
                                <Text align='center' size='xxs'>
                                    {remaining_time}
                                </Text>
                            </div>
                        ) : (
                            is_completed_order && (
                                <RatingCellRenderer
                                    has_review_details={has_review_details}
                                    is_reviewable={Boolean(is_order_reviewable)}
                                    rating={rating}
                                    onClickUserRatingButton={() => {
                                        should_show_order_details.current = false;
                                        showRatingModal();
                                    }}
                                />
                            )
                        )}
                    </Table.Cell>
                </Table.Row>
            </DesktopWrapper>
            <MobileWrapper>
                <Table.Row
                    className={classNames('orders__mobile', {
                        'orders__mobile--attention': !isOrderSeen(id),
                    })}
                >
                    <Table.Cell
                        className={classNames('orders__mobile-header', {
                            'order-table-grid--active': is_active_tab,
                        })}
                    >
                        <Text
                            as='div'
                            align='center'
                            size='xxs' // TODO: Change the font-size once design is ready
                            weight='bold'
                            className={classNames('orders__mobile-status', {
                                'order-table-status--danger': should_highlight_danger,
                                'order-table-status--alert': should_highlight_alert,
                                'order-table-status--success': should_highlight_success,
                                'order-table-status--disabled': should_highlight_disabled,
                            })}
                        >
                            {status_string}
                        </Text>
                    </Table.Cell>
                    <Table.Cell className='orders__mobile-header-right'>
                        {is_timer_visible && (
                            <Text
                                size='xxs'
                                color='prominent'
                                align='center'
                                line_height='l'
                                className='orders__mobile-time'
                            >
                                {remaining_time}
                            </Text>
                        )}
                        {is_active_tab ? (
                            <div className='orders__mobile-chat'>
                                <Icon
                                    data_testid='dt_chat_icon'
                                    icon='IcChat'
                                    height={15}
                                    width={16}
                                    onClick={() => {
                                        sendbird_store.setShouldShowChatModal(true);
                                        sendbird_store.setShouldShowChatOnOrders(true);
                                    }}
                                />
                            </div>
                        ) : (
                            <div className='orders__mobile-chat'>
                                {is_completed_order && (
                                    <RatingCellRenderer
                                        has_review_details={has_review_details}
                                        is_reviewable={Boolean(is_order_reviewable)}
                                        rating={rating}
                                        onClickUserRatingButton={() => {
                                            should_show_order_details.current = false;
                                            showRatingModal();
                                        }}
                                    />
                                )}
                            </div>
                        )}
                    </Table.Cell>
                    <Table.Cell className='orders__mobile-title'>
                        <Title
                            send_amount={amount_display}
                            currency={account_currency}
                            order_purchase_datetime={order_purchase_datetime}
                            order_type={order_type}
                        />
                    </Table.Cell>
                </Table.Row>
            </MobileWrapper>
        </div>
    );
};

export default observer(OrderTableRow);
