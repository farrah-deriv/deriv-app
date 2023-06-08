import React from 'react';
import { render, screen } from '@testing-library/react';
import ChatWrapper from '../chat-wrapper';
import { isDesktop, isMobile } from '@deriv/shared';

const mock_order_store = {
    order_information: {
        other_user_details: {
            name: 'Test user',
        },
    },
};

jest.mock('Stores', () => ({
    ...jest.requireActual('Stores'),
    useStores: jest.fn(() => ({
        order_store: mock_order_store,
        sendbird_store: {
            last_other_user_activity: 'Last seen 1 hour ago',
        },
    })),
}));

jest.mock('@deriv/shared', () => ({
    ...jest.requireActual('@deriv/shared'),
    isMobile: jest.fn(() => false),
    isDesktop: jest.fn(() => true),
}));

const mockedMobileReturnFunc = jest.fn();

describe('<ChatWrapper />', () => {
    it('should render one <ChatWrapper /> component in desktop view', () => {
        render(
            <ChatWrapper is_modal_open={false} mobile_return_func={mockedMobileReturnFunc}>
                test
            </ChatWrapper>
        );
        expect(screen.getByText('test')).toBeInTheDocument();
    });

    it('should render one <ChatWrapper /> component in mobile view', () => {
        (isMobile as jest.Mock).mockReturnValueOnce(true);
        (isDesktop as jest.Mock).mockReturnValueOnce(false);
        render(
            <ChatWrapper is_modal_open mobile_return_func={mockedMobileReturnFunc}>
                test
            </ChatWrapper>
        );

        expect(screen.getByText('test')).toBeInTheDocument();
        expect(screen.getByText('Last seen 1 hour ago')).toBeInTheDocument();
        expect(screen.getByText('Test user')).toBeInTheDocument();
    });
});
