import React from 'react';
import VerificationDocumentSubmitted from '../verification-document-submitted';
import { render, screen, fireEvent } from '@testing-library/react';
import { StoreProvider, mockStore } from '@deriv/stores';

describe('<VerificationDocumentSubmited />', () => {
    let modal_root_el: HTMLDivElement;

    beforeAll(() => {
        modal_root_el = document.createElement('div');
        modal_root_el.setAttribute('id', 'modal_root');
        document.body.appendChild(modal_root_el);
    });

    afterAll(() => {
        document.body.removeChild(modal_root_el);
    });

    it('should render the VerificationDocumentSubmited component', async () => {
        const mock = mockStore({
            ui: {
                is_verification_submitted: true,
            },
        });

        const wrapper = ({ children }: { children: JSX.Element }) => (
            <StoreProvider store={mock}>{children}</StoreProvider>
        );
        const { container } = render(<VerificationDocumentSubmitted />, { wrapper });
        expect(container).toBeInTheDocument();
    });

    it('should render VerificationDocumentSubmited component with Messages and Button', async () => {
        const mock = mockStore({
            ui: {
                is_verification_submitted: true,
            },
        });

        const wrapper = ({ children }: { children: JSX.Element }) => (
            <StoreProvider store={mock}>{children}</StoreProvider>
        );
        render(<VerificationDocumentSubmitted />, { wrapper });
        expect(screen.getByText('We’ve received your documents')).toBeInTheDocument();
        expect(
            screen.getByText(
                'We’ll need 1 - 3 days to review your documents and notify you by email. You can practice with demo accounts in the meantime.'
            )
        ).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Continue' })).toBeInTheDocument();
    });

    it('should render VerificationDocumentSubmited click on Button to called false function', async () => {
        const mock = mockStore({
            ui: {
                is_verification_submitted: true,
            },
        });

        const wrapper = ({ children }: { children: JSX.Element }) => (
            <StoreProvider store={mock}>{children}</StoreProvider>
        );
        render(<VerificationDocumentSubmitted />, { wrapper });
        const continue_button = screen.getByRole('button', { name: 'Continue' });
        fireEvent.click(continue_button);
        expect(mock.ui.setIsVerificationSubmitted).toHaveBeenCalledWith(false);
    });
});
