import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import OrderDetailsComplainModalRadioGroup from '../order-details-complain-modal-radio-group';

describe('<OrderDetailsComplainModalRadioGroup/>', () => {
    const mock_props = {
        dispute_reason: '',
        is_buy_order_for_user: false,
        onCheckboxChange: jest.fn(),
    };

    it('should render component with 3 radio buttons', () => {
        render(<OrderDetailsComplainModalRadioGroup {...mock_props} />);

        expect(screen.getAllByRole('radio').length).toBe(3);
    });

    it('should select the checkbox when a radio button is selected', () => {
        render(<OrderDetailsComplainModalRadioGroup {...mock_props} />);
        fireEvent.click(screen.getAllByRole('radio')[1]);

        expect(mock_props.onCheckboxChange).toHaveBeenCalledWith('buyer_underpaid');
    });

    it('should select the checkbox when a radio button is selected', () => {
        render(<OrderDetailsComplainModalRadioGroup {...mock_props} />);

        expect(screen.getByLabelText('I’ve not received any payment.')).toBeInTheDocument();
        expect(screen.getByLabelText('I’ve received less than the agreed amount.')).toBeInTheDocument();
        expect(screen.getByLabelText('I’ve received more than the agreed amount.')).toBeInTheDocument();
    });

    it('should select the checkbox when a radio button is selected', () => {
        render(<OrderDetailsComplainModalRadioGroup {...mock_props} is_buy_order_for_user />);

        expect(
            screen.getByLabelText('I’ve made full payment, but the seller hasn’t released the funds.')
        ).toBeInTheDocument();
        expect(screen.getByLabelText('I wasn’t able to make full payment.')).toBeInTheDocument();
        expect(screen.getByLabelText('I’ve paid more than the agreed amount.')).toBeInTheDocument();
    });
});
