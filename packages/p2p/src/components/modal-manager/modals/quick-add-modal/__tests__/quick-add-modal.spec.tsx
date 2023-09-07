import React from 'react';
import { screen, render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useStores } from 'Stores';
import { useModalManagerContext } from 'Components/modal-manager/modal-manager-context';
import QuickAddModal from '../quick-add-modal';

const mockLocalStorage = {
    getItem: jest.fn(() =>
        JSON.stringify({
            selected_methods: ['alipay'],
        })
    ),
    removeItem: jest.fn(),
    setItem: jest.fn(),
};

Object.defineProperty(window, 'localStorage', {
    value: mockLocalStorage,
});

let mock_store: DeepPartial<ReturnType<typeof useStores>>;

const advert_props = {
    id: '123',
    type: 'buy',
};

const mockSavedStateFunction = jest.fn();
const mock_modal_manager: DeepPartial<ReturnType<typeof useModalManagerContext>> = {
    is_modal_open: true,
    showModal: jest.fn(),
    useSavedState: jest.fn(() => [[], mockSavedStateFunction]),
};

const el_modal = document.createElement('div');

jest.mock('@deriv/components', () => ({
    ...jest.requireActual('@deriv/components'),
    DesktopWrapper: jest.fn(({ children }) => <div>{children}</div>),
    MobileWrapper: jest.fn(({ children }) => <div>{children}</div>),
}));

jest.mock('Stores', () => ({
    ...jest.requireActual('Stores'),
    useStores: jest.fn(() => mock_store),
}));

jest.mock('Components/modal-manager/modal-manager-context', () => ({
    ...jest.requireActual('Components/modal-manager/modal-manager-context'),
    useModalManagerContext: jest.fn(() => mock_modal_manager),
}));

jest.mock('../quick-add-modal-content', () => jest.fn(() => <div>QuickAddModalContent</div>));

describe('<QuickAddModal />', () => {
    beforeEach(() => {
        mock_store = {
            my_ads_store: {
                payment_method_ids: [],
                payment_method_names: [],
                should_show_add_payment_method: false,
                show_filter_payment_methods: false,
                hideQuickAddModal: jest.fn(),
                onClickUpdatePaymentMethods: jest.fn(),
                setSearchTerm: jest.fn(),
                setSearchedResults: jest.fn(),
                setShouldShowAddPaymentMethod: jest.fn(),
                setShowFilterPaymentMethods: jest.fn(),
            },
            my_profile_store: {
                payment_methods_list: [],
                selected_payment_method: [],
                getPaymentMethodsList: jest.fn(),
            },
        };
    });

    beforeAll(() => {
        el_modal.setAttribute('id', 'modal_root');
        document.body.appendChild(el_modal);
    });

    afterAll(() => {
        document.body.removeChild(el_modal);
    });

    it('should render the quick add modal', () => {
        render(<QuickAddModal advert={advert_props} />);

        expect(screen.getByText('Add payment methods')).toBeInTheDocument();
        expect(screen.getByText('Add payment methods')).toBeInTheDocument();
        expect(screen.getAllByText('QuickAddModalContent')).toHaveLength(2);
        expect(screen.getByRole('button', { name: 'Add' })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Cancel' })).toBeInTheDocument();
    });

    it('should call setShowFilterPaymentMethods, setSearchTerm, setSearchedResults, when pressing the arrow icon if show_filter_payment_methods is true', () => {
        mock_store.my_ads_store.show_filter_payment_methods = true;
        mock_store.my_ads_store.should_show_add_payment_method = true;
        advert_props.type = 'sell';

        render(<QuickAddModal advert={advert_props} />);

        const arrow_icon = screen.getByTestId('dt_quick_add_modal_arrow_icon');

        userEvent.click(arrow_icon);

        expect(mock_store.my_ads_store.setShowFilterPaymentMethods).toHaveBeenCalledWith(false);
        expect(mock_store.my_ads_store.setSearchTerm).toHaveBeenCalledWith('');
        expect(mock_store.my_ads_store.setSearchedResults).toHaveBeenCalledWith([]);
    });

    it('should call setItem and showModal when pressing arrow icon if is_payment_methods_selected is true', () => {
        mock_store.my_ads_store.should_show_add_payment_method = true;
        mock_store.my_profile_store.selected_payment_method = ['alipay'];

        render(<QuickAddModal advert={advert_props} />);

        const arrow_icon = screen.getByTestId('dt_quick_add_modal_arrow_icon');

        userEvent.click(arrow_icon);

        expect(mockLocalStorage.setItem).toHaveBeenCalled();
        expect(mock_modal_manager.showModal).toHaveBeenCalled();
        (mock_modal_manager.showModal as jest.Mock)?.mock.calls[0][0].props.onCancel();
        expect(mock_store.my_ads_store.payment_method_ids).toEqual([]);
        expect(mock_store.my_ads_store.payment_method_names).toEqual([]);
    });

    it('should call setShouldShowAddPaymentMethod and hideQuickAddModal if none of the above is true and should_close_all_modals is true when toggling modal', () => {
        mock_store.my_ads_store.should_show_add_payment_method = true;

        render(<QuickAddModal advert={advert_props} />);

        const close_icon = screen.getByTestId('dt_modal_close_icon');

        userEvent.click(close_icon);

        expect(mock_store.my_ads_store.setShouldShowAddPaymentMethod).toHaveBeenCalledWith(false);
        expect(mock_store.my_ads_store.hideQuickAddModal).toHaveBeenCalled();
    });

    it('should call hideQuickAddModal, setShouldShowAddPaymentMethod if should_close_all_modals is false should_show_add_payment_method is true when toggling modal', () => {
        advert_props.type = 'buy';

        render(<QuickAddModal advert={advert_props} />);

        const return_icon = screen.getByTestId('dt_mobile_full_page_modal_return_icon');

        userEvent.click(return_icon);

        expect(mock_store.my_ads_store.hideQuickAddModal).toHaveBeenCalled();
        expect(mock_store.my_ads_store.setShouldShowAddPaymentMethod).toHaveBeenCalledWith(false);
    });

    it('should call setShouldShowAddPaymentMethod when pressing Cancel button', () => {
        render(<QuickAddModal advert={advert_props} />);

        const cancel_button = screen.getByRole('button', { name: 'Cancel' });

        userEvent.click(cancel_button);

        expect(mock_store.my_ads_store.setShouldShowAddPaymentMethod).toHaveBeenCalledWith(false);
    });

    it('should call onClickUpdatePaymentMethods when pressing Add button', () => {
        mock_modal_manager.useSavedState = jest.fn(() => [['alipay'], mockSavedStateFunction]);

        render(<QuickAddModal advert={advert_props} />);

        const add_button = screen.getByRole('button', { name: 'Add' });

        userEvent.click(add_button);

        expect(mock_store.my_ads_store.onClickUpdatePaymentMethods).toHaveBeenCalledWith('123', true);
    });
});
