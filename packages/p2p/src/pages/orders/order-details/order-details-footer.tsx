import React from 'react';
import { Button } from '@deriv/components';
import { observer } from '@deriv/stores';
import { Localize } from 'Components/i18next';
import { useStores } from 'Stores';
import './order-details-footer.scss';

const OrderDetailsFooter = () => {
    const { general_store, order_store } = useStores();
    const {
        id,
        is_buy_order_for_user,
        should_show_cancel_and_paid_button,
        should_show_complain_and_received_button,
        should_show_only_received_button,
        should_show_only_complain_button,
        chat_channel_url,
    } = order_store.order_information;

    React.useEffect(() => {
        const website_status = setInterval(() => {
            order_store.getWebsiteStatus();
        }, 10000);

        return () => {
            clearInterval(website_status);
        };
    });

    const showCancelOrderModal = () => {
        order_store.getWebsiteStatus(true);
    };

    const showComplainOrderModal = () => {
        general_store.showModal({ key: 'OrderDetailsComplainModal' });
    };

    const showConfirmOrderModal = () => {
        if (is_buy_order_for_user) {
            general_store.showModal({ key: 'OrderDetailsConfirmModal' });
        } else {
            order_store.confirmOrderRequest(id);
        }
    };

    if (should_show_cancel_and_paid_button) {
        return (
            <React.Fragment>
                <div className='order-details-footer'>
                    <div className='order-details-footer--right'>
                        <Button.Group>
                            <Button large secondary onClick={showCancelOrderModal} is_disabled={!chat_channel_url}>
                                <Localize i18n_default_text='Cancel order' />
                            </Button>
                            <Button large primary onClick={showConfirmOrderModal} is_disabled={!chat_channel_url}>
                                <Localize i18n_default_text="I've paid" />
                            </Button>
                        </Button.Group>
                    </div>
                </div>
            </React.Fragment>
        );
    }

    if (should_show_complain_and_received_button) {
        return (
            <React.Fragment>
                <div className='order-details-footer'>
                    <div className='order-details-footer--right'>
                        <Button.Group>
                            <Button large tertiary onClick={showComplainOrderModal}>
                                <Localize i18n_default_text='Complain' />
                            </Button>
                            <Button large primary onClick={showConfirmOrderModal}>
                                <Localize i18n_default_text="I've received payment" />
                            </Button>
                        </Button.Group>
                    </div>
                </div>
            </React.Fragment>
        );
    }

    if (should_show_only_complain_button) {
        return (
            <React.Fragment>
                <div className='order-details-footer'>
                    <div className='order-details-footer--right'>
                        <Button large tertiary onClick={showComplainOrderModal}>
                            <Localize i18n_default_text='Complain' />
                        </Button>
                    </div>
                </div>
            </React.Fragment>
        );
    }

    if (should_show_only_received_button) {
        return (
            <React.Fragment>
                <div className='order-details-footer'>
                    <div className='order-details-footer--right'>
                        <Button large primary onClick={showConfirmOrderModal}>
                            <Localize i18n_default_text="I've received payment" />
                        </Button>
                    </div>
                </div>
            </React.Fragment>
        );
    }

    return null;
};

export default observer(OrderDetailsFooter);
