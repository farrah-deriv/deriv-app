import React from 'react';
import { render, screen } from '@testing-library/react';
import OrderDetailsComplainFooter from '../order-details-complain-modal-footer';

describe('<OrderDetailsComplainFooter />', () => {
    const mock_props = {
        error_message: '',
        dispute_reason: '',
        onClickSubmitButton: jest.fn(),
        onClickCloseButton: jest.fn(),
    };
    it('should render OrderDetailsComplainFooter with `Submit` and `Cancel` buttons', () => {
        render(<OrderDetailsComplainFooter {...mock_props} />);
        expect(screen.getByText('Cancel')).toBeInTheDocument();
        expect(screen.getByText('Submit')).toBeInTheDocument();
    });

    it('should render OrderDetailsComplainFooter with the error message', () => {
        render(<OrderDetailsComplainFooter {...mock_props} error_message='Some error' />);
        expect(screen.getByText('Some error')).toBeInTheDocument();
    });
});
