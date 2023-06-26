import moment from 'moment';
import { WS } from '@deriv/shared';
import { convertToMillis } from 'Utils/date-time';
import { PromiseClass } from './utility';

let clock_started = false;
const pending = new PromiseClass();
let server_time: moment.Moment,
    performance_request_time: number,
    get_time_interval: ReturnType<typeof setInterval>,
    update_time_interval: ReturnType<typeof setInterval>,
    onTimeUpdated: () => void;

const requestTime = () => {
    performance_request_time = performance.now();
    WS.send({ time: 1 }).then(timeCounter);
};

const init = (fncTimeUpdated?: () => void) => {
    if (!clock_started) {
        if (fncTimeUpdated) {
            onTimeUpdated = fncTimeUpdated;
        }
        requestTime();
        clearInterval(get_time_interval);
        get_time_interval = setInterval(requestTime, 30000);
        clock_started = true;
    }
};

export const timeCounter = (response: { error: Error; time: number }) => {
    if (response.error) return;

    if (!clock_started) {
        init();
        return;
    }

    clearInterval(update_time_interval);

    const start_timestamp = response.time;
    const performance_response_time = performance.now();
    const time_taken = performance_response_time - performance_request_time;
    const server_time_at_response = start_timestamp * 1000 + time_taken;

    const updateTime = () => {
        const time_since_response = performance.now() - performance_response_time;
        server_time = moment(server_time_at_response + time_since_response).utc();

        if (typeof onTimeUpdated === 'function') {
            onTimeUpdated();
        }
    };
    updateTime();
    pending.resolve?.('');

    update_time_interval = setInterval(updateTime, 1000);
};

export const timePromise = pending.promise;

const get = () => (server_time ? convertToMillis(server_time.unix()) : undefined);

const getDistanceToServerTime = (compare_millis_time: number) => {
    const now_millis = get();
    const distance = now_millis ? compare_millis_time - now_millis : 0;

    return distance;
};

export default {
    init,
    get,
    getDistanceToServerTime,
};
