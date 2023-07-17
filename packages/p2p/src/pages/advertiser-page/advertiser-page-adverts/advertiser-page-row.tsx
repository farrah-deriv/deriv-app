import React from 'react';
import { Button, DesktopWrapper, MobileWrapper, Table, Text } from '@deriv/components';
import { isDesktop, isMobile } from '@deriv/shared';
import { observer, useStore } from '@deriv/stores';
import { localize, Localize } from 'Components/i18next';
import { useModalManagerContext } from 'Components/modal-manager/modal-manager-context';
import { buy_sell } from 'Constants/buy-sell';
import { useStores } from 'Stores/index';
import { generateEffectiveRate } from 'Utils/format-value';

type TAvailabilityStatus = 0 | 1;
type TAdvertiserDetails = {
    id: string;
    completed_orders_count: number;
    is_blocked: TAvailabilityStatus;
    is_favourite: TAvailabilityStatus;
    is_online: TAvailabilityStatus;
    is_recommended: null | number;
    last_online_time: number | null;
    name: string;
    rating_average: null | number;
    rating_count: number;
    recommended_average: null | number;
    recommended_count: number | null;
    total_completion_rate: number | null;
};

type TAdvertiserPageDetails = {
    account_currency: string;
    advertiser_details: TAdvertiserDetails;
    counterparty_type: string;
    country: string;
    created_time: number;
    description: string;
    effective_rate: null | number;
    effective_rate_display: string;
    id: string;
    is_active: TAvailabilityStatus;
    is_visible: TAvailabilityStatus;
    local_currency: string;
    max_order_amount_limit: number;
    max_order_amount_limit_display: string;
    min_order_amount_limit: number;
    min_order_amount_limit_display: string;
    payment_method: string;
    payment_method_names: string[];
    price: number | null;
    price_display: string;
    rate: number;
    rate_display: string;
    rate_type: string;
    type: string;
};

export type TAdvertiserPageRow = {
    row: TAdvertiserPageDetails;
};

const AdvertiserPageRow = ({ row: advert }: TAdvertiserPageRow) => {
    const { advertiser_page_store, buy_sell_store, floating_rate_store, general_store } = useStores();
    const {
        client: { currency },
    } = useStore();
    const {
        effective_rate,
        local_currency,
        max_order_amount_limit_display,
        min_order_amount_limit_display,
        payment_method_names,
        price_display,
        rate_type,
        rate,
    } = advert;
    const { advertiser_details_id, counterparty_type } = advertiser_page_store;
    const { advertiser_id, is_barred } = general_store;
    const { showModal } = useModalManagerContext();

    const is_buy_advert = counterparty_type === buy_sell.BUY;
    const is_my_advert = advertiser_details_id === advertiser_id;

    const { display_effective_rate } = generateEffectiveRate({
        price: price_display,
        rate_type,
        rate,
        local_currency,
        exchange_rate: floating_rate_store.exchange_rate,
        market_rate: effective_rate,
    });

    const showAdForm = () => {
        buy_sell_store.setSelectedAdState(advert);
        showModal({
            key: 'BuySellModal',
        });
    };

    const getButtonLabel = () => `${is_buy_advert ? localize('Buy') : localize('Sell')} ${currency}`;

    const getButtonContent = () =>
        is_my_advert ? (
            <Table.Cell />
        ) : (
            <Table.Cell className='advertiser-page-adverts__button'>
                <Button is_disabled={is_barred} onClick={showAdForm} primary small={isDesktop()} large={isMobile()}>
                    {getButtonLabel()}
                </Button>
            </Table.Cell>
        );

    const getPaymentListContent = () => (
        <div className='advertiser-page-adverts__payment-methods-list'>
            {payment_method_names
                ? payment_method_names.map(payment_method => {
                      return (
                          <div className='advertiser-page-adverts__payment-method' key={payment_method}>
                              <Text line-height='l' size={isMobile() ? 'xxxs' : 'xs'}>
                                  {payment_method}
                              </Text>
                          </div>
                      );
                  })
                : null}
        </div>
    );

    return (
        <React.Fragment>
            <DesktopWrapper>
                <Table.Row className='advertiser-page-adverts__table-row'>
                    <Table.Cell>{`${min_order_amount_limit_display}-${max_order_amount_limit_display} ${currency}`}</Table.Cell>
                    <Table.Cell>
                        <Text color='profit-success' size='xs' weight='bold'>
                            {display_effective_rate} {local_currency}
                        </Text>
                    </Table.Cell>
                    <Table.Cell>{getPaymentListContent()}</Table.Cell>
                    {getButtonContent()}
                </Table.Row>
            </DesktopWrapper>
            <MobileWrapper>
                <Table.Row className='advertiser-page-adverts__table-row'>
                    <Table.Cell className='advertiser-page-adverts__cell'>
                        <Text size='xxs'>
                            <Localize
                                i18n_default_text='Rate (1 {{currency}})'
                                values={{
                                    currency,
                                }}
                            />
                        </Text>
                        <Text as='div' color='profit-success' weight='bold'>
                            {display_effective_rate} {local_currency}
                        </Text>
                        <div className='advertiser-page-adverts__cell-limit'>
                            <Text size='xxs'>
                                <Localize
                                    i18n_default_text='Limits {{min_order_amount_limit_display}}-{{max_order_amount_limit_display}} {{currency}}'
                                    values={{
                                        min_order_amount_limit_display,
                                        max_order_amount_limit_display,
                                        currency,
                                    }}
                                />
                            </Text>
                        </div>
                        {getPaymentListContent()}
                    </Table.Cell>
                    {getButtonContent()}
                </Table.Row>
            </MobileWrapper>
        </React.Fragment>
    );
};

export default observer(AdvertiserPageRow);
