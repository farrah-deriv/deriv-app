import React from 'react';
import { render, screen } from '@testing-library/react';
import ChatHeader from '../chat-header';
import { isDesktop, isMobile } from '@deriv/shared';

const mock_order_store = {
    order_information: {
        other_user_details: {
            name: 'test',
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

describe('<ChatHeader />', () => {
    it('should render empty element in mobile view', () => {
        (isMobile as jest.Mock).mockReturnValueOnce(true);
        (isDesktop as jest.Mock).mockReturnValueOnce(false);
        const { container } = render(<ChatHeader />);
        expect(container).toBeEmptyDOMElement();
    });

    it('should render chat header in desktop view', () => {
        const { container } = render(<ChatHeader />);
        expect(container).not.toBeEmptyDOMElement();
    });

    it("should render chat header icon with other user's nickname, name, and last online activity ", () => {
        render(<ChatHeader />);
        expect(screen.getByText('TE')).toBeInTheDocument();
        expect(screen.getByText('test')).toBeInTheDocument();
        expect(screen.getByText('Last seen 1 hour ago')).toBeInTheDocument();
    });
});
