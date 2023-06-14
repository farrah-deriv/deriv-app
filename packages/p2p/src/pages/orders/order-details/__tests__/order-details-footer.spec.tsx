import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import OrderDetailsFooter from '../order-details-footer';

const mock_get_website_status = jest.fn();
const mock_show_modal = jest.fn();
const mock_confirm_order_request = jest.fn();

const mock_order_info = {
    id: '12345',
    is_buy_order_for_user: false,
    should_show_cancel_and_paid_button: false,
    should_show_complain_and_received_button: false,
    should_show_only_received_button: false,
    should_show_only_complain_button: false,
    chat_channel_url: 'test.com',
};

const mock_order_store = {
    order_information: { ...mock_order_info },
    getAdvertiserInfo: jest.fn(),
    getWebsiteStatus: mock_get_website_status,
    confirmOrderRequest: mock_confirm_order_request,
};

const mock_store = {
    order_store: {
        ...mock_order_store,
    },
    general_store: {
        showModal: mock_show_modal,
    },
};

jest.mock('Stores', () => ({
    ...jest.requireActual('Stores'),
    useStores: jest.fn(() => mock_store),
}));

describe('<OrderDetailsFooter />', () => {
    it('should return empty DOM element when all should_show_*_button are false', () => {
        const { container } = render(<OrderDetailsFooter />);
        expect(container).toBeEmptyDOMElement();
    });

    it('should call getWebsiteStatus function every 10 seconds', async () => {
        jest.useFakeTimers();
        render(<OrderDetailsFooter />);
        jest.advanceTimersByTime(10000);
        await waitFor(() => expect(mock_get_website_status).toHaveBeenCalledTimes(1));
        jest.advanceTimersByTime(10000);
        await waitFor(() => expect(mock_get_website_status).toHaveBeenCalledTimes(2));
        jest.useRealTimers();
    });

    describe('<OrderDetailsFooter /> with should_show_cancel_and_paid_button = true', () => {
        beforeEach(() => {
            mock_store.order_store.order_information = { ...mock_order_info };
            mock_store.order_store.order_information.should_show_cancel_and_paid_button = true;
        });
        it('should show Cancel order and paid button', () => {
            render(<OrderDetailsFooter />);

            expect(screen.getByText('Cancel order')).toBeInTheDocument();
            expect(screen.getByText("I've paid")).toBeInTheDocument();
        });

        it('should cancel order when `Cancel order` button is clicked', () => {
            render(<OrderDetailsFooter />);
            userEvent.click(screen.getByText('Cancel order'));
            expect(mock_get_website_status).toHaveBeenCalled();
        });

        it('should call confirmOrderRequest function when `Ive paid` button is clicked and is_buy_order_for_user is false', () => {
            render(<OrderDetailsFooter />);
            userEvent.click(screen.getByText("I've paid"));
            expect(mock_confirm_order_request).toHaveBeenCalled();
        });

        it('should open confirm popup when `Ive paid` button is clicked and is_buy_order_for_user is true', () => {
            mock_store.order_store.order_information.is_buy_order_for_user = true;

            render(<OrderDetailsFooter />);
            userEvent.click(screen.getByText("I've paid"));
            expect(mock_show_modal).toHaveBeenCalledWith({ key: 'OrderDetailsConfirmModal' });
        });
    });

    describe('<OrderDetailsFooter /> with should_show_complain_and_received_button = true', () => {
        beforeEach(() => {
            mock_store.order_store.order_information = { ...mock_order_info };
            mock_store.order_store.order_information.should_show_complain_and_received_button = true;
        });

        it('should show complain and received button', () => {
            render(<OrderDetailsFooter />);
            expect(screen.getByText('Complain')).toBeInTheDocument();
            expect(screen.getByText("I've received payment")).toBeInTheDocument();
        });

        it('should open complain order modal when `Complain` button is clicked', () => {
            render(<OrderDetailsFooter />);
            userEvent.click(screen.getByText('Complain'));
            expect(mock_show_modal).toHaveBeenCalledWith({ key: 'OrderDetailsComplainModal' });
        });

        it('should call confirmOrderRequest function when `Ive received payment` button is clicked and is_buy_order_for_user is false', () => {
            render(<OrderDetailsFooter />);
            userEvent.click(screen.getByText("I've received payment"));
            expect(mock_confirm_order_request).toHaveBeenCalled();
        });

        it('should call confirmOrderRequest function when `Ive received payment` button is clicked and is_buy_order_for_user is true', () => {
            mock_store.order_store.order_information.is_buy_order_for_user = true;
            render(<OrderDetailsFooter />);
            userEvent.click(screen.getByText("I've received payment"));
            expect(mock_show_modal).toHaveBeenCalledWith({ key: 'OrderDetailsConfirmModal' });
        });
    });

    describe('<OrderDetailsFooter /> with should_show_only_complain_button = true', () => {
        beforeEach(() => {
            mock_store.order_store.order_information = { ...mock_order_info };
            mock_store.order_store.order_information.should_show_only_complain_button = true;
        });

        it('should show complain button', () => {
            render(<OrderDetailsFooter />);
            expect(screen.getByText('Complain')).toBeInTheDocument();
        });

        it('should open complain order modal when `Complain` button is clicked', () => {
            render(<OrderDetailsFooter />);
            userEvent.click(screen.getByText('Complain'));
            expect(mock_show_modal).toHaveBeenCalledWith({ key: 'OrderDetailsComplainModal' });
        });
    });

    describe('<OrderDetailsFooter /> with should_show_only_received_button = true', () => {
        beforeEach(() => {
            mock_store.order_store.order_information = { ...mock_order_info };
            mock_store.order_store.order_information.should_show_only_received_button = true;
        });

        it('should show only received button', () => {
            render(<OrderDetailsFooter />);
            expect(screen.getByText("I've received payment")).toBeInTheDocument();
        });

        it('should call confirmOrderRequest function when `Ive received payment` button is clicked and is_buy_order_for_user is false', () => {
            render(<OrderDetailsFooter />);
            userEvent.click(screen.getByText("I've received payment"));
            expect(mock_confirm_order_request).toHaveBeenCalled();
        });

        it('should call confirmOrderRequest function when `Ive received payment` button is clicked and is_buy_order_for_user is true', () => {
            mock_store.order_store.order_information.is_buy_order_for_user = true;
            render(<OrderDetailsFooter />);
            userEvent.click(screen.getByText("I've received payment"));
            expect(mock_show_modal).toHaveBeenCalledWith({ key: 'OrderDetailsConfirmModal' });
        });
    });
});
