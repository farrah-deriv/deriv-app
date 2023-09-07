import React from 'react';
import { screen, render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { StoreProvider, mockStore } from '@deriv/stores';
import { useStores } from 'Stores';
import QuickAddModalContent from '../quick-add-modal-content';

let mock_store: DeepPartial<ReturnType<typeof useStores>>;

const content_props = {
    id: '123',
    is_buy_advert: true,
    is_payment_methods_selected: true,
    selected_methods: ['alipay'],
    setSelectedMethods: jest.fn(),
    setShouldCloseAllModals: jest.fn(),
};

const mock_ui_store = mockStore({
    ui: {
        is_mobile: false,
    },
});

const wrapper = ({ children }: { children: JSX.Element }) => (
    <StoreProvider store={mock_ui_store}>{children}</StoreProvider>
);

jest.mock('Stores', () => ({
    ...jest.requireActual('Stores'),
    useStores: jest.fn(() => mock_store),
}));

jest.mock('@deriv/components', () => ({
    ...jest.requireActual('@deriv/components'),
    DesktopWrapper: jest.fn(({ children }) => <div>{children}</div>),
    MobileWrapper: jest.fn(({ children }) => <div>{children}</div>),
}));

jest.mock('Components/my-ads/filter-payment-methods', () => jest.fn(() => <div>FilterPaymentMethods</div>));
jest.mock('Pages/my-ads/buy-ad-payment-methods-list.jsx', () => jest.fn(() => <div>BuyAdPaymentMethodsList</div>));
jest.mock('Pages/my-profile/payment-methods/add-payment-method/add-payment-method.jsx', () =>
    jest.fn(() => <div>AddPaymentMethod</div>)
);

describe('<QuickAddModalContent />', () => {
    beforeEach(() => {
        mock_store = {
            general_store: {
                active_index: 2,
            },
            my_ads_store: {
                payment_method_ids: [],
                payment_method_names: [],
                should_show_add_payment_method: false,
                show_filter_payment_methods: false,
                onClickUpdatePaymentMethods: jest.fn(),
                setShouldShowAddPaymentMethod: jest.fn(),
            },
            my_profile_store: {
                advertiser_payment_methods_list: [],
                selected_payment_method: [],
                getPaymentMethodsList: jest.fn(),
            },
        };
    });

    it('should render buy advert content if is_buy_advert is true', () => {
        render(<QuickAddModalContent {...content_props} />, { wrapper });

        expect(screen.getAllByText('You may choose up to 3 payment methods for this ad.')).toHaveLength(2);
        expect(screen.getAllByText('BuyAdPaymentMethodsList')).toHaveLength(2);
        expect(screen.getByRole('button', { name: 'Cancel' })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Add' })).toBeInTheDocument();
    });

    it('should call setShouldCloseAllModals if Cancel button is pressed', () => {
        render(<QuickAddModalContent {...content_props} />, { wrapper });

        const cancel_button = screen.getByRole('button', { name: 'Cancel' });
        userEvent.click(cancel_button);

        expect(content_props.setShouldCloseAllModals).toBeCalledWith(true);
    });

    it('should call onClickUpdatePaymentMethods if Add button is pressed', () => {
        mock_store.my_ads_store.payment_method_ids = ['alipay'];
        mock_store.my_ads_store.payment_method_names = ['Alipay'];

        render(<QuickAddModalContent {...content_props} />, { wrapper });

        const add_button = screen.getByRole('button', { name: 'Add' });
        userEvent.click(add_button);

        expect(mock_store.my_ads_store.onClickUpdatePaymentMethods).toBeCalledWith('123', true);
    });

    it('should render FilterPaymentMethods if show_filter_payment_methods is true', () => {
        mock_store.my_ads_store.show_filter_payment_methods = true;
        render(<QuickAddModalContent {...content_props} />, { wrapper });

        expect(screen.getByText('FilterPaymentMethods')).toBeInTheDocument();
    });

    it('should render AddPaymentMethod component if is_buy_advert is false and should_show_add_payment_method is true', () => {
        content_props.is_buy_advert = false;
        mock_store.my_ads_store.should_show_add_payment_method = true;

        render(<QuickAddModalContent {...content_props} />, { wrapper });

        expect(screen.getAllByText('AddPaymentMethod')).toHaveLength(2);
    });

    it('should render QuickAddModalButtons call setShouldCloseAllModals if Cancel is clicked and onClickUpdatePaymentMethods if Add is clicked', () => {
        mock_store.my_ads_store.selected_payment_method = ['alipay'];
        mock_store.my_ads_store.payment_method_ids = ['alipay'];

        render(<QuickAddModalContent {...content_props} />, { wrapper });

        const cancel_button = screen.getByRole('button', { name: 'Cancel' });
        const add_button = screen.getByRole('button', { name: 'Add' });

        userEvent.click(cancel_button);
        expect(content_props.setShouldCloseAllModals).toBeCalledWith(false);

        userEvent.click(add_button);
        expect(mock_store.my_ads_store.onClickUpdatePaymentMethods).toBeCalledWith('123', false);
    });

    it('should render only Cancel button selected_payment_method is empty and should_show_add_payment_method is true', () => {
        mock_store.my_ads_store.should_show_add_payment_method = true;

        render(<QuickAddModalContent {...content_props} />, { wrapper });

        const cancel_button = screen.getByRole('button', { name: 'Cancel' });

        userEvent.click(cancel_button);

        expect(content_props.setShouldCloseAllModals).toBeCalledWith(false);
    });

    it('should render AddPaymentMethods if is_buy_advert and should_show_add_payment_method are false', () => {
        render(<QuickAddModalContent {...content_props} />, { wrapper });

        expect(screen.getAllByText('You may add up to 3 payment methods.')).toHaveLength(2);
        expect(screen.getAllByText('Payment method')).toHaveLength(2);
    });

    it('should call setShouldShowAddPaymentMethod if add payment method card is pressed', () => {
        render(<QuickAddModalContent {...content_props} />, { wrapper });

        const add_payment_methods = screen.getAllByText('Payment method');

        userEvent.click(add_payment_methods[0]);

        expect(mock_store.my_ads_store.setShouldShowAddPaymentMethod).toBeCalledWith(true);
    });

    it('should call setSelectedMethods and update payment_method_ids when payment method card is pressed and if id is not included in payment_method_ids ', () => {
        mock_store.my_profile_store.advertiser_payment_methods_list = [
            {
                ID: '1',
                is_enabled: 1,
                method: 'alipay',
                display_name: 'Alipay',
            },
        ];

        render(<QuickAddModalContent {...content_props} />, { wrapper });

        const alipay_cards = screen.getAllByText('Alipay');

        userEvent.click(alipay_cards[0]);

        expect(mock_store.my_ads_store.payment_method_ids).toEqual(['1']);
        expect(content_props.setSelectedMethods).toBeCalledWith(['alipay', '1']);
    });

    it('should call setSelectedMethods and remove alipay when clicking on payment method card', () => {
        mock_store.my_profile_store.advertiser_payment_methods_list = [
            {
                ID: '1',
                is_enabled: 1,
                method: 'alipay',
                display_name: 'Alipay',
            },
        ];

        mock_store.my_ads_store.payment_method_ids = ['1'];

        render(<QuickAddModalContent {...content_props} />, { wrapper });

        const alipay_cards = screen.getAllByText('Alipay');

        userEvent.click(alipay_cards[0]);

        expect(mock_store.my_ads_store.payment_method_ids).toEqual([]);
        expect(content_props.setSelectedMethods).toBeCalledWith(['alipay']);
    });
});
