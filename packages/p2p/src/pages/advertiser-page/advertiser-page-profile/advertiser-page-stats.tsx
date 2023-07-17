import React from 'react';
import { Money, Text } from '@deriv/components';
import { isMobile } from '@deriv/shared';
import { observer, useStore } from '@deriv/stores';
import { localize, Localize } from 'Components/i18next';
import { useStores } from 'Stores';
import './advertiser-page-stats.scss';

const ItalicText = (
    <Text key={0} className='advertiser-page-stats__italic' color='less-prominent' size={isMobile() ? 'xxxs' : 'xs'} />
);

const AdvertiserPageStats = () => {
    const { advertiser_page_store, general_store } = useStores();
    const {
        client: { currency },
    } = useStore();

    const { advertiser_id, advertiser_info, label_size } = general_store;
    const { advertiser_details_id, counterparty_advertiser_info } = advertiser_page_store;
    const is_my_advert = advertiser_details_id === advertiser_id;
    // Use general_store.advertiser_info since resubscribing to the same id from advertiser page returns error
    const info = is_my_advert ? advertiser_info : counterparty_advertiser_info;

    const {
        buy_completion_rate,
        buy_orders_amount,
        buy_orders_count,
        buy_time_avg,
        partner_count,
        release_time_avg,
        sell_completion_rate,
        sell_orders_amount,
        sell_orders_count,
    } = info;

    const avg_buy_time_in_minutes = buy_time_avg > 60 ? Math.round(buy_time_avg / 60) : '< 1';
    const avg_release_time_in_minutes = release_time_avg > 60 ? Math.round(release_time_avg / 60) : '< 1';

    const getValueSize = () => (isMobile() ? 'xs' : 'm');

    return (
        <React.Fragment>
            <div className='advertiser-page-stats'>
                <div className='advertiser-page-stats__cell'>
                    <Text as='p' color='less-prominent' size={label_size}>
                        <Localize i18n_default_text='Buy completion  <0>30d</0>' components={[ItalicText]} />
                    </Text>
                    <Text as='p' color='prominent' size={getValueSize()} weight='bold'>
                        {buy_completion_rate ? `${buy_completion_rate}% (${buy_orders_count})` : '-'}
                    </Text>
                </div>
                <div className='advertiser-page-stats__cell'>
                    <Text as='p' color='less-prominent' size={label_size}>
                        <Localize i18n_default_text='Sell completion  <0>30d</0>' components={[ItalicText]} />
                    </Text>
                    <Text as='p' color='prominent' size={getValueSize()} weight='bold'>
                        {sell_completion_rate ? `${sell_completion_rate}% (${sell_orders_count})` : '-'}
                    </Text>
                </div>
                <div className='advertiser-page-stats__cell'>
                    <Text as='p' color='less-prominent' size={label_size}>
                        <Localize i18n_default_text='Trade volume  <0>30d</0>' components={[ItalicText]} />
                    </Text>
                    <Text as='p' color='prominent' size={getValueSize()} weight='bold'>
                        {buy_orders_amount && sell_orders_amount ? (
                            <Money
                                amount={Number(buy_orders_amount) + Number(sell_orders_amount)}
                                currency={currency}
                                show_currency
                            />
                        ) : (
                            '-'
                        )}
                    </Text>
                </div>
                <div className='advertiser-page-stats__cell'>
                    <Text as='p' color='less-prominent' size={label_size}>
                        <Localize i18n_default_text='Avg. pay time  <0>30d</0>' components={[ItalicText]} />
                    </Text>
                    <Text color='prominent' size={getValueSize()} weight='bold'>
                        {buy_time_avg
                            ? localize('{{- avg_buy_time_in_minutes}} min', {
                                  avg_buy_time_in_minutes,
                              })
                            : '-'}
                    </Text>
                </div>
                <div className='advertiser-page-stats__cell'>
                    <Text as='p' color='less-prominent' size={label_size}>
                        <Localize i18n_default_text='Avg. release time  <0>30d</0>' components={[ItalicText]} />
                    </Text>
                    <Text color='prominent' size={getValueSize()} weight='bold'>
                        {release_time_avg
                            ? localize('{{- avg_release_time_in_minutes}} min', {
                                  avg_release_time_in_minutes,
                              })
                            : '-'}
                    </Text>
                </div>
                <div className='advertiser-page-stats__cell'>
                    <Text as='p' color='less-prominent' size={label_size}>
                        <Localize i18n_default_text='Trade partners' />
                    </Text>
                    <Text as='p' color='prominent' size={getValueSize()} weight='bold'>
                        {partner_count || '0'}
                    </Text>
                </div>
            </div>
        </React.Fragment>
    );
};

export default observer(AdvertiserPageStats);
