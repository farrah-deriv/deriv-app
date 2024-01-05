import React from 'react';
import { render, screen } from '@testing-library/react';
import { StoreProvider, mockStore } from '@deriv/stores';
import TwoFactorEnabled from '../two-factor-enabled';

describe('<TwoFactorEnabled />', () => {
    const store = mockStore({});

    it('should render TwoFactorEnabled component if 2FA is enabled', () => {
        render(
            <StoreProvider store={store}>
                <TwoFactorEnabled />
            </StoreProvider>
        );
        const title_1 = screen.getByText(/2FA enabled/i);
        const title_2 = screen.getByText(/You have enabled 2FA for your Deriv account./i);
        const title_3 = screen.getByText(
            /To disable 2FA, please enter the six-digit authentication code generated by your 2FA app below:/i
        );
        expect(title_1).toBeInTheDocument();
        expect(title_2).toBeInTheDocument();
        expect(title_3).toBeInTheDocument();
    });

    it('should render DigitForm component if 2FA is enabled', () => {
        render(
            <StoreProvider store={store}>
                <TwoFactorEnabled />
            </StoreProvider>
        );

        const digitform = screen.getByTestId('dt_digitform_2fa');
        expect(digitform).toBeInTheDocument();
    });
});
