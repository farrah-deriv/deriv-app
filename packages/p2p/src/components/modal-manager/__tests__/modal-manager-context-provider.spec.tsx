import React from 'react';
import { screen, render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ModalManagerContextProvider, { TModalManagerContext } from '../modal-manager-context-provider';
import ModalManager from '../modal-manager';
import {useModalManagerContext} from '../modal-manager-context';

let mock_modal_manager_state: Partial<TModalManagerContext>

// jest.mock('@deriv/shared', () => ({
//     ...jest.requireActual('@deriv/shared'),
//     isDesktop: jest.fn(() => false),
// }));

function MockBuySellModal({title, subtitle}: {title?: string, subtitle?: string}) {
    if (title && subtitle) {
        return <div>BuySellModal with {title} and {subtitle}</div>
    } else if (title) {
        return <div>BuySellModal with {title}</div>
    } else {
        return <div>BuySellModal</div>
    }
}

function MockMyAdsDeleteModal() {
    console.log('this is shown')
    return <div>MyAdsDeleteModal</div>
}


jest.mock('Constants/modals', () => ({
    Modals: {
        BuySellModal: MockBuySellModal,
        MyAdsDeleteModal: MockMyAdsDeleteModal
    },
}));


function MockPage() {
    const {showModal, hideModal} = useModalManagerContext();

    const showBuySellModal = () => showModal({
        key: 'BuySellModal',
        props: {}
    })


    const showMyAdsDeleteModal = () => {
        showModal({
        key: 'MyAdsDeleteModal',
        props: {}
    })
    }

    const hideModals = () => {
        hideModal({should_hide_all_modals: true})
    }

    return (
        <div>
            <button onClick={showBuySellModal}>Show BuySellModal</button>
            <button onClick={showMyAdsDeleteModal}>Show MyAdsDeleteModal</button>
            <button onClick={() => hideModal()}>Hide Modal</button>
            <button onClick={hideModals}>Hide All Modals</button>
        </div>
    )
}


describe('<ModalManagerContextProvider />', () => {
    // beforeEach(() => {
    //     jest.resetModules()
    // })
    it('1', () => {
        render(
            <React.Fragment>
                <ModalManagerContextProvider>
                    <ModalManager/>
                    <MockPage />
                </ModalManagerContextProvider>
            </React.Fragment>
        );

        const showBtn = screen.getByRole('button', {
            name: /Show BuySellModal/
        })

        userEvent.click(showBtn);

        const text = screen.getByText('BuySellModal')
        expect(text).toBeInTheDocument();
    });

    it('2', () => {
        render(
            <React.Fragment>
                <ModalManagerContextProvider>
                    <ModalManager/>
                    <MockPage />
                </ModalManagerContextProvider>
            </React.Fragment>
        );

        const showBuySellModalBtn = screen.getByRole('button', {
            name: /Show BuySellModal/
        })

        const showMyAdsDeleteModalBtn = screen.getByRole('button', {
            name: /Show MyAdsDeleteModal/
        })

        userEvent.click(showBuySellModalBtn);
        userEvent.click(showMyAdsDeleteModalBtn)

        const text = screen.getByText('MyAdsDeleteModal')
        expect(text).toBeInTheDocument();
    });

    it('3', async () => {
        jest.doMock('@deriv/shared', () => ({
            ...jest.requireActual('@deriv/shared'),
            isDesktop: jest.fn(() => false),
        }));
        render(
            <React.Fragment>
                <ModalManagerContextProvider>
                    <ModalManager/>
                    <MockPage />
                </ModalManagerContextProvider>
            </React.Fragment>
        );

        const showBuySellModalBtn = screen.getByRole('button', {
            name: /Show BuySellModal/
        })

        const hideModalBtn = screen.getByRole('button', {
            name: /Hide Modal/
        })

        userEvent.click(showBuySellModalBtn);
        // userEvent.click(hideModalBtn)

        const text = screen.queryByText('BuySellModal')
        expect(text).toBeInTheDocument();
    });
});
