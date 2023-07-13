import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { isDesktop, isMobile } from '@deriv/shared';
import { useModalManagerContext } from 'Components/modal-manager/modal-manager-context';
import { useStores } from 'Stores';
import OrderDetailsWrapper from '../order-details-wrapper';

const mock_set_should_show_chat_modal = jest.fn();

const mock_order_store = {
    order_information: {
        should_show_order_footer: true,
    },
    onPageReturn: jest.fn(),
    should_navigate_to_buy_sell: true,
    setShouldNavigateToBuySell: jest.fn(),
};

jest.mock('Stores', () => ({
    ...jest.requireActual('Stores'),
    useStores: jest.fn(
        (): DeepPartial<ReturnType<typeof useStores>> => ({
            order_store: mock_order_store,
            sendbird_store: { setShouldShowChatModal: mock_set_should_show_chat_modal },
        })
    ),
}));

jest.mock('@deriv/shared', () => ({
    ...jest.requireActual('@deriv/shared'),
    isDesktop: jest.fn(() => true),
    isMobile: jest.fn(() => false),
}));

jest.mock('Components/modal-manager/modal-manager-context', () => ({
    useModalManagerContext: jest.fn(
        (): DeepPartial<ReturnType<typeof useModalManagerContext>> => ({
            isCurrentModal: jest.fn(() => false),
        })
    ),
}));

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useHistory: jest.fn(() => ({
        push: jest.fn(),
    })),
}));

describe('<OrderDetailsWrapper />', () => {
    it('should render component in desktop view', async () => {
        const desktop_props = {
            onClick: jest.fn(),
            page_title: 'desktop test',
        };

        render(<OrderDetailsWrapper {...desktop_props} />);

        await waitFor(() => {
            expect(screen.getByTestId('dt_page_return')).toBeInTheDocument();
            expect(screen.getByText('desktop test')).toBeInTheDocument();
        });
    });

    it('should render component in mobile view', async () => {
        (isDesktop as jest.Mock).mockReturnValue(false);
        (isMobile as jest.Mock).mockReturnValue(true);
        const mobile_props = {
            className: 'order-details',
            body_className: 'order-details__body',
            height_offset: '80px',
            is_flex: true,
            is_modal_open: true,
            page_title: 'mobile test',
        };

        render(<OrderDetailsWrapper {...mobile_props} />);

        await waitFor(() => {
            expect(screen.getByTestId('dt_order_details_wrapper_mobile')).toBeInTheDocument();
            expect(screen.getByText('mobile test')).toBeInTheDocument();
        });
    });

    it('should call `setShouldShowChatModalFn` when complain svg icon is clicked', () => {
        render(<OrderDetailsWrapper page_title='test' />);

        const svg_icon = screen.getByTestId('dt_chat_icon');
        userEvent.click(svg_icon);
        expect(mock_set_should_show_chat_modal).toHaveBeenCalledTimes(1);
    });

    it('should return to previous page when page return button is clicked', () => {
        const { debug } = render(<OrderDetailsWrapper page_title='test' />);
        const page_return_button = screen.getByTestId('dt_mobile_full_page_modal_return_header');
        expect(page_return_button).toBeInTheDocument();
        userEvent.click(page_return_button);
        expect(mock_order_store.onPageReturn).toHaveBeenCalledTimes(1);
        expect(mock_order_store.setShouldNavigateToBuySell).toHaveBeenCalledTimes(1);
    });
});
