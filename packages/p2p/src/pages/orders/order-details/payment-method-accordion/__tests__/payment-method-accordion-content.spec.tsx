import React from 'react';
import { render, screen } from '@testing-library/react';
import { mock_bank_transfer_payment_method } from 'Pages/orders/order-details/__mocks__/mock-order-details-data';
import PaymentMethodAccordionContent from '../payment-method-accordion-content';

describe('<PaymentMethodAccordionContent/>', () => {
    it('should render PaymentMethodAccordionContent component with passed props', () => {
        render(<PaymentMethodAccordionContent payment_method={mock_bank_transfer_payment_method} />);
        expect(screen.getByText('Account Number')).toBeInTheDocument();
        expect(screen.getByText('1234567890')).toBeInTheDocument();
        expect(screen.getByText('Swift Code')).toBeInTheDocument();
        expect(screen.getByText('1234')).toBeInTheDocument();
        expect(screen.getByText('Bank Name')).toBeInTheDocument();
        expect(screen.getByText('DBS')).toBeInTheDocument();
        expect(screen.getByText('Bank Address')).toBeInTheDocument();
        expect(screen.getByText('12 Marina Boulevard, Singapore')).toBeInTheDocument();
    });
});
