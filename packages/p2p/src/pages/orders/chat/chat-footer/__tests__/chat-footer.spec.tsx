import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useStores } from 'Stores';
import { handleCtrlEnterKeyPressed } from 'Utils/chat-message';
import ChatFooter from '../chat-footer';

const mock_order_store = {
    order_information: {
        is_inactive_order: false,
    },
};

const mock_sendbird_store = {
    chat_messages: [],
    is_chat_frozen: false,
    sendMessage: jest.fn(),
    sendFile: jest.fn(),
};

jest.mock('Stores', () => ({
    ...jest.requireActual('Stores'),
    useStores: jest.fn(
        (): Partial<ReturnType<typeof useStores>> => ({
            sendbird_store: mock_sendbird_store,
            order_store: mock_order_store,
        })
    ),
}));

jest.mock('Utils/chat-message', () => ({
    handleCtrlEnterKeyPressed: jest.fn(),
}));

describe('<ChatFooter />', () => {
    it('should show `This conversation is closed` if is_chat_frozen is true', () => {
        (useStores as jest.Mock).mockReturnValueOnce({
            order_store: mock_order_store,
            sendbird_store: {
                ...mock_sendbird_store,
                is_chat_frozen: true,
            },
        });
        render(<ChatFooter />);
        expect(screen.getByText('This conversation is closed.')).toBeInTheDocument();
    });

    it('should show `This conversation is closed` if is_inactive_order is true', () => {
        (useStores as jest.Mock).mockReturnValueOnce({
            order_store: {
                ...mock_order_store,
                order_information: {
                    ...mock_order_store.order_information,
                    is_inactive_order: true,
                },
            },
            sendbird_store: mock_sendbird_store,
        });
        render(<ChatFooter />);
        expect(screen.getByText('This conversation is closed.')).toBeInTheDocument();
    });

    it('should render chat footer with empty input field and attachment button', () => {
        render(<ChatFooter />);
        expect(
            screen.getByText(
                'In case of a dispute, we will only consider the communication through Deriv P2P chat channel.'
            )
        ).toBeInTheDocument();
        expect(screen.getByRole('textbox')).toBeInTheDocument();
        expect(screen.getByTestId('dt_attachment_icon')).toBeInTheDocument();
    });

    it('should show send button if input field is not empty', () => {
        render(<ChatFooter />);
        const input = screen.getByRole('textbox');
        userEvent.type(input, 'test');

        const send_button = screen.getByTestId('dt_send_message_icon');
        expect(send_button).toBeInTheDocument();
    });

    it('should send the message if user click enter key on the keyboard', () => {
        render(<ChatFooter />);
        const input = screen.getByRole('textbox');
        userEvent.type(input, 'test');
        userEvent.type(input, '{enter}');
        expect(mock_sendbird_store.sendMessage).toBeCalledTimes(1);
    });

    it('should send file in the chat if user click on attachment icon and upload a file', () => {
        render(<ChatFooter />);
        const str = JSON.stringify('test');
        const blob = new Blob([str]);
        const file = new File([blob], 'values.json', {
            type: 'application/JSON',
        });
        File.prototype.text = jest.fn().mockResolvedValueOnce(str);

        const input = screen.getByTestId('dt_attachment_icon');
        userEvent.click(input);
        userEvent.upload(screen.getByTestId('dt_file_input'), file);
        expect(mock_sendbird_store.sendFile).toBeCalledTimes(1);
    });

    it('should add new line if user click ctrl + enter key on the keyboard', () => {
        render(<ChatFooter />);

        const input = screen.getByRole('textbox');
        userEvent.type(input, 'test');
        userEvent.type(input, '{ctrl}{enter}');
        expect(handleCtrlEnterKeyPressed).toBeCalledTimes(1);
    });
});
