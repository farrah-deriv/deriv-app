import React from 'react';
import { render, screen } from '@testing-library/react';
import {
    mock_bank_transfer_payment_method,
    mock_ewallet_payment_method,
} from 'Pages/orders/order-details/__mocks__/mock-order-details-data';
import PaymentMethodAccordionHeader from '../payment-method-accordion-header';

describe('<PaymentMethodAccordionHeader/>', () => {
    it('should render PaymentMethodAccordionContent component with bank transfer payment method', () => {
        render(<PaymentMethodAccordionHeader payment_method={mock_bank_transfer_payment_method} />);

        expect(screen.getByText('Bank Transfer')).toBeInTheDocument();
        expect(screen.getByText('DBS')).toBeInTheDocument();
        expect(screen.getByTestId('ic_cashier_bank_transfer')).toBeInTheDocument();
    });

    it('should render PaymentMethodAccordionContent component with ewallet payment method', () => {
        render(<PaymentMethodAccordionHeader payment_method={mock_ewallet_payment_method} />);

        expect(screen.getByText('Skrill')).toBeInTheDocument();
        expect(screen.getByTestId('ic_cashier_ewallet')).toBeInTheDocument();
    });
});
