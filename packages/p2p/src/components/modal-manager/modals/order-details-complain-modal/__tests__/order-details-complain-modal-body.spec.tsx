import React from 'react';
import { render, screen } from '@testing-library/react';
import OrderDetailsComplainModalBody from '../order-details-complain-modal-body';

describe('<OrderDetailsComplainBody />', () => {
    const mock_props = {
        is_buy_order_for_user: false,
        dispute_reason: '',
        onCheckboxChange: jest.fn(),
    };
    it('should render OrderDetailsComplainModalBody component', () => {
        render(<OrderDetailsComplainModalBody {...mock_props} />);
        expect(
            screen.getByText("If your complaint isn't listed here, please contact our Customer Support team.")
        ).toBeInTheDocument();
    });
});
