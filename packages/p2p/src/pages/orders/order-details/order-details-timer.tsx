import React from 'react';
import { observer } from 'mobx-react-lite';
import { Text } from '@deriv/components';
import { localize } from 'Components/i18next';
import { secondsToTimer } from 'Utils/date-time';
import ServerTime from 'Utils/server-time';
import { useStores } from 'Stores';
import './order-details-timer.scss';

const OrderDetailsTimer = observer(() => {
    const getTimeLeft = (time: number) => {
        const distance = ServerTime.getDistanceToServerTime(time);
        return {
            distance,
            label: secondsToTimer(Math.max(0, distance)),
        };
    };

    const { order_store } = useStores();
    const { order_expiry_milliseconds, should_show_order_timer } = order_store.order_information;
    const [remaining_time, setRemainingTime] = React.useState(getTimeLeft(order_expiry_milliseconds).label);
    const interval = React.useRef<NodeJS.Timeout | null>(null);

    const countDownTimer = () => {
        const time_left = getTimeLeft(order_expiry_milliseconds);
        if (time_left.distance < 0 && interval.current) clearInterval(interval.current);

        setRemainingTime(time_left.label);
    };

    React.useEffect(() => {
        countDownTimer();
        interval.current = setInterval(countDownTimer, 1000);

        return () => {
            if (interval.current) clearInterval(interval.current);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [order_expiry_milliseconds]);

    if (should_show_order_timer) {
        return (
            <div className='order-details-timer'>
                <Text size='xxs' align='center'>
                    {localize('Time left')}
                </Text>
                <Text className='order-details-timer__counter' size='xxs' align='center'>
                    {remaining_time}
                </Text>
            </div>
        );
    }

    if (interval.current) clearInterval(interval.current);
    return null;
});

export default OrderDetailsTimer;
