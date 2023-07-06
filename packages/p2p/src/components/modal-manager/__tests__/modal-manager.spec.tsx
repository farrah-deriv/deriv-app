import React from 'react';
import { screen, render, waitFor } from '@testing-library/react';
import ModalManagerContextProvider, { TModalManagerContext } from '../modal-manager-context-provider';
import ModalManager from '../modal-manager';

let mock_modal_manager_state: TModalManagerContext


function MockModal({title, subtitle}: {title?: string, subtitle?: string}) {
    if (title && subtitle) {
        return <div>BuySellModal with {title} and {subtitle}</div>
    } else if (title) {
        return <div>BuySellModal with {title}</div>
    } else {
        return <div>BuySellModal</div>
    }
}

jest.mock('Constants/modals', () => ({
    Modals: {
        BuySellModal: MockModal,
    },
}));


describe('<ModalManager />', () => {
    beforeEach(() => {
        mock_modal_manager_state = {
            is_modal_open: true,
            modal: {
                key: 'BuySellModal',
                props: {},
            },
            hideModal: jest.fn(),
            isCurrentModal: jest.fn(),
            modal_props: new Map(),
            previous_modal: null,
            showModal: jest.fn(),
            stacked_modal: null,
            useRegisterModalProps: jest.fn(),
        };
    })

    afterAll(() => {
        jest.resetModules()
        jest.resetAllMocks()
    })

    it('should not render any modals', () => {
        mock_modal_manager_state.modal = null

        render(
            <React.Fragment>
                <ModalManagerContextProvider mock={mock_modal_manager_state}>
                    <ModalManager />
                </ModalManagerContextProvider>
            </React.Fragment>
        );

        const text = screen.queryByText('BuySellModal');
        expect(text).not.toBeInTheDocument();
    });
    it('should render MockModal component if there are modals to be shown', async () => {
        render(
            <React.Fragment>
                <ModalManagerContextProvider mock={mock_modal_manager_state}>
                    <ModalManager />
                </ModalManagerContextProvider>
            </React.Fragment>
        );

        const asyncElementPromise = screen.findByText('BuySellModal');
        expect(await asyncElementPromise).toBeInTheDocument();
    });

    it('should render MockModal component with props passed', async () => {
        mock_modal_manager_state.modal = {
            key: 'BuySellModal',
            props: {
                title: 'Title'
            }
        }
        render(
            <React.Fragment>
                <ModalManagerContextProvider mock={mock_modal_manager_state}>
                    <ModalManager />
                </ModalManagerContextProvider>
            </React.Fragment>
        );

        const asyncElementPromise = screen.findByText('BuySellModal with Title');
        expect(await asyncElementPromise).toBeInTheDocument();
    })
    
    it('should', async () => {
        mock_modal_manager_state.modal_props.set('BuySellModal', {
            title: 'Cached Title'
        })
        render(
            <React.Fragment>
                <ModalManagerContextProvider mock={mock_modal_manager_state}>
                    <ModalManager />
                </ModalManagerContextProvider>
            </React.Fragment>
        );

        const asyncElementPromise = screen.findByText('BuySellModal with Cached Title');
        expect(await asyncElementPromise).toBeInTheDocument();
    })

    it('should 2', async () => {
        mock_modal_manager_state.modal_props.set('BuySellModal', {
            title: 'Cached Title'
        })
        mock_modal_manager_state.modal = {
            key: 'BuySellModal',
            props: {
                subtitle: 'Subtitle'
            }
        }
        render(
            <React.Fragment>
                <ModalManagerContextProvider mock={mock_modal_manager_state}>
                    <ModalManager />
                </ModalManagerContextProvider>
            </React.Fragment>
        );

        const asyncElementPromise = screen.findByText('BuySellModal with Cached Title and Subtitle');
        expect(await asyncElementPromise).toBeInTheDocument();
    })

    it('should 2', async () => {
        mock_modal_manager_state.modal_props.set('BuySellModal', {
            title: 'Cached Title'
        })
        mock_modal_manager_state.modal = {
            key: 'AdErrorTooltipModal',
            props: {}
        }
        render(
            <React.Fragment>
                <ModalManagerContextProvider mock={mock_modal_manager_state}>
                    <ModalManager />
                </ModalManagerContextProvider>
            </React.Fragment>
        );

        const asyncElementPromise = screen.queryByText('BuySellModal')
        expect(asyncElementPromise).not.toBeInTheDocument();
    })
});
