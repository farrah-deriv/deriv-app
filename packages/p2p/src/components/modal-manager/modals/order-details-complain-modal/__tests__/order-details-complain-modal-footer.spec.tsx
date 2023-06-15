import React from 'react';
import { render, screen } from '@testing-library/react';
import OrderDetailsComplainModalFooter from '../order-details-complain-modal-footer';

describe('<OrderDetailsComplainModalFooter />', () => {
    const mock_props = {
        error_message: '',
        dispute_reason: '',
        onClickSubmitButton: jest.fn(),
        onClickCloseButton: jest.fn(),
    };
    it('should render OrderDetailsComplainFooter with `Submit` and `Cancel` buttons', () => {
        render(<OrderDetailsComplainModalFooter {...mock_props} />);
        expect(screen.getByRole('button', { name: 'Cancel' })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Submit' })).toBeInTheDocument();
    });

    it('should render OrderDetailsComplainFooter with the error message', () => {
        render(<OrderDetailsComplainModalFooter {...mock_props} error_message='Some error' />);
        expect(screen.getByText('Some error')).toBeInTheDocument();
    });
});
