import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { isDesktop, isMobile } from '@deriv/shared';
import { useStores } from 'Stores';
import OrderDetailsComplainModal from '../order-details-complain-modal';
import { useModalManagerContext } from 'Components/modal-manager/modal-manager-context';

const el_modal = document.createElement('div');

const mock_dispute_order_request = jest.fn();
const mock_hide_modal = jest.fn();
const mock_set_error_message = jest.fn();

const mock_store = {
    order_store: {
        order_information: {
            id: '123',
            is_buy_order_for_user: true,
        },
        disputeOrderRequest: mock_dispute_order_request,
    },
    order_details_store: {
        error_message: '',
        setErrorMessage: mock_set_error_message,
    },
};

jest.mock('Stores', () => ({
    useStores: jest.fn(
        (): DeepPartial<ReturnType<typeof useStores>> => ({
            ...jest.requireActual('Stores'),
            ...mock_store,
        })
    ),
}));

jest.mock('Components/modal-manager/modal-manager-context', () => ({
    useModalManagerContext: jest.fn(
        (): DeepPartial<ReturnType<typeof useModalManagerContext>> => ({
            hideModal: mock_hide_modal,
            is_modal_open: true,
        })
    ),
}));

jest.mock('@deriv/shared', () => ({
    ...jest.requireActual('@deriv/shared'),
    isDesktop: jest.fn(() => true),
    isMobile: jest.fn(() => false),
}));

describe('<OrderDetailsComplainModal/>', () => {
    beforeAll(() => {
        el_modal.setAttribute('id', 'modal_root');
        document.body.appendChild(el_modal);
    });

    afterAll(() => {
        document.body.removeChild(el_modal);
    });

    it('should render complain modal in desktop view', () => {
        render(<OrderDetailsComplainModal />);

        expect(screen.getByText("What's your complaint?")).toBeInTheDocument();
    });

    it('should disable button when no complain is provided', () => {
        render(<OrderDetailsComplainModal />);

        expect(screen.getByRole('button', { name: /Submit/i })).toBeDisabled();
    });

    it('should submit the complain when complain is provided as input', async () => {
        render(<OrderDetailsComplainModal />);

        userEvent.click(screen.getAllByRole('radio')[1]);

        const submit_button = screen.getByRole('button', { name: 'Submit' });
        expect(submit_button).toBeEnabled();
        userEvent.click(submit_button);

        await waitFor(() => {
            expect(mock_dispute_order_request).toHaveBeenCalled();
        });
    });

    it('should display error message when error response is received', () => {
        useStores.mockReturnValueOnce({
            ...mock_store,
            order_details_store: {
                error_message: 'Some error',
            },
        });
        render(<OrderDetailsComplainModal />);

        expect(screen.getByText('Some error')).toBeInTheDocument();
    });

    it('should clear error message and call hideModal function when closing the modal', () => {
        render(<OrderDetailsComplainModal />);

        userEvent.keyboard('{Escape}');

        expect(mock_set_error_message).toHaveBeenCalledWith('');
        expect(mock_hide_modal).toHaveBeenCalled();
    });

    it('should show Complaint header in mobile view', () => {
        (isDesktop as jest.Mock).mockReturnValueOnce(false);
        (isMobile as jest.Mock).mockReturnValueOnce(true);
        render(<OrderDetailsComplainModal />);

        expect(screen.getByText('Complaint')).toBeInTheDocument();
    });
});
